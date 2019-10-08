VALID_SITES = ['YachtHub', 'YachtWorld']

import argparse
parser = argparse.ArgumentParser()
parser.add_argument("site", choices=VALID_SITES,
                    help="Site name to scrape")
parser.add_argument("-d", type=int,
                    help="index page depth")
parser.add_argument("-s", type=int,
                    help="starting page number")
args = parser.parse_args()

class Scraper:
  __init__(site, page_depth, start_page)
