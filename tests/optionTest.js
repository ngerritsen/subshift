'use strict';

const fs = require('fs');
const childProcess = require('child_process');
const uuid = require('uuid');
const rimraf = require('rimraf');
const { testSubtitles, testShiftedSubtitles } = require('./fixtures');

const TEST_FOLDER = '.test-' + uuid.v4();

let testFilePath;

beforeEach(() => {
  testFilePath = TEST_FOLDER + '/' + uuid.v4() + '.srt';
  fs.writeFileSync(testFilePath, testSubtitles);
});

beforeAll(() => {
  fs.mkdirSync(TEST_FOLDER);
});

afterAll(() => {
  rimraf.sync(TEST_FOLDER);
});

test('Specifying an output file will write the result there.', () => {
  childProcess.execSync(
    `node . shift ${testFilePath} 2100 -o ${testFilePath}-resync`
  );

  const result = fs.readFileSync(`${testFilePath}-resync`, 'utf-8');

  expect(result).toBe(testShiftedSubtitles);
});

test('Adding a backup flag will create a backup file.', () => {
  childProcess.execSync(`node . shift ${testFilePath} 2100 -b`);

  const backup = fs.readFileSync(`${testFilePath}.bak`, 'utf-8');
  const result = fs.readFileSync(`${testFilePath}`, 'utf-8');

  expect(backup).toBe(testSubtitles);
  expect(result).toBe(testShiftedSubtitles);
});
