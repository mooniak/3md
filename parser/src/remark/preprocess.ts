/**
 * 3md Preprocessing - Handle block separators before markdown parsing
 */

import type { Lang, Locale } from '../types';

const BLOCK_SEPARATOR = '\u0DF4'; // Kunddaliya ෴
const LANGS_REGEX = /^{{langs\s*\|\s*(si|ta|en)\s*\|\s*(si|ta|en)\s*\|\s*(si|ta|en)\s*}}$/im;

/**
 * Convert locale string to array of language codes
 */
function localeToLangs(locale: Locale | undefined): Lang[] {
  if (!locale) {
    return [];
  }
  return locale.split('-').map((v) => v.trim().toLowerCase() as Lang);
}

/**
 * Extract language declaration from text
 */
function extractLangs(text: string): { langs: Lang[]; remainingText: string; fullText: string } {
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.match(LANGS_REGEX);

    if (matches && matches.length > 3) {
      const langs = [matches[1], matches[2], matches[3]].map(
        (v) => v.trim().toLowerCase() as Lang
      );

      // Keep a copy with the lang declaration
      const fullText = text;

      // Remove the lang declaration line for processing
      lines.splice(i, 1);
      const remainingText = lines.join('\n');

      return { langs, remainingText, fullText };
    }
  }

  return { langs: [], remainingText: text, fullText: text };
}

/**
 * Preprocess 3md text to handle block separators
 * This must run BEFORE markdown parsing
 */
export function preprocessText(text: string, locale?: Locale): string {
  const targetLangs = localeToLangs(locale);

  if (targetLangs.length === 0) {
    return text;
  }

  // Extract language declaration
  const { langs: currentLangs, remainingText, fullText } = extractLangs(text);

  if (currentLangs.length === 0) {
    return text;
  }

  // Only proceed if we have block separators
  if (!remainingText.includes(BLOCK_SEPARATOR)) {
    // No block separators, return original text so inline separators can be processed
    return fullText;
  }

  // Process the document by handling block separators
  const processedBlocks: string[] = [];

  // Split by blank lines to get markdown blocks
  const blocks = remainingText.split(/\n\n+/);

  for (const block of blocks) {
    // Check if this block contains the block separator
    if (block.includes(BLOCK_SEPARATOR)) {
      // This is a multi-block with block separators
      // Split by block separator pattern: newline + ෴ + newline
      const variants = block
        .split(new RegExp(`\\n${BLOCK_SEPARATOR}\\n`))
        .map(v => v.trim())
        .filter(v => v.length > 0);

      if (variants.length === currentLangs.length) {
        // Valid multi-block, extract target language variant
        const langMap: { [K in Lang]?: string } = {};
        for (let j = 0; j < currentLangs.length; j++) {
          langMap[currentLangs[j]] = variants[j];
        }

        // Get the content for the target language
        const targetLang = targetLangs[0];
        const targetContent = langMap[targetLang];

        if (targetContent) {
          // Check if this is a list (starts with -, *, +, or number.)
          const isListBlock = targetContent.split('\n').some(line => {
            const trimmed = line.trim();
            return /^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);
          });

          if (isListBlock) {
            // For lists, don't add hard breaks - each line is a separate item
            processedBlocks.push(targetContent);
          } else {
            // For paragraphs, add hard line breaks to preserve multi-line structure
            const lines = targetContent.split('\n');
            const processedLines = lines.map((line, idx) => {
              // Add backslash at end of line (except last line) for hard line break
              if (idx < lines.length - 1 && line.trim().length > 0) {
                return line + '\\';
              }
              return line;
            });
            processedBlocks.push(processedLines.join('\n'));
          }
        }
      } else {
        // Invalid multi-block or different count, keep as-is
        processedBlocks.push(block);
      }
    } else {
      // Not a multi-block, keep as-is
      processedBlocks.push(block);
    }
  }

  // Reconstruct the document with lang declaration prepended
  // This allows inline separators to still be processed by the locale parser
  const langDeclaration = `{{langs|${currentLangs.join('|')}}}`;
  const result = langDeclaration + '\n\n' + processedBlocks.join('\n\n');
  return result;
}
