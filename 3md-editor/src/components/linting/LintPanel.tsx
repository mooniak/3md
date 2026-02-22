/**
 * LintPanel - Toggleable sidebar panel displaying linting results
 */

import { useState } from 'react';
import { useEditorStore } from '../../lib/state/editorStore';
import { useBlockHighlight } from '../../hooks/useBlockHighlight';

export function LintPanel() {
  const lintResults = useEditorStore((state) => state.lintResults);
  const blocks = useEditorStore((state) => state.blocks);
  const activeBlockId = useEditorStore((state) => state.activeBlockId);
  const setActiveBlock = useEditorStore((state) => state.setActiveBlock);
  const [isOpen, setIsOpen] = useState(true);
  const { highlightBlock, clearHighlights } = useBlockHighlight();

  // Aggregate all issues
  const allIssues: Array<{ blockId: string; issue: any }> = [];
  lintResults.forEach((result, blockId) => {
    if (result.issues && result.issues.length > 0) {
      result.issues.forEach((issue) => {
        allIssues.push({ blockId, issue });
      });
    }
  });

  // Group by severity
  const errorCount = allIssues.filter((i) => i.issue.severity === 'error').length;
  const warningCount = allIssues.filter((i) => i.issue.severity === 'warning').length;
  const infoCount = allIssues.filter((i) => i.issue.severity === 'info').length;

  // If panel is closed, show toggle button
  if (!isOpen) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="absolute right-0 top-4 bg-gray-800 text-white px-3 py-2 rounded-l-lg shadow-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          title="Show linting panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {allIssues.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {allIssues.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-l border-gray-300 h-full w-80 flex flex-col shadow-lg">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Linting Results</h2>
          <div className="flex gap-2 text-xs">
            {errorCount > 0 && (
              <span className="bg-red-600 px-2 py-0.5 rounded">
                {errorCount} error{errorCount !== 1 ? 's' : ''}
              </span>
            )}
            {warningCount > 0 && (
              <span className="bg-yellow-600 px-2 py-0.5 rounded">
                {warningCount} warning{warningCount !== 1 ? 's' : ''}
              </span>
            )}
            {infoCount > 0 && (
              <span className="bg-blue-600 px-2 py-0.5 rounded">
                {infoCount} info
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            clearHighlights();
            setActiveBlock(null);
          }}
          className="text-gray-300 hover:text-white transition-colors"
          title="Hide linting panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Issue list - Scrollable */}
      {allIssues.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="mt-2 text-sm font-medium text-green-800">
              No linting issues found
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Your content is well-formed!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {allIssues.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveBlock(item.blockId);
                highlightBlock(item.blockId);
              }}
              className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all ${
                item.issue.severity === 'error'
                  ? 'bg-red-50 border-red-500'
                  : item.issue.severity === 'warning'
                  ? 'bg-yellow-50 border-yellow-500'
                  : 'bg-blue-50 border-blue-500'
              } ${
                activeBlockId === item.blockId
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold uppercase ${
                        item.issue.severity === 'error'
                          ? 'text-red-800'
                          : item.issue.severity === 'warning'
                          ? 'text-yellow-800'
                          : 'text-blue-800'
                      }`}
                    >
                      {item.issue.severity}
                    </span>
                    <span className="text-xs text-gray-500">
                      Block {item.blockId.substring(0, 8)}...
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      item.issue.severity === 'error'
                        ? 'text-red-900'
                        : item.issue.severity === 'warning'
                        ? 'text-yellow-900'
                        : 'text-blue-900'
                    }`}
                  >
                    {item.issue.message}
                  </p>
                  {item.issue.details && (
                    <p className="text-xs text-gray-600 mt-1">{item.issue.details}</p>
                  )}
                  {item.issue.suggestion && (
                    <p className="text-xs text-gray-700 mt-2 italic">
                      💡 {item.issue.suggestion}
                    </p>
                  )}
                  {item.issue.affectedLanguages && (
                    <div className="flex gap-1 mt-2">
                      {item.issue.affectedLanguages.map((lang: string) => (
                        <span
                          key={lang}
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
