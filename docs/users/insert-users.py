import csv
import pymongo
from pymongo.errors import BulkWriteError
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv(dotenv_path='../../.env')

MONGO_URI_KEY = "MONGO_URI_DEV"
MONGO_URI = os.getenv(MONGO_URI_KEY)
DATABASE = "tcup"

def load_users_from_txt():
    filename = 'users.txt'
    users = [];
    with open(filename, encoding='utf8') as file:
        next(file)
        for line in file:
            data = line.strip().split(';')
            surname = data[0]
            name = data[1]
            email = data[2]
            first_password = 'tcup2020'
            first_hash = bcrypt.hashpw(first_password.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8')
            user = {
                'name': name,
                'surname': surname,
                'email': email,
                'password': first_hash
            }
            users.append(user)
    return users

def insert_users(users):
    client = pymongo.MongoClient(MONGO_URI)
    database = client[DATABASE]
    collection = database['users']
    try:
        result = collection.insert_many(users)
        return result.acknowledged, len(result.inserted_ids)
    except BulkWriteError as error:
        print(error)
        return False, 0


users = load_users_from_txt()
# print(users)
successful, count = insert_users(users)
print('Insert successful' if successful else 'Insert not successful')
print(f'{count} users inserted')
