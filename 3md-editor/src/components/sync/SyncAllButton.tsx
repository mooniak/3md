/**
 * SyncAllButton - Synchronizes structure across all blocks
 */

import { useState } from 'react';
import { useEditorStore } from '../../lib/state/editorStore';
import { detectStructureMismatches } from '../../lib/editor/BlockSyncManager';
import type { Language } from '../../lib/state/types';

export function SyncAllButton() {
  const blocks = useEditorStore((state) => state.blocks);
  const editorStates = useEditorStore((state) => state.editorStates);
  const syncBlockStructure = useEditorStore((state) => state.syncBlockStructure);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSyncAll = async () => {
    setIsProcessing(true);

    try {
      // Find all blocks with mismatches
      const blocksToSync: Array<{ blockId: string; sourceLang: Language }> = [];

      for (const block of blocks) {
        const result = detectStructureMismatches(editorStates, block.id);
        if (!result.matched) {
          // Default to syncing from Sinhala (first language)
          blocksToSync.push({
            blockId: block.id,
            sourceLang: 'si',
          });
        }
      }

      // Sync each block
      for (const { blockId, sourceLang } of blocksToSync) {
        syncBlockStructure(blockId, sourceLang);
        // Add small delay to allow state updates
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      console.log(`Synced ${blocksToSync.length} blocks`);
    } catch (error) {
      console.error('Error syncing blocks:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleSyncAll}
      disabled={isProcessing}
      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Synchronize structure across all languages"
    >
      {isProcessing ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Syncing...
        </span>
      ) : (
        '⚡ Sync All'
      )}
    </button>
  );
}
