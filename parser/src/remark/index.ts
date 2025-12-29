import type { Root } from 'mdast';
import type { TrimdOptions } from '../types';
import { parseLocale } from './locale.js';

/**
 * Remark plugin for 3md (Trilingual Markdown)
 *
 * This plugin processes 3md documents and extracts language-specific content
 * based on the provided locale option.
 *
 * @param options - Plugin options
 * @returns Transformer function for remark
 */
export default function remark3md(options?: TrimdOptions) {
  return (tree: Root) => {
    parseLocale(tree, options?.locale);
    return tree;
  };
}
