const express = require('express')
const formidable = require('express-formidable')

const mh = require('mongodb-tiny-helper')(
    'mongodb+srv://'+
    process.env.DB_USER+':'+
    process.env.DB_PASS+
    '@cluster0-yn8qf.mongodb.net/test?retryWrites=true&w=majority',
    'main'
)

const app = express()
const port = 3000

app.use('/static', express.static('public'))
app.use(formidable())
app.get('/', (req, res) => res.send('Hello World!'))

const sanitizeString = (str) => {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}

app.post('/', function (req, res) {
  if (req.fields && req.fields.content) {
        req.fields.content = sanitizeString(req.fields.content)

        let data = {
            text: req.fields.content,
            date: Date.now()
        }

        mh.insertOne('messages', data, function(val) {
            if (val.insertedCount === 1)
                res.send(req.fields.content)
            else
                res.send('error!')
        })
    } else {
        res.send('Missing content value!')
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app