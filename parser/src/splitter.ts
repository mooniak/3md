/**
 * 3md Splitter - Split a 3md document into separate language files
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remark3md from './remark/index.js';
import { preprocessText } from './remark/preprocess.js';
import type { Lang } from './types';

/**
 * Split a 3md document into three separate markdown files
 *
 * @param content - The 3md document content
 * @returns Object with si, ta, and en markdown content
 */
export async function splitToLanguageFiles(content: string): Promise<{
  si: string;
  ta: string;
  en: string;
}> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkStringify);

  const result: { si: string; ta: string; en: string } = {
    si: '',
    ta: '',
    en: '',
  };

  // Process for each language
  for (const lang of ['si', 'ta', 'en'] as Lang[]) {
    // Preprocess to handle block separators
    const preprocessed = preprocessText(content, lang);

    const langProcessor = processor()
      .use(remark3md, { locale: lang });

    const file = await langProcessor.process(preprocessed);
    result[lang] = String(file);
  }

  return result;
}

/**
 * Split a 3md document and write to files
 *
 * @param content - The 3md document content
 * @param baseName - Base filename (without extension)
 * @returns Object with filenames and content
 */
export async function splitToFiles(
  content: string,
  baseName: string
): Promise<{
  files: Array<{ filename: string; content: string }>;
}> {
  const split = await splitToLanguageFiles(content);

  return {
    files: [
      { filename: `${baseName}.si.md`, content: split.si },
      { filename: `${baseName}.ta.md`, content: split.ta },
      { filename: `${baseName}.en.md`, content: split.en },
    ],
  };
}
