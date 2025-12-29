# 3md Specification

**Version:** 0.1.0  
**Date:** 2025-12-29  
**Status:** Proposal  
**Authors:** Pathum Egodawatta

---

## 1. Introduction

### 1.1 What is 3md?

3md (Trilingual Markdown) is a formal extension to [CommonMark](https://spec.commonmark.org/) version 0.31.2, designed for parallel trilingual content authoring in Sinhala (si), Tamil (ta), and English (en).

This specification defines:

1. **Syntax extensions** to CommonMark for multilingual content blocks
2. **Separator semantics** for block-level and inline multilingual binding
3. **Document structure** requirements for trilingual documents
4. **Processing rules** for parsers and renderers

### 1.2 Design Goals and Key Features

3md extends CommonMark with these core principles:

1. **Unambiguous parsing**: Dual-separator design (Kunddaliya ෴ for blocks, Tilde ~ for inline) eliminates parsing ambiguity and Markdown syntax conflicts
2. **CommonMark compatibility**: All valid CommonMark constructs remain valid; 3md only adds new constructs
3. **Human readability**: Plain text editable in any text editor, visually clear separators serve dual purpose (human/machine)
4. **Cultural relevance**: Kunddaliya (෴) connects to South Asian manuscript traditions
5. **Trilingual constraint**: Fixed support for Sinhala (si), Tamil (ta), and English (en)

**Single-source multilingual**: All language variants in one file eliminates version drift. Translators see parallel content while working.

**Parallel authoring**: Content written simultaneously in all languages preserves cultural context. Conceptual equivalence over literal translation. `{{empty}}` marker enables language-specific content.

**Tool-agnostic plain text**: Edit anywhere. Version control with meaningful diffs. Future-proof archival. Export to any format (Word, PDF, InDesign, HTML).

**Note:** Authoring tools MAY provide rich UIs while storing in 3md format. This specification defines storage format, not authoring experience.


### 1.3 Relationship to CommonMark

3md is a **strict extension** of CommonMark. This means:

- All valid CommonMark documents are valid 3md documents (as Mono Blocks)
- 3md adds new constructs but does not modify CommonMark syntax
- CommonMark processing rules apply to content within each language variant
- 3md parsers MUST support all CommonMark features

### 1.4 Terminology

Throughout this specification:

- **MUST**, **MUST NOT**, **REQUIRED**: Absolute requirements (RFC 2119)
- **SHOULD**, **SHOULD NOT**, **RECOMMENDED**: Strong recommendations
- **MAY**, **OPTIONAL**: Truly optional features
- **3md document**: A document conforming to this specification
- **CommonMark document**: A document conforming to CommonMark 0.31.2

---

## 2. Document Structure

### 2.1 Overall Structure

A 3md document consists of three parts, in order:

```
[YAML Frontmatter]     (OPTIONAL)
Language Declaration   (REQUIRED)
Content Blocks         (REQUIRED)
```

### 2.2 YAML Frontmatter

**Status**: OPTIONAL

If present, YAML frontmatter:

- MUST appear at the beginning of the document
- MUST be delimited by `---` on separate lines
- MUST contain valid YAML 1.2
- MUST NOT contain the `---` delimiter within the YAML content

**Syntax:**

```
---
<valid YAML content>
---
```

**Example:**

```yaml
---
status:
  si: synced
  ta: fuzzy
  en: source
---
```

See [§7 YAML Frontmatter Schema](#7-yaml-frontmatter-schema) for detailed schema specification.

### 2.3 Language Declaration

**Status**: REQUIRED

Every 3md document MUST begin with a language declaration (after optional frontmatter).

**Syntax:**

```
{{langs|<lang1>|<lang2>|<lang3>}}
```

**Rules:**

1. MUST appear on its own line
2. MUST be the first non-frontmatter line
3. MUST contain exactly three language codes
4. MUST use valid ISO 639-1 codes: `si`, `ta`, `en`
5. MUST NOT contain whitespace around separators
6. Language order is arbitrary but MUST be consistent throughout document

**Valid examples:**

```
{{langs|si|ta|en}}
{{langs|en|si|ta}}
{{langs|ta|en|si}}
```

**Invalid examples:**

```
{{langs|si|en}}           # Error: only 2 languages
{{langs|si|ta|en|fr}}     # Error: 4 languages
{{langs|si | ta | en}}    # Error: whitespace around separators
{{langs|sin|tam|eng}}     # Error: invalid ISO 639-1 codes
{{ langs|si|ta|en }}      # Error: whitespace inside braces
```

**Processing:**

1. Parser MUST extract language codes in declaration order
2. Parser MUST store this order as **persistent document state**
3. All Multi Blocks MUST use this exact order
4. Parser MUST reject documents with invalid language declarations

---

## 3. Block Structure

### 3.1 Block Types

3md defines two fundamental block types:

1. **Multi Block**: Contains parallel content in all three declared languages
2. **Mono Block**: Contains language-invariant content (standard CommonMark)

**Block detection algorithm:**

```
For each block:
  IF block contains separator (~ or \n෴\n):
    Block is Multi
  ELSE:
    Block is Mono
```

### 3.2 Multi Blocks

A Multi Block contains **parallel content** in all three languages.

**Requirements:**

1. MUST contain exactly three language variants
2. Variants MUST appear in declaration order
3. Variants MUST be separated by valid separators
4. Each variant is processed as CommonMark

**Two separator types:**

1. **Block separator**: `\n෴\n` (newline, Kunddaliya U+0DF4, newline)
2. **Inline separator**: `~` (tilde, U+007E)

**Separator selection rules:**

- Use block separator (`\n෴\n`) for multi-line content
- Use inline separator (`~`) for single-line content
- MUST NOT mix separators within the same block

### 3.3 Mono Blocks

A Mono Block contains **language-invariant content**.

**Characteristics:**

1. Contains NO separators (`~` or `\n෴\n`)
2. Processed as standard CommonMark
3. Rendered identically in all language outputs

**Common use cases:**

- Fenced code blocks
- Mathematical notation
- Numerical data
- Universal symbols

---

## 4. Separator Semantics

### 4.1 The Kunddaliya (෴) - Block Separator

**Unicode**: U+0DF4 (SINHALA PUNCTUATION KUNDDALIYA)

**Syntax**: The block separator is the three-character sequence `\n෴\n` (LF + U+0DF4 + LF).

**Usage rules:**

1. MUST be surrounded by line breaks (LF or CRLF)
2. Binds multi-line content blocks
3. Creates visual block-level separation

**Valid in:**

- Multi-line paragraphs
- Lists (when using block-level list syntax)
- Blockquotes
- Tables (when table structure differs by language)

**Processing:**

```
content1\n෴\ncontent2\n෴\ncontent3
```

Parser splits on `\n෴\n` to extract three variants.

### 4.2 The Tilde (~) - Inline Separator

**Unicode**: U+007E (TILDE)

**Syntax**: Single tilde character `~` on the same line as content.

**Usage rules:**

1. MUST appear on a single line with all variants
2. Separates compact parallel text
3. MUST NOT appear within code spans (`` ` ``)

**Valid in:**

- Headings
- Single-line paragraphs
- Simple list items
- Table cells (when table structure is identical)
- Link text
- Image alt text

**Processing:**

```
content1~content2~content3
```

Parser splits on `~` to extract three variants, respecting escape sequences and code spans.

### 4.3 Separator Selection Algorithm

```python
def select_separator(content_variants: list[str]) -> str:
    """
    Determine which separator to use for a Multi Block.
    """
    # Check if any variant contains newlines
    for variant in content_variants:
        if '\n' in variant:
            return 'block'  # Use \n෴\n

    # Check if any variant exceeds recommended length
    for variant in content_variants:
        if len(variant) > 80:
            return 'block'  # Use \n෴\n

    # Check if content contains internal formatting
    # (this is a heuristic; exact rules depend on element type)
    if has_complex_formatting(content_variants):
        return 'block'  # Use \n෴\n

    # Default to inline for simple, short content
    return 'inline'  # Use ~
```

### 4.4 Mixing Separators

Within a single Multi Block:

- MUST use consistent separator type
- MUST NOT mix `~` and `\n෴\n`

**Invalid example:**

```
Content 1~Content 2
෴
Content 3
```

This mixes inline (`~`) and block (`\n෴\n`) separators in the same block.

---

## 5. Syntax Elements

### 5.1 Paragraphs

#### 5.1.1 Multi Block Paragraphs (Inline)

**Syntax:**

```
variant1~variant2~variant3
```

**Rules:**

1. All three variants on single line
2. Separated by tilde (`~`)
3. Each variant processed as CommonMark inline content
4. Blank line before and after (standard CommonMark paragraph rules)

**Example:**

```
{{langs|si|ta|en}}

කෙටි වාක්‍යය.~குறுகிய வாக்கியம்.~Short sentence.
```

#### 5.1.2 Multi Block Paragraphs (Block)

**Syntax:**

```
variant1
෴
variant2
෴
variant3
```

**Rules:**

1. Each variant can span multiple lines
2. Separated by `\n෴\n`
3. Each variant processed as CommonMark paragraph content
4. Blank line before first variant and after last variant

**Example:**

```
{{langs|si|ta|en}}

මෙය දිගු ඡේදයකි.
මෙහි රේඛා කිහිපයක් ඇත.
෴
இது நீண்ட பத்தி.
இதில் பல வரிகள் உள்ளன.
෴
This is a longer paragraph.
It has multiple lines.
```

#### 5.1.3 Mono Block Paragraphs

Standard CommonMark paragraphs without separators.

**Example:**

```
{{langs|si|ta|en}}

This is language-invariant content.
```

### 5.2 Headings

#### 5.2.1 ATX Headings (Multi Block, Inline)

**Status**: RECOMMENDED

**Syntax:**

```
# variant1~variant2~variant3
## variant1~variant2~variant3
### variant1~variant2~variant3
```

**Rules:**

1. All three variants on same line as heading marker
2. Separated by tilde (`~`)
3. Follows CommonMark ATX heading rules
4. Supports heading levels 1-6

**Example:**

```
{{langs|si|ta|en}}

# හැඳින්වීම~அறிமுகம்~Introduction
## උප මාතෘකාව~துணைத் தலைப்பு~Subheading
```

#### 5.2.2 ATX Headings (Multi Block, Block)

**Status**: OPTIONAL (for long headings)

**Syntax:**

```
# variant1
෴
# variant2
෴
# variant3
```

**Rules:**

1. Each variant on separate line with heading marker
2. Separated by `\n෴\n`
3. Used when any variant exceeds 80 characters

**Example:**

```
{{langs|si|ta|en}}

# ශ්‍රී ලංකාවේ පුරාණ ඉතිහාසය සහ සංස්කෘතික උරුමයන් පිළිබඳ සවිස්තරාත්මක අධ්‍යයනය
෴
# இலங்கையின் பண்டைய வரலாறு மற்றும் கலாச்சார பாரம்பரியம் பற்றிய விரிவான ஆய்வு
෴
# A Comprehensive Study of Ancient History and Cultural Heritage of Sri Lanka
```

#### 5.2.3 Setext Headings

**Status**: NOT RECOMMENDED

Setext headings (underlined with `=` or `-`) are valid CommonMark but NOT RECOMMENDED in 3md due to ambiguity with separators.

If used, they MUST be Mono Blocks:

```
{{langs|si|ta|en}}

Introduction
============
```

### 5.3 Lists

#### 5.3.1 Lists (Inline Syntax)

**Syntax:**

```
- item1~item1~item1
- item2~item2~item2
```

or

```
1. item1~item1~item1
2. item2~item2~item2
```

**Rules:**

1. Each list item contains three variants on same line
2. Variants separated by tilde (`~`)
3. List markers follow CommonMark rules
4. Each variant processed as CommonMark list item content

**Example:**

```
{{langs|si|ta|en}}

- පළමු අයිතමය~முதல் உருப்படி~First item
- දෙවන අයිතමය~இரண்டாவது உருப்படி~Second item
- තුන්වන අයිතමය~மூன்றாவது உருப்படி~Third item
```

#### 5.3.2 Lists (Block Syntax)

**Syntax:**

```
- item1
- item2
- item3
෴
- item1
- item2
- item3
෴
- item1
- item2
- item3
```

**Rules:**

1. Entire list (all items) is one Multi Block
2. Each language variant contains complete list
3. Separated by `\n෴\n`
4. Used when items contain complex formatting

**Example:**

```
{{langs|si|ta|en}}

1. පළමු අයිතමය
2. **තද** සහිත දෙවන අයිතමය
3. තුන්වන අයිතමය
෴
1. முதல் உருப்படி
2. **தடித்த** உடன் இரண்டாவது உருப்படி
3. மூன்றாவது உருப்படி
෴
1. First item
2. Second item with **bold**
3. Third item
```

#### 5.3.3 Nested Lists

**Indentation**: Use 3 spaces for nested items (CommonMark recommendation).

**Inline syntax:**

```
{{langs|si|ta|en}}

1. ප්‍රධාන අයිතමය~முதன்மை உருப்படி~Main item
   - කැදැලි~உள்ளமைப்பு~Nested
2. දෙවන අයිතමය~இரண்டாவது~Second item
```

**Block syntax:**

```
{{langs|si|ta|en}}

1. ප්‍රධාන අයිතමය
   - කැදැලි එක
   - කැදැලි දෙක
2. දෙවන අයිතමය
෴
1. முதன்மை உருப்படி
   - உள்ளமைப்பு ஒன்று
   - உள்ளமைப்பு இரண்டு
2. இரண்டாவது உருப்படி
෴
1. Main item
   - Nested one
   - Nested two
2. Second item
```

### 5.4 Blockquotes

**Status**: Block separator REQUIRED

**Syntax:**

```
> line1
> line2
෴
> line1
> line2
෴
> line1
> line2
```

**Rules:**

1. Entire blockquote is one Multi Block
2. Each variant contains complete blockquote
3. Separated by `\n෴\n`
4. CommonMark blockquote rules apply within each variant

**Example:**

```
{{langs|si|ta|en}}

> මම නිර්මාණය කරන්නේ
> ස්ථානය සඳහාය.
෴
> நான் இடத்திற்காக
> வடிவமைக்கிறேன்.
෴
> I design for
> the place.
```

### 5.5 Code

#### 5.5.1 Inline Code

**Status**: Protected from separator parsing

Inline code spans (`` `code` ``) are **Mono Blocks** and separators within are **literal**.

**Example:**

```
{{langs|si|ta|en}}

Use `url~path~segment` syntax.~`url~path~segment` භාවිතා කරන්න.~`url~path~segment` பயன்படுத்து.
```

In this example:
- The `~` inside backticks is literal (not a separator)
- The `~` outside backticks separates language variants

#### 5.5.2 Fenced Code Blocks

**Status**: Always Mono Blocks

Fenced code blocks are **language-invariant** and MUST NOT contain separators.

**Syntax:**

````
```language
code content
```
````

**Rules:**

1. Code blocks are Mono (no language variants)
2. Separators within code are literal
3. Follows CommonMark fenced code block rules

**Example:**

````
{{langs|si|ta|en}}

Here's a function:~ශ්‍රිතයක්:~ஒரு செயல்பாடு:

```python
def greet(name):
    return f"Hello, {name}!"
```

This returns a greeting.~මෙය සුබ පැතුම් ප්‍රතිදානය කරයි.~இது வாழ்த்து திருப்பி அனுப்புகிறது.
````

#### 5.5.3 Indented Code Blocks

Indented code blocks (4-space indentation) are also Mono Blocks.

**Example:**

```
{{langs|si|ta|en}}

Example:~උදාහරණය:~உதாரணம்:

    function hello() {
        return "Hello!";
    }
```

### 5.6 Tables

#### 5.6.1 Tables (Inline Cell Syntax)

**Status**: RECOMMENDED when structure is identical

**Syntax:**

```
| Header1~Header1~Header1 | Header2~Header2~Header2 |
|-------------------------|-------------------------|
| Cell1~Cell1~Cell1       | Cell2~Cell2~Cell2       |
```

**Rules:**

1. Each cell contains three variants
2. Variants separated by tilde (`~`)
3. Table structure MUST be identical across languages
4. CommonMark table extension rules apply

**Example:**

```
{{langs|si|ta|en}}

| විශේෂාංගය~அம்சம்~Feature | මිල~விலை~Price |
|---------------------------|----------------|
| මූලික~அடிப்படை~Basic      | $10            |
| ප්‍රිමියම්~பிரீமியம்~Premium | $25          |
```

#### 5.6.2 Tables (Block Syntax)

**Status**: REQUIRED when structure differs

**Syntax:**

```
| Header1 | Header2 |
|---------|---------|
| Cell1   | Cell2   |
෴
| Header1 | Header2 |
|---------|---------|
| Cell1   | Cell2   |
෴
| Header1 | Header2 |
|---------|---------|
| Cell1   | Cell2   |
```

**Rules:**

1. Entire table is one Multi Block
2. Each variant contains complete table
3. Table structure MAY differ by language
4. Separated by `\n෴\n`

**Example:**

```
{{langs|si|ta|en}}

| විශේෂාංගය | මිල |
|-----------|-----|
| මූලික     | $10 |
෴
| அம்சம்    | விலை |
|----------|------|
| அடிப்படை  | $10  |
෴
| Feature | Price |
|---------|-------|
| Basic   | $10   |
```

### 5.7 Links and Images

#### 5.7.1 Inline Links (Single URL)

**Syntax:**

```
[text1~text2~text3](url)
```

**Example:**

```
{{langs|si|ta|en}}

[ප්‍රලේඛනය~ஆவணம்~Documentation](https://docs.example.com)
```

#### 5.7.2 Inline Links (Language-Specific URLs)

**Status**: Block separator REQUIRED

**Syntax:**

```
[text1](url1)
෴
[text2](url2)
෴
[text3](url3)
```

**Example:**

```
{{langs|si|ta|en}}

[සිංහල ප්‍රලේඛනය](https://docs.example.com/si)
෴
[தமிழ் ஆவணங்கள்](https://docs.example.com/ta)
෴
[English Documentation](https://docs.example.com/en)
```

#### 5.7.3 Images (Single Source)

**Status**: Standard Markdown syntax with multilingual alt text

Images use standard Markdown image syntax. **Fencing is NOT required** - images are automatically treated as language-invariant (Mono Blocks) with the image path appearing in all outputs.

**Syntax:**

```
![alt1~alt2~alt3](image.png)
```

**Rules:**

1. Image path is language-invariant (same image in all outputs)
2. Alt text SHOULD use separators (`~`) for multilingual accessibility
3. Alt text provides screen reader support in each language
4. NO fenced code blocks needed around images

**When to use:**
- Single image file that appears in all language outputs
- Alt text needs translation for accessibility
- Museum artifacts, diagrams, charts, photos

**Example:**

```
{{langs|si|ta|en}}

![ගෘහ නිර්මාණ රූප සටහන~கட்டிடக்கலை வரைபடம~Architecture diagram](arch.png)
```

**Accessibility note:** Always provide multilingual alt text for screen readers. Each language output will render with the appropriate alt text for that language.

#### 5.7.4 Images (Language-Specific Sources)

**Syntax:**

```
![alt1](image1.png)
෴
![alt2](image2.png)
෴
![alt3](image3.png)
```

#### 5.7.5 Reference-Style Links

**Status**: NOT SUPPORTED

Reference-style links (`[text][ref]` with `[ref]: url`) are **NOT SUPPORTED** in 3md due to syntax conflicts with entity references.

### 5.8 HTML Embeds and Media

**Status**: Mono Blocks (language-invariant)

HTML content for embedded media (videos, audio, iframes, interactive widgets) MUST be placed in fenced code blocks. This content appears identically in all three language outputs.

**Syntax:**

````
```
<html content>
```
````

**Rules:**

1. HTML blocks MUST be wrapped in fenced code blocks (` ``` `)
2. Language hint is OPTIONAL (may be omitted or set to `html`)
3. Content is rendered as HTML, NOT as `<pre><code>` wrapped text
4. Separators (`~` or `෴`) within HTML are literal characters, not processed
5. Same HTML appears in all language outputs (Mono Block behavior)

**Common use cases:**

- **Video embeds**: YouTube, Vimeo, custom video players
- **Audio players**: SoundCloud, custom audio elements
- **Interactive widgets**: Maps, charts, forms
- **Inline SVG graphics**: When embedding SVG code directly

**Example 1: YouTube Embed**

````markdown
{{langs|si|ta|en}}

Watch this documentary:~මෙම වාර්තා චිත්‍රපටය නරඹන්න:~இந்த ஆவணப்படத்தைப் பார்க்கவும்:

```
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="Documentary video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

The video shows...~වීඩියෝව පෙන්වයි...~வீடியோ காட்டுகிறது...
````

**Example 2: Audio Player**

````markdown
{{langs|si|ta|en}}

Listen to this recording:~මෙම පටිගත කිරීම අසන්න:~இந்த பதிவைக் கேளுங்கள்:

```html
<audio controls>
  <source src="audio/interview-2024.mp3" type="audio/mpeg">
  <source src="audio/interview-2024.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>
```

This interview discusses...~මෙම සම්මුඛ සාකච්ඡාව සාකච්ඡා කරයි...~இந்த நேர்காணல் விவாதிக்கிறது...
````

**Example 3: Inline SVG**

````markdown
{{langs|si|ta|en}}

Symbol legend:~සංකේත පැහැදිලි කිරීම:~சின்னம் விளக்கம்:

```
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
```

Red circle indicates...~රතු වෘත්තය දක්වයි...~சிவப்பு வட்டம் குறிக்கிறது...
````

**Relationship to Images:**

- **Images** (PNG, JPG, GIF): Use standard Markdown syntax `![alt~alt~alt](path.jpg)` - NO fencing required
- **HTML embeds**: Use fenced blocks as shown above

See [§5.7.3 Images](#573-images-single-source) for image syntax with multilingual alt text.

### 5.9 Entity References

**Status**: 3md Extension (not in CommonMark)

Entity references provide consistent terminology across languages.

**Syntax:**

```
[[entity-id]]                  # Display = entity-id
[[entity-id|display-text]]     # Custom display text
```

**Rules:**

1. Entity MUST be defined in frontmatter
2. Parser resolves reference based on current language
3. If entity not defined, parser SHOULD emit warning

**Example:**

```yaml
---
entities:
  bawa:
    primary: "Geoffrey Bawa"
    si: "ජෙෆ්රි බාවා"
    ta: "ஜெஃப்ரி பாவா"
---
{{langs|si|ta|en}}

[[bawa|ජෙෆ්රි බාවා]] යනු ප්‍රසිද්ධ ස්ථාපත්‍ය විද්‍යාඥයෙකි.
෴
[[bawa|ஜெஃப்ரி பாவா]] புகழ்பெற்ற கட்டடடக் கலைஞர்.
෴
[[bawa]] is a renowned architect.
```

### 5.10 Emphasis and Strong Emphasis

Standard CommonMark emphasis works within each language variant.

**Example:**

```
{{langs|si|ta|en}}

**තද** සහ *ඇලවූ* පෙළ.~**தடித்த** மற்றும் *சாய்வு* உரை.~**Bold** and *italic* text.
```

### 5.11 HTML

**Status**: Inherits from CommonMark

Raw HTML is permitted (following CommonMark rules) but:

1. HTML is language-invariant (Mono Block)
2. SHOULD be avoided in favor of Markdown

**Example:**

```
{{langs|si|ta|en}}

Some text~சில உரை~කිසියම් පෙළ

<div class="special">
  Language-invariant HTML content
</div>

More text~மேலும் உரை~තවත් පෙළ
```

### 5.12 Comments

**Syntax**: Standard HTML comments

```
<!-- comment text -->
```

**Rules:**

1. Comments are **removed during parsing**
2. Do NOT appear in output
3. Can appear in Multi or Mono blocks

**Example:**

```
{{langs|si|ta|en}}

සිංහල වාක්‍යය. <!-- සිංහල අදහස් -->
෴
தமிழ் வாக்கியம். <!-- தமிழ் கருத்து -->
෴
English sentence. <!-- English comment -->
```

---

## 6. Escape Sequences

### 6.1 Escape Characters

The following characters can be escaped with backslash:

- `\~` → Literal tilde
- `\෴` → Literal Kunddaliya
- `\\` → Literal backslash

**Processing order:**

1. Identify and protect code spans and blocks
2. Process escape sequences
3. Split on separators
4. Parse CommonMark within each variant

### 6.2 Escape Processing Algorithm

```python
def process_escapes(text: str) -> str:
    """
    Process escape sequences before splitting on separators.
    """
    # Protect code spans first
    text, code_map = extract_code_spans(text)

    # Process escape sequences
    text = text.replace('\\~', '\x00TILDE\x00')
    text = text.replace('\\෴', '\x00KUNDALIYA\x00')
    text = text.replace('\\\\', '\x00BACKSLASH\x00')

    # Now safe to split on separators
    variants = split_on_separators(text)

    # Restore escaped characters
    for i, variant in enumerate(variants):
        variant = variant.replace('\x00TILDE\x00', '~')
        variant = variant.replace('\x00KUNDALIYA\x00', '෴')
        variant = variant.replace('\x00BACKSLASH\x00', '\\')
        variants[i] = variant

    # Restore code spans
    variants = restore_code_spans(variants, code_map)

    return variants
```

### 6.3 Examples

**URLs with tildes:**

```
{{langs|si|ta|en}}

Visit https://example.com/path\~to\~file for info.~ප්‍රලේඛන සඳහා https://example.si/path\~to\~file වෙත.~ஆவணங்களுக்கு https://example.ta/path\~to\~file ஐ.
```

**Price ranges:**

```
{{langs|si|ta|en}}

Costs $100\~200 depending on size.~ප්‍රමාණය අනුව $100\~200.~அளவைப் பொறுத்து $100\~200.
```

**Discussing separators:**

```
{{langs|si|ta|en}}

The \~ character separates variants.~\~ අක්ෂරය වෙන් කරයි.~\~ எழுத்து பிரிக்கிறது.
```

---

## 7. YAML Frontmatter Schema

### 7.1 Structure

Frontmatter is optional but if present MUST be valid YAML 1.2.

**Top-level keys** (all OPTIONAL):

- `status`: Translation status tracking
- `entities`: Entity definitions
- `metadata`: Per-language metadata
- `citations`: Citation references
- Custom keys (implementation-defined)

### 7.2 Status Schema

**Purpose**: Track translation status for each language.

**Schema:**

```yaml
status:
  si: <status-value>
  ta: <status-value>
  en: <status-value>
```

**Valid status values:**

- `source`: Authoritative content (primary language)
- `synced`: Translation verified against current source
- `fuzzy`: Source changed; translation needs review
- `untranslated`: No translation exists yet
- `machine`: Machine-translated, not human-verified

**Default behavior:**

If `status` is not specified, the **first language** in `{{langs}}` declaration is treated as `source`, others as `untranslated`.

**Example:**

```yaml
---
status:
  en: source
  si: synced
  ta: fuzzy
---
{{langs|en|si|ta}}
```

### 7.3 Entities Schema

**Purpose**: Define reusable entities for consistent terminology.

**Schema:**

```yaml
entities:
  <entity-id>:
    primary: <string>    # Primary/canonical name
    si: <string>         # Sinhala variant
    ta: <string>         # Tamil variant
    en: <string>         # English variant
    # Additional metadata (implementation-defined)
    type: <string>
    [other-fields]: <any>
```

**Rules:**

1. `entity-id` MUST be unique within document
2. `primary` is REQUIRED
3. Language-specific variants are OPTIONAL
4. If language variant missing, `primary` is used

**Example:**

```yaml
---
entities:
  bawa:
    primary: "Geoffrey Bawa"
    si: "ජෙෆ්රි බාවා"
    ta: "ஜெஃப்ரி பாவா"
    type: person
    birth: 1919
    death: 2003
---
```

### 7.4 Metadata Schema

**Purpose**: Per-language metadata (author, description, etc.)

**Schema:**

```yaml
metadata:
  si:
    author: <string>
    description: <string>
    [custom-fields]: <any>
  ta:
    author: <string>
    description: <string>
    [custom-fields]: <any>
  en:
    author: <string>
    description: <string>
    [custom-fields]: <any>
```

**Example:**

```yaml
---
metadata:
  si:
    author: "පතුම් ඒගොඩවත්ත"
    description: "ප්‍රදර්ශන මාර්ගෝපදේශය"
  ta:
    author: "பதும் ஏகொடவத்த"
    description: "கண்காட்சி வழிகாட்டி"
  en:
    author: "Pathum Egodawatta"
    description: "Exhibition guide"
---
```

### 7.5 Citations Schema

**Purpose**: Bibliography and citation management.

**Schema:**

```yaml
citations:
  <citation-id>:
    type: <string>      # article, book, etc.
    author: <string>
    title: <string>
    year: <number>
    [other-fields]: <any>
```

**Example:**

```yaml
---
citations:
  ref-001:
    type: article
    author: "Smith, John"
    title: "Tropical Modernism"
    year: 2020
    journal: "Architecture Review"
---
```

---

## 8. Processing Rules

### 8.1 Parsing Pipeline

**Conforming parsers** MUST follow this pipeline:

```
1. Read input (UTF-8)
2. Extract YAML frontmatter (if present)
3. Parse language declaration
4. Split into blocks (blank line separation)
5. For each block:
   a. Detect separator type (block / inline / none)
   b. If separator present:
      - Split into variants
      - Validate variant count (MUST be 3)
      - Validate order matches declaration
   c. Parse CommonMark within each variant
6. Resolve entity references (if frontmatter present)
7. Generate output
```

### 8.2 Variant Count Validation

For Multi Blocks:

```python
def validate_variant_count(variants: list[str], declared_langs: list[str]) -> None:
    """
    Validate that variant count matches declared language count.
    """
    if len(variants) != len(declared_langs):
        raise VariantCountError(
            f"Found {len(variants)} variants but expected {len(declared_langs)} "
            f"(declared languages: {', '.join(declared_langs)})"
        )
```

### 8.3 Empty Marker Handling

The special marker `{{empty}}` indicates intentionally missing content.

**Example:**

```
{{langs|si|ta|en}}

සිංහල පෙළ.~{{empty}}~{{empty}}
```

**Processing:**

1. Parser recognizes `{{empty}}` as placeholder
2. Renderer outputs empty content for that variant
3. Validator SHOULD NOT warn about incomplete content

### 8.4 Error Handling

**Parsers MUST:**

1. **Fail fast** on critical errors
2. Provide **line numbers** in error messages
3. Include **context** (surrounding lines)
4. Suggest **fixes** when possible

**Critical errors** (parsing fails):

- Missing language declaration
- Invalid language codes
- Mismatched variant count
- Malformed frontmatter YAML
- Mixed separators in same block

**Warnings** (parsing succeeds):

- Potential mono block ambiguity
- Undefined entity references
- Missing translation status
- Inconsistent table structures

**Example error message:**

```
ERROR at line 42:

සිංහල~தமிழ்

Found 2 variants but expected 3 (si, ta, en).

Suggested fix:
සිංහල~தமிழ்~English
```

---

## 9. Output Formats

### 9.1 Per-Language Markdown

Extract single-language Markdown files.

**Input:**

```
{{langs|si|ta|en}}

# හැඳින්වීම~அறிமுகம்~Introduction

පෙළ.~உரை.~Text.
```

**Output (si.md):**

```markdown
# හැඳින්වීම

පෙළ.
```

**Output (ta.md):**

```markdown
# அறிமுகம்

உரை.
```

**Output (en.md):**

```markdown
# Introduction

Text.
```

### 9.2 HTML Output

**Option 1: Separate documents**

Generate three HTML files, one per language.

**Option 2: Single document with lang attributes**

```html
<article lang="si">
  <h1>හැඳින්වීම</h1>
  <p>පෙළ.</p>
</article>

<article lang="ta">
  <h1>அறிமுகம்</h1>
  <p>உரை.</p>
</article>

<article lang="en">
  <h1>Introduction</h1>
  <p>Text.</p>
</article>
```

### 9.3 JSON AST

Structured representation for programmatic access.

**Schema:**

```json
{
  "version": "0.1.0",
  "frontmatter": { },
  "languages": ["si", "ta", "en"],
  "blocks": [
    {
      "type": "multi" | "mono",
      "element": "paragraph" | "heading" | "list" | ...,
      "separator": "block" | "inline" | null,
      "variants": {
        "si": "<content>",
        "ta": "<content>",
        "en": "<content>"
      }
    }
  ]
}
```

---

## 10. Conformance

### 10.1 Conforming Documents

A document conforms to this specification if:

1. It contains a valid language declaration
2. All Multi Blocks have exactly three variants
3. Variants appear in declared language order
4. Separators are used correctly
5. Frontmatter (if present) is valid YAML
6. CommonMark content within variants is valid

### 10.2 Conforming Parsers

A parser conforms to this specification if:

1. It correctly parses all valid 3md documents
2. It rejects invalid documents with clear error messages
3. It supports all CommonMark 0.31.2 features
4. It implements the full parsing pipeline (§8.1)
5. It validates variant counts (§8.2)
6. It processes escape sequences correctly (§6)

### 10.3 Conforming Renderers

A renderer conforms to this specification if:

1. It correctly renders parsed 3md to target format
2. It preserves language-specific content
3. It handles Mono Blocks appropriately
4. It resolves entity references (if present)

---

## 11. Security Considerations

### 11.1 Code Injection

- Parsers MUST sanitize HTML output (XSS prevention)
- Entity references MUST NOT allow code execution
- YAML frontmatter MUST be safely parsed (no `eval()`)

### 11.2 Resource Limits

Parsers SHOULD implement:

- Maximum document size limits
- Maximum nesting depth limits
- Timeout limits for parsing

### 11.3 Unicode Security

- Parsers MUST handle Unicode correctly (UTF-8)
- MUST reject invalid UTF-8 sequences
- SHOULD warn about lookalike characters (homoglyph attacks)

---

## 12. Changelog

### Version 0.1.0 (2025-12-29)

- Initial specification
- Based on CommonMark 0.31.2
- Defines core syntax and semantics
- Specifies YAML frontmatter schema
- Documents processing rules

---

## Appendix A: Complete Grammar (EBNF)

```ebnf
(* 3md Grammar *)

document = [frontmatter], language-declaration, block* ;

frontmatter = "---", newline, yaml-content, newline, "---", newline ;

language-declaration = "{{langs|", lang-code, "|", lang-code, "|", lang-code, "}}", newline ;

lang-code = "si" | "ta" | "en" ;

block = multi-block | mono-block ;

multi-block = multi-block-inline | multi-block-block ;

multi-block-inline = variant, "~", variant, "~", variant, newline ;

multi-block-block = variant, newline, "෴", newline, variant, newline, "෴", newline, variant, newline ;

mono-block = commonmark-block ;

variant = (* any text, processed as CommonMark *) ;

newline = "\n" | "\r\n" ;
```

---

## Appendix B: Example Documents

### B.1 Minimal Valid Document

```
{{langs|si|ta|en}}

හෙලෝ~வணக்கம்~Hello
```

### B.2 Complete Document with Frontmatter

```
---
status:
  si: synced
  ta: synced
  en: source

entities:
  bawa:
    primary: "Geoffrey Bawa"
    si: "ජෙෆ්රි බාවා"
    ta: "ஜெஃப்ரி பாவா"
---
{{langs|en|si|ta}}

# Introduction~හැඳින්වීම~அறிமுகம்

[[bawa]] was a renowned architect.
෴
[[bawa|ජෙෆ්රි බාවා]] ප්‍රසිද්ධ ස්ථාපත්‍ය විද්‍යාඥයෙකි.
෴
[[bawa|ஜெஃப்ரி பாவா]] புகழ்பெற்ற கட்டடக் கலைஞர்.

## Key Works~ප්‍රධාන කෘති~முக்கிய படைப்புகள்

- Kandalama Hotel~කන්දලාම හෝටලය~கந்தளாம ஹோட்டல்
- Lighthouse Hotel~ලයිට්හවුස් හෝටලය~லைட்ஹவுஸ் ஹோட்டல்

| Project~ව්‍යාපෘතිය~திட்டம் | Year~වර්ෂය~ஆண்டு |
|-----------------------------|-------------------|
| Kandalama~කන්දලාම~கந்தளாம  | 1994              |
```

---

## Appendix C: Migration from CommonMark

To convert a CommonMark document to 3md:

1. Add language declaration: `{{langs|en|si|ta}}`
2. For each heading, add variants: `# Title~Title~Title`
3. For each paragraph, add variants using appropriate separator
4. Leave code blocks as-is (Mono Blocks)
5. (Optional) Add frontmatter for metadata

---

## References

- [CommonMark Specification 0.31.2](https://spec.commonmark.org/0.31.2/)
- [YAML 1.2](https://yaml.org/spec/1.2/)
- [RFC 2119: Key words for use in RFCs](https://www.rfc-editor.org/rfc/rfc2119)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [Unicode Character U+0DF4](https://unicode.org/charts/PDF/U0D80.pdf)

---

**END OF SPECIFICATION**
