/**
 * 3mdSerializer - Convert Lexical editor states to .3md format
 *
 * This module converts Lexical EditorState JSON with BlockNodes
 * back into valid .3md file content.
 */

import type { EditorStates, Language, Block } from '../state/types';
import type { SerializedBlockNode } from '../nodes/BlockNode';

interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  [key: string]: any;
}

interface SerializedEditorState {
  root: {
    children: LexicalNode[];
    [key: string]: any;
  };
}

/**
 * Convert a Lexical text node to markdown with formatting
 */
function serializeTextNode(node: LexicalNode): string {
  let text = node.text || '';

  // Apply formatting based on format bitmask
  const format = node.format || 0;
  const isBold = (format & 1) !== 0;
  const isItalic = (format & 2) !== 0;
  const isUnderline = (format & 8) !== 0;
  const isStrikethrough = (format & 4) !== 0;
  const isCode = (format & 16) !== 0;

  if (isCode) {
    text = `\`${text}\``;
  }
  if (isBold) {
    text = `**${text}**`;
  }
  if (isItalic) {
    text = `*${text}*`;
  }
  if (isStrikethrough) {
    text = `~~${text}~~`;
  }
  if (isUnderline) {
    text = `<u>${text}</u>`;
  }

  return text;
}

/**
 * Convert Lexical nodes to markdown text
 */
function serializeNodesToMarkdown(nodes: LexicalNode[], depth = 0): string {
  const lines: string[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case 'paragraph':
        if (node.children && node.children.length > 0) {
          const content = serializeNodesToMarkdown(node.children, depth);
          if (content.trim()) {
            lines.push(content);
          }
        }
        break;

      case 'heading':
        const headingLevel = parseInt(node.tag?.replace('h', '') || '1');
        const headingHashes = '#'.repeat(headingLevel);
        const headingContent = serializeNodesToMarkdown(node.children || [], depth);
        lines.push(`${headingHashes} ${headingContent}`);
        break;

      case 'list':
        const listItems = node.children || [];
        listItems.forEach((item, index) => {
          if (item.type === 'listitem') {
            const itemContent = serializeNodesToMarkdown(item.children || [], depth + 1);
            const prefix = node.listType === 'number'
              ? `${node.start + index}. `
              : '- ';
            const indent = '  '.repeat(depth);
            lines.push(`${indent}${prefix}${itemContent}`);
          }
        });
        break;

      case 'quote':
        const quoteContent = serializeNodesToMarkdown(node.children || [], depth);
        quoteContent.split('\n').forEach(line => {
          lines.push(`> ${line}`);
        });
        break;

      case 'code':
        const codeContent = node.children?.[0]?.text || '';
        const language = node.language || '';
        lines.push(`\`\`\`${language}`);
        lines.push(codeContent);
        lines.push('```');
        break;

      case 'text':
        return serializeTextNode(node);

      case 'link':
        const linkText = serializeNodesToMarkdown(node.children || [], depth);
        return `[${linkText}](${node.url})`;

      case 'linebreak':
        return '  \n';

      default:
        // Handle unknown node types
        if (node.children) {
          lines.push(serializeNodesToMarkdown(node.children, depth));
        }
    }
  }

  return lines.join('\n');
}

/**
 * Determine separator type based on block content
 */
function determineSeparator(markdown: string): 'inline' | 'block' {
  const lines = markdown.trim().split('\n');

  // If multiple lines or contains line breaks, use block separator
  if (lines.length > 1) {
    return 'block';
  }

  // If single line with content, use inline separator
  return 'inline';
}

/**
 * Extract all BlockNodes from an editor state
 */
function extractBlockNodes(editorState: string): SerializedBlockNode[] {
  try {
    const parsed: SerializedEditorState = JSON.parse(editorState);
    return parsed.root.children.filter(
      (node): node is SerializedBlockNode => node.type === 'block'
    );
  } catch (error) {
    console.error('Error parsing editor state:', error);
    return [];
  }
}

/**
 * Convert editor states to .3md file content
 *
 * @param editorStates - Editor states for all three languages
 * @param blocks - Block metadata
 * @param frontmatter - Optional YAML frontmatter
 * @returns .3md file content as string
 */
export function serialize3md(
  editorStates: EditorStates,
  blocks: Block[],
  frontmatter: Record<string, any> | null
): string {
  const lines: string[] = [];

  // Add YAML frontmatter if present
  if (frontmatter && Object.keys(frontmatter).length > 0) {
    lines.push('---');
    for (const [key, value] of Object.entries(frontmatter)) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
    lines.push('---');
    lines.push('');
  }

  // Add language declaration
  lines.push('{{langs|si|ta|en}}');
  lines.push('');

  // Extract BlockNodes from each language
  const siBlocks = editorStates.si ? extractBlockNodes(editorStates.si) : [];
  const taBlocks = editorStates.ta ? extractBlockNodes(editorStates.ta) : [];
  const enBlocks = editorStates.en ? extractBlockNodes(editorStates.en) : [];

  const maxBlocks = Math.max(siBlocks.length, taBlocks.length, enBlocks.length);

  // Process each block
  for (let i = 0; i < maxBlocks; i++) {
    const siBlock = siBlocks[i];
    const taBlock = taBlocks[i];
    const enBlock = enBlocks[i];

    // Convert each language variant to markdown
    const siMarkdown = siBlock
      ? serializeNodesToMarkdown(siBlock.children || [])
      : '';
    const taMarkdown = taBlock
      ? serializeNodesToMarkdown(taBlock.children || [])
      : '';
    const enMarkdown = enBlock
      ? serializeNodesToMarkdown(enBlock.children || [])
      : '';

    // Determine separator type (use block separator if any variant is multi-line)
    const separator = determineSeparator(siMarkdown) === 'block' ||
                      determineSeparator(taMarkdown) === 'block' ||
                      determineSeparator(enMarkdown) === 'block'
      ? 'block'
      : 'inline';

    if (separator === 'inline') {
      // Inline separator: si~ta~en
      const inlineSi = siMarkdown.replace(/\n/g, ' ').trim();
      const inlineTa = taMarkdown.replace(/\n/g, ' ').trim();
      const inlineEn = enMarkdown.replace(/\n/g, ' ').trim();
      lines.push(`${inlineSi}~${inlineTa}~${inlineEn}`);
    } else {
      // Block separator: use ෴ (kunddaliya)
      lines.push(siMarkdown.trim());
      lines.push('෴');
      lines.push(taMarkdown.trim());
      lines.push('෴');
      lines.push(enMarkdown.trim());
    }

    // Add spacing between blocks
    if (i < maxBlocks - 1) {
      lines.push('');
    }
  }

  return lines.join('\n') + '\n';
}

/**
 * Check if all editor states are empty
 */
export function isEditorEmpty(editorStates: EditorStates): boolean {
  return !editorStates.si && !editorStates.ta && !editorStates.en;
}

/**
 * Get block count from editor states
 */
export function getBlockCount(editorStates: EditorStates): number {
  if (!editorStates.si) return 0;

  const siBlocks = extractBlockNodes(editorStates.si);
  return siBlocks.length;
}
