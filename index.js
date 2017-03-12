#!/usr/bin/env node

'use strict'

const fs = require('fs')
const moment = require('moment')
const program = require('commander')
const { version } = require('./package.json')

const TIME_FORMAT = 'HH:mm:ss,SSS'
const TIME_SEPARATOR = ' --> '

program
  .version(version)
  .usage('<file> <shift> [shiftEnd]')
  .parse(process.argv)

const [path, shiftStartArg, shiftEndArg] = program.args

if (!path || !shiftStartArg) {
  program.help()
}

const shiftStart = Number(shiftStartArg)
const shiftEnd = shiftEndArg ? Number(shiftEndArg) : shiftStart

read((subs) => {
  write(shift(subs))
})

function shift(subs) {
  const lines = subs.split('\n')
  const timeLines = lines.filter(isTimeLine)
  const [firstTime] = parseTimes(timeLines[0])
  const [lastTime] = parseTimes(timeLines[timeLines.length - 1])

  const shiftFactor = (shiftEnd - shiftStart) / getElapsedMs(firstTime, lastTime)

  return lines
    .map(line =>
      isTimeLine(line) ?
        shiftTimeLine(line, shiftFactor, firstTime) :
        line
    )
    .join('\n')
}

function shiftTimeLine(line, shiftFactor, firstTime) {
  return parseTimes(line)
    .map(time => {
      const shiftBy = calculateShift(time, shiftFactor, firstTime)
      return time.add(shiftBy, 'ms').format(TIME_FORMAT)
    })
    .join(TIME_SEPARATOR)
}

function calculateShift(time, shiftFactor, firstTime) {
  const extraShift = getElapsedMs(firstTime, time) * shiftFactor
  return extraShift + shiftStart
}

function parseTimes(line) {
  return line.split(TIME_SEPARATOR)
    .map(timeString => moment(timeString.trim(), TIME_FORMAT))
}

function isTimeLine(line) {
  return line.indexOf(TIME_SEPARATOR) > -1
}

function getElapsedMs(reference, time) {
  return time.unix() - reference.unix()
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
