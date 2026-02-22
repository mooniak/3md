/**
 * useBlockHighlight - Hook for highlighting blocks across all three editors
 */

export function useBlockHighlight() {
  /**
   * Highlights all blocks with the given blockId across all three language editors
   * and optionally scrolls ALL of them into view
   */
  const highlightBlock = (blockId: string, shouldScroll: boolean = true) => {
    // First, clear any existing highlights
    clearHighlights();

    // Find all DOM elements with this block ID (should be 3: si, ta, en)
    const blockElements = document.querySelectorAll(`[data-block-id="${blockId}"]`);

    if (blockElements.length === 0) {
      console.warn(`[useBlockHighlight] No blocks found with ID: ${blockId}`);
      return;
    }

    // Add highlight class to all matching blocks
    blockElements.forEach((element) => {
      element.classList.add('block-highlighted');
    });

    // Only scroll if explicitly requested (default: true)
    if (shouldScroll) {
      // Scroll ALL blocks into view smoothly (one for each language editor)
      // Use requestAnimationFrame to ensure smooth scrolling across multiple containers
      requestAnimationFrame(() => {
        blockElements.forEach((element) => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        });
      });
    }
  };

  /**
   * Removes all block highlights from the page
   */
  const clearHighlights = () => {
    const highlightedElements = document.querySelectorAll('.block-highlighted');
    highlightedElements.forEach((element) => {
      element.classList.remove('block-highlighted');
    });
  };

  return {
    highlightBlock,
    clearHighlights,
  };
}
