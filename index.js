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
            name: sanitizeString(req.fields.name),
            date: Date.now(),
            parent: sanitizeString(req.fields.reply)
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

app.get('/user', function (req, res) {
    if (!req.query || !req.query.account) {
        res.send('Missing account value!')
    }

    let data = {
        query: { name: sanitizeString(req.query.account) },
        sort: { date: -1 }
    }

    mh.find('messages', data, function(val) {
        if (val && val.length > 0)
            res.send(JSON.stringify(val.splice(0,5)))
        else
            res.send('error!')
    })
})

app.get('/all', function (req, res) {
    let data = {
        query: {},
        sort: { date: -1 }
    }

    mh.find('messages', data, function(posts) {
        if (posts && posts.length > 0) {

            for (var i = posts.length - 1; i >= 0; i--) {
                if (posts[i].parent) {
                    var current_post = posts[i]
                    posts.splice(i, 1);

                    var parent = posts.find(p => p._id == current_post.parent)
                    if (!parent.children)
                        parent.children = []
                    parent.children.push(current_post)
                }
            }

            res.send(JSON.stringify(posts))
        } else {
            res.send('error!')
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app