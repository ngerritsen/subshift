#!/usr/bin/env node

'use strict'

const fs = require('fs')
const moment = require('moment')

const TIME_FORMAT = 'HH:mm:ss,SSS'
const TIME_SEPARATOR = ' --> '

const [,, path, shiftByMsString] = process.argv
const shiftByMs = Number(shiftByMsString)

read((subs) => {
  write(shift(subs))
})

function shift(subs) {
  return subs
    .split('\n')
    .map(line => {
      if (line.indexOf(TIME_SEPARATOR) > -1) {
        return shiftTimeLine(line)
      }

      return line
    })
    .join('\n')
}

function shiftTimeLine(line) {
  return line
    .split(TIME_SEPARATOR)
    .map(timeString =>
      moment(timeString.trim(), TIME_FORMAT)
        .add(shiftByMs, 'ms')
        .format(TIME_FORMAT)
    )
    .join(TIME_SEPARATOR)
}

function read(callback) {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      throw err
    }

    callback(data)
  })
}

function write(data) {
  fs.writeFile(path, data, err => {
    if (err) {
      throw err
    }
  })
}
