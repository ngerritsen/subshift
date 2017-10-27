const testSubtitles = `
1
01:00:00,000 --> 01:00:00,000
Hello world

2
02:00:00,000 --> 02:00:00,000
Lorem ipsum,
dolor sit amet.

3
03:00:00,000 --> 03:00:00,000
The end!
`;

const testShiftedSubtitles = `
1
01:00:02,100 --> 01:00:02,100
Hello world

2
02:00:02,100 --> 02:00:02,100
Lorem ipsum,
dolor sit amet.

3
03:00:02,100 --> 03:00:02,100
The end!
`;

const testNegativeShiftedSubtitles = `
1
00:59:57,900 --> 00:59:57,900
Hello world

2
01:59:57,900 --> 01:59:57,900
Lorem ipsum,
dolor sit amet.

3
02:59:57,900 --> 02:59:57,900
The end!
`;

const testLinearCorrectedSubtitles = `
1
01:00:03,000 --> 01:00:03,000
Hello world

2
02:00:02,000 --> 02:00:02,000
Lorem ipsum,
dolor sit amet.

3
03:00:01,000 --> 03:00:01,000
The end!
`;

const testNegativeLinearCorrectedSubtitles = `
1
01:00:03,000 --> 01:00:03,000
Hello world

2
02:00:00,000 --> 02:00:00,000
Lorem ipsum,
dolor sit amet.

3
02:59:57,000 --> 02:59:57,000
The end!
`;

module.exports = {
  testSubtitles,
  testShiftedSubtitles,
  testNegativeShiftedSubtitles,
  testLinearCorrectedSubtitles,
  testNegativeLinearCorrectedSubtitles
};
