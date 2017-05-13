'use strict'

const imgur = require('imgur')
const exec = require('child_process').exec
const opn = require('opn')
const dialog = require('dialog')

try {
  const { username, password } = require('./credentials')

  if (username && password) {
    imgur.setCredentials(username, password)
  }
} catch(err) {}

let cp = exec('xfce4-screenshooter -r -o cat', { encoding: 'base64' }, (err, stdout, stderr) => {
  if (err) {
    console.error(err.stack)
    process.exit()
  }
  imgur.uploadBase64(stdout)
  .then((json) => {
    opn(json.data.link)
  })
  .catch((err) => {
    dialog.err(JSON.stringify(err), 'Upload failed')
  })
})
