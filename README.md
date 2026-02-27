# 3md: An Open Standard for Trilingual Text

**A plain text format for Sinhala, Tamil, and English content.**

3md is an open infrastructure project—a standard for storing and managing trilingual content in a single, human-readable file.

---

## What is 3md?

3md (Trilingual Markdown) is an **open text format specification** for multilingual content storage. It defines a standardized way to write and maintain content in **Sinhala, Tamil, and English** simultaneously in plain text files.

The specification itself is free and open. Tools built on 3md enable you to use these files in common workflows—from simple text editors to professional publishing systems.

## How Does It Work?

The 3md workflow has three steps:

**1. Write in parallel**
Create content in all three languages using any text editor. Use simple separators to keep translations aligned.

**2. Store in one file**
Everything lives in a single `.3md` file. No more juggling separate documents.

**3. Export automatically**
Convert to production formats: separate language files, PDF, Word, InDesign, HTML, or websites. Setup workflows to automatically update your design when source file is changed.

### The Two Separators

3md keeps languages aligned using two simple markers:

#### 1. The Tilde (~) for Short Text

Use `~` to separate short translations on the same line:

```
හෙලෝ වර්ල්ඩ්!~வணக்கம் உலகம்!~Hello World!
```

When this is processed with a 3md suppoerted appication the output will be three seperate lines or files for Sinhala, Tamil, and English.

Perfect for:
- Headings and titles
- Short sentences
- List items
- Table cells

#### 2. The Kunddaliya (෴) for Longer Content

Use `෴` (a traditional Sinhala punctuation mark) to bind multi-line blocks:

```
මෙය දිගු ඡේදයකි.
එහි රේඛා කිහිපයක් ඇත.
෴
இது நீண்ட பத்தி.
இதில் பல வரிகள் உள்ளன.
෴
This is a longer paragraph.
It has multiple lines.
```

Perfect for:
- Paragraphs with multiple sentences
- Complex lists
- Block quotes
- Tables with different structures per language

That's it. Two separators. Everything else is just writing.



### Built on Markdown

**What is Markdown?**
Markdown is a widely-adopted plain text formatting syntax created in 2004. Instead of using complex word processors, you write in plain text with simple conventions like `# Heading` or `**bold**`. Millions of writers, developers, and organizations use Markdown because:
- Files remain readable as plain text
- Works in any text editor, forever
- No proprietary software lock-in
- Easy to convert to HTML, PDF, Word, and other formats

**What is CommonMark?**
CommonMark is the standardized specification of Markdown, published in 2014 to ensure consistent behavior across different tools. It defines exactly how Markdown should be parsed and rendered, removing ambiguities from the original informal specification.

**Why build on CommonMark?**
Rather than inventing a new format from scratch, 3md extends CommonMark with multilingual constructs. This means:
- All existing Markdown tools can partially read 3md files
- Writers already familiar with Markdown can learn 3md quickly
- The format inherits decades of stability and real-world testing
- Future-proof: built on proven, widely-supported infrastructure

3md adds just two separators to CommonMark—the rest is standard Markdown.

### Why Does This Matter?

If you've ever worked on multilingual publications, you know the problems:

- **Version chaos**: Which Sinhala Word doc matches the latest English PDF?
- **Translation drift**: The Tamil version is two edits behind the English source
- **Collaboration headaches**: Designer has v3, translator has v2, curator has v4
- **File format lock-in**: InDesign files from 2010 won't open in 2025
- **Export nightmares**: Copy-pasting between Word, InDesign, and your website

3md solves these problems by keeping all three languages in **one plain text file** that:

- Works in any text editor (even Notepad)
- Never becomes obsolete
- Tracks changes clearly with version control
- Exports to any format you need (Word, PDF, InDesign, HTML)
- Shows translators all three languages while they work

---

## Why Trilingual Content Matters in Sri Lanka

Sri Lanka's 2012 trilingual policy framework recognizes **Sinhala and Tamil as official languages** and **English as the link language**—aiming to foster social harmony and ensure every citizen can access government services, education, and cultural resources in their mother tongue.

But the reality is challenging:

