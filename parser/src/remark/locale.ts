import type { PhrasingContent, Root, ListItem } from 'mdast';
import type { Lang, Locale } from '../types';
import { visit } from 'unist-util-visit';

const LANGS_REGEX = /^{{langs\s*\|\s*(si|ta|en)\s*\|\s*(si|ta|en)\s*\|\s*(si|ta|en)\s*}}$/i;
const INLINE_SEPARATOR = '~';
const BLOCK_SEPARATOR = '\u0DF4'; // Kunddaliya ෴

/**
 * Convert locale string to array of language codes
 * Examples: 'si-ta-en' => ['si', 'ta', 'en'], 'en' => ['en']
 */
function localeToLangs(locale: Locale | undefined): Lang[] {
  if (!locale) {
    return [];
  }
  return locale.split('-').map((v) => v.trim().toLowerCase() as Lang);
}

/**
 * Parse language declaration from the document
 * Format: {{langs|si|ta|en}}
 */
function parseLangs(tree: Root): Lang[] {
  if (!tree.children.length) {
    return [];
  }

  const node = tree.children[0];

  if (node.type === 'paragraph' && node.children.length > 0) {
    const langsNode = node.children[0];

    if (langsNode.type === 'text' && langsNode.value) {
      const matches = langsNode.value.match(LANGS_REGEX);
      if (matches && matches.length > 3) {
        const langs = [matches[1], matches[2], matches[3]].map(
          (v) => v.trim().toLowerCase() as Lang
        );

        // Validate no duplicates
        if (new Set(langs).size !== langs.length) {
          throw new Error('Duplicate language codes in {{langs}} declaration');
        }

        // Remove the lang node from tree
        tree.children.shift();

        return langs;
      }
    }
  }

  return [];
}

type HeadingLangValues = {
  [K in Lang]?: string;
};

/**
 * Get heading value based on separator-split values
 * If headings use | separator (mlmd style), split them
 * If headings use ~ separator (3md style), split them
 */
function getHeadingValue(
  text: string,
  currentLangs: Lang[],
  targetLangs: Lang[]
): string {
  // Try inline separator first (~)
  if (text.includes(INLINE_SEPARATOR)) {
    const values = text.split(INLINE_SEPARATOR).map((v) => v.trim());

    if (values.length !== currentLangs.length) {
      // Not a valid multi-block heading, return as-is
      return text;
    }

    const hLangValues: HeadingLangValues = {};
    for (let i = 0; i < currentLangs.length; i++) {
      hLangValues[currentLangs[i]] = values[i];
    }

    const langs = targetLangs.length === 0 ? currentLangs : targetLangs;
    return langs
      .map((lang) => hLangValues[lang])
      .filter((v) => v !== undefined)
      .join(' ');
  }

  // No separator, return as-is (mono block)
  return text;
}

/**
 * Replace heading content based on target locale
 */
function replaceHeadingByLocale(
  tree: Root,
  currentLangs: Lang[],
  targetLangs: Lang[]
): void {
  for (const node of tree.children) {
    if (node.type === 'heading' && node.children.length > 0) {
      const first = node.children[0];
      if (first.type === 'text' && first.value) {
        first.value = getHeadingValue(first.value, currentLangs, targetLangs);
      }
    }
  }
}

/**
 * Split paragraph children by line breaks
 */
function splitByBreak(nodes: PhrasingContent[]): PhrasingContent[][] {
  const result: PhrasingContent[][] = [];
  let current: PhrasingContent[] = [];

  for (const node of nodes) {
    if (node.type === 'break') {
      result.push(current);
      current = [];
    } else {
      current.push(node);
    }
  }

  if (current.length > 0) {
    result.push(current);
  }

  return result;
}

type ParagraphLangValues = {
  [K in Lang]?: PhrasingContent[];
};

/**
 * Get paragraph children based on target langs
 */
function getParagraphChildren(
  values: PhrasingContent[][],
  currentLangs: Lang[],
  targetLangs: Lang[]
): PhrasingContent[] {
  if (values.length <= 1) {
    return values[0] ?? [];
  }

  const pLangValues: ParagraphLangValues = {};
  for (let i = 0; i < currentLangs.length; i++) {
    pLangValues[currentLangs[i]] = values[i];
  }

  const breakNode = { type: 'break' as const };

  const children = targetLangs
    .map((lang) => pLangValues[lang])
    .filter((v) => v !== undefined)
    .flatMap((v) => [...(v as PhrasingContent[]), breakNode]);

  children.pop(); // Remove trailing break

  return children;
}

