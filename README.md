# Why it's cool

-   Can find boats from multiple sites all in one place
-   Can see how long boats have been listed for
-   Can see a history of price changes
-   Can search more powerfully doing thing like excluding models you're not interested in

# Ideas

-   Price drop on boats listed for more than a month
-   Website could be like a notebook of boats you're interested in. You could keep notes for each one and order the list to your favourites and why.
-   It would be cool if you could make a list of your favourites then share it to a forum. Perhaps the code could go in automatically. What would a cool forum post look like? There are 2. Where individuals show the ones they like. Or where people post to threads like seabreeze interesting boats for sale or recommend people look at a boat. It could also be someone selling their own boat. It should be as easy as copying the link from the address bar.
-   Seabreeze interesting boats:
    *IMG*
    <b>42' Tayana - $100k - Sydney</b>
    Good fixer upper. Price has dropped. Listed for 6 months.
-   What if you wanted to recommend a few boats to someone?
    Go to the site. Star a few, a bit like a checkout. Review the list (optionally add comments to each) and click the share button.

* * *

# Scraped images

-   Simple python httpd server used locally

# Scraping and importing

-   In the scraper directory type: "scrapy crawl sitename" (Each site has a spider in the spiders directory)
-   Then in root call task "rails scraper:import" which will import all the scraped data from the scraper and archive once consumed.

# Resetting database

-   Call task "rails data:delete_all"
-   Move scraper archived files back to main data directory and they will be reprocessed

# Tests

-   Go to tests directory and run "pytest"

* * *

# Deployment

-   Do db:migrate, db:seed, database:stats, scraper:import with the flag `RAILS_ENV=production`
