"""Class each row of the color fork inventory by the rules in the tokens repo's
docs/color-by-component.md and diff against the agent's proposed_role.

Usage: python3 -I color-fork-check.py color-fork/inventory-2026-10-14.csv > report.md

The inventory has no variant column and no code line, so a rule that needs the variant
(a Button's kind, a badge's kind, the info variant) falls back on the agent's own
proposed_job for the kind, and says so in the 'basis' column of the report.
"""
import csv, sys, re, collections

FAMILY = [('brand', 'brand'), ('error', 'critical'), ('success', 'positive'), ('warning', 'warning')]
STEP = {'rest': 'enabled', 'hover': 'hover', 'group-hover': 'hover', 'disabled+hover': 'hover',
        'active': 'pressed', 'focus': 'focus', 'focus-visible': 'focus',
        'data-[state=checked]': 'enabled', 'data-[state=indeterminate]': 'enabled',
        'data-[state=checked]+hover': 'hover', 'data-[state=indeterminate]+hover': 'hover',
        'data-[state=checked]+active': 'pressed', 'data-[state=indeterminate]+active': 'pressed',
        'data-[state=active]': 'enabled'}
PATTERN = [(r'icon-button', 'icon-button'), (r'\bbutton\b', 'button'), (r'checkbox|switch|toggle', 'control'),
           (r'radio', 'radio'), (r'badge', 'badge'), (r'progress', 'progress'), (r'interactive-chip', 'chip'),
           (r'chip|tag\b', 'tag'), (r'tab-group|content-switcher|\btabs?\b', 'tabs'), (r'date-?picker|calendar', 'datepicker'),
           (r'carousel|pager|pagination', 'dots'), (r'\blink\b', 'link'), (r'alert|toast|banner|callout|notification', 'alert'),
           (r'input|text-?field|textarea|select|combobox|\bfield\b|search', 'input'), (r'accordion|menu|list|row|table', 'row'),
           (r'avatar', 'avatar')]
JOB = {'solid-cta': 'button-solid', 'text-cta': 'button-text', 'link': 'link', 'focus-ring': 'focus',
       'field-state': 'input', 'status-text': 'status-text', 'status-fill': 'status-fill',
       'selection-control': 'control', 'selected-soft': 'row', 'text-accent': 'text-accent', 'review': None}

def family(old):
    for word, fam in FAMILY:
        if word in old: return fam
    return None

def pattern(row):
    if row['scope'] == 'library':
        c = row['component'].lower()
        for rx, p in PATTERN:
            if re.search(rx, c): return p, 'component name'
    return JOB.get(row['proposed_job']), 'agent job'

def role(p, prop, step, F, job):
    """One role, or several joined by ' | ' where the inventory cannot tell, or None."""
    if p == 'input' and prop == 'border' and F in ('critical', 'warning', 'positive'):
        return f'border/{F}/accent'
    if step == 'focus':
        return 'border/neutral/focus' if prop == 'border' else None
    solid = lambda s: f'bg/{F}/solid/{s}'
    if p in ('button', 'button-solid'):
        if job == 'text-cta' or p == 'button-text': p = 'button-text'
        else:
            return {'fill': solid(step), 'border': f'border/{F}/solid', 'text': f'fg/{F}/on-solid'}[prop]
    if p in ('button-text', 'icon-button'):
        if prop == 'text': return f'fg/{F}/accent' + (f' + bg/{F}/ghost/{step}' if step != 'enabled' else '')
        if prop == 'fill': return f'bg/{F}/ghost/{step}' if step != 'enabled' else None
        return f'border/{F}/accent'
    if p in ('control', 'radio'):
        if prop == 'fill': return solid(step)
        if prop == 'text': return f'fg/{F}/on-solid | fg/neutral/regular'
        return f'border/{F}/accent' if p == 'radio' else f'border/{F}/solid'
    if p == 'badge':
        return {'fill': solid('enabled'), 'text': f'fg/{F}/on-solid | fg/{F}/accent', 'border': f'border/{F}/accent'}[prop]
    if p == 'progress': return solid('enabled') if prop == 'fill' else None
    if p == 'chip':
        return {'fill': solid(step), 'text': f'fg/{F}/on-solid', 'border': f'border/{F}/solid'}[prop]
    if p == 'tag': return {'fill': f'bg/{F}/soft/enabled', 'text': f'fg/{F}/regular', 'border': f'border/{F}/muted'}[prop]
    if p == 'tabs': return {'fill': f'bg/{F}/accent', 'text': f'fg/{F}/accent', 'border': f'border/{F}/accent'}[prop]
    if p == 'datepicker': return {'fill': solid('enabled'), 'text': f'fg/{F}/on-solid | fg/{F}/accent', 'border': f'border/{F}/accent'}[prop]
    if p == 'dots': return f'bg/{F}/accent' if prop == 'fill' else None
    if p == 'link': return f'fg/link/{step}' if prop == 'text' else None
    if p == 'alert': return {'fill': f'bg/{F}/regular | bg/{F}/accent', 'text': f'fg/{F}/accent | fg/{F}/regular', 'border': f'border/{F}/muted'}[prop]
    if p == 'input':
        if prop == 'border': return 'border/neutral/focus' if step == 'pressed' else 'border/neutral/focus | border/neutral/regular'
        return f'fg/{F}/accent' if prop == 'text' else None
    if p == 'row': return {'fill': f'bg/{F}/ghost/selected' if step == 'enabled' else f'bg/{F}/ghost/{step}', 'text': f'fg/{F}/accent', 'border': f'border/{F}/accent'}[prop]
    if p == 'avatar': return {'fill': f'bg/{F}/accent', 'text': 'fg/neutral/on-inverse/strong', 'border': None}[prop]
    if p == 'status-text': return f'fg/{F}/accent' if prop == 'text' else (f'border/{F}/accent' if prop == 'border' else None)
    if p == 'status-fill': return f'bg/{F}/accent' if prop == 'fill' else None
    if p == 'text-accent': return {'text': f'fg/{F}/accent', 'border': f'border/{F}/accent', 'fill': f'bg/{F}/accent'}[prop]
    if p == 'focus': return 'border/neutral/focus' if prop == 'border' else None
    return None

