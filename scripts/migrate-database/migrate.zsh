source $(dirname "$0")/.env

DUMP_DIR="$(dirname "$0")/mongodump"

echo "🎉 Migrating $FROM_MONGO_DB_NAME database to $TO_MONGO_DB_NAME"

[[ -d $DUMP_DIR ]] && rm -r $DUMP_DIR && echo "🔥 Removed old dump directory $DUMP_DIR"

echo "⬇️  Dumping $FROM_MONGO_DB_NAME"
mongodump --uri=$BASE_URI --db=$FROM_MONGO_DB_NAME --out=$DUMP_DIR --ssl
echo "✨ Dump created in $DUMP_DIR"

echo "⬆️  Restoring $FROM_MONGO_DB_NAME to $TO_MONGO_DB_NAME"
mongorestore --uri=$BASE_URI --db=$TO_MONGO_DB_NAME --ssl "$DUMP_DIR/$FROM_MONGO_DB_NAME/"
echo "✨ Restore done."
