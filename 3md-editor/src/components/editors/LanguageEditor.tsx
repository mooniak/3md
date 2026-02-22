/**
 * LanguageEditor - A single Lexical editor instance for one language
 * REFACTORED: This editor now contains ALL blocks for a language
 */

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import type { EditorState } from 'lexical';
import { useCallback, useEffect, useRef } from 'react';
import type { Language } from '../../lib/state/types';
import { BlockNode } from '../../lib/nodes/BlockNode';
import { useEditorClick } from '../../hooks/useEditorClick';
import { useBlockHighlight } from '../../hooks/useBlockHighlight';
import { useEditorStore } from '../../lib/state/editorStore';
import { FormattingToolbar } from './FormattingToolbar';

interface LanguageEditorProps {
  language: Language;
  initialState?: string | null;
  onChange: (language: Language, state: string) => void;
}

/**
 * Plugin to update editor state when initialState prop changes
 */
function StateUpdatePlugin({ stateJson }: { stateJson?: string | null }) {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only set state on initial mount, not on subsequent changes
    // This prevents focus loss during typing
    if (!stateJson || hasInitialized.current) return;

    try {
      const parsedState = editor.parseEditorState(stateJson);
      editor.setEditorState(parsedState);
      hasInitialized.current = true;
    } catch (error) {
      console.error('[StateUpdatePlugin] Error setting editor state:', error);
    }
  }, [editor, stateJson]);

  return null;
}

const languageLabels: Record<Language, string> = {
  si: 'සිංහල (Sinhala)',
  ta: 'தமிழ் (Tamil)',
  en: 'English',
};

export function LanguageEditor({
  language,
  initialState,
  onChange,
}: LanguageEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const setActiveBlock = useEditorStore((state) => state.setActiveBlock);
  const { highlightBlock } = useBlockHighlight();

  // Setup click handling for block highlighting
  useEditorClick({
    editorRef,
    setActiveBlock,
    highlightBlock,
  });

  const handleChange = useCallback(
    (editorState: EditorState) => {
      const json = JSON.stringify(editorState.toJSON());
      onChange(language, json);
    },
    [language, onChange]
  );

  const initialConfig = {
    namespace: `Editor-${language}`,
    nodes: [BlockNode, HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
    theme: {
      paragraph: 'mb-2',
      heading: {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
        h3: 'text-xl font-bold mb-2',
      },
      list: {
        ul: 'list-disc list-inside mb-2',
        ol: 'list-decimal list-inside mb-2',
        listitem: 'ml-4',
      },
      link: 'text-blue-600 underline hover:text-blue-800',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
    },
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    editorState: initialState || undefined,
  };

  return (
    <div
      ref={editorRef}
      className="flex flex-col h-full border border-gray-300 rounded-lg overflow-hidden bg-white"
    >
      {/* Language Label */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
        <h3 className="text-sm font-semibold text-gray-700">
          {languageLabels[language]}
        </h3>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto flex flex-col">
        <LexicalComposer initialConfig={initialConfig}>
          <div className="flex flex-col h-full">
            <FormattingToolbar />
            <div className="relative flex-1">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="outline-none p-4 min-h-full focus:ring-2 focus:ring-blue-500 focus:ring-inset" />
                }
                placeholder={
                  <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                    Start typing in {languageLabels[language]}...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <ListPlugin />
              <LinkPlugin />
              <OnChangePlugin onChange={handleChange} />
              <StateUpdatePlugin stateJson={initialState} />
            </div>
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
}