**The Translation Bottleneck**
- Critical shortage of professional translators who work between Sinhala and Tamil
- Most translators work *into* English, not *between* the national languages
- Bilingual public servants often lack the fluency to serve citizens effectively

**Documentation Chaos**
- Government departments still operate primarily in one language
- Citizens often unaware of their constitutional right to receive services in their language
- Updating all signage, forms, and documents into three languages requires massive coordination

**The Technology Gap**
- No standard way to maintain synchronized trilingual content
- Museums, publishers, and cultural organizations juggle separate Word/InDesign files
- Version control nightmares make it nearly impossible to keep translations aligned

**3md is one approach to these challenges**—a simple text format that:
- Keeps all three languages in one file
- Makes translation gaps visible
- Works with any text editor
- Can be maintained by cultural workers and content creators
- Helps support linguistic accessibility

It's a small tool, but we hope it can be useful for those working on multilingual content.

---

## Who is 3md for?

3md is infrastructure for anyone working with trilingual Sri Lankan content:

**Cultural Organizations**
- Museums writing exhibition labels and catalog entries
- Archives documenting collections in three languages
- Cultural centers publishing multilingual programs

**Publishers & Writers**
- Authors writing trilingual books and articles
- Publishers managing translation workflows
- Editors coordinating writers and translators

**Government & NGOs**
- Agencies publishing public information
- NGOs creating accessible community resources
- Educational institutions developing learning materials

**Tool Builders**
- Developers building content management systems
- Organizations creating publishing workflows
- Anyone implementing multilingual infrastructure

### As an Open Standard

3md is not a product or proprietary software. It's a **public specification** that anyone can:
- Implement in their own tools and systems
- Use freely without licensing fees
- Extend for specific organizational needs
- Build upon for related projects

The specification is openly published and community-maintained.

---


---

## Real-World Examples

### Example 1: Museum Exhibition Label

You're curating an exhibition and need wall labels in three languages:

```
{{langs|en|si|ta}}

# Water Pot~ජල භාජනය~நீர் பானை

This clay pot was commonly used for water storage in 5th century Anuradhapura.
෴
මෙම මැටි භාජනය ක්‍රි.ව. 5 වන සියවසේ අනුරාධපුරයේ ජල ගබඩා කිරීම සඳහා බහුලව භාවිතා කර ඇත.
෴
இந்த மண் பானை கி.பி. 5ஆம் நூற்றாண்டு அனுராதபுரத்தில் நீர் சேமிப்புக்காக பொதுவாக பயன்படுத்தப்பட்டது.

**Material:** Red clay, wheel-thrown~**ද්‍රව්‍ය:** රතු මැටි, රෝද භ්‍රමණය~**பொருள்:** சிவப்பு களிமண், சக்கர வார்ப்பு

**Catalog Number:** ANP-1982-045
```

**What you get:**
- One file for designer, translator, and curator
- All three languages stay synchronized
- Export to InDesign for label printing
- Update once, update everywhere

### Example 2: Book Publishing

You're publishing a book on Geoffrey Bawa's architecture:

```
{{langs|si|ta|en}}

# ජෙෆ්රි බාවා~ஜெஃப்ரி பாவா~Geoffrey Bawa

ජෙෆ්රි බාවා (1919-2003) ශ්‍රී ලංකාවේ ප්‍රසිද්ධතම ස්ථාපත්‍ය විද්‍යාඥයා ලෙස සැලකේ.
ඔහු නිර්මාණය කළේ භූ දර්ශනය සමඟ සුසංයෝගී වන ගොඩනැගිලි, සම්ප්‍රදායික දේශීය
ශිල්පීය ක්‍රම නවීන සැලසුම් සමඟ මුසු කරමින්.
෴
ஜெஃப்ரி பாவா (1919-2003) இலங்கையின் மிகவும் புகழ்பெற்ற கட்டடக் கலைஞராகக் கருதப்படுகிறார்.
அவர் நிலப்பரப்புடன் இணக்கமான கட்டிடங்களை வடிவமைத்தார், பாரம்பரிய உள்ளூர்
கைவினைத் திறன்களை நவீன வடிவமைப்புடன் இணைத்தார்.
෴
Geoffrey Bawa (1919-2003) is considered Sri Lanka's most renowned architect.
He designed buildings that harmonize with the landscape, blending traditional local
craftsmanship with modern design.

## ප්‍රධාන මූලධර්ම~முக்கிய கொள்கைகள்~Key Principles

ඔහුගේ ස්ථාපත්‍ය දර්ශනය මූලික මූලධර්ම කිහිපයක් මත පදනම් විය:
෴
அவரது கட்டிடக்கலை தத்துவம் முக்கிய கொள்கைகளை அடிப்படையாகக் கொண்டது:
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
```

