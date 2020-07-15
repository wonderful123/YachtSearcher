# How to use the scraper:
`scrapy crawl yachthub`

Stores files in data directory. There is a file that stores which urls have been deep scraped (this can be deleted to revisit the pages again). This means that extra data is gathered from the listing page. There's no need to visit the pages again.

## Install with:
`pip install -r requirements.txt`

## Arguments:
`scrapy crawl yachthub -a page_depth=x -a start_index=x -a scrape_location=true`

`page_depth (number)`
- Default all

`start_index (number)`
- Default 1

`scrape_location (false)`
- Default true
Only scrapes location if not in deep scraped list.

## Problems with python version - use virtualenv
`virtualenv -p /usr/bin/python3.6 venv`

To begin using the virtual environment, it needs to be activated:
`source venv/bin/activate`

===================Upgrading====================

## Upgrade PIP
Windows
`python -m pip install --upgrade pip`
Linux
`python -m pip install --upgrade pip`
use `source activate` to enter virtualenv. `deactivate` to exit.

## Upgrade Scrapy
`pip install --upgrade scrapy`

## Upgrade all python packages
Windows (Powershell)
`pip freeze | %{$_.split('==')[0]} | %{pip install --upgrade $_}`
Linux
`pip3 list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip3 install -U`
