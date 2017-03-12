# subshift

Shifts SRT subtitle files by ms.

## Usage

Make sure you have [Node.js](https://nodejs.org/en/) 6+ installed. Then install subshift:

```bash
npm install -g subshift
```

Add a delay to all subtitles:

```bash
subshift file.srt 3000
```

Add a negative a delay:

```bash
subshift file.srt -200
```

When you specify a second shift, subshift will perform a linear correction:

```bash
subshift file.srt 1000 2000
```

This will shift the first subtitle with 1 second and the last with 2 seconds, it will distribute the delays in between in a linear fashion.

Beware that subshift overwrites the origin file by default, you can create a backup or separate output file:

```bash
subshift file.srt 3000 -o file-sync.srt
subshift file.srt 3000 -b # Creates file.srt.bak with the original file
```

Display help:

```bash
subshift --help
```

## Feature wishlist ⭐️

- Provide reference points for linear shifts.
- Ability to provide seconds instead of milliseconds
