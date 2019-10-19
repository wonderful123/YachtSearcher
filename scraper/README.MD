How to use the scraper:
"scrapy crawl yachthub"

Stores files in data directory. There is a file that stores which urls have been deep scraped (this can be deleted to revisit the pages again). This means that extra data is gathered from the listing page. There's no need to visit the pages again.

Arguments:
scrapy crawl yachthub -a page_depth=x start_index=x scrape_location=true

page_depth (number)
- Default all

start_index (number)
- Default 1

scrape_location (false)
- Default true
Only scrapes location if not in deep scraped list.
