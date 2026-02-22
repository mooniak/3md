/**
 * useLinting - React hook for real-time linting of editor content
 */

import { useEffect, useState } from 'react';
import { useEditorStore } from '../lib/state/editorStore';
import { createLintEngine, allRules } from '@mooniak/lexical-linter';
import type { LintResult } from '../lib/state/types';

// Create and configure the lint engine once
const lintEngine = createLintEngine();
lintEngine.registerRules(allRules);

// Configure which rules to enable
lintEngine.updateConfig({
  rules: {
    'matching-numbers': { enabled: true, severity: 'warning' },
    'matching-urls': { enabled: true, severity: 'warning' },
    'matching-emails': { enabled: true, severity: 'warning' },
    'matching-paragraph-count': { enabled: true, severity: 'error' },
    'matching-formatting-structure': { enabled: true, severity: 'warning' },
    'content-presence': { enabled: true, severity: 'error' },
    'balanced-parentheses': { enabled: true, severity: 'warning' },
    'balanced-brackets': { enabled: true, severity: 'warning' },
    'matching-quotes': { enabled: true, severity: 'info' },
  },
});

/**
 * Hook to run linting on all blocks with debouncing
 */
export function useLinting(debounceMs: number = 500) {
  const editorStates = useEditorStore((state) => state.editorStates);
  const blocks = useEditorStore((state) => state.blocks);
  const setLintResults = useEditorStore((state) => state.setLintResults);
  const [isLinting, setIsLinting] = useState(false);

  useEffect(() => {
    // Debounce linting
    const timeoutId = setTimeout(() => {
      runLinting();
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [editorStates, blocks, debounceMs]);

  const runLinting = async () => {
    setIsLinting(true);

    try {
      // Lint each block
      for (const block of blocks) {
        const blockStates = extractBlockStates(block.id, editorStates);

        if (!blockStates.sinhala || !blockStates.tamil || !blockStates.english) {
          continue;
        }

        // Create linting context
        const context = {
          languages: ['sinhala', 'tamil', 'english'] as const,
          states: blockStates,
          metadata: {
            blockId: block.id,
            blockType: block.type,
            contentType: block.element,
            headingLevel: block.headingLevel,
          },
        };

        // Run linting
        const result = lintEngine.lint(context);

        // Convert to our LintResult type
        const lintResult: LintResult = {
          issues: result.issues,
          summary: result.summary,
        };

        // Store results
        setLintResults(block.id, lintResult);
      }
    } catch (error) {
      console.error('Error during linting:', error);
    } finally {
      setIsLinting(false);
    }
  };

  return { isLinting };
}

/**
 * Extract block states for a specific block from all language editor states
 */
function extractBlockStates(
  blockId: string,
  editorStates: { si: string | null; ta: string | null; en: string | null }
): {
  sinhala: string | null;
  tamil: string | null;
  english: string | null;
} {
  const result = {
    sinhala: null as string | null,
    tamil: null as string | null,
    english: null as string | null,
  };

  // Extract Sinhala block
  if (editorStates.si) {
    const siState = JSON.parse(editorStates.si);
    const siBlock = findBlock(siState, blockId);
    if (siBlock) {
      result.sinhala = JSON.stringify({
        root: {
          children: siBlock.children || [],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      });
    }
  }

  // Extract Tamil block
  if (editorStates.ta) {
    const taState = JSON.parse(editorStates.ta);
    const taBlock = findBlock(taState, blockId);
    if (taBlock) {
      result.tamil = JSON.stringify({
        root: {
          children: taBlock.children || [],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      });
    }
  }

  // Extract English block
  if (editorStates.en) {
    const enState = JSON.parse(editorStates.en);
    const enBlock = findBlock(enState, blockId);
    if (enBlock) {
      result.english = JSON.stringify({
        root: {
          children: enBlock.children || [],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      });
    }
  }

  return result;
}

/**
 * Find a block node by ID in an editor state
 */
function findBlock(editorState: any, blockId: string): any | null {
  if (!editorState.root || !editorState.root.children) {
    return null;
  }

  return editorState.root.children.find(
    (node: any) => node.type === 'block' && node.blockId === blockId
  );
}
