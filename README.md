# 3md: Trilingual Markdown Specification

**Version:** 0.1.0
**Languages:** Sinhala (si), Tamil (ta), English (en)
**Status:** Proposal
**Date:** 2025-12-29
**Based on:** [MLMD (Multilingual Markdown)](https://shennongalpha.westlake.edu.cn/doc/en/mlmd/)

---

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Document Structure](#document-structure)
4. [The Separator System](#the-separator-system)
5. [Syntax Reference](#syntax-reference)
6. [YAML Frontmatter Reference](#yaml-frontmatter-reference)
7. [Philosophy & Design Rationale](#philosophy--design-rationale)
8. [Complete Examples](#complete-examples)
9. [Best Practices](#best-practices)
10. [Common Workflows](#common-workflows)
11. [For Developers & Tool Builders](#for-developers--tool-builders)
12. [Appendices](#appendices)

---

## Introduction

### What is Markdown?

Markdown is a simple, plain-text formatting language that allows you to write content that can be easily converted to beautifully formatted documents, websites, or publications. Unlike Word or InDesign, Markdown files are **plain text** - you can edit them in any text editor, and they work seamlessly with modern collaboration tools and version control systems.

**Why content creators love Markdown:**
- **Future-proof**: Plain text files never become obsolete
- **Portable**: Works with any tool, any platform, any time
- **Version-friendly**: Track changes clearly, collaborate effectively
- **Distraction-free**: Focus on writing, not formatting
- **Flexible**: Export to Word, PDF, InDesign, HTML, or any format you need

### What is 3md?

**3md** (Trilingual Markdown) is a specialized format for South Asian cultural organizations, museums, publishers, and content creators who work in **Sinhala, Tamil, and English** simultaneously.

Instead of maintaining three separate Word documents or InDesign files (one per language), 3md lets you:

- **Write all three languages in one file** - Keep translations aligned and synchronized
- **Maintain parallel content** - See all language variants side-by-side while editing
- **Track translation status** - Know what's complete, what needs review, what's in progress
- **Collaborate across teams** - Translators, editors, and designers work from the same source
- **Preserve cultural context** - Write naturally in each language, not literal translations
- **Export to any format** - Generate Word docs, PDFs, InDesign files, websites, or print materials

**How it works:**

3md extends standard Markdown with two distinct separators:

- **Kunddaliya (෴)** - A traditional Sinhala punctuation mark that binds multi-line content blocks
- **Tilde (~)** - Separates short parallel text on a single line

This dual-separator system enables unambiguous parsing while supporting complex document structures including lists, blockquotes, and tables.

### Minimal Example

The simplest valid 3md document:

```
{{langs|si|ta|en}}

හෙලෝ වර්ල්ඩ්!~வணக்கம் உலகம்!~Hello World!
```

No frontmatter required. No complex structures. Just the language header and inline content with the tilde (`~`) separator.

### Key Features for Cultural Organizations

- **Single source of truth** - One file replaces three separate Word/InDesign documents
- **Visual alignment** - See all three languages side-by-side while editing
- **Flexible workflows** - Start in any language (Sinhala-first, English-first, or Tamil-first)
- **Translation management** - Track status (draft, needs review, complete) for each language
- **Team collaboration** - Multiple authors, translators, and editors work from the same file
- **Consistent terminology** - Define key terms once, use everywhere
- **Export anywhere** - Convert to Word, PDF, InDesign, HTML, or print-ready formats
- **Plain text format** - Edit in any text editor, no specialized software required
- **Future-proof** - Files remain readable and usable for decades

### Integration with Your Workflow

3md is designed to work **with** your existing tools and processes, not replace them:

**For Writers & Editors:**
- Edit 3md files in any text editor (Notepad, TextEdit, VS Code, Sublime Text)
- Use familiar Markdown formatting (headings, bold, italic, lists, tables)
- Export to Word documents for final review or client delivery

**For Translators:**
- See source text and translation side-by-side
- Track what's translated, what needs review, what's pending
- Work in the language order that suits your workflow

**For Designers:**
- Export to InDesign-compatible formats
- Maintain consistent text across all language variants
- Update content without reformatting entire layouts

**For Teams:**
- Use collaboration tools like Google Docs, Dropbox, or Git
- Track changes clearly with version control
- Avoid "version 23 final FINAL edited.docx" chaos

**For Publishers:**
- Maintain museum catalogs, exhibition guides, or publications in three languages
- Update content once, export to all formats
- Archive in a format that will work 50 years from now

### Who is 3md For?

**Cultural Organizations:**
- Museums creating exhibition catalogs and wall labels
- Archives maintaining historical documents
- Cultural centers producing educational materials
- Heritage sites developing visitor guides

**Publishers:**
- Book publishers producing trilingual editions
- Magazine editors managing multilingual content
- Academic publishers handling research papers
- Educational publishers creating textbooks

**Government & NGOs:**
- Public institutions with trilingual mandates
- NGOs serving diverse communities
- Government agencies publishing official documents
- Educational institutions producing resources

**Creative Professionals:**
- Writers working in multiple languages
- Translators managing parallel texts
- Editors coordinating multilingual teams
- Content creators serving trilingual audiences

### Relationship to MLMD

3md is **based on MLMD** but optimized for South Asian trilingual contexts:

| Feature              | MLMD           | 3md                          |
|----------------------|----------------|--------------------------------|
| Block separator      | `\n`           | `\n෴\n` (Kunddaliya)           |
| Inline separator     | N/A            | `~` (tilde)                    |
| Separator semantics  | Ambiguous      | Unambiguous (2 distinct roles) |
| Target languages     | Any            | si, ta, en (flexible order)    |
| Language order       | Per-block      | Per-document (declared once)   |
| Lists, tables, quotes| Not specified  | Fully specified                |
| Frontmatter          | Not specified  | YAML with schema               |

---

## Quick Start

### What You Need

To start working with 3md, you only need:

1. **A text editor** - Any text editor will work:
   - Simple: Notepad (Windows), TextEdit (Mac), gedit (Linux)
   - Advanced: VS Code, Sublime Text, Atom
   - Online: Any browser-based text editor

2. **Basic Markdown knowledge** - If you can write `**bold**` and `# Heading`, you're ready!

3. **(Optional) Conversion tools** - To export to other formats:
   - 3md to Word converter
   - 3md to PDF generator
   - 3md to InDesign exporter

**Note:** While specialized tools make working with 3md easier (syntax highlighting, live preview, export options), you can start with any basic text editor today.

### Step 1: Declare Languages

Every 3md document begins with a language header:

```
{{langs|si|ta|en}}
```

The order is flexible - choose what suits your workflow:
- `{{langs|si|ta|en}}` - Sinhala-first workflow
- `{{langs|en|si|ta}}` - English-first workflow (common for technical docs)
- `{{langs|ta|si|en}}` - Tamil-first workflow

### Step 2: Write Your First Heading

Use the tilde (`~`) for inline content:

```
{{langs|si|ta|en}}

# හැඳින්වීම~அறிமுகம்~Introduction
```

### Step 3: Add a Paragraph

For multi-line content, use the Kunddaliya (`෴`) block separator:

```
{{langs|si|ta|en}}

# හැඳින්වීම~அறிமுகம்~Introduction

මෙය සරල ලේඛනයකි.
෴
இது ஒரு எளிய ஆவணம்.
෴
This is a simple document.
```

### Step 4: Create a List

```
{{langs|si|ta|en}}

## විශේෂාංග~அம்சங்கள்~Features

- පළමු අයිතමය~முதல் உருப்படி~First item
- දෙවන අයිතමය~இரண்டாவது உருப்படி~Second item
- තුන්වන අයිතමය~மூன்றாவது உருப்படி~Third item
```

That's it! You're ready to create multilingual documents.

---

## Document Structure

### Overall Structure

```
---
# Optional YAML frontmatter
---
{{langs|si|ta|en}}
# Document content follows
```

### YAML Frontmatter (Optional)

Frontmatter appears **before** the `{{langs}}` header, delimited by `---`:

```yaml
---
project:
  title: "Document Title"
  created: "2025-01-15"

status:
  si: synced
  ta: fuzzy
  en: source
---
{{langs|si|ta|en}}
```

See [YAML Frontmatter Reference](#yaml-frontmatter-reference) for complete details.

### Language Declaration

The language header must appear on the first line after optional frontmatter:

```
{{langs|si|ta|en}}
```

**Key points:**
- Must appear on first line (after optional frontmatter)
- Declares languages in **any order chosen by the author**
- Uses ISO 639-1 language codes: `si`, `ta`, `en`
- Defines the order used throughout the document for all Multi Blocks
- The **first language** in the declaration is treated as the default source language unless explicitly overridden in frontmatter

**Important:** The language order is **persistent throughout the document**. Once declared, all Multi Blocks must follow this exact order.

### Block Types

3md uses two fundamental block types:

#### Multi Blocks

Contain **parallel content** in all declared languages. Each language variant appears in the declared order, separated by the Kunddaliya (෴) or tilde (~).

**Example:**
```
සිංහල වාක්‍යය.
෴
தமிழ் வாக்கியம்.
෴
English sentence.
```

#### Mono Blocks

Contain **language-invariant content** that applies across all languages (e.g., code samples, numbers, universal notation).

**Example:**
```
This is language-invariant content.
```

**Detection Rule:** A paragraph without separators (`~` or `\n෴\n`) is treated as **Mono (language-invariant)**.

---

## The Separator System

3md uses two distinct separators with clear, unambiguous roles. Understanding when to use each is fundamental to working with 3md.

### The Kunddaliya (෴) - Block Binder

The [Kunddaliya](https://en.wikipedia.org/wiki/Sinhala_script#Punctuation) (U+0DF4) is a traditional Sinhala punctuation mark used to bind multi-line blocks together.

**Usage:**
- **ONLY** used with surrounding line breaks: `\n෴\n`
- Binds together multi-line blocks (paragraphs, lists, blockquotes, tables)
- Creates explicit visual separation between language blocks

**When to use:**
- Multi-line paragraphs
- Lists with complex content or formatting
- Blockquotes
- Tables (when structure differs by language)
- Any content exceeding 80 characters per variant
- Content with internal line breaks or complex formatting

**Example:**
```
{{langs|si|ta|en}}

ඔහුගේ ස්ථාපත්‍ය දර්ශනය මූලික මූලධර්ම කිහිපයක් මත පදනම් විය.
මෙය බහු-පේළි අන්තර්ගතයකි.
෴
அவரது கட்டடக்கலை தத்துவம் முக்கிய கொள்கைகளை அடிப்படையாகக் கொண்டது.
இது பல-வரி உள்ளடக்கம்.
෴
His architectural philosophy was based on key principles.
This is multi-line content.
```

**Advantages:**
- **Cultural relevance** - Connects to South Asian manuscript traditions
- **Visual clarity** - Unambiguous block-level separator
- **Unicode support** - Standard character with universal support

### The Tilde (~) - Inline Separator

The tilde character separates **compact, single-line** multilingual content.

**Usage:**
- Used within a single line to separate short parallel text
- Ideal for brief sentences, headings, labels, table cells
- ASCII character, universally available on keyboards

**When to use:**
- Headings (any level)
- Brief sentences (≤80 characters per variant)
- Simple content without complex formatting
- List items (when simple and short)
- Table cells (when structure is identical across languages)
- Optimizing for storage efficiency and compact diffs

**Example:**
```
{{langs|si|ta|en}}

# හැඳින්වීම~அறிமுகம்~Introduction

Short sentence.~குறுகிய வாக்கியம்.~කෙටි වාක්‍යය.
```

**Advantages:**
- **Simplicity** - No ambiguity with block-level syntax
- **Efficiency** - Compact storage for short content
- **Clarity** - Parser logic is unambiguous

### Format Selection Guide

Use this decision tree to choose the right separator:

```
Is the content a single line?
├─ YES: Is each variant ≤80 characters?
│   ├─ YES: Use inline separator (~)
│   └─ NO: Use block separator (෴)
└─ NO: Use block separator (෴)

Special cases:
- Headings: Always use inline (~)
- Code blocks: Always mono (language-invariant)
- Tables: Inline (~) if structure identical, block (෴) if structure differs
```

### Escaping Special Characters

To include literal separator characters in your content, use backslash escaping:

**Escape Sequences:**
- `\~` → Literal tilde character
- `\෴` → Literal Kunddaliya character
- `\\` → Literal backslash

**Inline Code Protection:**

Content within backticks is automatically protected - separators are treated as literal characters:

```
{{langs|si|ta|en}}

Use `url~path~segment` syntax for routing.~`url~path~segment` සින්ටැක්ස් භාවිතා කරන්න.~`url~path~segment` வழிச்செலுத்தலுக்கு பயன்படுத்தவும்.
```

**Common Use Cases:**

**URLs and Paths:**
```
{{langs|si|ta|en}}

Visit https://example.com/path\~to\~file for documentation.~ප්‍රලේඛන සඳහා https://example.si/path\~to\~file වෙත පිවිසෙන්න.~ஆவணங்களுக்கு https://example.ta/path\~to\~file ஐப் பார்க்கவும்.
```

**Price Ranges:**
```
{{langs|si|ta|en}}

Items cost $100\~200 depending on size.~ප්‍රමාණය අනුව අයිතම $100\~200 වේ.~அளவைப் பொறுத்து பொருட்கள் $100\~200 செலவாகும்.
```

**Discussing Separator Characters:**
```
{{langs|si|ta|en}}

The tilde \~ character separates inline variants.~ටිල්ඩ් \~ අක්ෂරය පේළි වෙනස්කම් වෙන් කරයි.~டில்ட் \~ எழுத்து வரிசை மாறுபாடுகளை பிரிக்கிறது.

The Kunddaliya \෴ character binds multi-line blocks.~කුණ්ඩලිය \෴ අක්ෂරය බහු-රේඛා කොටස් බන්ධනය කරයි.~குண்டலிகா \෴ எழுத்து பல-வரி தொகுதிகளை இணைக்கிறது.
```

**Important Notes:**
- Backslash escapes work in paragraphs, headings, lists, blockquotes, and table cells
- Inline code blocks (`` `...` ``) automatically protect all special characters
- Fenced code blocks (` ``` `) are always mono (language-invariant) - no escaping needed
- To include a literal backslash before a separator, use double backslash: `\\~`

---

## Syntax Reference

### Paragraphs

#### Multi Block Paragraphs (Block Format)

Use block format for multi-line paragraphs or content exceeding 80 characters:

```
{{langs|si|ta|en}}

සිංහල වාක්‍යය. මෙය දිගු ඡේදයක් විය හැක.
෴
தமிழ் வாக்கியம். இது நீண்ட பத்தியாக இருக்கலாம்.
෴
English sentence. This can be a longer paragraph.

තවත් සිංහල වාක්‍යය.
෴
மற்றொரு தமிழ் வாக்கியம்.
෴
Another English sentence.
```

#### Inline Paragraphs (Compact Format)

For short, simple sentences (≤80 characters per variant):

```
{{langs|si|ta|en}}

Short sentence.~குறுகிய வாக்கியம்.~කෙටි වාක්‍යය.

Another brief sentence.~மற்றொரு சிறிய வாக்கியம்.~තවත් කෙටි වාක්‍යය.
```

Each line is a separate paragraph with all three variants inline.

#### Mono Block Paragraphs

Content without separators is language-invariant:

```
{{langs|si|ta|en}}

This is language-invariant content.
```

**Important:** Content in a single language without separators will be parsed as **Mono** (language-invariant). For incomplete translations, use explicit empty markers:

```
සිංහල පෙළ.~{{empty}}~{{empty}}
```

Or using block syntax:
```
සිංහල පෙළ.
෴
{{empty}}
෴
{{empty}}
```

### Headings

Headings in 3md use **inline syntax** with the tilde (~) separator as the standard approach.

#### Inline Syntax (Standard)

```
{{langs|si|ta|en}}

# සිරස්තලය~தலைப்பு~Heading

## උප සිරස්තලය~துணைத் தலைப்பு~Subheading

### තෙවන මට්ටම~மூன்றாம் நிலை~Third Level
```

**Six heading levels** are supported (# through ######).

#### Block-Level Alternative

For headings exceeding 80 characters per variant:

```
{{langs|si|ta|en}}

# මෙය ඉතා දිගු සිරස්තලයක් වන අතර එය අසූ අක්ෂර ප්‍රමාණය ඉක්මවයි
෴
# இது மிக நீண்ட தலைப்பு மற்றும் எண்பது எழுத்துக்கு மேல் செல்கிறது
෴
# This is a very long heading that exceeds the eighty character threshold
```

#### Language-Invariant Headings

Headings without separators are mono:

```
{{langs|si|ta|en}}

# Introduction

## Data Analysis
```

### Emphasis

Standard Markdown emphasis works within each language variant:

```
{{langs|si|ta|en}}

**තද** පෙළ සහ *ඇලවූ* පෙළ.~**தடித்த** உரை மற்றும் *சாய்வு* உரை.~**Bold** text and *italic* text.
```

- `**bold**` for bold
- `*italic*` or `_italic_` for italic
- `***bold italic***` for both

### Code Blocks

Code blocks in 3md are **always mono (language-invariant)**.

#### Inline Code

Use backticks for inline code:

```
{{langs|si|ta|en}}

The `print()` function outputs text to the console.
~`print()` ශ්‍රිතය කොන්සෝලය වෙත පෙළ ප්‍රතිදානය කරයි.
~`print()` சார்பு பிழையகத்திற்கு உரையை வெளியிடும்.
```

**Important:** Separators inside backticks are literal - they don't split into variants.

#### Fenced Code Blocks

Use triple backticks with optional language identifier:

````
{{langs|si|ta|en}}

# Python Example~Python උදාහරණය~Python உதாரணம்

Here's a simple function:~සරල ශ්‍රිතයක්:~ஒரு எளிய செயல்பாடு:

```python
def greet(name):
    """Greet the user"""
    return f"Hello, {name}!"

# Usage
print(greet("World"))
```

This function returns a greeting message.~මෙම ශ්‍රිතය සුබ පැතුම් පණිවිඩයක් ප්‍රතිදානය කරයි.~இந்த செயல்பாடு வாழ்த்து செய்தியை திருப்பி அனுப்புகிறது.
````

**Supported Features:**
- Syntax highlighting with language identifier (`python`, `javascript`, `bash`, etc.)
- Language-invariant - code is identical across all language variants
- No separator parsing - tildes and Kunddaliya in code are literal
- Indentation preserved exactly as written

#### Indented Code Blocks

Four-space indentation also creates code blocks:

```
{{langs|si|ta|en}}

Basic example:~මූලික උදාහරණය:~அடிப்படை உதாரணம்:

    function hello() {
        console.log("Hello!");
    }
```

### Lists

Lists can use either inline syntax (for simple items) or block-level syntax (for complex content).

#### Inline List Syntax (Default)

For simple, short list items (≤80 characters per variant):

**Ordered lists:**
```
{{langs|si|ta|en}}

1. First item~முதல் உருப்படி~පළමු අයිතමය
2. Second item~இரண்டாவது உருப்படி~දෙවන අයිතමය
3. Third item~மூன்றாவது உருப்படி~තුන්වන අයිතමය
```

**Unordered lists:**
```
{{langs|si|ta|en}}

- Bullet one~புல்லட் ஒன்று~බුලට් එක
- Bullet two~புல்லட் இரண்டு~බුලට් දෙක
- Bullet three~புல்லட் மூன்று~බුලට් තුන
```

#### Block-Level List Syntax

For items with formatting or multi-line content:

```
{{langs|si|ta|en}}

1. පළමු අයිතමය
2. දෙවන අයිතමය **තද** සමඟ
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

**Important:** The entire list (all items together) forms one Multi Block, whether using inline or block syntax.

#### Nested Lists

**Inline syntax (compact):**
```
{{langs|si|ta|en}}

1. Main item~முதன்மை உருப்படி~ප්‍රධාන අයිතමය
   - Nested one~உள்ளமைக்கப்பட்ட ஒன்று~කැදැලි එක
   - Nested two~உள்ளமைக்கப்பட்ட இரண்டு~කැදැලි දෙක
2. Second item~இரண்டாவது உருப்படி~දෙවන අයිතමය
```

**Block syntax (for complex nesting):**
```
{{langs|si|ta|en}}

1. ප්‍රධාන අයිතමය
   - කැදැලි බුලට් එක
   - කැදැලි බුලට් දෙක
2. දෙවන ප්‍රධාන අයිතමය
   - තවත් කැදැලි
෴
1. முதன்மை உருப்படி
   - உள்ளமைக்கப்பட்ட புல்லட் ஒன்று
   - உள்ளமைக்கப்பட்ட புல்லட் இரண்டு
2. இரண்டாவது முதன்மை உருப்படி
   - மற்றொரு உள்ளமைக்கப்பட்டது
෴
1. Main item
   - Nested bullet one
   - Nested bullet two
2. Second main item
   - Another nested
```

**Indentation:** Use **3 spaces** for nested items to align with parent content.

### Blockquotes

```
{{langs|si|ta|en}}

> උපුටා දැක්වීම පළමු පේළිය.
> උපුටා දැක්වීම දෙවන පේළිය.
෴
> மேற்கோள் முதல் வரி.
> மேற்கோள் இரண்டாவது வரி.
෴
> Quote first line.
> Quote second line.
```

The entire blockquote (all lines) forms one Multi Block.

### Tables

Tables can use inline cell syntax (default) or block-level syntax.

#### Inline Cell Syntax (Default)

For tables where structure is identical but content varies:

```
{{langs|si|ta|en}}

| Feature~විශේෂාංගය~அம்சம் | Price~මිල~விலை |
|---------------------------|----------------|
| Basic~මූලික~அடிப்படை      | $10            |
| Premium~ප්‍රිමියම්~பிரீமியம் | $25          |
```

#### Block-Level Table Syntax

For tables where structure differs by language:

```
{{langs|si|ta|en}}

| විශේෂාංගය | මිල |
|-----------|-----|
| මූලික     | $10 |
| ප්‍රිමියම් | $25 |
෴
| அம்சம்    | விலை |
|----------|------|
| அடிப்படை  | $10  |
| பிரீமியம் | $25  |
෴
| Feature | Price |
|---------|-------|
| Basic   | $10   |
| Premium | $25   |
```

#### Language-Invariant Tables

When structure and content are identical across languages:

```
{{langs|si|ta|en}}

| Year | Value |
|------|-------|
| 2023 | 100   |
| 2024 | 150   |
```

### Links and Images

#### Standard Markdown Links

```
{{langs|si|ta|en}}

Visit [our website](https://example.com) for more information.~වැඩි විස්තර සඳහා [අපගේ වෙබ් අඩවිය](https://example.si) වෙත පිවිසෙන්න.~மேலும் தகவலுக்கு [எங்கள் இணையத்தளத்தை](https://example.ta) பார்க்கவும்.
```

#### Multilingual Link Text

Use the tilde separator for multilingual link text with a single URL:

```
{{langs|si|ta|en}}

[Documentation~ප්‍රලේඛනය~ஆவணம்](https://docs.example.com)
```

#### Language-Specific URLs

When different language variants need different URLs:

```
{{langs|si|ta|en}}

[English documentation](https://docs.example.com/en)
෴
[සිංහල ප්‍රලේඛනය](https://docs.example.com/si)
෴
[தமிழ் ஆவணங்கள்](https://docs.example.com/ta)
```

#### Images

Standard Markdown image syntax:

```
{{langs|si|ta|en}}

![Architecture diagram](images/architecture.png)
```

#### Multilingual Alt Text

```
{{langs|si|ta|en}}

![Diagram showing system architecture~පද්ධති ව්‍යුහය පෙන්වන රූප සටහන~கணினி கட்டமைப்பைக் காட்டும் வரைபடம்](images/architecture.png)
```

#### Language-Specific Images

```
{{langs|si|ta|en}}

![English screenshot](images/screenshot-en.png)
෴
![සිංහල තිර රුව](images/screenshot-si.png)
෴
![தமிழ் திரை பிடிப்பு](images/screenshot-ta.png)
```

#### Autolinks

```
{{langs|si|ta|en}}

Visit <https://example.com> for updates.
~යාවත්කාලීන සඳහා <https://example.si> වෙත පිවිසෙන්න.
~புதுப்பிப்புகளுக்கு <https://example.ta> ஐப் பார்க்கவும்.
```

### Entity References

Entity references provide consistent terminology across languages:

```
{{langs|si|ta|en}}

[[Geoffrey Bawa|ජෙෆ්රි බාවා]] යනු ශ්‍රී ලංකාවේ ප්‍රසිද්ධ ස්ථාපත්‍ය විද්‍යාඥයෙකි.
෴
[[Geoffrey Bawa|ஜெஃப்ரி பாவா]] இலங்கையின் புகழ்பெற்ற கட்டடக் கலைஞர்.
෴
[[Geoffrey Bawa]] is Sri Lanka's renowned architect.
```

**Syntax:**
- `[[entity-id]]` - Display and reference are identical
- `[[entity-id|display-text]]` - Reference differs from display

**Links vs Entity References:**

| Syntax | Purpose | Example |
|--------|---------|---------|
| `[text](url)` | Standard Markdown link | `[Google](https://google.com)` |
| `[[entity-id]]` | Entity reference (3md custom) | `[[Geoffrey Bawa]]` |
| `[[entity-id\|display]]` | Entity with custom display | `[[Geoffrey Bawa\|ජෙෆ්රි බාවා]]` |

Entity details are defined in frontmatter (see [Entity Definitions](#entity-definitions)).

**Important:** Reference-style links (`[text][ref]` with `[ref]: url`) are **not supported** due to syntax conflicts.

### Comments

HTML-style comments are supported:

```
{{langs|si|ta|en}}

සිංහල වාක්‍යය. <!-- මෙය අදහස් දැක්වීමකි -->
෴
தமிழ் வாக்கியம். <!-- இது ஒரு கருத்து -->
෴
English sentence. <!-- This is a comment -->

<!-- Multi-line comment
     spanning several lines
     in any language -->
```

Comments are **removed during parsing** and do not appear in output.

---

## YAML Frontmatter Reference

3md supports optional YAML frontmatter for metadata management. Frontmatter appears **before** the `{{langs}}` header, delimited by `---`.

### Basic Structure

```yaml
---
project:
  title: "Document Title"
  created: "2025-01-15"
  deadline: "2026-05-01"

status:
  si: synced
  ta: fuzzy
  en: source
---
{{langs|si|ta|en}}
```

### Translation Status Tracking

```yaml
status:
  si: synced
  ta: fuzzy
  en: source
```

**Default behavior:** If status is not explicitly declared, the **first language** in the `{{langs}}` declaration is treated as the source language, and all others are treated as `untranslated`.

For example:
- `{{langs|en|si|ta}}` → English is default source
- `{{langs|si|ta|en}}` → Sinhala is default source

**Status values:**

| Status         | Meaning                                           |
|----------------|---------------------------------------------------|
| `source`       | Authoritative content (primary language)          |
| `synced`       | Translation verified against current source       |
| `fuzzy`        | Source changed; translation needs review          |
| `untranslated` | No translation exists yet                         |
| `machine`      | Machine-translated, not human-verified            |

### Entity Definitions

```yaml
entities:
  gb-001:
    primary: "Geoffrey Bawa"
    si: "ජෙෆ්රි බාවා"
    ta: "ஜெஃப்ரி பாவா"
    type: person
    birth: 1919
    death: 2003

  kandalama:
    primary: "Heritance Kandalama"
    si: "හෙරිටන්ස් කන්දලාම"
    ta: "ஹெரிடன்ஸ் கந்தளாம"
    type: project
    year: 1994
```

Entities defined here can be referenced in content using `[[entity-id]]` or `[[entity-id|display]]`.

### Per-Language Metadata

```yaml
metadata:
  si:
    author: "පතුම් ඒගොඩවත්ත"
    description: "ජෙෆ්රි බාවා ප්‍රදර්ශන මාර්ගෝපදේශය"
  ta:
    author: "பதும் ஏகொடவத்த"
    description: "ஜெஃப்ரி பாவா கண்காட்சி வழிகாட்டி"
  en:
    author: "Pathum Egodawatta"
    description: "Geoffrey Bawa exhibition guide"
```

### Citation Metadata

```yaml
citations:
  ref-001:
    type: article
    author: "Smith, John"
    title: "Tropical Modernism"
    year: 2020
    journal: "Architecture Review"
```

Citations can be referenced using `{{ref|@ref-001}}` syntax (inherited from MLMD).

---

## Philosophy & Design Rationale

### Multilingual Parallel Writing vs Translation

3md is designed for **parallel multilingual content creation**, not sequential translation workflows. Authors write content simultaneously in multiple languages, maintaining conceptual equivalence rather than literal translation. This approach:

- Preserves cultural context and idiom in each language
- Allows natural expression without translation artifacts
- Enables language-specific content where appropriate
- Maintains structural alignment across languages

### Human-Readable Yet Structured

3md balances two competing needs:

- **Human readability**: Authors can edit files in plain text editors without specialized tools
- **Machine parsability**: Structured format enables automated processing, validation, and transformation

The Kunddaliya (෴) serves as a visual separator that's both meaningful to human readers and unambiguous for parsers.

### Optimized for Storage and Editing, Not Authoring

3md prioritizes:

- **Compact storage**: Optional inline formatting (`content1~content2~content3`)
- **Version control friendly**: Plain text diffs work naturally
- **Long-term archival**: No proprietary formats or complex dependencies
- **Editing efficiency**: Direct manipulation without round-trip conversions

**Note:** Authoring tools can provide rich UIs while storing in 3md format.

### The Dual-Separator Design

The choice of two separators is deliberate:

**Block Separator (Kunddaliya ෴):**
- Cultural relevance - connects to South Asian manuscript traditions
- Visual clarity - unmistakable block-level separator
- Semantic consistency - binds blocks, just as it historically marked text boundaries

**Inline Separator (Tilde ~):**
- Universal availability - ASCII character on all keyboards
- Storage efficiency - compact single-line format
- Parser clarity - no ambiguity with block-level syntax

This dual system eliminates the parsing ambiguities present in single-separator approaches while maintaining both human readability and machine precision.

---

## Complete Examples

### Example 1: Sinhala-First Workflow

```
---
project:
  title: "Geoffrey Bawa: Tropical Modernism"
  created: "2025-01-15"
  deadline: "2026-05-01"

status:
  si: synced
  ta: synced
  en: source

entities:
  gb-001:
    primary: "Geoffrey Bawa"
    si: "ජෙෆ්රි බාවා"
    ta: "ஜெஃப்ரி பாவா"
    type: person
    birth: 1919
    death: 2003

metadata:
  si:
    author: "පතුම් ඒගොඩවත්ත"
    description: "ජෙෆ්රි බාවා ප්‍රදර්ශන මාර්ගෝපදේශය"
  ta:
    author: "பதும் ஏகொடவத்த"
    description: "ஜெஃப்ரி பாவா கண்காட்சி வழிகாட்டி"
  en:
    author: "Pathum Egodawatta"
    description: "Geoffrey Bawa exhibition guide"
---
{{langs|si|ta|en}}

# [[gb-001|ජෙෆ්රි බාවා]]~[[gb-001|ஜெஃப்ரி பாவா]]~[[gb-001]]

[[gb-001|ජෙෆ්රි බාවා]] (1919-2003) ශ්‍රී ලංකාවේ ප්‍රසිද්ධ ස්ථාපත්‍ය විද්‍යාඥයෙකි.
෴
[[gb-001|ஜெஃப்ரி பாவா]] (1919-2003) இலங்கையின் புகழ்பெற்ற கட்டடக் கலைஞர்.
෴
[[gb-001]] (1919-2003) is Sri Lanka's most renowned architect.

## මූලධර්ම~கொள்கைகள்~Principles

ඔහුගේ ස්ථාපත්‍ය දර්ශනය මූලික මූලධර්ම කිහිපයක් මත පදනම් විය:
෴
அவரது கட்டடக்கலை தத்துவம் முக்கிய கொள்கைகளை அடிப்படையாகக் கொண்டது:
෴
His architectural philosophy was based on key principles:

1. **ස්ථානය සමඟ සමගිය** - ස්වාභාවික භූ දර්ශනයට ප්‍රතිචාරය
2. **අභ්‍යන්තර-බාහිර සම්බන්ධතාව** - අවකාශවල ද්‍රවශීල මායිම්
3. **දේශීය ද්‍රව්‍ය භාවිතය** - සාම්ප්‍රදායික ශ්‍රී ලාංකික ද්‍රව්‍ය
෴
1. **இடத்துடன் இணக்கம்** - இயற்கை நிலப்பரப்புக்கு பதில்
2. **உட்புற-வெளிப்புற இணைப்பு** - இடங்களின் திரவ எல்லைகள்
3. **உள்ளூர் பொருட்களின் பயன்பாடு** - பாரம்பரிய இலங்கை பொருட்கள்
෴
1. **Harmony with place** - Response to natural landscape
2. **Inside-outside connection** - Fluid boundaries of spaces
3. **Use of local materials** - Traditional Sri Lankan materials

> "මම නිර්මාණය කරන්නේ ස්ථානය සඳහාය."
෴
> "நான் இடத்திற்காக வடிவமைக்கிறேன்."
෴
> "I design for the place."

— [[gb-001]]

## ප්‍රධාන ව්‍යාපෘති~முக்கிய திட்டங்கள்~Major Projects

| ව්‍යාපෘතිය            | වර්ෂය |
|------------------------|-------|
| හෙරිටන්ස් කන්දලාම      | 1994  |
| ලයිට්හවුස් හෝටලය       | 1997  |
| ජෙෆ්රි බාවා නිවස      | 1960  |
෴
| திட்டம்                 | ஆண்டு |
|------------------------|-------|
| ஹெரிடன்ஸ் கந்தளாம      | 1994  |
| லைட்ஹவுஸ் ஹோட்டல்      | 1997  |
| ஜெஃப்ரி பாவா வீடு      | 1960  |
෴
| Project                | Year  |
|------------------------|-------|
| Heritance Kandalama    | 1994  |
| Lighthouse Hotel       | 1997  |
| Geoffrey Bawa House    | 1960  |

අවසාන යාවත්කාලීනය: 2025-12-29
෴
கடைசியாக புதுப்பிக்கப்பட்டது: 2025-12-29
෴
Last updated: 2025-12-29
```

### Example 2: English-First Workflow

The same document with English as the primary language:

```
---
project:
  title: "Geoffrey Bawa: Tropical Modernism"
  created: "2025-01-15"

status:
  en: source
  si: synced
  ta: synced
---
{{langs|en|si|ta}}

# [[gb-001]]~[[gb-001|ජෙෆ්රි බාවා]]~[[gb-001|ஜெஃப்ரி பாவா]]

[[gb-001]] (1919-2003) is Sri Lanka's most renowned architect.
෴
[[gb-001|ජෙෆ්රි බාවා]] (1919-2003) ශ්‍රී ලංකාවේ ප්‍රසිද්ධ ස්ථාපත්‍ය විද්‍යාඥයෙකි.
෴
[[gb-001|ஜெஃப்ரி பாவா]] (1919-2003) இலங்கையின் புகழ்பெற்ற கட்டடக் கலைஞர்.

## Principles~මූලධර්ම~கொள்கைகள்

His architectural philosophy was based on key principles:
෴
ඔහුගේ ස්ථාපත්‍ය දර්ශනය මූලික මූලධර්ම කිහිපයක් මත පදනම් විය:
෴
அவரது கட்டிடக்கலை தத்துவம் முக்கிய கொள்கைகளை அடிப்படையாகக் கொண்டது:

1. **Harmony with place** - Response to natural landscape
2. **Inside-outside connection** - Fluid boundaries of spaces
3. **Use of local materials** - Traditional Sri Lankan materials
෴
1. **ස්ථානය සමඟ සමගිය** - ස්වාභාවික භූ දර්ශනයට ප්‍රතිචාරය
2. **අභ්‍යන්තර-බාහිර සම්බන්ධතාව** - අවකාශවල ද්‍රවශීල මායිම්
3. **දේශීය ද්‍රව්‍ය භාවිතය** - සාම්ප්‍රදායික ශ්‍රී ලාංකික ද්‍රව්‍ය
෴
1. **இடத்துடன் இணக்கம்** - இயற்கை நிலப்பரப்புக்கு பதில்
2. **உட்புற-வெளிப்புற இணைப்பு** - இடங்களின் திரவ எல்லைகள்
3. **உள்ளூர் பொருட்களின் பயன்பாடு** - பாரம்பரிய இலங்கை பொருட்கள்
```

**Note:** The content order changes based on the `{{langs}}` declaration. Tools should respect this order when parsing and rendering.

### Example 3: Museum Exhibition Wall Label

A real-world example from a museum exhibition:

```
---
project:
  title: "Ancient Sri Lankan Pottery"
  exhibition: "Clay & Culture"
  location: "National Museum, Colombo"
  curator: "Dr. Anoma Pieris"

status:
  en: source
  si: synced
  ta: synced

entities:
  anuradhapura:
    primary: "Anuradhapura"
    si: "අනුරාධපුරය"
    ta: "அனுராதபுரம்"
    period: "377 BCE - 1017 CE"
---
{{langs|en|si|ta}}

# Water Pot~ජල භාජනය~நீர் பானை

## Period~කාල පරිච්ඡේදය~காலம்

[[anuradhapura|Anuradhapura]] period, 5th century CE~[[anuradhapura|අනුරාධපුර]] යුගය, ක්‍රි.ව. 5 වන සියවස~[[anuradhapura|அனுராதபுர]] காலம், கி.பி. 5ஆம் நூற்றாண்டு

## Description~විස්තරය~விளக்கம்

මෙම මැටි භාජනය සාමාන්‍යයෙන් ජල ගබඩා කිරීම සඳහා භාවිතා කර ඇත. එහි වටකුරු පාදය සහ සිහින් බිත්ති ජල සිසිලනය සඳහා ප්‍රශස්ත වේ.
෴
இந்த மண் பானை பொதுவாக நீர் சேமிப்புக்காக பயன்படுத்தப்பட்டது. இதன் வட்டமான அடிப்பகுதி மற்றும் மெல்லிய சுவர்கள் நீர் குளிர்ச்சியாக இருக்க உதவியது.
෴
This clay pot was commonly used for water storage. Its round base and thin walls helped keep water cool.

## Material & Technique~ද්‍රව්‍ය සහ තාක්ෂණය~பொருள் & நுட்பம்

Red clay, wheel-thrown, low-temperature firing~රතු මැටි, රෝද භ්‍රමණය, අඩු උෂ්ණත්ව දැවීම~சிவப்பு களிமண், சக்கர வார்ப்பு, குறைந்த வெப்பநிலை சுடுதல்

## Dimensions~මාන~அளவுகள்

| Measurement~මිනුම~அளவீடு | Size~ප්‍රමාණය~அளவு |
|---------------------------|---------------------|
| Height~උස~உயரம்           | 32 cm               |
| Diameter~විෂ්කම්භය~விட்டம் | 28 cm               |
| Weight~බර~எடை             | 2.4 kg              |

## Provenance~සම්භවය~தோற்றம்

Excavated in 1982 from [[anuradhapura|Anuradhapura]] archaeological site.~1982 දී [[anuradhapura|අනුරාධපුර]] පුරාවිද්‍යා භූමියෙන් කැණීම් කරන ලදී.~1982 இல் [[anuradhapura|அனுராதபுர]] தொல்லியல் தளத்தில் இருந்து அகழ்வாராய்ச்சி செய்யப்பட்டது.

---

**Catalog Number:** ANP-1982-045
**Conservation Status:** Excellent
**Display Case:** Gallery 2, Section B
```

This example shows:
- Metadata tracking (project, curator, location)
- Translation status management
- Entity references for place names
- Mixed content (paragraphs, tables, metadata)
- Real-world museum workflow

---

## Best Practices

### Content Organization

1. **Use Multi Blocks for parallel content** - Conceptually equivalent text in all languages
2. **Use Mono Blocks for language-invariant content** - Code samples, numbers, universal symbols
3. **Keep block granularity consistent** - Each block should represent one semantic unit
4. **Use entity references for terminology** - Ensures consistency across languages

### Choosing the Right Format

**Use inline separator (`~`) when:**
- Content is a single line
- Each variant is ≤80 characters
- Simple content without complex formatting
- Optimizing for compact storage and version control

**Use block separator (`෴`) when:**
- Content spans multiple lines
- Any variant exceeds 80 characters
- Content includes internal formatting (bold, italic, links)
- Readability during editing is the priority

**Special cases:**
- **Headings:** Always use inline (`~`)
- **Code blocks:** Always mono (language-invariant)
- **Tables:** Inline if structure identical, block if structure differs

### Formatting Guidelines

1. **Be consistent within a document** - Use the appropriate separator for each content type
2. **Use proper indentation in lists** - 3 spaces for nested items
3. **Keep table alignment consistent** - Use same column structure across language variants when possible
4. **Use explicit empty markers** - For incomplete translations: `{{empty}}`

### Frontmatter Usage

1. **Always track status** - Essential for production workflows with multiple authors
2. **Define entities in frontmatter** - Enables reuse and consistency checking
3. **Use ISO 639-1 codes** - `si`, `ta`, `en` (not `sin`, `tam`, `eng`)
4. **Document in comments** - Add YAML comments explaining metadata structure

### Version Control Best Practices

1. **One 3md file per document** - Enables atomic commits across languages
2. **Use inline separator (`~`) for brief content** - Reduces diff noise
3. **Use block separator (`෴`) for structured content** - Clear diffs for complex content
4. **Commit all languages together** - Maintains synchronization
5. **Tag synced states** - Use git tags to mark when all languages are synchronized

### Translation Workflow

1. **Choose your source language** - Declare it first in `{{langs}}` header
   - English-first: `{{langs|en|si|ta}}`
   - Sinhala-first: `{{langs|si|ta|en}}`
   - Tamil-first: `{{langs|ta|si|en}}`

2. **Explicitly mark source if needed** - Use `status: { en: source }` to override default

3. **Mark new translations as `fuzzy`** - Until reviewed and verified

4. **Update to `synced` after review** - Confirms translation accuracy

5. **Flag source changes** - Change status to `fuzzy` when source content updates

**Example workflows:**

**English-first workflow:**
```yaml
status:
  en: source
  si: fuzzy
  ta: untranslated
```

**Sinhala-first workflow:**
```yaml
status:
  si: source
  ta: synced
  en: synced
```

### Handling Ambiguity

**Mono block ambiguity:**

Content in a single language without separators will be parsed as Mono (language-invariant). Validators should warn about potential ambiguity.

**For incomplete translations, use explicit markers:**
```
සිංහල පෙළ.~{{empty}}~{{empty}}
```

**For truly language-invariant content:**
```
This content is identical across all languages.
```

---

## Common Workflows

### Workflow 1: Museum Exhibition Labels

**Team:** Curator, translator, designer

1. **Curator writes English content** in 3md using `{{langs|en|si|ta}}`
2. **Translator adds Sinhala and Tamil** directly in the same file
3. **Curator reviews** all three languages side-by-side
4. **Designer exports to InDesign** for label design
5. **Everyone works from one file** - no version confusion

**Benefits:**
- Single source prevents translation drift
- Easy to see which labels need translation
- Updates automatically sync across all languages

### Workflow 2: Book Publishing

**Team:** Author, editor, translators, typesetter

1. **Author writes in preferred language** (e.g., Sinhala-first: `{{langs|si|ta|en}}`)
2. **Translators work in parallel** on Tamil and English versions
3. **Editor reviews and marks status** (`synced`, `fuzzy`, `needs review`)
4. **Export to Word** for final editorial review
5. **Export to InDesign** for book layout
6. **Archive 3md file** as the master source

**Benefits:**
- Parallel translation workflow speeds up production
- Clear status tracking for each language
- One master file for all editions

### Workflow 3: Website Content

**Team:** Content writer, web developer

1. **Writer creates content** in 3md
2. **Conversion tool generates** separate HTML files (si.html, ta.html, en.html)
3. **Web developer integrates** into website
4. **Content updates** by editing 3md and regenerating

**Benefits:**
- Content separate from presentation
- Easy to update all languages at once
- Future-proof plain text storage

### Workflow 4: Collaborative Document

**Team:** Multiple authors, multiple translators

1. **Use version control** (Git, Dropbox, Google Drive)
2. **Track changes** clearly with plain text diffs
3. **Assign sections** to different authors
4. **Merge work** without format conflicts
5. **Export final version** to required format

**Benefits:**
- Git-style collaboration on multilingual content
- Clear history of who changed what
- No "merge conflict" disasters from binary formats

---

## For Developers & Tool Builders

If you're building tools, parsers, or conversion utilities for 3md, see:

- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Technical implementation guide for developers
- **[ERRORS.md](ERRORS.md)** - Complete error handling and validation specifications

---

## Appendices

### Appendix A: Quick Reference Card

**File Extension:** `.3md`

**Basic Structure:**
```
---
# Optional frontmatter
---
{{langs|si|ta|en}}
# Content
```

**Separators:**
- Block: `\n෴\n` (Kunddaliya with line breaks)
- Inline: `~` (tilde)

**Common Patterns:**

| Element | Syntax |
|---------|--------|
| Heading | `# Text~Text~Text` |
| Paragraph (inline) | `Text~Text~Text` |
| Paragraph (block) | `Text\n෴\nText\n෴\nText` |
| List (inline) | `- Item~Item~Item` |
| Table (inline cells) | `\| Cell~Cell~Cell \|` |
| Code | `` `code` `` (mono) |
| Link | `[Text~Text~Text](url)` |
| Entity | `[[entity-id\|display]]` |
| Comment | `<!-- comment -->` |

**Escape Sequences:**
- `\~` → literal tilde
- `\෴` → literal Kunddaliya
- `\\` → literal backslash

### Appendix B: Format Selection Matrix

| Content Type | Single Line | ≤80 chars/variant | Complex Format | Recommended |
|--------------|-------------|-------------------|----------------|-------------|
| Heading | Yes | Yes | No | Inline (`~`) |
| Heading | Yes | No | No | Block (`෴`) |
| Paragraph | Yes | Yes | No | Inline (`~`) |
| Paragraph | No | Any | Any | Block (`෴`) |
| Paragraph | Yes | No | Any | Block (`෴`) |
| List item | Yes | Yes | No | Inline (`~`) |
| List | Any | Any | Yes | Block (`෴`) |
| Table | Any | Any | Same structure | Inline (`~`) |
| Table | Any | Any | Diff structure | Block (`෴`) |
| Blockquote | Any | Any | Any | Block (`෴`) |
| Code | Any | Any | Any | Mono (no sep) |

### Appendix C: Common Patterns

**Pattern 1: Technical documentation with code**
```
{{langs|en|si|ta}}

# Function Reference~ශ්‍රිත යොමුව~செயல்பாடு குறிப்பு

The `calculate()` function performs arithmetic operations.~`calculate()` ශ්‍රිතය ගණිතමය මෙහෙයුම් සිදු කරයි.~`calculate()` செயல்பாடு கணித செயல்பாடுகளை செய்கிறது.

```python
def calculate(a, b, operation):
    return operation(a, b)
```

Returns the result of applying the operation.~මෙහෙයුම යෙදීමේ ප්‍රතිඵලය ප්‍රතිදානය කරයි.~செயல்பாட்டைப் பயன்படுத்துவதன் முடிவை திருப்பி அனுப்புகிறது.
```

**Pattern 2: Product documentation with tables**
```
{{langs|en|si|ta}}

# Pricing Plans~මිල ගණන් සැලසුම්~விலை திட்டங்கள்

| Plan~සැලැස්ම~திட்டம் | Users~පරිශීලකයින්~பயனர்கள் | Price~මිල~விலை |
|----------------------|---------------------------|----------------|
| Basic~මූලික~அடிப்படை | 1-5 | $10/mo |
| Pro~වෘත්තීය~நிபுணர் | 6-20 | $25/mo |
```

**Pattern 3: Content with entities**
```
---
entities:
  bawa:
    primary: "Geoffrey Bawa"
    si: "ජෙෆ්රි බාවා"
    ta: "ஜெஃப்ரி பாவா"
---
{{langs|si|ta|en}}

[[bawa|ජෙෆ්රි බාවා]] ශ්‍රී ලංකාවේ ප්‍රසිද්ධ ස්ථාපත්‍ය විද්‍යාඥයෙකි.
෴
[[bawa|ஜெஃப்ரி பாவா]] இலங்கையின் புகழ்பெற்ற கட்டடக் கலைஞர்.
෴
[[bawa]] is Sri Lanka's renowned architect.
```

### Appendix D: Migration from Standard Markdown

**Step 1: Add language header**
```diff
+ {{langs|en|si|ta}}
+
  # My Document
```

**Step 2: Convert headings to inline format**
```diff
- # Introduction
+ # Introduction~හැඳින්වීම~அறிமுகம்
```

**Step 3: Convert paragraphs**

For short paragraphs:
```diff
- This is content.
+ This is content.~මෙය අන්තර්ගතයයි.~இது உள்ளடக்கம்.
```

For longer paragraphs:
```diff
- This is a longer paragraph with multiple sentences.
+ This is a longer paragraph with multiple sentences.
+ ෴
+ මෙය වාක්‍ය කිහිපයක් සහිත දිගු ඡේදයකි.
+ ෴
+ இது பல வாக்கியங்களைக் கொண்ட நீண்ட பத்தி.
```

**Step 4: Add frontmatter (optional)**
```diff
+ ---
+ status:
+   en: source
+   si: fuzzy
+   ta: untranslated
+ ---
  {{langs|en|si|ta}}
```

---

## File Extension

3md files should use the `.3md` extension:

```
document.3md
chapter-01.3md
index.3md
```

This distinguishes 3md from standard markdown (`.md`) and other MLMD variants (`.mlmd`).

---

## License

This specification is released under **CC BY 4.0** for use by the TriText project and the broader multilingual content management community.

---

## Maintainers

**Project:** [TriText](https://github.com/mooniak/tritext)
**Specification:** [github.com/mooniak/3md](https://github.com/mooniak/3md)
**Contact:** [Issues](https://github.com/mooniak/3md/issues)

---

**Document Version:** 0.1.0
**Last Updated:** 2025-12-29
**Contributors:** Pathum Egodawatta, TriText Team
