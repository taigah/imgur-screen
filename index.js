#!/usr/bin/env node
'use strict'

const fs = require('fs')
const imgur = require('imgur')
const exec = require('child_process').exec
const opn = require('opn')
const cp = require('copy-paste')

// Parsing arguments

let album = null
let copy = false

if (process.argv.includes('--copy')) {
  copy = true
}

if (process.argv.includes('--album')) {
  try {
    let index = process.argv.indexOf('--album') + 1
    album = process.argv[index]
    if (album === undefined) {
      throw new Error('Album id not provided')
    }
  } catch (err) {
    console.error('Incorrect usage of --album\n Should be --album album_id')
    process.exit(1)
  }
}

function upload (file) {
  return imgur.uploadFile(file, album)
  .then((json) => {
    if (copy) {
      cp.copy(json.data.link)
    }
    opn(json.data.link)
  })
}

function screen () {
  return new Promise((resolve, reject) => {
    exec('xfce4-screenshooter -r -o echo', (err, stdout, stderr) => {
      if (err) {
        console.error(err.stack)
        process.exit(1)
      }
      const file = stdout.trim()
      upload(file)
      .then(resolve)
      .catch(reject)
    })
  })
}

const credentialsPath = process.env.HOME + '/.imgur-screen.json'

fs.access(credentialsPath, (err) => {
  if (err) {
    screen()
    .then(() => {
      process.exit(0)
    })
    .catch(err => {
      throw err
    })
  } else {
    fs.readFile(credentialsPath, (err, data) => {
      if (err) {
        console.error(err)
        process.exit()
      }
      const { username, password } = JSON.parse(data.toString())
      imgur.setCredentials(username, password)
      screen()
      .then(() => {
        process.exit(0)
      })
      .catch(err => {
        console.error(err)
      })
    })
  }
})
