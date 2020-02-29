import re
import iso4217parse


def parse_price(s):
    """Parses price string into currency object

    Parameters
    ----------
    price : string
        String with currency, symbol, etc.
        Can handle "$1.29 Million"

    Returns
    -------
    dict
        Returns dict containing - original, currency code, name, symbol, value
        otherwise None if not a valid price
    """
    # Default to USD if currency in dollars but nothing specified
    DEFAULT_DOLLARS = 'USD'

    price = re.search(r'(\d{1,3}(\,\d{3})*|(\d+))(\.\d+)?', s)
    if price:
        price = price.group(0)
    else:
        return None

    # Check for 'Million' text
    million = re.search('(?i)million', s)
    if million:
        price = '{:0,d}'.format(int(float(price) * 1e6))

    # Extract currency symbol if available
    currency_symbols = u'[$¢£¤¥֏؋৲৳৻૱௹฿៛\u20a0-\u20bd\ua838\ufdfc\ufe69\uff04\uffe0\uffe1\uffe5\uffe6]'
    symbol = re.findall(currency_symbols, s)
    if symbol:
        symbol = symbol[0]
        price = symbol + price

    formatted = price

    # If $, check what kind
    if symbol == '$':
        code_list = ['AU', 'NZ']
        c = DEFAULT_DOLLARS
        for code in code_list:
            currency_type = re.search('(?i)' + code, s)
            if currency_type:
                c = code + "D"  # eg. AUD
                break
        price = f"{c} {price}"

    currency = iso4217parse.parse(price)[0]
    return {
        'formatted': formatted,
        'code': currency.alpha3,
        'name': currency.name,
        'symbol': currency.symbols[0],
        'value': float(re.sub(r"\D", "", price))
    }
