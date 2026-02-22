/**
 * FormattingToolbar - Text formatting controls for each editor
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $isHeadingNode } from '@lexical/rich-text';

export function FormattingToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        setBlockType(element.getTag());
      } else if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, $isListNode);
        const listType = parentList ? parentList.getListType() : 'bullet';
        setBlockType(listType === 'number' ? 'ol' : 'ul');
      } else {
        setBlockType('paragraph');
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1
    );
  }, [editor, updateToolbar]);

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatList = (listType: 'ul' | 'ol') => {
    if (blockType === listType) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      if (listType === 'ul') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    }
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-200 bg-gray-50">
      {/* Bold */}
      <button
        onClick={() => formatText('bold')}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          isBold ? 'bg-gray-300 font-bold' : ''
        }`}
        title="Bold (Ctrl+B)"
        aria-label="Format bold"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3v14h5.5c2.5 0 4.5-2 4.5-4.5 0-1.5-.7-2.8-1.8-3.5C14.3 8.3 15 7 15 5.5 15 3 13 1 10.5 1H5v2zm2 2h3.5c1.4 0 2.5 1.1 2.5 2.5S11.9 10 10.5 10H7V5zm0 7h4c1.7 0 3 1.3 3 3s-1.3 3-3 3H7v-6z" />
        </svg>
      </button>

      {/* Italic */}
      <button
        onClick={() => formatText('italic')}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          isItalic ? 'bg-gray-300 italic' : ''
        }`}
        title="Italic (Ctrl+I)"
        aria-label="Format italic"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 3h8v2h-3l-4 10h3v2H4v-2h3l4-10H8V3z" />
        </svg>
      </button>

      {/* Underline */}
      <button
        onClick={() => formatText('underline')}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          isUnderline ? 'bg-gray-300 underline' : ''
        }`}
        title="Underline (Ctrl+U)"
        aria-label="Format underline"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 2h2v8c0 2.2 1.8 4 4 4s4-1.8 4-4V2h2v8c0 3.3-2.7 6-6 6s-6-2.7-6-6V2zm0 16h12v2H4v-2z" />
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Unordered List */}
      <button
        onClick={() => formatList('ul')}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          blockType === 'ul' ? 'bg-gray-300' : ''
        }`}
        title="Bullet List"
        aria-label="Insert bullet list"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 5h2v2H3V5zm4 0h10v2H7V5zm-4 4h2v2H3V9zm4 0h10v2H7V9zm-4 4h2v2H3v-2zm4 0h10v2H7v-2z" />
        </svg>
      </button>

      {/* Ordered List */}
      <button
        onClick={() => formatList('ol')}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          blockType === 'ol' ? 'bg-gray-300' : ''
        }`}
        title="Numbered List"
        aria-label="Insert numbered list"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 3h2v2H3V3zm0 4h2v2H3V7zm0 4h2v2H3v-2zM3 15h2v2H3v-2zM7 5h10v2H7V5zm0 4h10v2H7V9zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" />
        </svg>
      </button>
    </div>
  );
}
