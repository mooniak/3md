/**
 * 3md Type Definitions
 */

export type Lang = 'si' | 'ta' | 'en';

export type Locale = string; // e.g., 'si-ta-en', 'en', 'si-en', etc.

export interface TrimdOptions {
  locale?: Locale;
}

export interface TrimdDocument {
  frontmatter?: Record<string, any>;
  languages: Lang[];
  blocks: Block[];
}

export type BlockType = 'multi' | 'mono';
export type SeparatorType = 'inline' | 'block' | 'none';
export type ElementType = 'paragraph' | 'heading' | 'list' | 'blockquote' | 'table' | 'code';

export interface Block {
  type: BlockType;
  element: ElementType;
  separator: SeparatorType;
  variants?: Map<Lang, string>; // For multi blocks
  content?: string; // For mono blocks
}

export interface HeadingLangValues {
  [key: string]: string;
}

export interface ParagraphLangValues {
  [key: string]: string[];
}
