import csv
import pymongo
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='../../.env')

MONGO_URI_KEY = "MONGO_URI_DEV"
MONGO_URI = os.getenv(MONGO_URI_KEY)
DATABASE = "tcup"

def load_glider_indexes():
    glider_types = [];
    with open('glider-indexes.txt', encoding='utf8') as file:
        for line in file:
            data = line.strip()
            coeficient = data.split('    ')[0]
            glider_names = data.split('    ')[1].split(';')
            glider_names = [glider_name.strip() for glider_name in glider_names if glider_name]
            for glider_name in glider_names:
                glider_type = {
                    'name': glider_name,
                    'index': int(coeficient)
                }
                glider_types.append(glider_type)
    return glider_types

def insert_glider_types(glider_types):
    client = pymongo.MongoClient(MONGO_URI)
    database = client[DATABASE]
    collection = database['glidertypes']
    result = collection.insert_many(glider_types)
    return result.acknowledged, len(result.inserted_ids)



glider_types = load_glider_indexes()
# print(glider_types)
successful, count = insert_glider_types(glider_types)
print('Insert successful' if successful else 'Insert not successful')
print(f'{count} glider types inserted')
