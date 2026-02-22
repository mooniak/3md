/**
 * FileImporter - Component for importing .3md files
 */

import { useRef, useState } from 'react';
import { useEditorStore } from '../../lib/state/editorStore';
import { deserialize3md } from '../../lib/editor/3mdDeserializer';

export function FileImporter() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setEditorStates = useEditorStore((state) => state.setEditorStates);
  const setBlocks = useEditorStore((state) => state.setBlocks);
  const setFrontmatter = useEditorStore((state) => state.setFrontmatter);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file extension
    if (!file.name.endsWith('.3md')) {
      setError('Please select a .3md file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Read file content
      const content = await file.text();

      // Deserialize to Lexical editor states
      const { editorStates, blocks, frontmatter } = deserialize3md(content);

      // Update Zustand store
      setEditorStates(editorStates);
      setBlocks(blocks);
      setFrontmatter(frontmatter);

      console.log('Successfully imported 3md file:', file.name);
      console.log('Blocks:', blocks.length);
    } catch (err) {
      console.error('Error importing file:', err);
      setError(err instanceof Error ? err.message : 'Failed to import file');
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="inline-block">
      <input
        ref={fileInputRef}
        type="file"
        accept=".3md"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Import 3md file"
      />
      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Import a .3md file"
      >
        {isLoading ? 'Importing...' : 'Import'}
      </button>
      {error && (
        <div className="absolute mt-2 px-3 py-2 bg-red-600 text-white text-xs rounded-md shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