rows = list(csv.DictReader(open(sys.argv[1], newline='')))
out = []
for r in rows:
    F = family(r['old_name']); step = STEP.get(r['state'], r['state']); p, basis = pattern(r)
    pred = role(p, r['property'], step, F, r['proposed_job']) if F else None
    prop = r['proposed_role'].strip()
    status = ('undecided' if pred is None else 'agree' if prop == pred else
              'agree' if ' | ' in pred and prop in pred.split(' | ') else 'differ')
    out.append(dict(r, pattern=p or '', basis_check=basis, predicted=pred or '', status=status))

U = lambda rs: sum(int(r['uses'] or 0) for r in rs)
print('# Color fork check\n')
print('The inventory classed by the component page\'s rules, against the agent\'s proposed role.')
print('No variant column in the inventory, so the kind of a Button, a badge or an info variant comes')
print('from the agent\'s own job column where a component name does not decide it.\n')
print('| Status | Rows | Uses |\n| --- | --- | --- |')
for s in ('agree', 'differ', 'undecided'):
    rs = [r for r in out if r['status'] == s]; print(f'| {s} | {len(rs)} | {U(rs)} |')
print('\nAgreement by what classed the row:\n')
print('| Classed by | Agree | Differ | Undecided |\n| --- | --- | --- | --- |')
for b in ('component name', 'agent job'):
    rs = [r for r in out if r['basis_check'] == b]
    print(f"| {b} | {sum(r['status']=='agree' for r in rs)} | {sum(r['status']=='differ' for r in rs)} | {sum(r['status']=='undecided' for r in rs)} |")
print('\nA row classed by the agent job agrees with the agent by construction where the job already names the role; those rows test the spelling, not the assignment.')
print('\n## Where the rules and the agent differ\n')
print('| Pattern | Property | State | Agent proposed | The page says | Rows | Uses |\n| --- | --- | --- | --- | --- | --- | --- |')
g = collections.defaultdict(list)
for r in out:
    if r['status'] == 'differ': g[(r['pattern'], r['property'], r['state'], r['proposed_role'], r['predicted'])].append(r)
for k, rs in sorted(g.items(), key=lambda kv: -U(kv[1])):
    print('| ' + ' | '.join(x.replace(' | ', ' or ') for x in k) + f' | {len(rs)} | {U(rs)} |')
print('\n## Undecided by these columns\n')
print('| Pattern | Property | State | Agent proposed | Rows | Uses |\n| --- | --- | --- | --- | --- | --- |')
g = collections.defaultdict(list)
for r in out:
    if r['status'] == 'undecided': g[(r['pattern'] or '(none)', r['property'], r['state'], r['proposed_role'])].append(r)
for k, rs in sorted(g.items(), key=lambda kv: -U(kv[1])):
    print('| ' + ' | '.join(k) + f' | {len(rs)} | {U(rs)} |')
with open(sys.argv[1].rsplit('.', 1)[0] + '-checked.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)
