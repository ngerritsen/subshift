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

test('Syncs the subtitles based on times.', () => {
  childProcess.execSync(`node . sync ${testFilePath} 01:00:03,000 03:00:01,000`);

  const result = fs.readFileSync(testFilePath, 'utf-8');

  expect(result).toBe(fixtures.testLinearCorrectedSubtitles);
});
