/**
 * Main App component for 3md Editor
 */

import { EditorToolbar } from './components/editors/EditorToolbar';
import { ParallelEditorGroup } from './components/editors/ParallelEditorGroup';
import { LintPanel } from './components/linting/LintPanel';
import { useLinting } from './hooks/useLinting';

function App() {
  // Run linting with debouncing
  useLinting(500);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <EditorToolbar />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editors */}
        <div className="flex-1 overflow-auto">
          <ParallelEditorGroup />
        </div>

        {/* Lint panel sidebar - fixed width when open, collapsed to button when closed */}
        <div className="flex-shrink-0">
          <LintPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
