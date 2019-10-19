import sqlite3
from sqlite3 import Error

def create_table(conn):
    sql = ''' CREATE TABLE IF NOT EXISTS listing_data (
      listing_id INTEGER PRIMARY KEY,
      url TEXT NOT NULL UNIQUE,
      is_deep_scraped TEXT,
      is_location_scraped TEXT
      ) '''
    cur = conn.cursor()
    cur.execute(sql)

def load_prev_visited(db_name):
    db_file = f"./data/{db_name}.db"
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    create_table(conn)
    prev_visited_listings = {}
    sql = ''' SELECT * FROM listing_data '''
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    for row in rows:
        prev_visited_listings[row['url']] = {
            'is_deep_scraped': row['is_deep_scraped'],
            'is_location_scraped': row['is_location_scraped']
        }
    conn.close()

    return prev_visited_listings
