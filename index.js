const express = require('express')
const formidable = require('express-formidable')
const app = express()
const port = 3000

app.use('/static', express.static('public'))
app.use(formidable())
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/', function (req, res) {
  if (req.fields && req.fields.content)
    res.send(req.fields.content)
  else
    res.send('Missing content value!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app