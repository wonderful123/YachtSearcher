import json

contents = open('prev_visited_listings.jl', "r").read() 
prev_visited_listings = [json.loads(str(item)) for item in contents.strip().split('\n')]

print(prev_visited_listings)