**What you get:**
- Translator sees context in all languages
- Author can edit anywhere (even on a phone)
- Export to Word for editorial review
- Export to InDesign for book layout
- Archive as plain text forever

### Example 3: Website Content

You're managing a cultural center's website:

```
{{langs|en|si|ta}}

# Upcoming Events~ඉදිරි සිදුවීම්~வரவிருக்கும் நிகழ்வுகள்

## කවි සන්ධ්‍යාව~கவிதை மாலை~Poetry Evening

සජීව කාව්‍ය පාරායනය තුන් භාෂාවලින්.
පිළිගැනීම් අවශ්‍යයි.
෴
மூன்று மொழிகளில் நேரடி கவிதை வாசிப்பு.
முன்பதிவு தேவை.
෴
Live poetry readings in three languages.
Reservations required.

**දිනය~தேதி~Date:** 2025-05-15
**කාලය~நேரம்~Time:** 7:00 PM
**ස්ථානය~இடம்~Venue:** Main Hall~ප්‍රධාන ශාලාව~பிரதான மண்டபம்
```

**What you get:**
- Update event details once
- Generate separate HTML pages (en.html, si.html, ta.html)
- Content stays synchronized automatically
- Easy for content managers (no code needed)

### Example 4: Educational Workbook

You're creating a language learning workbook:

```
{{langs|en|si|ta}}

# පාඩම 1: ආයුබෝවන්~பாடம் 1: வணக்கம்~Lesson 1: Greetings

## දෛනික සුබ පැතුම්~தினசரி வாழ்த்துகள்~Daily Greetings

ඔබ හමුවන විට කුමක් කියන්නද?
෴
நீங்கள் சந்திக்கும் போது என்ன சொல்வீர்கள்?
෴
What do you say when you meet someone?

| සිංහල~தமிழ்~Sinhala | தமிழ்~தமிழ்~Tamil | ඉංග්‍රීසි~ஆங்கிலம்~English |
|---------------------|------------------|--------------------------|
| ආයුබෝවන්            | வணக்கம்           | Hello                    |
| සුබ උදෑසනක්          | காலை வணக்கம்     | Good morning             |
| සුබ සන්ධ්‍යාවක්      | மாலை வணக்கம்     | Good evening             |

**පුහුණු වන්න~பயிற்சி~Practice:**

කණ්ඩායම සමඟ කතා කරන්න. අත්හදා බලන්න:
෴
குழுவுடன் பேசுங்கள். முயற்சிக்கவும்:
෴
Speak with your group. Try:

- හෙට හමුවෙමු!~நாளை சந்திப்போம்!~See you tomorrow!
- ස්තූතියි!~நன்றி!~Thank you!
```

**What you get:**
- Consistent learning materials
- Side-by-side language comparison
- Easy to update exercises
- Export to printable PDFs or interactive apps

### Example 5: Community Newsletter

You're publishing a monthly community newsletter:

