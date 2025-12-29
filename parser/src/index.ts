/**
 * 3md Parser - Trilingual Markdown for Sinhala, Tamil, English
 *
 * Main entry point for the 3md parser library
 */

export { default as remark3md } from './remark/index.js';
export type { TrimdOptions, TrimdDocument, Block, Lang, Locale } from './types';
export { splitToLanguageFiles, splitToFiles } from './splitter.js';
export { preprocessText } from './remark/preprocess.js';
