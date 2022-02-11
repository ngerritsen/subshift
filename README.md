[![Pipeline Status](https://gitlab.com/ngerritsen/subshift/badges/master/pipeline.svg)](https://gitlab.com/ngerritsen/subshift/-/commits/master)

# subshift

Shifts SRT subtitle files by ms.

## Usage

Make sure you have [Node.js](https://nodejs.org/en/) 6+ installed. Then install subshift:

### Installation

```bash
npm install -g subshift
```

### Shift

Add a delay to all subtitles:

```bash
subshift shift file.srt 3000
```

Add a negative a delay:

```bash
subshift shift file.srt -200
```

When you specify a second shift, subshift will perform a linear correction:

```bash
subshift shift file.srt 1000 2000
```

This will shift the first subtitle with 1 second and the last with 2 seconds, it will distribute the delays in between in a linear fashion.

### Sync

Sync allows you to do a linear correction by providing the correct times for the start of the first and last subtitle.

```bash
subshift sync file.srt 00:01:30 01:30:52
```

This basically does the same as a shift with a start and end shift, but is more convenient because you don't have to calculate the shift durations yourself.

### Output files

Beware that subshift overwrites the origin file by default, you can create a backup or separate output file:

```bash
subshift file.srt 3000 -o file-sync.srt
subshift file.srt 3000 -b # Creates file.srt.bak with the original file
```

### Help

Display help:

```bash
subshift --help
```

## Feature wishlist ⭐️

- Provide reference points for linear shifts.
- Ability to provide seconds instead of milliseconds
