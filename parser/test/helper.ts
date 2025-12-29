import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remark3md from '../src/remark/index.js';
import { preprocessText } from '../src/remark/preprocess.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Read a fixture file from the test/fixtures directory
 */
export function readFile(filename: string): string {
  const path = join(__dirname, 'fixtures', filename);
  return readFileSync(path, 'utf-8');
}

/**
 * Parse 3md content and return stringified markdown for a specific locale
 */
export function parseRemark(content: string, locale?: string): string {
  // Preprocess to handle block separators
  const preprocessed = preprocessText(content, locale);

  const processor = unified()
    .use(remarkParse)
    .use(remark3md, { locale })
    .use(remarkStringify);

  const result = processor.processSync(preprocessed);
  return String(result);
}