```
{{langs|si|ta|en}}

# ප්‍රජා පුවත්~சமூக செய்திகள்~Community News
**මාර්තු 2025~மார்ச் 2025~March 2025**

## නව පුස්තකාලය විවෘත විය~புதிய நூலகம் திறக்கப்பட்டது~New Library Opens

පසුගිය සතියේ කොළඹ මධ්‍යස්ථානයේ අපගේ නව ත්‍රිභාෂා පුස්තකාලය විවෘත විය.
පුස්තකාල සාමාජිකත්වය නොමිලේ.
෴
கடந்த வாரம் கொழும்பு மையத்தில் எங்கள் புதிய முத்தமிழ் நூலகம் திறக்கப்பட்டது.
நூலக உறுப்பினர் இலவசம்.
෴
Last week our new trilingual library opened in Colombo Central.
Library membership is free.

**විවෘත වේලාවන්~திறந்திருக்கும் நேரம்~Opening Hours:**
- සඳුදා-සිකුරාදා~திங்கள்-வெள்ளி~Monday-Friday: 9:00 AM - 6:00 PM
- සෙනසුරාදා~சனி~Saturday: 10:00 AM - 4:00 PM
- ඉරිදා වසා ඇත~ஞாயிறு மூடப்பட்டுள்ளது~Sunday: Closed

**පන්ති ආරම්භ වේ~வகுப்புகள் தொடங்குகின்றன~Classes Begin**

අප්‍රේල් මාසයේදී ආරම්භ වන නව පන්ති:
- සිංහල ලිවීම (ආරම්භක මට්ටම)
- ඉතිහාසය සහ උරුමය
- තාලප්‍රාර්ථනා සිට්‍ටම්
෴
ஏப்ரல் மாதம் தொடங்கும் புதிய வகுப்புகள்:
- தமிழ் எழுத்து (ஆரம்ப நிலை)
- வரலாறு மற்றும் பாரம்பரியம்
- பாரம்பரிய நடனம்
෴
New classes starting in April:
- Sinhala Writing (Beginner Level)
- History and Heritage
- Traditional Dance

සියලුම පන්ති සඳහා ලියාපදිංචිය දැන් විවෘතයි!
වැඩි විස්තර සඳහා අපගේ වෙබ් අඩවියට පිවිසෙන්න.
෴
அனைத்து வகுப்புகளுக்கும் பதிவு இப்போது திறந்துள்ளது!
மேலும் தகவலுக்கு எங்கள் இணையதளத்தைப் பார்வையிடவும்.
෴
Registration now open for all classes!
Visit our website for more information.
```

**What you get:**
- Fast monthly updates
- Email one file to everyone on your team
- Generate web version and print version
- Keep an archive of every newsletter

---

## Getting Started

### Step 1: Declare Your Languages

Every 3md file starts with a language declaration:

```
{{langs|si|ta|en}}
```

The order is up to you:
- `{{langs|si|ta|en}}` — Start with Sinhala
- `{{langs|en|si|ta}}` — Start with English
- `{{langs|ta|si|en}}` — Start with Tamil

Choose whatever makes sense for your workflow.

### Step 2: Write a Heading

```
{{langs|si|ta|en}}

# හැඳින්වීම~அறிமுகம்~Introduction
```

Use `~` to separate the three translations.

### Step 3: Add a Paragraph

For short paragraphs:

```
මෙය සරල වාක්‍යයකි.~இது எளிய வாக்கியம்.~This is a simple sentence.
```

For longer paragraphs:

```
මෙය දිගු ඡේදයකි.
එහි රේඛා කිහිපයක් ඇත.
෴
இது நீண்ட பத்தி.
இதில் பல வரிகள் உள்ளன.
෴
This is a longer paragraph.
It has multiple lines.
```

### Step 4: Create a List

```
- පළමු අයිතමය~முதல் உருப்படி~First item
- දෙවන අයිතමය~இரண்டாவது உருப்படி~Second item
- තුන්වන අයිතමය~மூன்றாவது உருப்படி~Third item
```

### Step 5: Save and Export

Save your file as `document.3md`.

Now you can:
- Export to separate Markdown files (si.md, ta.md, en.md)
- Convert to HTML for your website
- Generate Word documents for editors
- Create InDesign-ready files for designers

---

## Why Plain Text Infrastructure?

### Long-Term Durability

Proprietary formats become obsolete. Microsoft Word files from 2005 are difficult to open today. InDesign files require expensive software and break across versions.

Plain text files work forever. A 3md file created in 2025 will be perfectly readable in 2055—or 2105. This matters for:
- Cultural archives that must last generations
- Government documents with legal requirements
- Historical records that become primary sources

### Platform Independence

3md files work on any system:
- Any operating system (Windows, Mac, Linux, mobile)
- Any text editor (from Notepad to professional IDEs)
- Cloud storage or offline
- No vendor lock-in, no subscription fees

