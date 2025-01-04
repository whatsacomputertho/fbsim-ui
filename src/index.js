const express = require('express')
express.static.mime.types['wasm'] = 'application/wasm'
const app = express()
const port = 8080

app.use(express.static('static'))
app.route('/', express.static('index.html'))

app.listen(port, () => {
  console.log(`FBSim UI server listening on port ${port}`)
})