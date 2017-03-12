# subshift

Shifts SRT subtitle files by ms.

## Usage

Make sure you have Node.js 6+ installed.

```bash
npm install -g subshift
```

```bash
subshift --help # Display help
```

```bash
subshift file.srt 3000 # Delays the subtitles with 3000ms
subshift file.srt -200 # Brings the subtitles 200ms forward
subshift file.srt 1000 2000 # Does a linear shift, relative to the first and last subtitle

```

Beware that subshift overwrites the origin file by default, you can create a backup or separate output file:

```bash
subshift file.srt 3000 -o file-sync.srt  # Specify output file
subshift file.srt 3000 -b  # Backup original to file.srt.bak
```

## Feature wishlist ⭐️

- Provide reference points for linear shifts.
- Ability to provide seconds instead of milliseconds