This is infrastructure that belongs to everyone.

### Transparent Version Control

Plain text enables clear change tracking:

```diff
- පැරණි පෙළ~பழைய உரை~Old text
+ නව පෙළ~புதிய உரை~New text
```

Version control systems (like Git) can track exactly who changed what, when, and why—essential for collaborative cultural documentation.

### Universal Export Capability

3md is a **storage and interchange format**, not a presentation format. Because it's plain text with a clear specification, it can be converted to any output format:

- **Word** (.docx) for editorial workflows
- **PDF** for archival and distribution
- **InDesign** for professional publishing
- **HTML** for web content
- **ePub** for digital books
- **JSON** for databases and applications

Different organizations can build different converters for their specific needs—the format stays the same.

---

## Tracking Translation Progress

Add a frontmatter section to track which languages are complete:

```yaml
---
status:
  si: synced      # Translation verified
  ta: fuzzy       # Needs review
  en: source      # Original language
---
{{langs|en|si|ta}}
```

**Status values:**
- `source` — The original language
- `synced` — Translation complete and verified
- `fuzzy` — Translation exists but needs review (source changed)
- `untranslated` — Not yet translated
- `machine` — Machine-translated, needs human review

This helps teams coordinate:
- Translators know what needs work
- Editors know what needs review
- Designers know what's ready to publish

---

## Working with Entities

Define people, places, or terms once and reuse them:

```yaml
---
entities:
  bawa:
    primary: "Geoffrey Bawa"
    si: "ජෙෆ්රි බාවා"
    ta: "ஜெஃப்ரி பாவா"
    type: person
    birth: 1919
---
{{langs|si|ta|en}}

[[bawa|ජෙෆ්රි බාවා]] යනු ප්‍රසිද්ධ ස්ථාපත්‍ය විද්‍යාඥයෙකි.
෴
[[bawa|ஜெஃப்ரி பாவா]] புகழ்பெற்ற கட்டடக் கலைஞர்.
෴
[[bawa]] is a renowned architect.
```

**Why this helps:**
- Consistent spelling across documents
- Easy to update names or terms
- Metadata stays with content

---

## Tools and Workflow

### What You Need

**Minimum:**
- Any text editor (Notepad, TextEdit, VS Code, Sublime Text)
- Basic Markdown knowledge

**Recommended:**
- Text editor with syntax highlighting
- Conversion tool for exporting (coming soon)
- Version control (Git) for collaboration

### Common Workflows

**Museum Exhibition Workflow:**
1. Curator writes English content
2. Translator adds Sinhala and Tamil in same file
3. Team reviews all languages side-by-side
4. Designer exports to InDesign for labels
5. Archive 3md file as master

**Book Publishing Workflow:**
1. Author writes in preferred language
2. Translators work in parallel
3. Editor marks translation status
4. Export to Word for review
5. Export to InDesign for layout
6. Keep 3md as canonical source

**Website Content Workflow:**
1. Content writer creates 3md
2. Conversion tool generates HTML files
3. Developer integrates into website
4. Updates made by editing 3md

---

## Frequently Asked Questions

### Do I need special software?

No. Any text editor works. We recommend editors with Markdown support for syntax highlighting, but Notepad will work fine.

### What about images and media?

Images work just like in Markdown:

```
![විස්තර~விளக்கம்~Description](image.png)
```

For videos, audio, and interactive content, you can embed HTML:

````
```
<iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>
```
````

### Can I include only one or two languages?

3md is specifically for three languages (Sinhala, Tamil, English). For other combinations or fewer languages, use standard Markdown or other multilingual formats.

### What if translation isn't done yet?

Use the empty marker:

```
සිංහල පෙළ.~{{empty}}~{{empty}}
```

Or mark status in frontmatter:

```yaml
status:
  si: source
  ta: untranslated
  en: untranslated
```

### How do I handle language-invariant content?

Just write it normally without separators:

```
{{langs|si|ta|en}}

This content appears in all three language outputs.

2 + 2 = 4
```

Code blocks, numbers, and formulas often don't need translation.

### Can I use this with other languages?

