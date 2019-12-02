let mongoose = require('mongoose')
require('dotenv').config()

export let dbConnection = mongoose.createConnection(`
  mongodb://${process.env.MONGO_URL}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_URL}`,
{ useNewUrlParser: true, useCreateIndex: true }
)
