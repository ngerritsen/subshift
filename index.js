#!/usr/bin/env node

'use strict'

const fs = require('fs')
const moment = require('moment')
const program = require('commander')
const { version } = require('./package.json')

const TIME_FORMAT = 'HH:mm:ss,SSS'
const TIME_SEPARATOR = ' --> '
const NEGATIVE_PATCH = 'NegativeNumber'

program
  .version(version)
  .option('-o --output <file>', 'Path to output shifted file.')
  .option('-b --backup', 'Create a ".bak" backup file.')

program
  .description('Shifts .srt subtitle files by milliseconds, providing a shift-end will perform a linear correction.')
  .command('shift <filepath> <shift>')
  .action((file, shift, shiftEnd) => {
    const shiftStart = parseNumericArg(shiftStartArg)
    const shiftEnd = shiftEndArg ? parseNumericArg(shiftEndArg) : shiftStart
    const subs = fs.readFileSync(filepath, 'utf-8')
    const shiftedSubs = shift(subs, shiftStart, shiftEnd)

    write(program, path, outputPath, subs, shiftedSubs)
  })

program
  .command('sync <filepath> <startTime> <endTime>')
  .description('Syncs the subtitles with a linear correction based on the start times of the first and last subtitle. Time format is HH:mm:ss,SSS.')
  .action((filepath, startTime, endTime) => {
    const subs = fs.readFileSync(filepath, 'utf-8')

    const shiftedSubs = shift(subs, shiftStart, shiftEnd)
    main()
  })

program.parse(patchNegatives(process.argv))

function shift(subs, shiftStart, shiftEnd) {
  const lines = subs.split('\n')
  const timeLines = lines.filter(isTimeLine)
  const [firstTime] = parseTimes(timeLines[0])
  const [lastTime] = parseTimes(timeLines[timeLines.length - 1])

  const shiftFactor = (shiftEnd - shiftStart) / getElapsedMs(firstTime, lastTime)

  return lines
    .map(line =>
      isTimeLine(line) ?
        shiftTimeLine(line, shiftFactor, shiftStart, firstTime) :
        line
    )
    .join('\n')
}

function shiftTimeLine(line, shiftFactor, shiftStart, firstTime) {
  return parseTimes(line)
    .map(time => {
      const shiftBy = calculateShift(time, shiftFactor, shiftStart, firstTime)
      return time.add(shiftBy, 'ms').format(TIME_FORMAT)
    })
    .join(TIME_SEPARATOR)
}

function calculateShift(time, shiftFactor, shiftStart, firstTime) {
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

function read(path, callback) {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      throw err
    }

    callback(data)
  })
}

function write(program, path, outputPath, original, data) {
  if (program.backup) {
    fs.writeFileSync(path + '.bak', original)
  }

  fs.writeFileSync(outputPath, data)
}

function patchNegatives(args) {
  return args.map(arg => isNumber(arg) ? arg.replace('-', NEGATIVE_PATCH) : arg)
}

function isNumber(string) {
  return !isNaN(string) && isFinite(string)
}

function parseNumericArg(arg) {
  return Number(arg.replace(NEGATIVE_PATCH, '-'))
}
