/**
 * 3mdDeserializer - Convert .3md files to Lexical editor states
 *
 * This module parses 3md content and converts it into Lexical EditorState JSON
 * with BlockNodes representing each 3md block.
 */

import type { TrimdDocument, Block as TrimdBlock, Lang } from '3md-parser/src/types';
import { generateBlockId } from '../utils/blockIdentifier';
import type { Block, EditorStates, Language, ContentElementType } from '../state/types';

/**
 * Detect the content element type from markdown content
 */
function detectElementType(content: string): {
  element: ContentElementType;
  headingLevel?: number;
} {
  if (!content.trim()) {
    return { element: 'paragraph' };
  }

  // Get first line to check for markers
  const firstLine = content.split('\n')[0];

  // Check for headings (# to ######)
  const headingMatch = firstLine.match(/^(#{1,6})\s/);
  if (headingMatch) {
    return {
      element: 'heading',
      headingLevel: headingMatch[1].length,
    };
  }

  // Check for list markers (bullet or numbered)
  const listMatch = firstLine.match(/^[\s]*([-*+]|\d+\.)\s/);
  if (listMatch) {
    return { element: 'list' };
  }

  // Check for blockquotes
  if (firstLine.startsWith('>')) {
    return { element: 'blockquote' };
  }

  // Check for code blocks
  if (firstLine.startsWith('```')) {
    return { element: 'code' };
  }

  // Default to paragraph
  return { element: 'paragraph' };
}

/**
 * Parse 3md content into a TrimdDocument structure
 */
function parse3md(content: string): TrimdDocument {
  // For now, we'll implement a simple parser that splits on separators
  // The full parser integration with remark3md will be enhanced later

  const lines = content.split('\n');
  let i = 0;

  // Skip frontmatter if present
  let frontmatter: Record<string, any> | undefined;
  if (lines[0] === '---') {
    i++;
    const yamlLines: string[] = [];
    while (i < lines.length && lines[i] !== '---') {
      yamlLines.push(lines[i]);
      i++;
    }
    i++; // Skip closing ---
    // TODO: Parse YAML frontmatter
  }

  // Skip empty lines
  while (i < lines.length && lines[i].trim() === '') {
    i++;
  }

  // Parse language declaration
  const langDecl = lines[i];
  const langMatch = langDecl.match(/\{\{langs\|(\w+)\|(\w+)\|(\w+)\}\}/);
  if (!langMatch) {
    throw new Error('Invalid or missing language declaration');
  }

  const languages = [langMatch[1], langMatch[2], langMatch[3]] as Lang[];
  i++;

  // Skip empty lines after declaration
  while (i < lines.length && lines[i].trim() === '') {
    i++;
  }

  // Parse blocks
  const blocks: TrimdBlock[] = [];
  const remainingContent = lines.slice(i).join('\n');

  // Split on double newlines to get blocks
  const blockStrings = remainingContent.split(/\n\n+/);

  for (const blockStr of blockStrings) {
    if (!blockStr.trim()) continue;

    // Check if block contains separators
    if (blockStr.includes('~')) {
      // Inline separator - Multi block
      // Extract markdown formatting prefix (like #, ##, -, etc.) if present
      const firstLine = blockStr.split('\n')[0];
      let markdownPrefix = '';
      let contentWithoutPrefix = blockStr;

      // Check for heading markers
      const headingMatch = firstLine.match(/^(#{1,6}\s+)/);
      if (headingMatch) {
        markdownPrefix = headingMatch[1];
        contentWithoutPrefix = blockStr.substring(markdownPrefix.length);
      }

      // Check for list markers (bullet or numbered)
      const bulletMatch = firstLine.match(/^([\s]*([-*+])\s+)/);
      const numberedMatch = firstLine.match(/^([\s]*(\d+)\.\s+)/);
      if (bulletMatch && !headingMatch) {
        markdownPrefix = bulletMatch[1];
        contentWithoutPrefix = blockStr.substring(markdownPrefix.length);
      } else if (numberedMatch && !headingMatch) {
        markdownPrefix = numberedMatch[1];
        contentWithoutPrefix = blockStr.substring(markdownPrefix.length);
      }

      const variants = contentWithoutPrefix.split('~');
      if (variants.length === 3) {
        const variantMap = new Map<Lang, string>();
        // Re-add the markdown prefix to each variant
        variantMap.set(languages[0], (markdownPrefix + variants[0]).trim());
        variantMap.set(languages[1], (markdownPrefix + variants[1]).trim());
        variantMap.set(languages[2], (markdownPrefix + variants[2]).trim());

        blocks.push({
          type: 'multi',
          element: 'paragraph',
          separator: 'inline',
          variants: variantMap,
        });
      }
    } else if (blockStr.includes('\n෴\n')) {
      // Block separator - Multi block
      const variants = blockStr.split('\n෴\n');
      if (variants.length === 3) {
        const variantMap = new Map<Lang, string>();
        variantMap.set(languages[0], variants[0].trim());
        variantMap.set(languages[1], variants[1].trim());
        variantMap.set(languages[2], variants[2].trim());

        blocks.push({
          type: 'multi',
          element: 'paragraph',
          separator: 'block',
          variants: variantMap,
        });
      }
    } else if (blockStr.includes('෴')) {
      // Block separator without newlines
      const variants = blockStr.split('෴');
      if (variants.length === 3) {
        const variantMap = new Map<Lang, string>();
        variantMap.set(languages[0], variants[0].trim());
        variantMap.set(languages[1], variants[1].trim());
        variantMap.set(languages[2], variants[2].trim());

        blocks.push({
          type: 'multi',
          element: 'paragraph',
          separator: 'block',
          variants: variantMap,
        });
      }
    } else {
      // Mono block
      blocks.push({
        type: 'mono',
        element: 'paragraph',
        separator: 'none',
        content: blockStr.trim(),
      });
    }
  }

  return {
    frontmatter,
    languages,
    blocks,
  };
}

/**
 * Convert markdown text content to Lexical nodes
 * Enhanced version that properly groups lists and handles formatting
 */
function convertMarkdownToLexical(markdown: string): any[] {
  if (!markdown.trim()) {
    return [{
      type: 'paragraph',
      children: [],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    }];
  }

  const lines = markdown.split('\n');
  const nodes: any[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Check if it's a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      nodes.push({
        type: 'heading',
        tag: `h${level}`,
        children: [
          {
            type: 'text',
            text: text,
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      });
      i++;
      continue;
    }

    // Check if it's a list item (bullet or numbered)
    const bulletMatch = line.match(/^[\s]*([-*+])\s+(.+)$/);
    const numberedMatch = line.match(/^[\s]*(\d+)\.\s+(.+)$/);

    if (bulletMatch || numberedMatch) {
      const isNumbered = !!numberedMatch;
      const listItems: any[] = [];

      // Collect all consecutive list items
      while (i < lines.length) {
        const currentLine = lines[i];
        const bulletMatch = currentLine.match(/^[\s]*([-*+])\s+(.+)$/);
        const numberedMatch = currentLine.match(/^[\s]*(\d+)\.\s+(.+)$/);

        if ((isNumbered && numberedMatch) || (!isNumbered && bulletMatch)) {
          const text = isNumbered ? numberedMatch![2] : bulletMatch![2];
          listItems.push({
            type: 'listitem',
            value: 1,
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: text,
                    version: 1,
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          });
          i++;
        } else {
          break;
        }
      }

      // Create the list node with all items
      nodes.push({
        type: 'list',
        listType: isNumbered ? 'number' : 'bullet',
        start: 1,
        tag: isNumbered ? 'ol' : 'ul',
        children: listItems,
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      });
      continue;
    }

    // Default to paragraph - collect all non-empty consecutive lines
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const currentLine = lines[i];

      // Stop if we hit an empty line, heading, or list
      if (!currentLine.trim() ||
          currentLine.match(/^#{1,6}\s/) ||
          currentLine.match(/^[\s]*([-*+]|\d+\.)\s/)) {
        break;
      }

      paragraphLines.push(currentLine);
      i++;
    }

    if (paragraphLines.length > 0) {
      nodes.push({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: paragraphLines.join('\n'),
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      });
    }
  }

  // If no nodes were created, add an empty paragraph with editable text node
  if (nodes.length === 0) {
    nodes.push({
      type: 'paragraph',
      children: [{
        type: 'text',
        text: '',
        version: 1,
      }],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    });
  }

  return nodes;
}

/**
 * Convert a 3md document to Lexical editor states
 *
 * @param content - Raw 3md file content
 * @returns Object containing editor states for each language and block metadata
 */
export function deserialize3md(content: string): {
  editorStates: EditorStates;
  blocks: Block[];
  frontmatter: Record<string, any> | null;
} {
  // Parse the 3md document
  const trimdDoc = parse3md(content);

  // Extract languages and frontmatter
  const languages: Language[] = trimdDoc.languages.map(lang => lang as Language);
  const frontmatter = trimdDoc.frontmatter || null;

  // Generate block IDs for each 3md block and detect content type
  const blocks: Block[] = trimdDoc.blocks.map(trimdBlock => {
    // Get first language variant to detect content type
    let firstVariant = '';
    if (trimdBlock.type === 'multi' && trimdBlock.variants) {
      firstVariant = trimdBlock.variants.values().next().value || '';
    } else if (trimdBlock.type === 'mono' && trimdBlock.content) {
      firstVariant = trimdBlock.content;
    }

    // Detect element type and heading level
    const { element, headingLevel } = detectElementType(firstVariant);

    return {
      id: generateBlockId(),
      type: trimdBlock.type,
      element,
      headingLevel,
    };
  });

  // Build Lexical editor states for each language
  const editorStates: EditorStates = {
    si: null,
    ta: null,
    en: null,
  };

  for (const lang of languages) {
    const blockNodes: any[] = [];

    for (let i = 0; i < trimdDoc.blocks.length; i++) {
      const trimdBlock = trimdDoc.blocks[i];
      const block = blocks[i];

      // Get content for this language
      let blockContent: string = '';
      if (trimdBlock.type === 'multi' && trimdBlock.variants) {
        blockContent = trimdBlock.variants.get(lang as Lang) || '';
      } else if (trimdBlock.type === 'mono' && trimdBlock.content) {
        blockContent = trimdBlock.content;
      }

      // Convert markdown to Lexical nodes
      const lexicalChildren = convertMarkdownToLexical(blockContent);

      // Create a BlockNode containing these children
      const blockNode = {
        type: 'block',
        blockId: block.id,
        blockType: trimdBlock.type,
        contentType: block.element,
        headingLevel: block.headingLevel,
        children: lexicalChildren.length > 0 ? lexicalChildren : [
          {
            type: 'paragraph',
            children: [{
              type: 'text',
              text: '',
              version: 1,
            }],
            direction: null,
            format: '',
            indent: 0,
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      };

      blockNodes.push(blockNode);
    }

    // Create the root EditorState for this language
    const editorState = {
      root: {
        children: blockNodes,
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    };

    editorStates[lang] = JSON.stringify(editorState);
  }

  return {
    editorStates,
    blocks,
    frontmatter,
  };
}
