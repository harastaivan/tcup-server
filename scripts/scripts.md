# Mongo scripts

## Dump database

```
mongodump --uri 'mongodb+srv://user:password@cluster1.isq4l.mongodb.net/tcup_prod' -o mongodump/
```

## Restore database

```
mongorestore --uri 'mongodb+srv://user:password@cluster1.isq4l.mongodb.net/tcup_prod_2020' -d tcup_prod_2020 mongodump/tcup_prod/
```
