/**
 * BlockNode - Custom Lexical node for 3md blocks
 *
 * This node serves as an invisible logical container for 3md blocks.
 * It maintains block correspondence across languages while providing
 * a seamless editing experience without visible separators.
 */

import type {
  BaseSelection,
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread,
} from 'lexical';
import { ElementNode } from 'lexical';
import type { BlockType, ContentElementType } from '../state/types';
import { generateBlockId } from '../utils/blockIdentifier';

export type SerializedBlockNode = Spread<
  {
    blockId: string;
    blockType: BlockType;
    contentType?: ContentElementType;
    headingLevel?: number;
  },
  SerializedElementNode
>;

export class BlockNode extends ElementNode {
  __blockId: string;
  __blockType: BlockType;
  __contentType?: ContentElementType;
  __headingLevel?: number;

  static getType(): string {
    return 'block';
  }

  static clone(node: BlockNode): BlockNode {
    const cloned = new BlockNode(
      node.__blockId,
      node.__blockType,
      node.__contentType,
      node.__headingLevel,
      node.__key
    );
    return cloned;
  }

  constructor(
    blockId: string,
    blockType: BlockType = 'multi',
    contentType?: ContentElementType,
    headingLevel?: number,
    key?: NodeKey
  ) {
    super(key);
    this.__blockId = blockId;
    this.__blockType = blockType;
    this.__contentType = contentType;
    this.__headingLevel = headingLevel;
  }

  getBlockId(): string {
    return this.__blockId;
  }

  getBlockType(): BlockType {
    return this.__blockType;
  }

  setBlockType(blockType: BlockType): void {
    const writable = this.getWritable();
    writable.__blockType = blockType;
  }

  getContentType(): ContentElementType | undefined {
    return this.__contentType;
  }

  setContentType(contentType: ContentElementType): void {
    const writable = this.getWritable();
    writable.__contentType = contentType;
  }

  getHeadingLevel(): number | undefined {
    return this.__headingLevel;
  }

  setHeadingLevel(level: number): void {
    const writable = this.getWritable();
    writable.__headingLevel = level;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    // Create a simple div container that's invisible to users
    const dom = document.createElement('div');
    dom.setAttribute('data-block-id', this.__blockId);
    dom.setAttribute('data-block-type', this.__blockType);
    if (this.__contentType) {
      dom.setAttribute('data-content-type', this.__contentType);
    }
    if (this.__headingLevel) {
      dom.setAttribute('data-heading-level', this.__headingLevel.toString());
    }
    // No visual styling - just a logical container
    return dom;
  }

  updateDOM(
    _prevNode: BlockNode,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    // Return false to indicate DOM doesn't need updates
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-block-id', this.__blockId);
    element.setAttribute('data-block-type', this.__blockType);
    if (this.__contentType) {
      element.setAttribute('data-content-type', this.__contentType);
    }
    if (this.__headingLevel) {
      element.setAttribute('data-heading-level', this.__headingLevel.toString());
    }
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-block-id')) {
          return null;
        }
        return {
          conversion: convertBlockElement,
          priority: 1,
        };
      },
    };
  }

  exportJSON(): SerializedBlockNode {
    return {
      ...super.exportJSON(),
      blockId: this.__blockId,
      blockType: this.__blockType,
      contentType: this.__contentType,
      headingLevel: this.__headingLevel,
      type: 'block',
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedBlockNode): BlockNode {
    const node = $createBlockNode(
      serializedNode.blockId,
      serializedNode.blockType,
      serializedNode.contentType,
      serializedNode.headingLevel
    );
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  // Allow block nodes to be merged if they're adjacent
  canMergeWith(_node: LexicalNode): boolean {
    return false;
  }

  // Block nodes can be split when user presses Enter
  canInsertAfter(): boolean {
    return true;
  }

  // Ensure block nodes are top-level elements in the editor
  isInline(): boolean {
    return false;
  }

  isShadowRoot(): boolean {
    return false;
  }

  /**
   * BlockNodes must never be removed even when empty.
   * This preserves block correspondence across languages.
   */
  canBeEmpty(): boolean {
    return false;
  }

  /**
   * Always include BlockNode wrapper when extracting children.
   * This ensures copy/paste preserves block boundaries.
   */
  extractWithChild(
    _child: LexicalNode,
    _selection: BaseSelection | null,
    _destination: 'clone' | 'html'
  ): boolean {
    return true;
  }

  /**
   * Prevent empty BlockNodes from merging with inserted content.
   * This maintains block separation during insertions.
   */
  canMergeWhenEmpty(): boolean {
    return false;
  }

  /**
   * Prevent BlockNode from collapsing when backspace is pressed at start.
   * Returns true to indicate the operation was handled.
   */
  collapseAtStart(_selection: RangeSelection): boolean {
    return true;
  }

  /**
   * Create a new BlockNode when Enter is pressed.
   * This maintains block structure and generates new block IDs.
   */
  insertNewAfter(
    _selection: RangeSelection,
    restoreSelection = true
  ): ElementNode | null {
    const newBlock = $createBlockNode(
      generateBlockId(), // Generate new unique ID
      this.__blockType,
      undefined, // contentType will be detected on save
      undefined  // headingLevel will be detected on save
    );

    const direction = this.getDirection();
    newBlock.setDirection(direction);

    this.insertAfter(newBlock, restoreSelection);

    return newBlock;
  }
}

function convertBlockElement(domNode: HTMLElement): { node: BlockNode } | null {
  const blockId = domNode.getAttribute('data-block-id');
  const blockType = domNode.getAttribute('data-block-type') as BlockType;
  const contentType = domNode.getAttribute('data-content-type') as ContentElementType | null;
  const headingLevelStr = domNode.getAttribute('data-heading-level');
  const headingLevel = headingLevelStr ? parseInt(headingLevelStr, 10) : undefined;

  if (!blockId) {
    return null;
  }

  const node = $createBlockNode(
    blockId,
    blockType || 'multi',
    contentType || undefined,
    headingLevel
  );
  return { node };
}

/**
 * Create a new BlockNode
 */
export function $createBlockNode(
  blockId: string,
  blockType: BlockType = 'multi',
  contentType?: ContentElementType,
  headingLevel?: number
): BlockNode {
  return new BlockNode(blockId, blockType, contentType, headingLevel);
}

/**
 * Type guard to check if a node is a BlockNode
 */
export function $isBlockNode(
  node: LexicalNode | null | undefined
): node is BlockNode {
  return node instanceof BlockNode;
}
