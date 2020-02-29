import sys
import pytest
sys.path.append("..")
from scraper.lib import parse

basictestdata = [(
    "$109",
    "$109",
    "USD",
    109
), (
    "$ 109",
    "$109",
    "USD",
    109
), (
    "$109,500",
    "$109,500",
    "USD",
    109500
), (
    "$ 109,500",
    "$109,500",
    "USD",
    109500
), (
    "$ 109,500 Other Text  ",
    "$109,500",
    "USD",
    109500
), (
    " Other text at front: $ 109,500",
    "$109,500",
    "USD",
    109500
), (
    " Other text at front:  $109,500 and behind",
    "$109,500",
    "USD",
    109500
), (
    "$1.29 Million",
    "$1,290,000",
    "USD",
    1290000
), (
    "AU$1.29 Million",
    "$1,290,000",
    "AUD",
    1290000
), (
    "$1.29 Million NZD",
    "$1,290,000",
    "NZD",
    1290000
)]


@pytest.mark.parametrize("s, formatted_string, currency_code, value",
                         basictestdata)
def test_parse_price(s, formatted_string, currency_code, value):
    data = parse.price(s)
    assert formatted_string == data['formatted']
    assert currency_code == data['code']
    assert value == data['value']
