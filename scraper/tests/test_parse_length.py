import sys
import pytest
sys.path.append("..")
from scraper.pipelines import parse_length

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
    "Length : 37.75' blah blah",
    453,
    "37' 9\"",
    11.5062
)]

@pytest.mark.parametrize("length_string, total_inches, imperial, meters", testdata)
def test_parse_length(length_string, total_inches, imperial, meters):
    data = parse_length(length_string)
    print(data)
    assert total_inches == data['total_inches'], "Total inches incorrect"
    assert imperial == data['imperial'], "Imperial string incorrect"
    assert meters == data['meters'], "Meters incorrect"
