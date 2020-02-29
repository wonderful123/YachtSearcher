import sys
import pytest
sys.path.append("..")
from scraper.lib import parse

testdata = [(
    "Length : 37.75 Feet",
    453,
    "37' 9\"",
    11.5062
), (
    "37' 9\"",
    453,
    "37' 9\"",
    11.5062
), (
    "37'9\"",
    453,
    "37' 9\"",
    11.5062
), (
    "The length is: 37' 9\" and some other text",
    453,
    "37' 9\"",
    11.5062
), (
    "37'",
    444,
    "37'",
    11.2776
), (
    "37 feet",
    444,
    "37'",
    11.2776
), (
    "37FEET",
    444,
    "37'",
    11.2776
), (
    "37 ft",
    444,
    "37'",
    11.2776
), (
    "39'6",
    474,
    "39' 6\"",
    12.0396
), (
    "39.5'",
    474,
    "39' 6\"",
    12.0396
), (
    "52'",
    624,
    "52'",
    15.849599999999999
), (
    "Length : 37.75' blah blah",
    453,
    "37' 9\"",
    11.5062
), (
    "Length : 78.00 FEET",
    936,
    "78'",
    23.7744
)]

@pytest.mark.parametrize("length_string, total_inches, imperial, meters",
                         testdata)
def test_parse_length(length_string, total_inches, imperial, meters):
    data = parse.length(length_string)
    print(data)
    assert total_inches == data['total_inches'], "Total inches incorrect"
    assert imperial == data['imperial'], "Imperial string incorrect"
    assert meters == data['meters'], "Meters incorrect"
