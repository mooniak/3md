/**
 * FileExporter - Component for exporting to .3md files
 */

import { useState } from 'react';
import { saveAs } from 'file-saver';
import { useEditorStore } from '../../lib/state/editorStore';
import { serialize3md, isEditorEmpty } from '../../lib/editor/3mdSerializer';

export function FileExporter() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editorStates = useEditorStore((state) => state.editorStates);
  const blocks = useEditorStore((state) => state.blocks);
  const frontmatter = useEditorStore((state) => state.frontmatter);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      // Check if editor has content
      if (isEditorEmpty(editorStates)) {
        setError('No content to export');
        setIsExporting(false);
        return;
      }

      // Serialize editor states to 3md format
      const content = serialize3md(editorStates, blocks, frontmatter);

      // Create blob and trigger download
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `document-${timestamp}.3md`;

      saveAs(blob, filename);

      console.log('Successfully exported to:', filename);
    } catch (err) {
      console.error('Error exporting file:', err);
      setError(err instanceof Error ? err.message : 'Failed to export file');
    } finally {
      setIsExporting(false);
    }
  };

  const isEmpty = isEditorEmpty(editorStates);

  return (
    <div className="inline-block relative">
      <button
        onClick={handleExport}
        disabled={isExporting || isEmpty}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={isEmpty ? 'No content to export' : 'Export to .3md file'}
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </button>
      {error && (
        <div className="absolute right-0 mt-2 px-3 py-2 bg-red-600 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
}
