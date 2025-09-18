'use strict'
require('module-alias/register')
const process = require('node:process')
const server = require('transport/http.js')
// const migrations = require('migrate.js')
// const staticServer = require('static/static.js')
const loadRoutes = require('loadRoutes/loadRoutes.js')
const path = require('node:path')
const apiPath = path.join(process.cwd(), '/src/api');

(async () => {
   const routing = await loadRoutes(apiPath)
   // await migrations()
   server(routing, process.env.API_PORT)
   // staticServer('src/static/', process.env.STATIC_PORT)
})()