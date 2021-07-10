const { readFileSync, writeFileSync } = require('fs')

/**
 * Creates a new database using JSON.
 * @param {string} path
 * @param {boolean} enc
 */
class DB {
  constructor(path) {
    const json = readFileSync(path).toString()

    this._path = path

    try {
      this._json = JSON.parse(json)
    } catch(e) {
      this.clear()
    }
  }

  _write() {
    let data = JSON.stringify(this._json)

    writeFileSync(this._path, data)
  }

  set_key(key, value) {
    if (key.split('/').length > 1) {
      let split = key.split('/')
      let node = this._json
      split.pop()
      for (const k of split) {
        if (!node[k]) node[k] = {}
        node = node[k]
      }

      node[key.split('/')[split.length]] = value
    } else {
      this._json[key] = value
    }
    this._write()
  }

  get_key(key) {
    if (key.split('/').length > 1) {
      let node = this._json
      for (const k of key.split('/')) {
        if (!node) return undefined
        node = node[k]
      }

      return node
    } else {
      return this._json[key]
    }
  }

  delete_key(key) {
    if (key.split('/').length > 1) {
      let code = 'delete this._json'
      for (const k of key.split('/')) {
        // Potentially dangerous code
        if (!eval(code.split(' ')[1])) return undefined
        code += `['${k}']`
      }

      // Potentially dangerous code
      eval(code)
    } else {
      delete this._json[key]
    }
    this._write()
  }

  clear() {
    this._json = {}
    this._write()
  }

  log() {
    console.log(this._json)
  }
}

module.exports.DB = DB