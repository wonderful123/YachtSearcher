import re
url = "https://yachthub.com/list/yachts-for-sale/used/sail-catamarans/seawind-1000/238819"
s = re.search('\d*$', url).group(0)

print(s)
