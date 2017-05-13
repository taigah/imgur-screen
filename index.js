#!/usr/bin/env node
'use strict'

const fs = require('fs')
const imgur = require('imgur')
const exec = require('child_process').exec
const opn = require('opn')
const dialog = require('dialog')

// Parsing arguments

let album = null

if (process.argv.includes('--album')) {
  try {
    let index = process.argv.indexOf('--album') + 1
    album = process.argv[index]
    if (album === undefined) {
      throw new Error('Album id not provided')
    }
  } catch (err) {
    dialog.err('Incorrect usage of --album\n Should be --album album_id')
    process.exit()
  }
}

function screen () {
  let cp = exec('xfce4-screenshooter -r -o cat', { encoding: 'base64' }, (err, stdout, stderr) => {
    if (err) {
      console.error(err.stack)
      process.exit()
    }
    imgur.uploadBase64(stdout, album)
    .then((json) => {
      opn(json.data.link)
    })
    .catch((err) => {
      dialog.err(JSON.stringify(err), 'Upload failed')
    })
  })
}

let credentials_path = process.env.HOME + '/.imgur-screen.json'

fs.access(credentials_path, (err) => {
  if (err) {
    screen()
  } else {
    fs.readFile(credentials_path, (err, data) => {
      if (err) {
        console.error(err)
        process.exit()
      }
      let { username, password } = JSON.parse(data.toString())
      imgur.setCredentials(username, password)
      screen()
    })
  }
})
