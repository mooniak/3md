/**
 * Zustand store for 3md Editor state management
 * REFACTORED: Single editor state per language (not per block)
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { syncBlockStructure as syncBlockStructureFn } from '../editor/BlockSyncManager';
import type { AppState, Block, Language, LintResult } from './types';

/**
 * Create the main application store using Zustand
 */
export const useEditorStore = create<AppState>((set, get) => ({
  // Initial state
  blocks: [],
  languages: ['si', 'ta', 'en'] as const,
  editorStates: {
    si: null,
    ta: null,
    en: null,
  },
  lintResults: new Map(),
  frontmatter: null,
  activeBlockId: null,
  syncInProgress: false,

  // Actions
  updateEditorContent: (lang: Language, state: string) => {
    set((prev) => ({
      editorStates: {
        ...prev.editorStates,
        [lang]: state,
      },
    }));
  },

  addBlock: (afterBlockId: string | null) => {
    set((state) => {
      const newBlock: Block = {
        id: uuidv4(),
        type: 'multi',
      };

      let newBlocks: Block[];
      if (afterBlockId === null) {
        // Add at the end
        newBlocks = [...state.blocks, newBlock];
      } else {
        // Insert after specified block
        const index = state.blocks.findIndex((b) => b.id === afterBlockId);
        if (index === -1) {
          newBlocks = [...state.blocks, newBlock];
        } else {
          newBlocks = [
            ...state.blocks.slice(0, index + 1),
            newBlock,
            ...state.blocks.slice(index + 1),
          ];
        }
      }

      return {
        blocks: newBlocks,
      };
    });
  },

  deleteBlock: (blockId: string) =>
    set((state) => {
      const newBlocks = state.blocks.filter((b) => b.id !== blockId);

      // Remove lint results
      const newLintResults = new Map(state.lintResults);
      newLintResults.delete(blockId);

      return {
        blocks: newBlocks,
        lintResults: newLintResults,
        activeBlockId: state.activeBlockId === blockId ? null : state.activeBlockId,
      };
    }),

  syncBlockStructure: (blockId, sourceLang) =>
    set((state) => {
      const newEditorStates = syncBlockStructureFn(state.editorStates, blockId, sourceLang);
      return { editorStates: newEditorStates };
    }),

  setLintResults: (blockId, results) =>
    set((state) => {
      const newLintResults = new Map(state.lintResults);
      newLintResults.set(blockId, results);
      return { lintResults: newLintResults };
    }),

  setFrontmatter: (frontmatter) => set({ frontmatter }),

  setBlocks: (blocks) => set({ blocks }),

  setActiveBlock: (blockId) => set({ activeBlockId: blockId }),

  setSyncInProgress: (inProgress) => set({ syncInProgress: inProgress }),

  setEditorStates: (editorStates) => set({ editorStates }),

  clearAll: () =>
    set({
      blocks: [],
      editorStates: {
        si: null,
        ta: null,
        en: null,
      },
      lintResults: new Map(),
      frontmatter: null,
      activeBlockId: null,
      syncInProgress: false,
    }),
}));
