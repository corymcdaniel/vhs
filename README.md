# VHS Project

A terminal recording project using [VHS](https://github.com/charmbracelet/vhs) to create automated terminal demos and tutorials.

## Overview

VHS (Video Home System) is a tool for creating terminal recordings programmatically. This project provides a structured approach to creating and managing terminal recordings using "tape" files.

## Prerequisites

- [VHS](https://github.com/charmbracelet/vhs) installed on your system
- Node.js 14+ (for running npm scripts)

## Installation

1. Install VHS:
   ```bash
   # On macOS
   brew install vhs
   
   # On other systems, see: https://github.com/charmbracelet/vhs#installation
   ```

2. Clone this repository:
   ```bash
   git clone <repository-url>
   cd vhs
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Creating a demo recording

Run the included demo tape:
```bash
npm run demo
```

This will generate a `demo.gif` file showing a sample terminal session.

### Creating your own recordings

1. Create a new `.tape` file with your recording script
2. Run VHS on your tape file:
   ```bash
   vhs your-recording.tape
   ```

### Tape file format

VHS tape files use a simple command-based format:

```
Output demo.gif

Set Shell "bash"
Set FontSize 14
Set Width 1200
Set Height 600

Type "echo 'Hello World!'" Enter
Sleep 2s
```

See the [VHS documentation](https://github.com/charmbracelet/vhs) for complete syntax reference.

## Git Integration

This project is configured to work seamlessly with Git:

- Generated video files (`.gif`, `.mp4`, etc.) are ignored via `.gitignore`
- Only source `.tape` files and configuration are tracked
- Clean command available to remove generated files: `npm run clean`

## Project Structure

```
.
├── README.md          # This file
├── package.json       # Node.js project configuration
├── .gitignore        # Git ignore patterns
├── demo.tape         # Example recording script
└── *.gif             # Generated recordings (ignored by git)
```

## Contributing

1. Create your tape files
2. Test recordings locally
3. Commit only source files (not generated videos)
4. Share your tape files for others to generate their own recordings