# 3md Implementation Guide

**For Developers and Tool Builders**

This document provides technical guidance for implementing 3md parsers, validators, and conversion tools.

---

## Table of Contents

1. [Parser Architecture](#parser-architecture)
2. [Error Handling and Validation](#error-handling-and-validation)
3. [Output Formats](#output-formats)
4. [Parser Implementation Tips](#parser-implementation-tips)
5. [Testing Requirements](#testing-requirements)

---

## Parser Architecture

### Recommended Parsing Pipeline

```
3md source
    ↓
1. Extract YAML frontmatter (optional)
    ↓
2. Parse {{langs|si|ta|en}} header
    ↓
3. Split on blank lines (\n\n) → Blocks
    ↓
4. For each block:
   - Check for ෴ separator (block-level)
   - Check for ~ separator (inline)
   - If present: Multi Block (split by separator)
   - If absent: Mono Block
    ↓
5. Parse Markdown within each language variant
    ↓
6. Resolve entity references from frontmatter
    ↓
7. Generate output (HTML/JSON/per-language MD)
```

### Parser State Machine

```
STATE: INITIAL
  ↓
  Read frontmatter (if present: ---...---)
  ↓
STATE: EXPECT_LANG_HEADER
  ↓
  Parse {{langs|si|ta|en}}
  Store language order
  ↓
STATE: PARSE_BLOCKS
  ↓
  For each block:
    - Detect separator type (෴ or ~)
    - Split into variants
    - Validate variant count matches language count
    - Parse Markdown in each variant
  ↓
STATE: COMPLETE
```

### Core Data Structures

**Document AST:**
```typescript
interface Document {
  frontmatter?: Frontmatter;
  languages: LanguageCode[];
  blocks: Block[];
}

interface Block {
  type: 'multi' | 'mono';
  content: MultiContent | MonoContent;
}

interface MultiContent {
  variants: Map<LanguageCode, string>;
  separator: 'block' | 'inline';
  element: 'paragraph' | 'heading' | 'list' | 'blockquote' | 'table';
}

interface MonoContent {
  text: string;
  element: 'code' | 'paragraph';
}
```

---

## Error Handling and Validation

For detailed error specifications, see [ERRORS.md](ERRORS.md).

### Key Validation Requirements

**Document-Level:**
- Language declaration must be present and valid
- ISO 639-1 language codes must be correct (`si`, `ta`, `en`)
- Language order must be consistent throughout document

**Block-Level:**
- Variant count must match declared language count
- Separators must not be mixed within same block (can't use both `෴` and `~` in one block)
- Entity references must be properly closed

**Content-Level:**
- Escape sequences must be valid
- Code blocks must be properly delimited
- Table structures must be valid Markdown

### Error Philosophy

3md parsers adopt a **fail-fast** approach with clear, actionable error messages:

```
ERROR at line 42:

සිංහල~தமிழ்

Found 2 variants but expected 3 (si, ta, en).

Possible fixes:
1. Add missing variant:
   සිංහල~தமிழ்~English

2. Use explicit empty marker:
   සිංහල~தமිழ்~{{empty}}
```

### Validation Levels

**Level 1: Critical Errors (Parsing Fails)**
- Missing language declaration
- Invalid language codes
- Mismatched variant counts
- Malformed frontmatter YAML

**Level 2: Warnings (Parsing Succeeds, May Need Review)**
- Single-language content without separators (potential mono block ambiguity)
- Entity references to undefined entities
- Inconsistent table structures across variants
- Very long lines (>120 characters)

**Level 3: Style Suggestions (Informational)**
- Mixed separator usage (using inline for some headings, block for others)
- Inconsistent indentation
- Missing translation status in frontmatter

---

## Output Formats

### Per-Language Markdown

Extract single-language Markdown files:

```
3md source → parser → si.md, ta.md, en.md
```

**Example output (si.md):**
```markdown
# හැඳින්වීම

මෙය සරල ලේඛනයකි.

## මූලධර්ම

1. පළමු මූලධර්මය
2. දෙවන මූලධර්මය
```

### JSON AST

Structured representation for programmatic access:

```json
{
  "version": "0.1.0",
  "frontmatter": {
    "status": {
      "si": "synced",
      "ta": "fuzzy",
      "en": "source"
    }
  },
  "languages": ["si", "ta", "en"],
  "blocks": [
    {
      "type": "multi",
      "separator": "inline",
      "element": "heading",
      "level": 1,
      "variants": {
        "si": "හැඳින්වීම",
        "ta": "அறிமுகம்",
        "en": "Introduction"
      }
    },
    {
      "type": "multi",
      "separator": "block",
      "element": "paragraph",
      "variants": {
        "si": "මෙය සරල ලේඛනයකි.",
        "ta": "இது ஒரு எளிய ஆவணம்.",
        "en": "This is a simple document."
      }
    }
  ]
}
```

### HTML with Language Attributes

Generate multilingual HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Multilingual Document</title>
</head>
<body>
  <article lang="si">
    <h1>හැඳින්වීම</h1>
    <p>මෙය සරල ලේඛනයකි.</p>
  </article>

  <article lang="ta">
    <h1>அறிமுகம்</h1>
    <p>இது ஒரு எளிய ஆவணம்.</p>
  </article>

  <article lang="en">
    <h1>Introduction</h1>
    <p>This is a simple document.</p>
  </article>
</body>
</html>
```

### Parallel HTML View

Side-by-side rendering for editing/review:

```html
<div class="parallel-view">
  <div class="lang-column" lang="si">
    <h1>හැඳින්වීම</h1>
    <p>මෙය සරල ලේඛනයකි.</p>
  </div>

  <div class="lang-column" lang="ta">
    <h1>அறிமுகம்</h1>
    <p>இது ஒரு எளிய ஆவணம்.</p>
  </div>

  <div class="lang-column" lang="en">
    <h1>Introduction</h1>
    <p>This is a simple document.</p>
  </div>
</div>
```

### Word/DOCX Export

Generate Microsoft Word documents:

**Option 1: Single multilingual document**
- Three columns, one per language
- Synchronized scrolling
- Style mappings for headings, emphasis, etc.

**Option 2: Three separate documents**
- One .docx per language
- Maintain cross-references via bookmarks

**Implementation approaches:**
- Use `pandoc` with custom templates
- Generate via `docx` library in Python/JavaScript
- Use Office Open XML directly

### InDesign Export

**ICML (InCopy Markup Language):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Document>
  <Story StoryTitle="si-content">
    <ParagraphStyleRange AppliedParagraphStyle="Heading1">
      <Content>හැඳින්වීම</Content>
    </ParagraphStyleRange>
  </Story>
</Document>
```

**IDML (InDesign Markup Language):**
- Full InDesign document structure
- Includes styles, text frames, pages
- More complex but provides complete layout control

**Best practice:**
- Export each language variant as separate story
- Include style mappings in export
- Provide templates for designers

---

## Parser Implementation Tips

### 1. Separator Detection

**Robust separator detection:**

```python
def detect_separator(block_text: str) -> str:
    """
    Detect which separator is used in a block.
    Returns 'block', 'inline', or 'none'.
    """
    # Check for block separator (with surrounding newlines)
    if '\n෴\n' in block_text:
        return 'block'

    # Check for inline separator (not in code blocks)
    if '~' in block_text and not is_in_code(block_text, '~'):
        return 'inline'

    return 'none'

def is_in_code(text: str, char: str) -> bool:
    """
    Check if character appears only within code blocks.
    """
    # Remove code blocks, check if char still exists
    text_no_code = remove_code_blocks(text)
    return char not in text_no_code
```

**Never mix separators:**
```python
if '\n෴\n' in block and '~' in block:
    raise SeparatorMixError(
        "Cannot use both block (෴) and inline (~) separators in same block"
    )
```

### 2. Escape Sequence Handling

**Process escapes before splitting:**

```python
def split_variants(text: str, separator: str) -> list[str]:
    """
    Split text on separator, respecting escape sequences.
    """
    # Replace escaped separators with placeholder
    text = text.replace('\\~', '\x00TILDE\x00')
    text = text.replace('\\෴', '\x00KUNDALIYA\x00')
    text = text.replace('\\\\', '\x00BACKSLASH\x00')

    # Split on separator
    variants = text.split(separator)

    # Restore escaped characters
    variants = [
        v.replace('\x00TILDE\x00', '~')
         .replace('\x00KUNDALIYA\x00', '෴')
         .replace('\x00BACKSLASH\x00', '\\')
        for v in variants
    ]

    return variants
```

### 3. Code Block Protection

**Protect code blocks from parsing:**

```python
import re

def protect_code_blocks(text: str) -> tuple[str, dict]:
    """
    Replace code blocks with placeholders, return mapping.
    """
    code_blocks = {}
    counter = 0

    # Fenced code blocks
    def replace_fenced(match):
        nonlocal counter
        placeholder = f'\x00CODE_{counter}\x00'
        code_blocks[placeholder] = match.group(0)
        counter += 1
        return placeholder

    text = re.sub(r'```.*?```', replace_fenced, text, flags=re.DOTALL)

    # Inline code
    def replace_inline(match):
        nonlocal counter
        placeholder = f'\x00CODE_{counter}\x00'
        code_blocks[placeholder] = match.group(0)
        counter += 1
        return placeholder

    text = re.sub(r'`[^`]+`', replace_inline, text)

    return text, code_blocks

def restore_code_blocks(text: str, code_blocks: dict) -> str:
    """
    Restore code blocks from placeholders.
    """
    for placeholder, code in code_blocks.items():
        text = text.replace(placeholder, code)
    return text
```

### 4. Entity Resolution

**Build entity map from frontmatter:**

```python
class EntityResolver:
    def __init__(self, frontmatter: dict):
        self.entities = frontmatter.get('entities', {})

    def resolve(self, entity_id: str, lang: str) -> str:
        """
        Resolve entity reference to display text.
        """
        if entity_id not in self.entities:
            raise UndefinedEntityError(f"Entity '{entity_id}' not defined")

        entity = self.entities[entity_id]

        # Return language-specific variant or primary
        return entity.get(lang, entity.get('primary', entity_id))

    def replace_references(self, text: str, lang: str) -> str:
        """
        Replace all [[entity-id|display]] references in text.
        """
        def replace(match):
            entity_id = match.group(1)
            display = match.group(2) if match.group(2) else None

            # If display specified, use it; otherwise resolve
            if display:
                return display
            else:
                return self.resolve(entity_id, lang)

        # Pattern: [[entity-id|display]] or [[entity-id]]
        pattern = r'\[\[([^|\]]+)(?:\|([^\]]+))?\]\]'
        return re.sub(pattern, replace, text)
```

### 5. HTML and Media Block Handling

**HTML blocks for embeds and media**

HTML content in fenced code blocks (videos, audio, iframes) must be:
1. Detected as fenced code blocks during parsing
2. Protected from separator processing (same as code protection)
3. Rendered as HTML, NOT wrapped in `<pre><code>` tags

**Implementation:**

```python
import re

def detect_html_blocks(text: str) -> tuple[str, dict]:
    """
    Detect and extract HTML blocks from fenced code blocks.
    Returns text with placeholders and mapping of placeholders to HTML.
    """
    html_blocks = {}
    counter = 0

    # Pattern for fenced code blocks (with optional 'html' language hint)
    # Matches: ```\n<html>...</html>\n``` or ```html\n<html>...</html>\n```
    pattern = r'```(?:html)?\n((?:<[^>]+>[\s\S]*?</[^>]+>)|(?:<[^>]+\s*/>))\n```'

    def replace_html(match):
        nonlocal counter
        html_content = match.group(1).strip()

        # Check if content is HTML (starts with < and contains >)
        if is_html(html_content):
            placeholder = f'\x00HTML_{counter}\x00'
            html_blocks[placeholder] = html_content
            counter += 1
            return placeholder
        else:
            # Not HTML, keep as regular code block
            return match.group(0)

    text = re.sub(pattern, replace_html, text, flags=re.MULTILINE)
    return text, html_blocks

def is_html(content: str) -> bool:
    """
    Check if content appears to be HTML.
    Simple heuristic: starts with < and contains HTML-like tags.
    """
    content = content.strip()
    if not content.startswith('<'):
        return False

    # Check for common HTML patterns
    html_patterns = [
        r'<iframe[\s>]',
        r'<video[\s>]',
        r'<audio[\s>]',
        r'<svg[\s>]',
        r'<embed[\s>]',
        r'<img[\s>]',
        r'<div[\s>]',
        r'<span[\s>]',
    ]

    return any(re.search(pattern, content, re.IGNORECASE) for pattern in html_patterns)

def restore_html_blocks(text: str, html_blocks: dict) -> str:
    """
    Restore HTML blocks from placeholders without <pre><code> wrapping.
    """
    for placeholder, html in html_blocks.items():
        text = text.replace(placeholder, html)
    return text
```

**Usage in parser pipeline:**

```python
def parse_3md_document(text: str) -> dict:
    """
    Complete parsing pipeline with HTML block handling.
    """
    # 1. Extract frontmatter
    frontmatter, text = parse_frontmatter(text)

    # 2. Parse language declaration
    langs, text = parse_language_declaration(text)

    # 3. Protect code blocks (including HTML in code blocks)
    text, code_blocks = protect_code_blocks(text)

    # 4. Detect and extract HTML blocks (from protected code blocks)
    text, html_blocks = detect_html_blocks(text)

    # 5. Split on blank lines into blocks
    blocks = text.split('\n\n')

    # 6. Parse each block (detect separators, create Multi/Mono blocks)
    parsed_blocks = []
    for block in blocks:
        parsed_block = parse_block(block, langs)
        parsed_blocks.append(parsed_block)

    # 7. Restore code blocks
    text = restore_code_blocks(text, code_blocks)

    # 8. Restore HTML blocks (as raw HTML, not code)
    text = restore_html_blocks(text, html_blocks)

    return {
        'frontmatter': frontmatter,
        'languages': langs,
        'blocks': parsed_blocks,
        'html_blocks': html_blocks
    }
```

**Rendering HTML blocks:**

When generating output (HTML, Markdown), HTML blocks should be:
- **HTML output**: Rendered directly as HTML (no escaping, no `<pre><code>` wrapper)
- **Markdown output**: Kept in fenced code blocks
- **JSON AST**: Marked with `type: 'html_embed'` for processors

**Example output:**

```python
# Input 3md
text = '''
{{langs|si|ta|en}}

Watch this:~මෙය බලන්න:~இதைப் பார்க்கவும்:

```
<iframe src="https://youtube.com/embed/VIDEO"></iframe>
```
'''

# HTML output for English variant
html_output = '''
<p>Watch this:</p>
<iframe src="https://youtube.com/embed/VIDEO"></iframe>
'''

# Note: No <pre><code> wrapping, direct HTML rendering
```

**Image handling (no fencing required):**

Images use standard Markdown syntax and do NOT require fencing:

```python
def parse_image(text: str, langs: list) -> dict:
    """
    Parse image with multilingual alt text.
    Syntax: ![alt1~alt2~alt3](image.png)
    """
    pattern = r'!\[([^\]]+)\]\(([^\)]+)\)'

    match = re.search(pattern, text)
    if not match:
        return None

    alt_text = match.group(1)
    image_path = match.group(2)

    # Split alt text by separator if present
    if '~' in alt_text:
        alt_variants = alt_text.split('~')
        if len(alt_variants) != len(langs):
            raise VariantCountMismatch(
                f"Expected {len(langs)} alt variants, got {len(alt_variants)}"
            )
    else:
        # Single alt text for all languages
        alt_variants = [alt_text] * len(langs)

    return {
        'type': 'image',
        'alt_variants': dict(zip(langs, alt_variants)),
        'src': image_path,
        'is_mono': True  # Image source is always language-invariant
    }
```

### 6. Frontmatter Parsing

**Use existing YAML parsers:**

```python
import yaml

def parse_frontmatter(text: str) -> tuple[dict, str]:
    """
    Extract YAML frontmatter from document.
    Returns (frontmatter_dict, remaining_text).
    """
    if not text.startswith('---\n'):
        return {}, text

    # Find closing ---
    end_match = re.search(r'\n---\n', text[4:])
    if not end_match:
        raise FrontmatterError("Unclosed frontmatter block")

    end_pos = end_match.end() + 4

    # Extract and parse YAML
    yaml_text = text[4:end_pos-4]
    try:
        frontmatter = yaml.safe_load(yaml_text)
    except yaml.YAMLError as e:
        raise FrontmatterError(f"Invalid YAML: {e}")

    remaining = text[end_pos:]
    return frontmatter, remaining
```

---

## Testing Requirements

### Test Categories

**1. Valid Documents**
- Minimal valid document
- All block types (paragraphs, headings, lists, tables, blockquotes)
- Both separator types (inline and block)
- With and without frontmatter
- All language orders (si-ta-en, en-si-ta, ta-en-si)

**2. Invalid Documents**
- Missing language declaration
- Invalid language codes
- Mismatched variant counts
- Mixed separators in same block
- Malformed frontmatter
- Unclosed entity references

**3. Edge Cases**
- Empty blocks
- Escaped separators
- Separators in code blocks
- Very long lines
- Nested lists
- Complex tables
- Unicode edge cases (ZWJ, ZWNJ in Sinhala/Tamil)

**4. Round-Trip Tests**
```
3md → parse → AST → generate → 3md
```
Ensure generated 3md is semantically equivalent to input.

### Reference Test Suite

A comprehensive test suite is maintained at:
```
tests/
  ├── valid/
  │   ├── minimal.3md
  │   ├── complete.3md
  │   ├── all-features.3md
  ├── invalid/
  │   ├── missing-lang-header.3md
  │   ├── mismatched-variants.3md
  │   ├── mixed-separators.3md
  ├── edge-cases/
  │   ├── escaped-separators.3md
  │   ├── code-with-separators.3md
  │   ├── complex-tables.3md
  └── expected-output/
      ├── minimal.json
      ├── complete.html
      └── all-features-si.md
```

---

## Performance Considerations

### Streaming Parsing

For large documents (>10MB), implement streaming:

```python
class StreamingParser:
    def parse_blocks(self, file_path: str):
        """
        Yield blocks one at a time without loading entire file.
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            frontmatter, langs = self.parse_header(f)

            current_block = []
            for line in f:
                if line.strip() == '':
                    if current_block:
                        yield self.parse_block(current_block, langs)
                        current_block = []
                else:
                    current_block.append(line)

            # Don't forget last block
            if current_block:
                yield self.parse_block(current_block, langs)
```

### Caching

Cache parsed ASTs for frequently accessed documents:

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def parse_cached(file_path: str, mtime: float) -> Document:
    """
    Cache parsed documents, keyed by path and modification time.
    """
    return parse_file(file_path)

# Usage
mtime = os.path.getmtime(file_path)
doc = parse_cached(file_path, mtime)
```

---

## Reference Implementations

### Official Implementations

- **Python**: `3md-py` - Reference implementation
- **JavaScript**: `3md-js` - For web-based tools
- **Rust**: `3md-rs` - High-performance parser

### Integration Libraries

- **Pandoc filter**: Convert 3md via Pandoc
- **VS Code extension**: Syntax highlighting and preview
- **InDesign plugin**: Import 3md directly

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to 3md parser implementations.

---

**Document Version:** 0.1.0
**Last Updated:** 2025-12-29
