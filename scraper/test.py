d = { 'state': 'NSW' }

x = d.get('asdf', False) or d.get('state')
print(x)
