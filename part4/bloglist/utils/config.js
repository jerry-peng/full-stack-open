require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

module.export = {
  MONGODB_URI,
  PORT
}
