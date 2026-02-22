/**
 * Type definitions for 3md Editor
 */

// Language codes for 3md (Sinhala, Tamil, English)
export type Language = 'si' | 'ta' | 'en';

// Block types in 3md
export type BlockType = 'multi' | 'mono';

// Content element types (what kind of content this block contains)
export type ContentElementType = 'paragraph' | 'heading' | 'list' | 'blockquote' | 'table' | 'code';

// Separator types for multilingual content
export type SeparatorType = 'inline' | 'block' | 'none';

/**
 * A single content block with a unique ID
 */
export interface Block {
  id: string;  // UUID
  type: BlockType;  // 'multi' or 'mono'
  element?: ContentElementType;  // What type of content (heading, paragraph, list, etc.)
  headingLevel?: number;  // If element is 'heading', what level (1-6)
}

/**
 * Editor state for a single language (contains all blocks)
 * Stored as Lexical JSON string
 * REFACTORED: Single editor state per language, not per block
 */
export type EditorState = string | null;

/**
 * Editor states organized by language
 * Each language has ONE complete editor state containing all BlockNodes
 */
export interface EditorStates {
  si: EditorState;
  ta: EditorState;
  en: EditorState;
}

/**
 * Lint results from the lexical-linter package
 */
export interface LintResult {
  issues: LintIssue[];
  issuesByCategory: Record<string, LintIssue[]>;
  issuesBySeverity: Record<string, LintIssue[]>;
  errorCount: number;
  warningCount: number;
  infoCount: number;
}

/**
 * Individual lint issue
 */
export interface LintIssue {
  id: string;
  ruleId: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  affectedLanguages: string[];
  position?: { language: string; path: string };
  autoFixable?: boolean;
  suggestion?: string;
  details?: string;
}

/**
 * Main application state
 */
export interface AppState {
  // Document structure
  blocks: Block[];
  languages: readonly Language[];

  // Editor states (Lexical JSON per block per language)
  editorStates: EditorStates;

  // Linting results per block
  lintResults: Map<string, LintResult>;

  // YAML frontmatter (preserved from import)
  frontmatter: Record<string, any> | null;

  // UI state
  activeBlockId: string | null;
  syncInProgress: boolean;

  // Actions
  updateEditorContent: (lang: Language, state: string) => void;
  addBlock: (afterBlockId: string | null) => void;
  deleteBlock: (blockId: string) => void;
  syncBlockStructure: (blockId: string, sourceLang: Language) => void;
  setLintResults: (blockId: string, results: LintResult) => void;
  setFrontmatter: (frontmatter: Record<string, any> | null) => void;
  setBlocks: (blocks: Block[]) => void;
  setActiveBlock: (blockId: string | null) => void;
  setSyncInProgress: (inProgress: boolean) => void;
  setEditorStates: (editorStates: EditorStates) => void;
  clearAll: () => void;
}
