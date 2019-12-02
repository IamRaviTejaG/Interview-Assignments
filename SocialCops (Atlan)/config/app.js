let express = require('express')
let app = express()
let bodyparser = require('body-parser')
let fs = require('fs')
let morgan = require('morgan')
let routes = require('../routes/routes')

app.use(morgan(':remote-addr - [:date[iso]] - :method - :url - :status - :response-time ms - :res[content-length]', { stream: fs.createWriteStream('./logs/requests.log', { flags: 'a+' }) }))
app.use(morgan('tiny'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
routes.routes(app)

export default app
