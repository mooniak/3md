# 3md Error Handling and Validation Guide

**Version:** 0.1.0
**Date:** 2025-12-29
**Related:** See [SPEC.md §8.4](SPEC.md#84-error-handling) for normative requirements

---

## Validation Philosophy

3md adopts a **fail-fast** philosophy: parsers should detect errors early and provide clear, actionable error messages to help authors fix issues quickly.

### Core Principles

- **Strict validation:** Catch errors during parsing, not rendering
- **Clear error messages:** Include line numbers, context, and suggested fixes
- **Helpful feedback:** Explain what's wrong and how to correct it
- **Non-fatal warnings:** Alert authors to potential issues without blocking

---

## Error Codes

All errors are assigned codes for consistent identification and handling:

| Code | Category | Severity | Error Type |
|------|----------|----------|------------|
| E001 | Syntax | Fatal | Missing Language Declaration |
| E002 | Syntax | Fatal | Invalid Language Codes |
| E003 | Syntax | Fatal | Wrong Language Count |
| E004 | Syntax | Fatal | Whitespace in Language Declaration |
| E005 | Validation | Fatal | Mismatched Variant Count |
| E006 | Validation | Fatal | Language Order Inconsistency |
| E007 | Validation | Fatal | Mixed Separators |
| E008 | Syntax | Fatal | Malformed YAML Frontmatter |
| E009 | Syntax | Fatal | Unclosed Entity Reference |
| E010 | Security | Fatal | Unsafe YAML Construct |
| E011 | Security | Fatal | Document Size Exceeded |
| E012 | Validation | Fatal | Invalid Status Value |
| E013 | Syntax | Fatal | Reference-Style Links Not Supported |
| W001 | Warning | Non-Fatal | Potential Mono Block Ambiguity |
| W002 | Warning | Non-Fatal | Empty Variant Without Marker |
| W003 | Warning | Non-Fatal | Undefined Entity Reference |
| W004 | Warning | Non-Fatal | Unused Entity Definition |
| S001 | Style | Informational | Line Too Long |
| S002 | Style | Informational | Inconsistent Separator Usage |

---

## Critical Errors (Parsing MUST Fail)

### E001: Missing Language Declaration

**Defined in:** SPEC.md §2.3

**Invalid Example:**
```
# Heading without {{langs}} declaration

Content here.
```

**Output:**
```
[ERROR E001] Missing language declaration at line 1

# Heading without {{langs}} declaration
^

Every 3md document must begin with a language declaration (after optional frontmatter).

Suggested fix:
{{langs|si|ta|en}}

# Heading~தலைப்பு~සිරස්තලය

Content here.
```

**Conformance:** Parsers MUST reject (SPEC.md §2.3)

---

### E002: Invalid Language Codes

**Defined in:** SPEC.md §2.3

**Invalid Example:**
```
{{langs|sin|tam|eng}}
```

**Output:**
```
[ERROR E002] Invalid language codes at line 1

{{langs|sin|tam|eng}}
        ^^^

Invalid language codes. Use ISO 639-1 codes: 'si', 'ta', 'en'
Found: 'sin', 'tam', 'eng'

Suggested fix:
{{langs|si|ta|en}}
```

**Conformance:** Parsers MUST reject (SPEC.md §2.3)

**Implementation:**
```python
VALID_LANG_CODES = {'si', 'ta', 'en'}

def validate_language_codes(codes: list[str]) -> None:
    invalid = set(codes) - VALID_LANG_CODES
    if invalid:
        raise InvalidLanguageCodesError(
            f"Invalid codes: {', '.join(invalid)}"
        )
```

---

### E003: Wrong Language Count

**Defined in:** SPEC.md §2.3

**Invalid Example 1 (Too Few):**
```
{{langs|si|en}}
```

**Output:**
```
[ERROR E003] Wrong language count at line 1

{{langs|si|en}}
              ^

3md requires exactly 3 languages. Found 2.

Suggested fix:
{{langs|si|ta|en}}
```

**Invalid Example 2 (Too Many):**
```
{{langs|si|ta|en|fr}}
```

**Output:**
```
[ERROR E003] Wrong language count at line 1

{{langs|si|ta|en|fr}}
                 ^^^

3md requires exactly 3 languages. Found 4.

Suggested fix:
{{langs|si|ta|en}}
```

**Conformance:** Parsers MUST reject (SPEC.md §2.3)

---

### E004: Whitespace in Language Declaration

**Defined in:** SPEC.md §2.3

**Invalid Example 1 (Around Separators):**
```
{{langs|si | ta | en}}
```

**Output:**
```
[ERROR E004] Invalid whitespace in language declaration at line 1

{{langs|si | ta | en}}
           ^    ^

Language declaration must not contain whitespace around separators.

Suggested fix:
{{langs|si|ta|en}}
```

**Invalid Example 2 (Inside Braces):**
```
{{ langs|si|ta|en }}
```

**Output:**
```
[ERROR E004] Invalid whitespace in language declaration at line 1

{{ langs|si|ta|en }}
 ^                 ^

Language declaration must not contain whitespace inside braces.

Suggested fix:
{{langs|si|ta|en}}
```

**Conformance:** Parsers MUST reject (SPEC.md §2.3)

---

### E005: Mismatched Variant Count

**Defined in:** SPEC.md §8.2

**Invalid Example:**
```
{{langs|si|ta|en}}

සිංහල පෙළ~தமிழ் உரை
```

**Output:**
```
[ERROR E005] Mismatched variant count at line 3

සිංහල පෙළ~தமிழ் உரை
^

Multi Block must have exactly 3 variants to match language declaration.
Found 2 variants, expected 3 (si, ta, en).

Suggested fix (option 1 - add missing variant):
සිංහල පෙළ~தமிழ் உரை~English text

Suggested fix (option 2 - use {{empty}} marker):
සිංහල පෙළ~தமிழ் உரை~{{empty}}
```

**Conformance:** Parsers MUST reject (SPEC.md §8.2)

**Implementation:**
```python
def validate_variant_count(variants: list[str], langs: list[str]) -> None:
    if len(variants) != len(langs):
        raise VariantCountError(
            f"Found {len(variants)} variants, expected {len(langs)} "
            f"({', '.join(langs)})"
        )
```

---

### E006: Language Order Inconsistency

**Defined in:** SPEC.md §2.3

**Invalid Example:**
```
{{langs|si|ta|en}}

English text~සිංහල පෙළ~தமிழ் உரை
```

**Output:**
```
[ERROR E006] Language order inconsistency at line 3

English text~සිංහල පෙළ~தமிழ் உரை
^

Variant order must match language declaration order.
Expected order: si, ta, en
Detected order: en, si, ta (based on Unicode script detection)

Suggested fix:
සිංහල පෙළ~தமிழ் உரை~English text
```

**Conformance:** Parsers MUST reject if order can be detected (SPEC.md §2.3)

**Note:** This error may not be detectable for all content (e.g., numerical data, mixed-script content). Parsers SHOULD attempt detection using Unicode script analysis.

---

### E007: Mixed Separators

**Defined in:** SPEC.md §4.4

**Invalid Example:**
```
{{langs|si|ta|en}}

සිංහල පෙළ~தமிழ் உரை
෴
English text
```

**Output:**
```
[ERROR E007] Mixed separators in same Multi Block at line 3

සිංහල පෙළ~தமிழ் உரை
              ^
෴
^

Cannot use both inline (~) and block (\n෴\n) separators in same Multi Block.

Suggested fix (option 1 - use inline only):
සිංහල පෙළ~தமிழ் உரை~English text

Suggested fix (option 2 - use block only):
සිංහල පෙළ
෴
தமிழ் உரை
෴
English text
```

**Conformance:** Parsers MUST reject (SPEC.md §4.4)

---

### E008: Malformed YAML Frontmatter

**Defined in:** SPEC.md §2.2

**Invalid Example:**
```yaml
---
project:
  title: "Document Title
  # Missing closing quote
---
```

**Output:**
```
[ERROR E008] Malformed YAML frontmatter at line 3

  title: "Document Title
         ^

Invalid YAML syntax: Unclosed quoted string

Suggested fix:
---
project:
  title: "Document Title"
---
```

**Conformance:** Parsers MUST reject (SPEC.md §2.2)

---

### E009: Unclosed Entity Reference

**Defined in:** SPEC.md §5.8

**Invalid Example:**
```
[[Geoffrey Bawa|ජෙෆ්රි බාවා
```

**Output:**
```
[ERROR E009] Unclosed entity reference at line 1

[[Geoffrey Bawa|ජෙෆ්රි බාවා
^

Entity reference missing closing ']]'

Suggested fix:
[[Geoffrey Bawa|ජෙෆ්රි බාවා]]
```

**Conformance:** Parsers MUST reject (SPEC.md §5.8)

---

### E010: Unsafe YAML Construct

**Defined in:** SPEC.md §11.1

**Invalid Example:**
```yaml
---
!!python/object/apply:os.system
args: ['rm -rf /']
---
```

**Output:**
```
[ERROR E010] Unsafe YAML construct detected at line 2

!!python/object/apply:os.system
^

YAML frontmatter contains potentially unsafe construct.
Only basic YAML types are allowed (strings, numbers, lists, maps).

Security risk: Code execution vulnerability
```

**Conformance:** Parsers MUST reject (SPEC.md §11.1)

**Implementation:**
```python
import yaml

def safe_load_frontmatter(yaml_text: str) -> dict:
    """
    Load YAML safely, rejecting dangerous constructs.
    """
    try:
        # Use safe_load, not load
        return yaml.safe_load(yaml_text)
    except yaml.YAMLError as e:
        raise UnsafeYAMLError(f"Invalid YAML: {e}")
```

---

### E011: Document Size Exceeded

**Defined in:** SPEC.md §11.2

**Invalid Example:**
```
# (52.4 MB document)
```

**Output:**
```
[ERROR E011] Document size exceeded at line 1

Document size: 52.4 MB
Maximum allowed: 10 MB

Large documents may cause performance issues or denial-of-service.
Consider splitting into multiple files.
```

**Conformance:** Parsers SHOULD implement size limits (SPEC.md §11.2)

**Recommended Limits:**
- Document size: 10 MB
- Block depth: 100 levels
- Variant length: 1 MB

---

### E012: Invalid Status Value

**Defined in:** SPEC.md §7.2

**Invalid Example:**
```yaml
---
status:
  si: completed  # Invalid
  ta: synced
  en: source
---
```

**Output:**
```
[ERROR E012] Invalid status value at line 3

  si: completed
      ^^^^^^^^^

Invalid status value 'completed'.
Valid values: source, synced, fuzzy, untranslated, machine

Suggested fix:
status:
  si: synced
  ta: synced
  en: source
```

**Conformance:** Parsers MUST reject (SPEC.md §7.2)

**Valid status values:**
- `source`: Authoritative content
- `synced`: Translation verified
- `fuzzy`: Needs review
- `untranslated`: Not translated
- `machine`: Machine-translated

---

### E013: Reference-Style Links Not Supported

**Defined in:** SPEC.md §5.7.5

**Invalid Example:**
```
{{langs|si|ta|en}}

See [documentation][ref] for details.

[ref]: https://example.com
```

**Output:**
```
[ERROR E013] Reference-style links not supported at line 3

See [documentation][ref] for details.
                   ^^^^^

Reference-style links ([text][ref] with [ref]: url) are not supported in 3md
due to syntax conflict with entity references [[entity-id]].

Suggested fix (option 1 - inline link):
See [documentation](https://example.com) for details.

Suggested fix (option 2 - entity reference):
# Define in frontmatter:
entities:
  docs:
    primary: "Documentation"
    url: "https://example.com"

# Use in content:
See [[docs|documentation]] for details.
```

**Conformance:** Parsers MUST reject (SPEC.md §5.7.5)

---

## Warnings (Parsing Succeeds, Review Needed)

### W001: Potential Mono Block Ambiguity

**Defined in:** SPEC.md §3.3

**Example:**
```
{{langs|si|ta|en}}

සිංහල පෙළ පමණි.
```

**Output:**
```
[WARNING W001] Potential Mono Block ambiguity at line 3

සිංහල පෙළ පමණි.
^

Content appears to be in a single language (Sinhala) without separators.
This will be parsed as Mono Block (language-invariant).

If this is intended as:
- Language-invariant content → No action needed
- Incomplete multilingual content → Add variants or use {{empty}}

Suggested fix for incomplete translation:
සිංහල පෙළ පමණි.~{{empty}}~{{empty}}
```

**Conformance:** Parsers SHOULD warn (SPEC.md §8.4)

**Implementation:**
```python
def detect_script(text: str) -> str:
    """
    Detect primary Unicode script in text.
    """
    for char in text:
        code = ord(char)
        if 0x0D80 <= code <= 0x0DFF:
            return 'Sinhala'
        elif 0x0B80 <= code <= 0x0BFF:
            return 'Tamil'
        elif code <= 0x00FF:
            return 'Latin'
    return 'Unknown'

def check_mono_ambiguity(content: str) -> bool:
    """
    Check if mono block appears to be single-language.
    """
    scripts = set()
    for char in content:
        script = detect_script(char)
        if script in {'Sinhala', 'Tamil', 'Latin'}:
            scripts.add(script)

    return len(scripts) == 1
```

---

### W002: Empty Variant Without Marker

**Defined in:** SPEC.md §8.3

**Example:**
```
{{langs|si|ta|en}}

සිංහල පෙළ.~~English text.
```

**Output:**
```
[WARNING W002] Empty variant without {{empty}} marker at line 3

සිංහල පෙළ.~~English text.
              ^

Empty variant detected (position 2 of 3).
Consider using explicit {{empty}} marker for clarity.

Suggested fix:
සිංහල පෙළ.~{{empty}}~English text.
```

**Conformance:** Parsers SHOULD warn (SPEC.md §8.4)

**Note:** See [The {{empty}} Marker](#the-empty-marker) section for details.

---

### W003: Undefined Entity Reference

**Defined in:** SPEC.md §5.8

**Example:**
```
{{langs|si|ta|en}}

[[unknown-entity]] is referenced here.~[[unknown-entity]] සඳහන් කර ඇත.~[[unknown-entity]] குறிப்பிடப்பட்டுள்ளது.
```

**Output:**
```
[WARNING W003] Undefined entity reference at line 3

[[unknown-entity]] is referenced here.
  ^^^^^^^^^^^^^^

Entity 'unknown-entity' not defined in frontmatter.
Link will use default /term/unknown-entity URL.

Suggested fix - add to frontmatter:
---
entities:
  unknown-entity:
    primary: "Entity Name"
    si: "ආයතන නම"
    ta: "நிறுவன பெயர்"
---
```

**Conformance:** Parsers SHOULD warn (SPEC.md §8.4)

---

### W004: Unused Entity Definition

**Defined in:** SPEC.md §7.3

**Example:**
```yaml
---
entities:
  bawa:
    primary: "Geoffrey Bawa"
    si: "ජෙෆ්රි බාවා"
    ta: "ஜெஃப்ரி பாவா"
  unused-entity:
    primary: "Never Referenced"
---
{{langs|si|ta|en}}

[[bawa]] is a renowned architect.
```

**Output:**
```
[WARNING W004] Unused entity definition in frontmatter

entities:
  unused-entity:
    ^^^^^^^^^^^^^

Entity 'unused-entity' defined in frontmatter but never referenced in document.
```

**Conformance:** Parsers SHOULD warn (SPEC.md §8.4)

---

## Style Suggestions (Informational)

### S001: Line Too Long

**Example:**
```
{{langs|si|ta|en}}

This is an extremely long line that exceeds the recommended 120 character limit which makes it harder to read and edit in most text editors.~මෙය නිර්දේශිත අක්ෂර 120 සීමාව ඉක්මවන ඉතා දිගු රේඛාවකි.~இது பரிந்துரைக்கப்பட்ட 120 எழுத்துக்கு மேல் செல்லும் மிக நீண்ட வரி.
```

**Output:**
```
[STYLE S001] Line exceeds 120 characters at line 3

Length: 287 characters
Recommended: ≤120 characters

Consider breaking into multiple lines or using block format.

Suggested fix (use block format):
This is an extremely long line that exceeds the recommended
120 character limit which makes it harder to read and edit
in most text editors.
෴
මෙය නිර්දේශිත අක්ෂර 120 සීමාව ඉක්මවන ඉතා දිගු රේඛාවකි.
෴
இது பரிந்துரைக்கப்பட்ட 120 எழுத்துக்கு மேல் செல்லும் மிக நீண்ட வரி.
```

**Conformance:** Parsers MAY suggest (informational only)

---

### S002: Inconsistent Separator Usage

**Example:**
```
{{langs|si|ta|en}}

# Heading~தலைப்பு~සිරස්තලය

පළමු ඡේදය.
෴
முதல் பத்தி.
෴
First paragraph.

දෙවන ඡේදය.~இரண்டாவது பத்தி.~Second paragraph.
```

**Output:**
```
[STYLE S002] Inconsistent separator usage

Document uses both inline (~) and block (\n෴\n) separators for similar content types.

Line 3: Inline separator for heading
Line 5: Block separator for paragraph
Line 11: Inline separator for paragraph

Consider using consistent separator style throughout document.
```

**Conformance:** Parsers MAY suggest (informational only)

---

## The {{empty}} Marker

### What is {{empty}}?

The `{{empty}}` marker is a special placeholder that indicates **intentionally missing content** in a Multi Block variant.

**Purpose:**
- Makes incomplete translations explicit
- Distinguishes from truly language-invariant (Mono Block) content
- Helps parsers and validators understand author intent

### When to Use {{empty}}

Use `{{empty}}` when:

1. **Translation is pending:**
   ```
   සිංහල පෙළ.~{{empty}}~English text.
   ```
   (Tamil translation not yet available)

2. **Content doesn't apply in a language:**
   ```
   Cultural reference specific to Sri Lanka.~{{empty}}~{{empty}}
   ```
   (Only meaningful in Sinhala context)

3. **Placeholder for future content:**
   ```
   {{empty}}~{{empty}}~Draft English version (translations pending)
   ```

### Valid {{empty}} Syntax

**Inline format:**
```
{{langs|si|ta|en}}

Content 1~{{empty}}~Content 3
සිංහල පෙළ.~தமிழ் உரை~{{empty}}
```

**Block format:**
```
{{langs|si|ta|en}}

Content in first language
෴
{{empty}}
෴
Content in third language
```

### Invalid Syntax (Will Trigger W002)

**Empty variant without marker:**
```
Content 1~~Content 3    # Warning: middle variant empty
සිංහල පෙළ.~தமிழ் உரை~   # Warning: trailing empty
```

**Should be:**
```
Content 1~{{empty}}~Content 3
සිංහල පෙළ.~தமிழ் உரை~{{empty}}
```

### How Parsers Should Handle {{empty}}

**Parsing:**
1. Recognize `{{empty}}` as special marker
2. Count as valid variant (satisfies variant count requirement)
3. Do not emit W002 warning for explicit `{{empty}}`

**Rendering:**
```python
def render_variant(content: str, lang: str) -> str:
    """
    Render a variant, handling {{empty}} marker.
    """
    if content.strip() == '{{empty}}':
        return ''  # Render as empty content
    return render_markdown(content)
```

**Output:**
- HTML: Empty element or skip rendering
- Per-language Markdown: Empty line or omit
- JSON AST: `null` or empty string

**Example:**
```python
# Input
variants = {
    'si': 'සිංහල පෙළ',
    'ta': '{{empty}}',
    'en': 'English text'
}

# HTML output
<p lang="si">සිංහල පෙළ</p>
<!-- ta: empty, skipped -->
<p lang="en">English text</p>

# JSON output
{
  "si": "සිංහල පෙළ",
  "ta": null,
  "en": "English text"
}
```

---

## Conformance Requirements

Based on SPEC.md §10 and RFC 2119:

### Parsers MUST (Critical Requirements)

1. **Reject documents with critical errors:**
   - All E001-E013 errors MUST cause parsing to fail
   - Provide clear error messages with line numbers
   - Include context (surrounding lines) and caret indicators

2. **Validate core requirements:**
   - Language declaration present and valid (E001, E002)
   - Exactly 3 languages (E003)
   - No whitespace in declaration (E004)
   - Variant count matches declaration (E005)
   - Valid YAML frontmatter if present (E008)

3. **Provide helpful feedback:**
   - Suggest fixes for common errors
   - Include error codes for programmatic handling
   - Explain what's wrong and why

### Parsers SHOULD (Recommended)

1. **Emit warnings for non-fatal issues:**
   - Potential Mono Block ambiguity (W001)
   - Empty variants without `{{empty}}` marker (W002)
   - Undefined entity references (W003)
   - Unused entity definitions (W004)

2. **Implement security checks:**
   - Detect unsafe YAML constructs (E010)
   - Enforce document size limits (E011)
   - Validate frontmatter schema (E012)

3. **Use Unicode script detection:**
   - For W001 (Mono Block ambiguity detection)
   - For E006 (language order validation, when possible)

4. **Support {{empty}} marker:**
   - Recognize as valid placeholder
   - Render appropriately in output
   - Don't warn when used explicitly

### Parsers MAY (Optional)

1. **Provide style suggestions:**
   - Line length recommendations (S001)
   - Consistent separator usage (S002)
   - Formatting improvements

2. **Implement error recovery:**
   - Attempt to parse despite errors (with warnings)
   - Suggest automatic fixes
   - Generate partial output

3. **Enhanced validation:**
   - Check entity reference consistency
   - Validate URL formats
   - Detect content duplication

---

## Recommended Error Message Format

All error messages SHOULD follow this template for consistency:

```
[LEVEL CODE] Error description at line N[, column M]

<code showing problematic line(s)>
<caret indicator (^) pointing to issue>

<Clear explanation of what's wrong>

<Suggested fix (if applicable):>
<corrected code example>
```

**Levels:**
- `ERROR` - Fatal errors (E001-E013)
- `WARNING` - Non-fatal warnings (W001-W004)
- `STYLE` - Style suggestions (S001-S002)

**Example:**
```
[ERROR E005] Mismatched variant count at line 3

සිංහල පෙළ~தமிழ் உரை
^

Multi Block must have exactly 3 variants to match language declaration.
Found 2 variants, expected 3 (si, ta, en).

Suggested fix:
සිංහල පෙළ~தமிழ் உரை~English text
```

---

## Implementation Notes

### Error Recovery Strategies

When parsers encounter errors, they MAY attempt recovery:

**Empty variants:**
```python
if variant == '':
    variant = '{{empty}}'  # Auto-insert marker
    emit_warning(W002)
```

**Extra variants:**
```python
if len(variants) > len(langs):
    variants = variants[:len(langs)]  # Truncate with warning
    emit_warning("Extra variants ignored")
```

**Missing variants:**
```python
while len(variants) < len(langs):
    variants.append('{{empty}}')  # Pad with warning
    emit_error(E005)
```

### Unicode Script Detection

For W001 and E006, use Unicode ranges:

```python
def get_unicode_script(char: str) -> str:
    """
    Detect Unicode script for a character.
    """
    code = ord(char)

    # Sinhala: U+0D80–U+0DFF
    if 0x0D80 <= code <= 0x0DFF:
        return 'Sinhala'

    # Tamil: U+0B80–U+0BFF
    elif 0x0B80 <= code <= 0x0BFF:
        return 'Tamil'

    # Latin: Basic + Latin-1 Supplement
    elif code <= 0x00FF:
        return 'Latin'

    # Common/Unknown
    else:
        return 'Common'

def detect_primary_script(text: str) -> str:
    """
    Detect primary script in text block.
    """
    script_counts = {}

    for char in text:
        if not char.isspace():
            script = get_unicode_script(char)
            script_counts[script] = script_counts.get(script, 0) + 1

    # Return most common non-Common script
    if script_counts:
        return max(script_counts.items(), key=lambda x: x[1])[0]

    return 'Unknown'
```

### Error Severity Mapping

```typescript
enum ErrorSeverity {
  FATAL,      // E001-E013: Parsing fails
  WARNING,    // W001-W004: Parsing succeeds with warnings
  INFO        // S001-S002: Informational suggestions
}

interface ParseError {
  code: string;           // "E001", "W002", etc.
  severity: ErrorSeverity;
  line: number;
  column?: number;
  context: string;        // Surrounding code
  message: string;        // Human-readable explanation
  suggestion?: string;    // Suggested fix
}
```

---

## Validation Checklist for Implementers

When implementing a 3md parser, ensure:

- [ ] All E001-E013 errors are detected and rejected
- [ ] Error messages include line numbers
- [ ] Error messages include context (code snippet)
- [ ] Error messages include caret (^) indicators
- [ ] Error messages suggest fixes
- [ ] W001-W004 warnings are emitted (optional but recommended)
- [ ] {{empty}} marker is recognized and handled
- [ ] Unicode script detection is implemented (for W001, E006)
- [ ] YAML frontmatter is safely parsed (no code execution)
- [ ] Document size limits are enforced (recommended: 10MB)
- [ ] Terminology is consistent (Multi Block, Mono Block)
- [ ] Error codes match this specification

---

**Last Updated:** 2025-12-29
**Maintainers:** TriText Team
**See Also:** [SPEC.md](SPEC.md), [IMPLEMENTATION.md](IMPLEMENTATION.md)
