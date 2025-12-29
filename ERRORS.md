# 3md Error Handling and Validation Guide

**Version:** 0.1.0
**Date:** 2025-12-29

---

## Validation Philosophy

3md adopts a **fail-fast** philosophy: parsers should detect errors early and provide clear, actionable error messages to help authors fix issues quickly.

### Core Principles

- **Strict validation:** Catch errors during parsing, not rendering
- **Clear error messages:** Include line numbers, context, and suggested fixes
- **Helpful feedback:** Explain what's wrong and how to correct it
- **Non-fatal warnings:** Alert authors to potential issues without blocking

---

## Common Error Scenarios

### 1. Mismatched Variant Count

```
{{langs|si|ta|en}}

English text~සිංහල පෙළ
```

**Error:** `Multi-block content must have exactly 3 variants (found 2)`

**Line:** 3, Column: 1

**Context:**
```
English text~සිංහල පෙළ
^
```

**Fix:** Add the missing third variant:
```
English text~සිංහල පෙළ~தமிழ் உரை
```

---

### 2. Missing Language Declaration

```
# Heading without {{langs}} declaration

Content here.
```

**Error:** `Document must begin with language declaration: {{langs|si|ta|en}}`

**Fix:** Add language declaration at the start (after optional frontmatter):
```
{{langs|si|ta|en}}

# Heading~தலைப்பு~සිරස්තලය

Content here.
```

---

### 3. Invalid Language Codes

```
{{langs|sin|tam|eng}}
```

**Error:** `Invalid language codes. Use ISO 639-1: 'si', 'ta', 'en' (not 'sin', 'tam', 'eng')`

**Fix:** Use correct ISO 639-1 codes:
```
{{langs|si|ta|en}}
```

---

### 4. Malformed YAML Frontmatter

```yaml
---
project:
  title: "Document Title
  # Missing closing quote
---
```

**Error:** `Invalid YAML frontmatter at line 3: Unclosed quoted string`

**Fix:** Close the quoted string:
```yaml
---
project:
  title: "Document Title"
---
```

---

### 5. Unclosed Entity Reference

```
[[Geoffrey Bawa|ජෙෆ්රි බාවා
```

**Error:** `Unclosed entity reference starting at line 1, column 1. Missing closing ']]'`

**Fix:** Close the entity reference:
```
[[Geoffrey Bawa|ජෙෆ්රි බාවා]]
```

---

### 6. Mixed Separator Usage

```
{{langs|si|ta|en}}

Line with inline~separator
෴
Block content here
```

**Error:** `Ambiguous separator usage: found both inline (~) and block (\n෴\n) separators in same block`

**Fix:** Use consistent separator for the block:

Option 1 - Inline only:
```
Line with inline~separator~மாறுபாடு
```

Option 2 - Block only:
```
Line with content
෴
வரி உள்ளடக்கம்
෴
Block content here
```

---

## Validation Rules

### MUST Validate (Fatal Errors)

Parsers **must** validate:

1. **Language declaration present:** Every document starts with `{{langs|...}}`
2. **Valid language codes:** Only `si`, `ta`, `en` in any order
3. **Variant count matches:** Multi-blocks have exactly 3 variants
4. **Language order consistency:** Same order used throughout document
5. **YAML syntax:** Frontmatter is valid YAML (if present)
6. **Entity references closed:** All `[[...]]` have matching closing `]]`

### SHOULD Validate (Recommended Warnings)

Parsers **should** validate:

7. **Entity definitions exist:** Referenced entities are defined in frontmatter
8. **No empty variants:** Warn about `text~~text` (empty middle variant)
9. **Consistent separator usage:** Don't mix `~` and `\n෴\n` in same logical block
10. **Status tracking:** If frontmatter has `status`, all three languages should have values

---

## Validation Warnings (Non-Fatal)

### Warning 1: Potential Mono Block Ambiguity

```
{{langs|si|ta|en}}

සිංහල පෙළ පමණි.
```

**Warning:** `Content appears to be in a single language (Sinhala) without separators. If this is intended as multilingual, add variants. If language-invariant, no action needed.`

**Suggestion:** Use Unicode script detection to identify likely single-language content.

---

### Warning 2: Empty Variant

```
English~~தமிழ்
```

**Warning:** `Empty variant detected (position 2 of 3). Consider using explicit placeholder or omitting if intentional.`

---

### Warning 3: Unused Entity Definitions

```yaml
entities:
  gb-001:
    primary: "Geoffrey Bawa"
  unused-entity:
    primary: "Never Referenced"
```

**Warning:** `Entity 'unused-entity' defined in frontmatter but never referenced in document.`

---

### Warning 4: Missing Entity Definition

```
[[unknown-entity]]
```

**Warning:** `Entity reference 'unknown-entity' not defined in frontmatter. Link will use default /term/unknown-entity URL.`

---

## Recommended Error Message Format

```
[ERROR] <Error Type> at line <N>, column <M>

<Context showing problematic line with caret (^) indicator>

<Clear explanation of what's wrong>

Suggested fix:
<Code example showing correct syntax>
```

### Example Error Output

```
[ERROR] Mismatched variant count at line 5, column 1

English text~සිංහල පෙළ
^

Multi-block content must have exactly 3 variants to match language declaration {{langs|si|ta|en}}.
Found 2 variants, expected 3.

Suggested fix:
English text~සිංහල පෙළ~தமிழ் உரை
```

---

## Error Categories

Parsers should categorize errors for better handling:

| Category | Severity | Examples |
|----------|----------|----------|
| **Syntax Errors** | Fatal | Missing `{{langs}}`, invalid YAML, unclosed entities |
| **Validation Errors** | Fatal | Mismatched variant count, invalid language codes |
| **Structural Warnings** | Warning | Mono block ambiguity, empty variants |
| **Reference Warnings** | Warning | Missing entity definitions, unused entities |

**Fatal errors** prevent document parsing. **Warnings** allow parsing to continue but alert authors to potential issues.

---

## Implementation Notes

### Unicode Script Detection

For detecting mono block ambiguity, use Unicode script detection:

```typescript
function detectUnicodeScripts(content: string): Set<string> {
  const scripts = new Set<string>();

  for (const char of content) {
    const code = char.codePointAt(0);
    if (code) {
      // Sinhala: U+0D80–U+0DFF
      if (code >= 0x0D80 && code <= 0x0DFF) scripts.add('Sinhala');
      // Tamil: U+0B80–U+0BFF
      else if (code >= 0x0B80 && code <= 0x0BFF) scripts.add('Tamil');
      // Latin: U+0000–U+007F, U+0080–U+00FF
      else if (code <= 0x00FF) scripts.add('Latin');
    }
  }

  return scripts;
}

function detectMonoAmbiguity(content: string): boolean {
  const scripts = detectUnicodeScripts(content);

  // Warn if appears to be single-language
  if (scripts.size === 1 && ['Sinhala', 'Tamil', 'Latin'].includes(
    scripts.values().next().value
  )) {
    return true; // Potentially ambiguous
  }

  return false;
}
```

### Error Recovery

When possible, parsers should attempt recovery:

- **Empty variants:** Treat as `{{empty}}` placeholder
- **Extra variants:** Ignore beyond expected count with warning
- **Missing variants:** Pad with `{{empty}}` with error
- **Invalid escape sequences:** Treat backslash as literal

---

**Last Updated:** 2025-12-29
**Maintainers:** TriText Team
