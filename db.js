const { readFileSync, writeFileSync } = require('fs')

class DB {
  constructor(path) {
    this.path = path

    try {
      this._json = JSON.parse(readFileSync(path))
    } catch {
      this._json = {}
    }
  }

  get(key) {
    return this._json[key]
  }

  set(key, value) {
    this._json[key] = value
    this._write()
  }

  _write() {
    writeFileSync(this.path, JSON.stringify(this._json))
  }
}

module.exports = DB