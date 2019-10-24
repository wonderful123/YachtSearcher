import sqlite3
from sqlite3 import Error
import os

class Database:
    """Handles simple sqlite database to keep track of urls already visited.
    We want to avoid having to check for changes on each individual listing
    so urls visited can be stored with flags indicating whether the listing
    has been visited or the location api has been used.

    Parameters
    ----------
    db_name : string
        Use the spider name and it will store the database file in ./data/db_name.db

    """

    def __init__(self, db_name):
        """ Initialize connection to database.
        :param db_name: database file (use spider name)
        """
        self.__conn = self.__create_connection(db_name)
        # Create listing data table if it doens't already exist
        self.__create_listing_data_table()

    def __create_connection(self, db_name):
        """ create a database connection to the SQLite database
            specified by db_name
        :param db_name: database file (use spider name)
        :return: Connection object or None
        """
        os.makedirs("./data/db", exist_ok=True)
        conn = None
        try:
            conn = sqlite3.connect("./data/db/" + db_name + ".db")
        except Error as e:
            print(e)

        return conn

    def close_connection(self):
        """ Simply closed the database connection
        :return: None
        """
        self.__conn.close()

    def __create_listing_data_table(self):
        sql = ''' CREATE TABLE IF NOT EXISTS listing_data (
          listing_id INTEGER PRIMARY KEY,
          url TEXT NOT NULL UNIQUE,
          is_deep_scraped TEXT,
          is_location_scraped TEXT
          ) '''
        cur = self.__conn.cursor()
        cur.execute(sql)
        self.__conn.commit()

    def flag_listing_data(self, url, field):
        """ flag listing data with true so we know it's been deep scraped
        :param url: listing url
        :param field: is_deep_scraped or is_location_scraped
        :return: None
        """
        # Uses 2 queries to upsert
        sql = f''' UPDATE listing_data
            SET {field} = "true"
            WHERE url = "{url}" '''
        cur = self.__conn.cursor()
        cur.execute(sql)

        sql = f''' INSERT OR IGNORE INTO listing_data
            (url, {field})
            VALUES ( "{url}", 'true' ) '''
        cur.execute(sql)
        self.__conn.commit()

    def load_prev_visited(self):
        """ Returns previously visited listings with flags to know if they have been
        deep scraped or location scraped
        :return: Dict with the listing url as the key and the flags set to 'true' or None.
        flags are is_deep_scraped or is_location_scraped
        """
        prev_visited_listings = {}
        sql = ''' SELECT * FROM listing_data '''
        # Returns dict rather than tuple
        self.__conn.row_factory = sqlite3.Row
        cur = self.__conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()
        for row in rows:
            prev_visited_listings[row['url']] = {
                'is_deep_scraped': row['is_deep_scraped'],
                'is_location_scraped': row['is_location_scraped']
            }

        return prev_visited_listings