Yes. 3md is specifically designed for Sinhala, Tamil, and English, but the specification can be technically extended to support other language combinations. Users working with different language pairs can:

- Modify the language declaration: `{{langs|de|fr|es}}` for German, French, and Spanish
- Use the same separator syntax (`~` and `෴`) for any language trio
- Adapt the specification for their needs under the CC BY 4.0 license

The core format is language-agnostic—only the cultural choices (like the Kunddaliya character) are specific to Sri Lankan trilingual publishing. For non-Sri Lankan contexts, you could substitute alternative separators while keeping the specification structure intact.

---

## Repository Organization

This repository contains both the **3md specification** and a **reference parser implementation**.

```
3md/
├── spec/              # 📋 Format specification
│   ├── SPEC.md       # Complete syntax specification
│   ├── ERRORS.md     # Error handling spec
│   ├── IMPLEMENTATION.md  # Implementation guide
│   └── examples/     # Canonical test documents
│
├── parser/           # 🔧 Reference TypeScript parser
│   ├── src/          # Parser source code
│   ├── test/         # Test suite
│   └── lib/          # Compiled output
│
├── docs/             # 📚 Articles and guides
└── README.md         # This file
```

### The Specification

The [spec/](spec/) directory contains the official 3md format specification. This is the canonical reference for implementing 3md tools in any programming language.

→ [Read the specification](spec/SPEC.md)

### The Reference Parser

The [parser/](parser/) directory contains a TypeScript/JavaScript implementation that demonstrates how to correctly parse 3md documents.

→ [Parser documentation](parser/README.md)

You can use this parser as a library, CLI tool, or reference when building your own implementation.

## Learn More

### For Writers and Content Creators

- Read the [full specification](spec/SPEC.md) for detailed syntax reference
- Explore [canonical examples](spec/examples/) for inspiration
- See [how to get started](#getting-started) above

### For Developers

- Read the [implementation guide](spec/IMPLEMENTATION.md) for building tools
- See the [error handling spec](spec/ERRORS.md) for parser validation
- Review the [reference parser](parser/README.md) implementation
- Check the [canonical test cases](spec/examples/)

### Get Help

- File issues at [github.com/mooniak/3md/issues](https://github.com/mooniak/3md/issues)
- Join discussions about multilingual publishing
- Contribute examples and use cases

---

## Why It's Called 3md

**3** = Three languages (Sinhala, Tamil, English)
**md** = Markdown

The name reflects both the technical foundation (Markdown) and the cultural mission (trilingual content for Sri Lankan cultural preservation and accessibility).

---

## A Note on the Kunddaliya (෴)

The Kunddaliya is a traditional Sinhala punctuation mark that historically marked the end of text sections in palm-leaf manuscripts. By using it as the block separator, 3md connects modern digital publishing to South Asian manuscript traditions—a fitting symbol for cultural preservation work.

On most keyboards:
- **Sinhala keyboard layout:** Direct character
- **Other keyboards:** Copy-paste from this guide, or type `\u0df4`

---

## Open Infrastructure

### Specification License

The 3md specification is released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

This means you're free to:
- Implement the specification in any software
- Use 3md files for any purpose (personal, commercial, governmental)
- Build tools, converters, and services
- Modify and adapt the specification for your needs
- Share and distribute the specification

### File Format

3md files (`.3md`) are plain text files with UTF-8 encoding. There are no proprietary formats, no patents, no restrictions. The format is designed to remain readable and parsable for decades.

### Implementations

Anyone can build tools that read and write 3md files. The specification defines the format—implementations can vary based on needs:
- Command-line converters
- Web-based editors
- Content management systems
- Desktop applications
- Publishing pipelines

If you build a tool that works with 3md, you're helping build public infrastructure.

---

## About This Project

**3md** is maintained by [Mooniak](https://mooniak.com)

**Primary Contributors:** Pathum Egodawatta

**Current Version:** 0.1.0 (2025-12-29)

**Repository:** [github.com/mooniak/3md](https://github.com/mooniak/3md)

This is infrastructure work—built for the long term, designed to serve cultural preservation and linguistic accessibility in Sri Lanka.

---

**An open standard for writing in three languages. Plain text. Human-readable. Forever.**