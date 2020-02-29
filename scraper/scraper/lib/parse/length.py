import re


# Accepts any string containing metric or imperial length
# Return dict with meters, imperial string and total inches
def parse_length(length):
    obj = {}
    # Replace "Feet" with '
    length = re.sub(r'(?i)\s*feet', "'", length)
    # Replace "ft" with ''
    length = re.sub(r'(?i)\s*ft', "'", length)

    # Check if string contains imperial symbol ' or "
    is_imperial = re.search(r"'|\"", length)
    is_metric = re.search(r'\d+.?\d*\s*(?=m)', length)

    if is_imperial:
        imperial = re.search(r'(\d*(.\d*)?\')(\s*\d+)?', length).group(0)
        feet = re.search(r"\d+.?\d*(?=')", imperial)
        feet = feet.group(0) if feet else '0'
        inches = imperial.replace(feet, '').replace("'", '')
        inches = re.search(r'(\d+)', inches)
        inches = inches.group(0) if inches else '0'
        total_inches = int(float(feet) * 12 + int(inches))
        obj["total_inches"] = total_inches
        obj["imperial"] = f"{int(total_inches/12)}' {total_inches%12}\""
        obj["meters"] = total_inches * 0.0254

    elif is_metric:
        obj["meters"] = float(is_metric.group(0))
        total_inches = int(obj["meters"] / 0.0254)
        obj["total_inches"] = total_inches
        obj["imperial"] = f"{int(total_inches/12)}' {total_inches%12}\""

    # replace 0" and 0' if that is added
    if obj.get('imperial'):
        obj["imperial"] = re.sub("^0' ", '', obj["imperial"])
        obj["imperial"] = re.sub(' 0"$', '', obj["imperial"])

    return obj
