/**
 * useEditorClick - Hook to handle click events in editors for block highlighting
 */

import { useEffect } from 'react';
import type { RefObject } from 'react';

interface UseEditorClickParams {
  editorRef: RefObject<HTMLDivElement>;
  setActiveBlock: (blockId: string | null) => void;
  highlightBlock: (blockId: string, shouldScroll?: boolean) => void;
}

export function useEditorClick({
  editorRef,
  setActiveBlock,
  highlightBlock,
}: UseEditorClickParams) {
  useEffect(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Find the nearest parent element with data-block-id attribute
      const blockElement = target.closest('[data-block-id]');

      if (blockElement) {
        const blockId = blockElement.getAttribute('data-block-id');

        if (blockId) {
          // Set the block as active in the store
          setActiveBlock(blockId);

          // Highlight the block across all three editors WITH scrolling
          // (scrolling is now safe - focus loss was fixed in StateUpdatePlugin)
          highlightBlock(blockId, true);
        }
      }
    };

    // Attach click event listener
    editorElement.addEventListener('click', handleClick);

    // Cleanup on unmount
    return () => {
      editorElement.removeEventListener('click', handleClick);
    };
  }, [editorRef, setActiveBlock, highlightBlock]);
}
