/**
 * BlockSyncManager - Manages block structure synchronization across languages
 *
 * Detects and synchronizes structural differences between language variants.
 */

import type { EditorStates, Language } from '../state/types';

export interface StructureDifference {
  blockId: string;
  languages: Language[];
  mismatches: string[];
}

export interface SyncResult {
  matched: boolean;
  differences: StructureDifference[];
}

/**
 * Compare block structures across all three languages
 */
export function detectStructureMismatches(
  editorStates: EditorStates,
  blockId: string
): SyncResult {
  // Parse editor states
  const states = {
    sinhala: editorStates.si ? JSON.parse(editorStates.si) : null,
    tamil: editorStates.ta ? JSON.parse(editorStates.ta) : null,
    english: editorStates.en ? JSON.parse(editorStates.en) : null,
  };

  // If any state is null, we can't compare
  if (!states.sinhala || !states.tamil || !states.english) {
    return {
      matched: true,
      differences: [],
    };
  }

  // Extract the specific block from each language's editor state
  const blockStates = {
    sinhala: extractBlockState(states.sinhala, blockId),
    tamil: extractBlockState(states.tamil, blockId),
    english: extractBlockState(states.english, blockId),
  };

  // If block doesn't exist in all languages, can't compare
  if (!blockStates.sinhala || !blockStates.tamil || !blockStates.english) {
    return {
      matched: true,
      differences: [],
    };
  }

  // Simple structure comparison
  const siStructure = getStructure(blockStates.sinhala);
  const taStructure = getStructure(blockStates.tamil);
  const enStructure = getStructure(blockStates.english);

  // Compare structures
  const matched =
    JSON.stringify(siStructure) === JSON.stringify(taStructure) &&
    JSON.stringify(taStructure) === JSON.stringify(enStructure);

  if (matched) {
    return {
      matched: true,
      differences: [],
    };
  }

  // Build difference report
  const mismatches: string[] = [];
  const affectedLanguages = new Set<Language>();

  if (siStructure.nodeCount !== taStructure.nodeCount) {
    mismatches.push(`Node count: si=${siStructure.nodeCount}, ta=${taStructure.nodeCount}`);
    affectedLanguages.add('si');
    affectedLanguages.add('ta');
  }

  if (siStructure.nodeCount !== enStructure.nodeCount) {
    mismatches.push(`Node count: si=${siStructure.nodeCount}, en=${enStructure.nodeCount}`);
    affectedLanguages.add('si');
    affectedLanguages.add('en');
  }

  if (taStructure.nodeCount !== enStructure.nodeCount) {
    mismatches.push(`Node count: ta=${taStructure.nodeCount}, en=${enStructure.nodeCount}`);
    affectedLanguages.add('ta');
    affectedLanguages.add('en');
  }

  const differences: StructureDifference[] = [{
    blockId,
    languages: Array.from(affectedLanguages),
    mismatches: mismatches.length > 0 ? mismatches : ['Structure mismatch'],
  }];

  return {
    matched: false,
    differences,
  };
}

/**
 * Extract a specific block's state from an editor state
 */
function extractBlockState(editorState: any, blockId: string): any | null {
  if (!editorState.root || !editorState.root.children) {
    return null;
  }

  // Find the block node with matching blockId
  const blockNode = editorState.root.children.find(
    (node: any) => node.type === 'block' && node.blockId === blockId
  );

  if (!blockNode) {
    return null;
  }

  // Return the block's children (the actual content structure)
  return {
    root: {
      children: blockNode.children || [],
      direction: null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  };
}

/**
 * Get simple structure info from a block state
 */
function getStructure(blockState: any): { nodeCount: number; types: string[] } {
  if (!blockState || !blockState.root || !blockState.root.children) {
    return { nodeCount: 0, types: [] };
  }

  const types: string[] = [];
  let nodeCount = 0;

  function traverse(node: any) {
    if (!node) return;
    nodeCount++;
    types.push(node.type || 'unknown');

    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  blockState.root.children.forEach(traverse);

  return { nodeCount, types };
}

/**
 * Synchronize structure from source language to target languages
 * This creates empty nodes in target languages to match the source structure
 */
export function syncBlockStructure(
  editorStates: EditorStates,
  blockId: string,
  sourceLang: Language
): EditorStates {
  // Parse editor states
  const states = {
    si: editorStates.si ? JSON.parse(editorStates.si) : null,
    ta: editorStates.ta ? JSON.parse(editorStates.ta) : null,
    en: editorStates.en ? JSON.parse(editorStates.en) : null,
  };

  if (!states[sourceLang]) {
    return editorStates;
  }

  // Extract source block structure
  const sourceBlock = extractBlockFromEditor(states[sourceLang], blockId);
  if (!sourceBlock) {
    return editorStates;
  }

  // Get the source block's children to use as a template
  const sourceChildren = sourceBlock.children || [];

  // Sync to other languages
  const targetLangs: Language[] = ['si', 'ta', 'en'].filter(lang => lang !== sourceLang);

  for (const targetLang of targetLangs) {
    if (states[targetLang]) {
      const targetBlock = extractBlockFromEditor(states[targetLang], blockId);
      if (targetBlock) {
        // Create empty nodes matching the source structure
        targetBlock.children = createEmptyNodesMatchingStructure(sourceChildren);
      }
    }
  }

  return {
    si: states.si ? JSON.stringify(states.si) : null,
    ta: states.ta ? JSON.stringify(states.ta) : null,
    en: states.en ? JSON.stringify(states.en) : null,
  };
}

/**
 * Extract block node from editor state (returns reference, not copy)
 */
function extractBlockFromEditor(editorState: any, blockId: string): any | null {
  if (!editorState.root || !editorState.root.children) {
    return null;
  }

  return editorState.root.children.find(
    (node: any) => node.type === 'block' && node.blockId === blockId
  );
}

/**
 * Create empty nodes that match a given structure
 */
function createEmptyNodesMatchingStructure(sourceChildren: any[]): any[] {
  const nodes: any[] = [];

  if (!sourceChildren || sourceChildren.length === 0) {
    return nodes;
  }

  for (const child of sourceChildren) {
    if (child.type === 'paragraph') {
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
    } else if (child.type === 'heading') {
      nodes.push({
        type: 'heading',
        tag: child.tag || 'h1',
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
    } else if (child.type === 'list') {
      // Count list items
      const itemCount = child.children?.length || 0;
      const listItems = [];

      for (let i = 0; i < itemCount; i++) {
        listItems.push({
          type: 'listitem',
          value: 1,
          children: [{
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
          }],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        });
      }

      nodes.push({
        type: 'list',
        listType: child.listType || 'bullet',
        start: 1,
        tag: child.tag || 'ul',
        children: listItems,
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      });
    }
  }

  return nodes;
}
