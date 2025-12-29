# Introducing 3md: A New Vision for Trilingual Content Creation

If you work in a cultural organization, you know the challenge. You have an exhibition, a publication, or a website, and the content needs to be perfect—in Sinhala, Tamil, and English.

This often means a chaotic workflow of multiple Microsoft Word documents, endless email chains, and a constant struggle to keep track of which translation is the most current. When it’s time for layout in Adobe InDesign, the process of manually copying and pasting everything begins. It's slow, tedious, and prone to errors.

What if there was a better way? What if all three languages could live together in a single, simple, organized document?

Meet **3md**, a new system designed for this exact challenge.

## First, What is Markdown? (And Why You'll Love It)

Imagine writing an email. You can’t use complex formatting menus, so you just type. To make a heading, you might put it on its own line. To emphasize a word, you might wrap it in asterisks (`*like this*`).

That’s the basic idea of Markdown. It’s a way of writing in plain text that is simple for anyone to read and write, but that can be automatically converted into beautifully formatted documents, web pages, or PDFs.

It frees your content from being locked inside proprietary files (like `.docx`). Your work becomes future-proof, easy to share, and simple to track.

## How 3md Transforms Trilingual Workflows

**3md** (Trilingual Markdown) takes the simplicity of Markdown and adapts it for parallel content creation in Sinhala, Tamil, and English. It’s built on one core idea: **one document, three languages.**

To achieve this, 3md uses two special characters to separate the languages:

*   The **Kunddaliya (෴)**: A beautiful and traditional Sinhala punctuation mark, used to separate large blocks of text like paragraphs or lists.
*   The **Tilde (~)**: A simple character found on every keyboard, used for short, inline text like headings.

### A Practical Example

Here’s what an exhibit label might look like in a `.3md` file.

```markdown
{{langs|si|ta|en}}

# මූලධර්ම~கொள்கைகள்~Principles

ඔහුගේ ස්ථාපත්‍ය දර්ශනය මූලික මූලධර්ම කිහිපයක් මත පදනම් විය:
෴
அவரது கட்டடக்கலை தத்துவம் முக்கிய கொள்கைகளை அடிப்படையாகக் கொண்டது:
෴
His architectural philosophy was based on key principles:
```
All three languages are together, perfectly aligned. It's instantly clear and easy for a writer or translator to work with.

## Integrate With Your Existing Tools

3md is not about replacing your tools, but about creating a central "source of truth" that makes them work better.

*   **Working with Word:** You can write your text in a simple `.3md` file, and then use a tool to convert it into three separate, formatted Word documents to share with colleagues who prefer that workflow.
*   **Powering InDesign:** Instead of manually copying and pasting, a simple script can read your `.3md` file and automatically place the Sinhala, Tamil, and English content into your InDesign layout. This alone can save countless hours and reduce errors.
*   **Effortless Collaboration:** Forget `final_v2_edits_FINAL.docx`. With `3md`, everyone works from the same file. It’s easy for a project manager to see exactly what a translator has changed, ensuring everyone is on the same page.

## We Want Your Feedback!

`3md` is currently a proposal, and we believe it can solve a real, practical problem for cultural creators and organizations. We are publishing this idea to invite discussion and gather feedback from the very people it’s designed to help.

Does this approach resonate with you? Do you see how it might fit into your work? What challenges do you foresee?

We encourage you to read the **[full specification on GitHub](https://github.com/mooniak/3md/blob/main/README.md)** and share your thoughts. You can comment on this article or, if you're comfortable, [share your ideas on the project's GitHub page](https://github.com/mooniak/3md/issues).

Let's build a better, simpler future for multilingual content together.
