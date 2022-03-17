const Database = require('./db')
const { isWebUri } = require('valid-url')
const express = require('express')
const app = express()

const PORT = 3000
const db = new Database('urls.json')

// write to file before exiting
for (const signal of [
  'SIGINT',
  'SIGUSR1',
  'SIGUSR2',
  'uncaughtException'
]) {
  process.on(signal, () => {
    db.write()
    process.exit()
  })
}

app.use(express.static('public'))

// copied from stackoverflow
function valid_url(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i') // fragment locator
  return pattern.test(str)
}

app.get('/:id', (req, res) => {
  const url = db.get(req.params.id)
  if (!url) {
    return res.status(404).redirect('/')
  }

  res.status(200).redirect(url)
})

app.get('/api/shorten', (req, res) => {
  if (!req.query || !req.query.url) {
    return res.status(422).send({ message: 'No url provided.' })
  }

  if (!isWebUri(req.query.url) || !valid_url(req.query.url)) {
    return res.status(422).send({ message: 'Invalid URL.' }) 
  }

  const id = Math.random().toString(36).substring(2)

  db.set(id, req.query.url)
  res.status(200).send({
    message: 'Successful.',
    url: `${req.protocol}://${req.get('host') || 'localhost:' + PORT}/${id}`
  })
})

app.listen(PORT, console.log(`Listening on port ${PORT}`))