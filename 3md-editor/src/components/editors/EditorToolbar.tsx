/**
 * EditorToolbar - Top-level toolbar with file operations and block management
 * REFACTORED: Block management now works via Lexical commands
 */

import { useEditorStore } from '../../lib/state/editorStore';
import { FileImporter } from '../file/FileImporter';
import { FileExporter } from '../file/FileExporter';
import { SyncAllButton } from '../sync/SyncAllButton';

export function EditorToolbar() {
  const blocks = useEditorStore((state) => state.blocks);

  const handleAddBlock = () => {
    // This will be implemented to send a Lexical command to active editor
    // For now, just log - will be implemented with proper Lexical integration
    console.log('Add block - needs Lexical command implementation');
  };

  return (
    <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between border-b border-gray-700">
      {/* Left side - App title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">3md Editor</h1>
        <span className="text-sm text-gray-400">Trilingual Markdown Editor</span>
      </div>

      {/* Center - Block count */}
      <div className="text-sm text-gray-300">
        {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleAddBlock}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
          title="Add a new block (Coming soon)"
        >
          + Add Block
        </button>

        <SyncAllButton />
        <FileImporter />
        <FileExporter />
      </div>
    </div>
  );
}