/**
 * Get paragraph value based on inline separator
 * If paragraph contains ~, split and extract target language
 */
function getParagraphValue(
  text: string,
  currentLangs: Lang[],
  targetLangs: Lang[]
): string {
  // Try inline separator (~)
  if (text.includes(INLINE_SEPARATOR)) {
    const values = text.split(INLINE_SEPARATOR).map((v) => v.trim());

    if (values.length !== currentLangs.length) {
      // Not a valid multi-block paragraph, return as-is
      return text;
    }

    const pLangValues: { [K in Lang]?: string } = {};
    for (let i = 0; i < currentLangs.length; i++) {
      pLangValues[currentLangs[i]] = values[i];
    }

    const langs = targetLangs.length === 0 ? currentLangs : targetLangs;
    return langs
      .map((lang) => pLangValues[lang])
      .filter((v) => v !== undefined)
      .join(' ');
  }

  // No separator, return as-is (mono block)
  return text;
}

/**
 * Replace paragraph content based on target locale
 * Handles both inline separator (~) and block separator (break-based multi-blocks)
 */
function replaceParagraphByLocale(
  tree: Root,
  currentLangs: Lang[],
  targetLangs: Lang[]
): void {
  if (targetLangs.length === 0) {
    return;
  }

  for (const node of tree.children) {
    if (node.type === 'paragraph' && node.children.length > 0) {
      // Check if the paragraph has inline separators in text nodes
      const firstChild = node.children[0];
      if (firstChild.type === 'text' && firstChild.value && firstChild.value.includes(INLINE_SEPARATOR)) {
        // Handle inline separator
        firstChild.value = getParagraphValue(firstChild.value, currentLangs, targetLangs);
      }
      // Note: Don't process paragraphs with breaks - they were already processed
      // during preprocessing and don't contain separators
    }
  }
}

/**
 * Pre-process raw text to handle block separators before markdown parsing
 * Converts block-separated multi-blocks to single-language content
 */
function preprocessBlockSeparators(
  text: string,
  currentLangs: Lang[],
  targetLangs: Lang[]
): string {
  if (targetLangs.length === 0 || !text.includes(BLOCK_SEPARATOR)) {
    return text;
  }

  // Split the document by double newlines (markdown blocks)
  const blocks = text.split(/\n\n+/);
  const processedBlocks: string[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Check if this block contains the block separator
    if (block.includes(`\n${BLOCK_SEPARATOR}\n`) || block.includes(BLOCK_SEPARATOR)) {
      // This is a multi-block with block separators
      const variants = block.split(new RegExp(`\\n?${BLOCK_SEPARATOR}\\n?`)).filter(v => v.trim());

      if (variants.length === currentLangs.length) {
        // Valid multi-block, extract target language variants
        const langMap: { [K in Lang]?: string } = {};
        for (let j = 0; j < currentLangs.length; j++) {
          langMap[currentLangs[j]] = variants[j];
        }

        // Get the content for target languages
        const targetContent = targetLangs
          .map((lang) => langMap[lang])
          .filter((v) => v !== undefined)
          .join('\n');

        processedBlocks.push(targetContent);
      } else {
        // Invalid multi-block, keep as-is
        processedBlocks.push(block);
      }
    } else {
      // Not a multi-block, keep as-is
      processedBlocks.push(block);
    }
  }

  return processedBlocks.join('\n\n');
}

/**
 * Replace list item content based on target locale
 */
function replaceListItemByLocale(
  tree: Root,
  currentLangs: Lang[],
  targetLangs: Lang[]
): void {
  if (targetLangs.length === 0) {
    return;
  }

  // Use visit to traverse all list items recursively
  visit(tree, 'listItem', (node: ListItem) => {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (child.type === 'paragraph' && child.children.length > 0) {
          const firstChild = child.children[0];
          if (firstChild.type === 'text' && firstChild.value && firstChild.value.includes(INLINE_SEPARATOR)) {
            // Handle inline separator in list item
            firstChild.value = getParagraphValue(firstChild.value, currentLangs, targetLangs);
          }
        }
      }
    }
  });
}

/**
 * Main parser function for locale-based filtering
 */
export function parseLocale(tree: Root, locale: Locale | undefined): void {
  const targetLangs = localeToLangs(locale);
  const currentLangs = parseLangs(tree);

  if (currentLangs.length > 0) {
    replaceHeadingByLocale(tree, currentLangs, targetLangs);
    replaceParagraphByLocale(tree, currentLangs, targetLangs);
    replaceListItemByLocale(tree, currentLangs, targetLangs);
  }
}
