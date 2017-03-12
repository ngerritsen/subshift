'use strict'

const test = require('ava')
const fs = require('fs')
const childProcess = require('child_process')
const uuid = require('uuid')
const rimraf = require('rimraf')

const TEST_FOLDER = '.test'
const testSubtitles = `
1
00:00:00,100 --> 0:00:03,410
Hello world

2
00:01:20,000 --> 0:01:28,900
Lorem ipsum,
dolor sit amet.
`

test.before(t => {
  fs.mkdirSync(TEST_FOLDER)
})

test.after(t => {
  rimraf.sync(TEST_FOLDER)
})

test('Shifts subtitles', t => {
  const testFileName = TEST_FOLDER + '/' + uuid.v4() + '.srt'
  const expectedResult = `
1
00:00:02,200 --> 00:00:05,510
Hello world

2
00:01:22,100 --> 00:01:31,000
Lorem ipsum,
dolor sit amet.
`

  fs.writeFileSync(testFileName, testSubtitles)

  childProcess.execSync(`node . ${testFileName} 2100`)
  const result = fs.readFileSync(testFileName, 'utf-8')
  t.is(result, expectedResult)
})

test('Shifts subtitles negatively', t => {
  const testFileName = TEST_FOLDER + '/' + uuid.v4() + '.srt'
  const expectedResult = `
1
00:00:00,000 --> 00:00:03,310
Hello world

2
00:01:19,900 --> 00:01:28,800
Lorem ipsum,
dolor sit amet.
`

  fs.writeFileSync(testFileName, testSubtitles)

  childProcess.execSync(`node . ${testFileName} -100`)
  const result = fs.readFileSync(testFileName, 'utf-8')
  t.is(result, expectedResult)
})
