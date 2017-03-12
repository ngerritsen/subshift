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

3
01:59:58,888 --> 01:59:58,920
The end!
`

const linearTestSubtitles = `
1
00:00:00,000 --> 00:00:00,000
Hello world

2
01:00:00,000 --> 01:00:00,000
Lorem ipsum,
dolor sit amet.

3
02:00:00,000 --> 02:00:00,000
The end!
`

test.beforeEach(t => {
  t.context.testFilePath = TEST_FOLDER + '/' + uuid.v4() + '.srt'
})

test.before(t => {
  fs.mkdirSync(TEST_FOLDER)
})

test.after.always(t => {
  rimraf.sync(TEST_FOLDER)
})

test('Shifts subtitles', t => {
  const { testFilePath } = t.context
  const expectedResult = `
1
00:00:02,200 --> 00:00:05,510
Hello world

2
00:01:22,100 --> 00:01:31,000
Lorem ipsum,
dolor sit amet.

3
02:00:00,988 --> 02:00:01,020
The end!
`

  fs.writeFileSync(testFilePath, testSubtitles)

  childProcess.execSync(`node . ${testFilePath} 2100`)
  const result = fs.readFileSync(testFilePath, 'utf-8')
  t.is(result, expectedResult)
})

test('Shifts subtitles negatively', t => {
  const { testFilePath } = t.context
  const expectedResult = `
1
00:00:00,000 --> 00:00:03,310
Hello world

2
00:01:19,900 --> 00:01:28,800
Lorem ipsum,
dolor sit amet.

3
01:59:58,788 --> 01:59:58,820
The end!
`

  fs.writeFileSync(testFilePath, testSubtitles)

  console.log(childProcess.execSync(`node . ${testFilePath} -100`).toString())
  const result = fs.readFileSync(testFilePath, 'utf-8')
  t.is(result, expectedResult)
})

test('With a second time does a linear shift.', t => {
  const { testFilePath } = t.context
  const expectedResult = `
1
00:00:01,000 --> 00:00:01,000
Hello world

2
01:00:02,000 --> 01:00:02,000
Lorem ipsum,
dolor sit amet.

3
02:00:03,000 --> 02:00:03,000
The end!
`

  fs.writeFileSync(testFilePath, linearTestSubtitles)

  childProcess.execSync(`node . ${testFilePath} 1000 3000`)
  const result = fs.readFileSync(testFilePath, 'utf-8')
  t.is(result, expectedResult)
})

test('With a second negative time does a linear shift.', t => {
  const { testFilePath } = t.context
  const expectedResult = `
1
00:00:01,000 --> 00:00:01,000
Hello world

2
01:00:00,000 --> 01:00:00,000
Lorem ipsum,
dolor sit amet.

3
01:59:59,000 --> 01:59:59,000
The end!
`

  fs.writeFileSync(testFilePath, linearTestSubtitles)

  childProcess.execSync(`node . ${testFilePath} 1000 -1000`)
  const result = fs.readFileSync(testFilePath, 'utf-8')
  t.is(result, expectedResult)
})
