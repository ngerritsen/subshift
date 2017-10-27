'use strict';

const fs = require('fs');
const childProcess = require('child_process');
const uuid = require('uuid');
const rimraf = require('rimraf');
const fixtures = require('./fixtures');

const TEST_FOLDER = '.test-' + uuid.v4();

let testFilePath;

beforeEach(() => {
  testFilePath = TEST_FOLDER + '/' + uuid.v4() + '.srt';
  fs.writeFileSync(testFilePath, fixtures.testSubtitles);
});

beforeAll(() => {
  fs.mkdirSync(TEST_FOLDER);
});

afterAll(() => {
  rimraf.sync(TEST_FOLDER);
});

test('Shifts subtitles', () => {
  childProcess.execSync(`node . shift ${testFilePath} 2100`);

  const result = fs.readFileSync(testFilePath, 'utf-8');

  expect(result).toBe(fixtures.testShiftedSubtitles);
});

test('Shifts subtitles negatively', () => {
  childProcess.execSync(`node . shift ${testFilePath} -2100`);

  const result = fs.readFileSync(testFilePath, 'utf-8');

  expect(result).toBe(fixtures.testNegativeShiftedSubtitles);
});

test('With a second shift time does a linear shift.', () => {
  childProcess.execSync(`node . shift ${testFilePath} 3000 1000`);

  const result = fs.readFileSync(testFilePath, 'utf-8');

  expect(result).toBe(fixtures.testLinearCorrectedSubtitles);
});

test('With a second negative time does a linear shift.', () => {
  childProcess.execSync(`node . shift ${testFilePath} 3000 -3000`);

  const result = fs.readFileSync(testFilePath, 'utf-8');

  expect(result).toBe(fixtures.testNegativeLinearCorrectedSubtitles);
});
