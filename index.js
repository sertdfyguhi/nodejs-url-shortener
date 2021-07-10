const { DB } = require('./db')
const { isUri } = require('valid-url')
const express = require('express')
const app = express()

const db = new DB('urls.json')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/web/index.html')
})

app.get('/:id', (req, res) => {
  const url = db.get_key(req.params.id)
  if (!url) {
    return res.status(404).redirect('/') }

  res.status(200).redirect(/^(https|http):\/\//.test(url) ? url : 'https://' + url)
})

app.get('/api/shorten', (req, res) => {
  if (!req.query || !req.query.url) {
    return res.status(422).send({ message: 'No url provided.' }) }
  if (!isUri(req.query.url)) {
    return res.status(422).send({ message: 'Invalid URL.' }) }

  const id = Math.random().toString(36).substring(2)

  db.set_key(id, req.query.url)
  res.status(200).send({ message: 'Successful.', url: `${req.protocol}://${req.get('host')}/${id}` })
})

app.listen(3000)