obj = {}
row = { "http://www.cruisersforum.com/forums/f47/are-there-any-affordable-bluewater-boats-built-in-the-90s-134069-2.html": { "deep_scraped": "true", "location_scraped": "false" }}
row2 = { "http://www.cruisersforum.com/forums/f47/are-there-any-affordable-123": { "deep_scraped": "true", "location_scraped": "true" }}
obj.update(row)
obj.update(row2)

import sqlite3
from sqlite3 import Error

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
    return conn

def create_table(conn):
    sql = ''' CREATE TABLE IF NOT EXISTS listing_data (
      listing_id INTEGER PRIMARY KEY,
      url TEXT NOT NULL UNIQUE,
      is_deep_scraped TEXT,
      is_location_scraped TEXT
      ) '''
    cur = conn.cursor()
    cur.execute(sql)

def insert_data(conn):
    sql = ''' INSERT INTO listing_data
    (url, is_deep_scraped, is_location_scraped)
    VALUES ("http://fucker.com", str(None), 'false') '''
    cur = conn.cursor()
    cur.execute(sql)

def load_prev_visited(conn):
    prev_visited_listings = {}
    sql = ''' SELECT * FROM listing_data '''
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    for row in rows:
        print(row)
        prev_visited_listings[row['url']] = {
            'is_deep_scraped': row['is_deep_scraped'],
            'is_location_scraped': row['is_location_scraped']
        }
    conn.close()

    return prev_visited_listings

conn = create_connection('./data/yachthub.db')

# create_table(conn)
# insert_data(conn)
listings = load_prev_visited(conn)

import pprint
pprint.pprint(listings)
