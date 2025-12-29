# 3md Parser - Reference Implementation

A TypeScript/JavaScript parser for [3md (Trilingual Markdown)](../spec/SPEC.md) files.

This is the **reference implementation** of the 3md specification, demonstrating how to correctly parse and split 3md documents into separate language files.

## Features

- ✅ Parse 3md documents with inline separators (~)
- ✅ Parse 3md documents with block separators (෴)
- ✅ Split into separate Sinhala, Tamil, and English markdown files
- ✅ Preserve markdown formatting (headings, lists, paragraphs, etc.)
- ✅ Handle multi-line content with hard line breaks
- ✅ CLI tool for batch processing
- ✅ Full TypeScript types
- ✅ Remark plugin for markdown processing

## Installation

```bash
npm install 3md-parser
```

Or for development:

```bash
git clone https://github.com/mooniak/3md.git
cd 3md/parser
npm install
npm run build
```

## Usage

### As a Library

```typescript
import { splitToLanguageFiles } from '3md-parser';

const content = `{{langs|si|ta|en}}

# හැඳින්වීම~அறிமுகம~Introduction

මෙය සරල පරිච්ඡේදයකි.~இது எளிய பத்தி.~This is a simple paragraph.`;

const result = await splitToLanguageFiles(content);

console.log(result.si); // Sinhala markdown
console.log(result.ta); // Tamil markdown
console.log(result.en); // English markdown
```

### As a CLI Tool

Split a 3md file into three language files:

```bash
3md-split document.3md
```

This creates:
- `document.si.md` - Sinhala
- `document.ta.md` - Tamil
- `document.en.md` - English

Specify a custom output basename:

```bash
3md-split document.3md my-output
```

Creates `my-output.si.md`, `my-output.ta.md`, `my-output.en.md`

### As a Remark Plugin

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { remark3md, preprocessText } from '3md-parser';

const content = `{{langs|si|ta|en}}
# හැඳින්වීම~அறிமுகம~Introduction`;

// Preprocess to handle block separators
const preprocessed = preprocessText(content, 'si');

// Process with remark
const processor = unified()
  .use(remarkParse)
  .use(remark3md, { locale: 'si' })
  .use(remarkStringify);

const file = await processor.process(preprocessed);
console.log(String(file)); // Sinhala markdown output
```

## API Reference

### `splitToLanguageFiles(content: string)`

Splits a 3md document into three separate language strings.

**Parameters:**
- `content` (string) - The 3md document content

**Returns:**
```typescript
{
  si: string,  // Sinhala markdown
  ta: string,  // Tamil markdown
  en: string   // English markdown
}
```

### `splitToFiles(content: string, baseName: string)`

Splits a 3md document and returns file objects ready to write.

**Parameters:**
- `content` (string) - The 3md document content
- `baseName` (string) - Base name for output files

**Returns:**
```typescript
{
  files: [
    { filename: string, content: string },
    { filename: string, content: string },
    { filename: string, content: string }
  ]
}
```

### `preprocessText(text: string, locale?: Locale)`

Preprocesses 3md text to handle block separators before markdown parsing.

**Parameters:**
- `text` (string) - The 3md document content
- `locale` (optional) - Target locale ('si', 'ta', 'en', or combined like 'si-ta')

**Returns:** Preprocessed text ready for markdown parsing

### `remark3md(options)`

Remark plugin for processing inline separators.

**Options:**
```typescript
{
  locale?: string  // Target locale: 'si', 'ta', 'en', or 'si-ta', etc.
}
```

## Architecture

The parser uses a two-phase processing architecture:

### Phase 1: Preprocessing (Text Manipulation)
Handles block separators (෴) **before** markdown parsing:
- Extracts language declaration
- Splits multi-line blocks by block separator
- Selects content for target language
- Adds hard line breaks (\) to preserve multi-line paragraphs

See: [src/remark/preprocess.ts](src/remark/preprocess.ts)

### Phase 2: AST Processing (Tree Transformation)
Handles inline separators (~) **during** remark processing:
- Parses markdown into AST
- Processes headings with inline separators
- Processes paragraphs with inline separators
- Processes list items with inline separators

See: [src/remark/locale.ts](src/remark/locale.ts)

This two-phase approach correctly handles both separator types while preserving markdown structure.

## Project Structure

```
parser/
├── src/
│   ├── index.ts           # Main exports
│   ├── types.ts           # TypeScript type definitions
│   ├── cli.ts             # CLI tool entry point
│   ├── splitter.ts        # High-level splitting logic
│   └── remark/
│       ├── index.ts       # Remark plugin
│       ├── locale.ts      # Inline separator processing
│       └── preprocess.ts  # Block separator preprocessing
├── test/
│   ├── locale.test.ts     # Tests for inline separators
│   └── splitter.test.ts   # Tests for file splitting
├── lib/                   # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── jest.config.json
```

## Development

### Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `lib/` directory.

### Test

```bash
npm test
```

Runs the test suite with Jest.

### Watch Mode

```bash
npm run build:watch
```

Continuously rebuilds on file changes during development.

## Testing

The parser includes comprehensive tests covering:

- Inline separators in headings
- Inline separators in paragraphs
- Inline separators in list items
- Block separators with multi-line content
- Mixed inline and block separators
- Language declaration parsing
- Edge cases and error conditions

All tests pass against the canonical examples in [../spec/examples/](../spec/examples/).

## Conformance

This implementation conforms to the [3md specification v0.1.0](../spec/SPEC.md) and:

- ✅ Correctly parses language declarations
- ✅ Handles inline separators (~)
- ✅ Handles block separators (෴)
- ✅ Preserves markdown formatting
- ✅ Passes all canonical examples
- ✅ Follows error handling spec

## Dependencies

- **unified** - Markdown processing framework
- **remark-parse** - Markdown parser
- **remark-stringify** - Markdown generator
- **unist-util-visit** - AST traversal utility

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type { Lang, Locale, TrimdDocument } from '3md-parser';

const lang: Lang = 'si';
const locale: Locale = 'si-ta';
```

## License

MIT License - See LICENSE file for details

## Contributing

This is a reference implementation. If you find bugs or have suggestions:

1. Check the [specification](../spec/SPEC.md) to confirm expected behavior
2. Open an issue describing the problem
3. Submit a pull request with tests

## Related

- [3md Specification](../spec/README.md) - Format specification
- [Examples](../spec/examples/) - Canonical test documents
- [Root README](../README.md) - Project overview and use cases

---

**A reference implementation for parsing trilingual Sri Lankan content.**
