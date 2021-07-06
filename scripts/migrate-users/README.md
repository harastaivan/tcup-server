# Migrace stránek

## tcup-server

1. new branch
2. ve stare heroku app nastavit tuto branch misto master
3. vytvorit novou app v heroku - tcup-xxxx-api, region Europe
4. deploy -> github -> connect to repo tcup-server -> branch -> enable automatic deploys -> deploy
5. open app (error)
6. migrace database viz (dump database a restore database)
7. nastaveni env variables (config vars)
8. melo by fungovat...
9. settings -> add domain -> zkopirovat dns target -> vytvorit novy dns zaznam (TTL 300, CNAME)
10. resources -> change dyno type -> hobby dyno
11. settings -> SSL certificates -> automatically managed

12. competitionClasses v databazi musi mit `soaringSpotId`
13. synchronize contest
14. competitionDays must have correct `TASK`s set
15. synchronize results

### Dump database

```
mongodump --uri 'mongodb+srv://user:password@cluster1.isq4l.mongodb.net/tcup_prod' -o mongodump/
```

### Restore database

```
mongorestore --uri 'mongodb+srv://user:password@cluster1.isq4l.mongodb.net/tcup_prod_2020' -d tcup_prod_2020 mongodump/tcup_prod/
```

### Synchronize contest

```
heroku run -a tcup-api npm run soaring-spot:contest
```

### Synchronize results

```
heroku run -a tcup-api npm run soaring-spot:results
```

### Scheduler for results synchronization

```
heroku addons:create scheduler:standard -a tcup-api
heroku addons:open scheduler -a tcup-api
```

- Create job
- Every 10 minute
- Run command `npm run soaring-spot:results`

## tcup-client

1. new branch
2. ve stare heroku app nastavit tuto branch misto master
3. vytvorit novou app v heroku - tcup-xxxx, region Europe
4. deploy -> github -> connect to repo tcup-client -> branch -> enable automatic deploys -> deploy
5. add buildpack (https://github.com/mars/create-react-app-buildpack)
6. deploy
7. nastaveni env variables (config vars)
8. melo by fungovat...
9. settings -> add domain -> zkopirovat dns target -> vytvorit novy dns zaznam (TTL 300, CNAME)
10. resources -> change dyno type -> hobby dyno
11. settings -> SSL certificates -> automatically managed
