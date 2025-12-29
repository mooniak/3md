# 3md Playground Usage Guide

## Overview

The 3md Playground is a web-based tool for testing and demonstrating trilingual markdown. It shows how 3md content is parsed into separate Sinhala, Tamil, and English outputs in real-time.

## Using the Playground

### 1. Load an Example

Click the **Example** dropdown at the top of the editor panel and select one:

- **Minimal** - Simplest possible 3md file
- **Simple Inline** - Inline separators with headings and lists
- **Block Separator** - Multi-line content with ෴ separator
- **Mixed** - Combination of inline and block separators
- **Colombo** - Real-world example about Colombo city

### 2. Edit Content

Type or paste 3md content directly into the editor. The outputs update automatically as you type (with a 300ms delay).

### 3. View Outputs

Each language has two view modes:

**Preview** - Rendered HTML output
- Shows how the content looks when published
- Formatting, headings, lists, bold/italic all rendered

**Markdown** - Raw markdown output
- Shows the actual markdown generated for each language
- Useful for debugging or copying to other markdown tools

Click the **PREVIEW** or **MARKDOWN** tabs to switch views for each language.

## 3md Syntax Quick Reference

### Language Declaration

Every 3md file starts with:
```
{{langs|si|ta|en}}
```

You can change the order: `{{langs|en|si|ta}}` or `{{langs|ta|si|en}}`

### Inline Separator (~)

Use `~` for short, single-line content:

```
හෙලෝ~வணக்கம்~Hello
```

Works in headings, paragraphs, list items:

```
# හැඳින්වීම~அறிமுகம~Introduction

මෙය වාක්‍යයකි.~இது வாக்கியம்.~This is a sentence.

- පළමු~முதல்~First
```

### Block Separator (෴)

Use `෴` for multi-line content:

```
මෙහි රේඛා කිහිපයක් ඇත.
දෙවන රේඛය මෙයයි.
තෙවන රේඛය මෙයයි.
෴
இதில் பல வரிகள் உள்ளன.
இரண்டாவது வரி இதுதான்.
மூன்றாவது வரி இதுதான்.
෴
It has multiple lines.
This is the second line.
This is the third line.
```

### Markdown Formatting

All standard markdown works:

```
**bold text~தடித்த உரை~bold text**

*italic text~சாய்வு உரை~italic text*

[link text~இணைப்பு உரை~link text](https://example.com)
```

## Tips

1. **Font size** - Editor uses 14px monospace for comfortable editing
2. **Live updates** - Changes appear after 300ms of typing
3. **All languages update together** - All three outputs process in parallel
4. **Examples are editable** - Load an example and modify it
5. **Black & white design** - Minimal distraction, maximum focus

## Common Patterns

### Museum Label

```
{{langs|si|ta|en}}

# භාජනය~பானை~Pot

මෙම මැටි භාජනය අනුරාධපුරයේ සොයා ගන්නා ලදී.
෴
இந்த மண் பானை அனுராதபுரத்தில் கண்டுபிடிக்கப்பட்டது.
෴
This clay pot was found in Anuradhapura.

**දිනය~தேதி~Date:** ක්‍රි.ව. 5 වන සියවස~கி.பி. 5ஆம் நூற்றாண்டு~5th century CE
```

### Website Content

```
{{langs|en|si|ta}}

# About Us~අප ගැන~எங்களை பற்றி

We are a cultural organization.~අපි සංස්කෘතික සංවිධානයකි.~நாங்கள் ஒரு கலாச்சார அமைப்பு.
```

### Newsletter

```
{{langs|si|ta|en}}

## ප්‍රජා පුවත්~சமூக செய்திகள்~Community News

පුස්තකාලය විවෘත විය.~நூலகம் திறக்கப்பட்டது.~Library opened.
```

## Build Process

If you're maintaining the playground:

```bash
# Install dependencies
npm install

# Build once
npm run build

# Watch for changes
npm run watch
```

The build script reads examples from `../spec/examples/` and injects them into the HTML file.
