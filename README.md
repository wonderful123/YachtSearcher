# Why it's cool
- Can find boats from multiple sites all in one place
- Can see how long boats have been listed for
- Can see a history of price changes
- Can search more powerfully doing thing like excluding models you're not interested in

# Ideas
- Price drop on boats listed for more than a month

---------------------------------------------------------------------------

# Scraped images
- Currently ember uses a symbolic link to serve the files. This should probably change to apache or other server later.

# Scraping and importing
- In the scraper directory type: "scrapy crawl sitename" (Each site has a spider in the spiders directory)
- Then in root call task "rails scraper:import" which will import all the scraped data from the scraper and archive once consumed.

# Resetting database
- Call task "rails data:delete_all"
- Move scraper archived files back to main data directory and they will be reprocessed

# Tests
- Go to tests directory and run "pytest"
