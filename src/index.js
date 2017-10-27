#!/usr/bin/env node

'use strict';

const fs = require('fs');
const moment = require('moment');
const program = require('commander');
const { version } = require('../package.json');

const TIME_FORMAT = 'HH:mm:ss,SSS';
const TIME_SEPARATOR = ' --> ';
const NEGATIVE_PATCH = 'NegativeNumber';
let matchingCommand = false;

program
  .version(version)
  .option('-o --output <path>', 'Path to output shifted file.')
  .option('-b --backup', 'Create a ".bak" backup file.');

program
  .command('shift <path> <shift> [shiftEnd]')
  .description(
    'Shifts .srt subtitle files by milliseconds, providing a shift-end will perform a linear correction.'
  )
  .action((path, shiftStartArg, shiftEndArg = shiftStartArg) => {
    matchingCommand = true;
    const shiftStart = parseNumericArg(shiftStartArg);
    const shiftEnd = parseNumericArg(shiftEndArg);

    const subs = fs.readFileSync(path, 'utf-8');
    const shiftedSubs = shift(subs, shiftStart, shiftEnd);

    write(program, path, subs, shiftedSubs);
  });

program
  .command('sync <path> <startTime> <endTime>')
  .description(
    'Syncs the subtitles with a linear correction based on the start times of the first and last subtitle. Time format is HH:mm:ss,SSS.'
  )
  .action((path, startTimeArg, endTimeArg) => {
    matchingCommand = true;
    const startTime = parseTime(startTimeArg);
    const endTime = parseTime(endTimeArg);

    const subs = fs.readFileSync(path, 'utf-8');
    const shiftedSubs = sync(subs, startTime, endTime);

    write(program, path, subs, shiftedSubs);
  });

program.parse(patchNegatives(process.argv));

if (!matchingCommand) {
  program.help();
}

function sync(subs, startTime, endTime) {
  const [firstTime, lastTime] = getBoundingTimes(subs);
  const shiftStart = startTime.diff(firstTime);
  const shiftEnd = endTime.diff(lastTime);

  return shift(subs, shiftStart, shiftEnd);
}

function shift(subs, shiftStart, shiftEnd) {
  const [firstTime, lastTime] = getBoundingTimes(subs);
  const shiftFactor = (shiftEnd - shiftStart) / firstTime.diff(lastTime);

  return subs
    .split('\n')
    .map(
      line =>
        isTimeLine(line)
          ? shiftTimeLine(line, shiftFactor, shiftStart, firstTime)
          : line
    )
    .join('\n');
}

function shiftTimeLine(line, shiftFactor, shiftStart, firstTime) {
  return parseTimes(line)
    .map(time => {
      const shiftBy = calculateShift(time, firstTime, shiftStart, shiftFactor);
      return time.add(shiftBy, 'ms').format(TIME_FORMAT);
    })
    .join(TIME_SEPARATOR);
}

function calculateShift(time, firstTime, shiftStart, shiftFactor) {
  const elapsedSinceFirst = firstTime.diff(time);
  return shiftStart + elapsedSinceFirst * shiftFactor;
}

function getBoundingTimes(subs) {
  const lines = subs.split('\n');
  const timeLines = lines.filter(isTimeLine);

  if (timeLines.length === 0) {
    throw new Error('No valid subtitles found');
  }

  const [firstTime] = parseTimes(timeLines[0]);
  const [lastTime] = parseTimes(timeLines[timeLines.length - 1]);

  return [firstTime, lastTime];
}

function parseTimes(line) {
  return line.split(TIME_SEPARATOR).map(timeString => parseTime(timeString));
}

function parseTime(timeString) {
  return moment(timeString.trim(), TIME_FORMAT);
}

function isTimeLine(line) {
  return line.indexOf(TIME_SEPARATOR) > -1;
}

function write(program, path, originalSubs, shiftedSubs) {
  if (program.backup) {
    fs.writeFileSync(path + '.bak', originalSubs);
  }

  fs.writeFileSync(program.output || path, shiftedSubs);
}

function patchNegatives(args) {
  return args.map(
    arg => (isNumber(arg) ? arg.replace('-', NEGATIVE_PATCH) : arg)
  );
}

function isNumber(string) {
  return !isNaN(string) && isFinite(string);
}

function parseNumericArg(arg) {
  return Number(arg.replace(NEGATIVE_PATCH, '-'));
}
