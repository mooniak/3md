# 3md Playground

Interactive web playground for testing and demonstrating 3md (Trilingual Markdown).

## Features

- **Live editing**: Type 3md content and see real-time output
- **Three language previews**: Sinhala, Tamil, and English side-by-side
- **Preview/Markdown toggle**: View rendered HTML or raw markdown for each language
- **Example loader**: Load examples from `spec/examples/` directory
- **Compact black & white design**: Clean, minimal interface

## Quick Start

Just open [index.html](index.html) in a modern browser. No build required for basic usage.

## Build Script

The build script injects example files from `spec/examples/` into the playground HTML.

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

This will:
1. Read all `.3md` files from `../spec/examples/`
2. Inject them as a JavaScript constant into `index.html`
3. Update the examples dropdown

### Watch Mode

```bash
npm run watch
```

Automatically rebuilds when:
- Parser source files change (`../parser/src`)
- Example files change (`../spec/examples`)

## How It Works

The playground is a single HTML file that:

1. **Imports dependencies from CDN** (esm.sh)
   - unified, remark-parse, remark-stringify
   - remark-rehype, rehype-stringify
   - unist-util-visit

2. **Embeds the 3md parser inline**
   - `preprocessText()` - handles block separators (෴)
   - `remark3md()` - remark plugin for inline separators (~)

3. **Loads examples** - injected by build script from spec/examples/

4. **Processes in real-time**
   - Parses 3md on each keystroke (300ms debounce)
   - Generates both HTML (preview) and markdown (for download)
   - Updates all three language outputs in parallel

## File Structure

```
playground/
├── index.html          # Main playground (standalone)
├── build.js            # Build script to inject examples
├── package.json        # Build dependencies
└── README.md           # This file
```

## Development

### Updating the Parser

When you update the parser code in `../parser/src/`, you'll need to manually sync changes to the playground's inline implementation:

1. Update `preprocessText()` function in index.html
2. Update `remark3md()` plugin in index.html

Or better yet, run the build script to pull in fresh examples:

```bash
npm run build
```

### Adding Examples

Add new `.3md` files to `../spec/examples/`, then run:

```bash
npm run build
```

The dropdown will automatically include the new examples.

## Browser Compatibility

Requires a modern browser with ES6 module support:
- Chrome/Edge 61+
- Firefox 60+
- Safari 11+

## License

MIT
