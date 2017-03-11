#!/usr/bin/env node

'use strict'

const fs = require('fs')
const moment = require('moment')

const TIME_FORMAT = 'HH:mm:ss,SSS'
const TIME_SEPARATOR = ' --> '

const [,, path, shiftByMsString] = process.argv
const shiftByMs = Number(shiftByMsString)

read((data) => {
  const subs = parse(data)
  const shiftedSubs = shift(subs)
  const shiftedData = format(shiftedSubs)

  write(shiftedData)
})

function shift(subs) {
  return subs.map(sub => Object.assign({}, sub, {
    times: sub.times.map(time => time.clone().add(shiftByMs, 'ms'))
  }))
}

function parse(data) {
  return data
    .split('\n')
    .reduce((groups, line) => {
      if (line.trim() === '') {
        return [...groups, []]
      }

      return updateLast(groups, group => [...group, line])
    }, [[]])
    .filter(group => group.length > 0)
    .map(group => {
      const [n, timesString, ...lines] = group
      const times = parseTimes(timesString)
      return { n, times, lines }
    })
}

function parseTimes(timesString) {
  return timesString
    .split(TIME_SEPARATOR)
    .map(timeString => moment(timeString.trim(), TIME_FORMAT))
}

function updateLast(arr, updater) {
  return arr.map((item, i) => {
    if (i === arr.length - 1) {
      return updater(item)
    }

    return item
  })
}

function format(subs) {
  return subs
    .map(({ n, times, lines }) => [
      n,
      formatTimes(times),
      lines.join('\n')
    ].join('\n'))
    .join('\n\n')
}

function formatTimes(times) {
  return times
    .map(time => time.format(TIME_FORMAT))
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
