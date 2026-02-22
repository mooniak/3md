/**
 * ParallelEditorGroup - Three-column layout with Lexical editors side-by-side
 * REFACTORED: One editor per language, each containing ALL blocks
 */

import { useEditorStore } from '../../lib/state/editorStore';
import { LanguageEditor } from './LanguageEditor';

export function ParallelEditorGroup() {
  const editorStates = useEditorStore((state) => state.editorStates);
  const updateEditorContent = useEditorStore((state) => state.updateEditorContent);

  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Sinhala Editor */}
        <LanguageEditor
          language="si"
          initialState={editorStates.si}
          onChange={updateEditorContent}
        />

        {/* Tamil Editor */}
        <LanguageEditor
          language="ta"
          initialState={editorStates.ta}
          onChange={updateEditorContent}
        />

        {/* English Editor */}
        <LanguageEditor
          language="en"
          initialState={editorStates.en}
          onChange={updateEditorContent}
        />
      </div>
    </div>
  );
}
