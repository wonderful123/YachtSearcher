import json
str = '"boatid": "239197", "price": "16000", "category": "sail - monohull", "category_secondary": "", "make": "Hartley", "model": "Fijian 43", "length": "13.11", "region": "Queensland"'
str = '{' + str + '}'
l = json.loads(str)
print(l["make"])
