const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/', function (req, res) {
  if (req.query && req.query.content)
    res.send(req.query.content)
  else
    res.send('Use ?content parameter for this endpoint.')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app