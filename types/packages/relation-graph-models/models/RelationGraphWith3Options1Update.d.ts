import { RGLine, RGNode, RGOptions } from '../../types';
import { RelationGraphWith2Data5LineConfig } from './RelationGraphWith2Data5LineConfig';
/**
 * Class related to options data update of relation-graph component
 */
export declare class RelationGraphWith3Options1Update extends RelationGraphWith2Data5LineConfig {
    constructor();
    /**
     * @inner
     */
    protected _updateOptions(options: RGOptions): void;
    /**
     * When the size of the parent element of the relation-graph component changes, you can call this method to recalculate the view size
     * @param zoomTo100
     * @protected
     * @inner
     */
    protected resetViewSize(zoomTo100?: boolean): void;
    /**
     * Lock the graph component screen and display a piece of text
     * @param graphLoadingText The text to display
     */
    loading(graphLoadingText?: string): void;
    /**
     * Clear the lock on the graph component screen
     */
    clearLoading(): void;
    /**
     * Set the checked node
     * @param node
     */
    setCheckedNode(node: string | RGNode): void;
    /**
     * Set the checked line
     * @param line
     */
    setCheckedLine(line: string | RGLine): void;
    /**
     * Clear all checked nodes and lines
     */
    clearChecked(): void;
    /**
     * Clear all selected nodes and lines
     */
    clearSelected(): void;
    /**
     * Set the canvas offset, used when dragging the canvas
     * @param x
     * @param y
     */
    setCanvasOffset(x: number, y: number): void;
    /**
     * Set the current canvas to move mode
     * @param newValue
     * @protected
     * @inner
     */
    protected setCanvasMoveMode(newValue: boolean): void;
    /**
     * @inner
     */
    onMiniViewMounted(): void;
    /**
     * @inner
     */
    onMiniViewUnMounted(): void;
    /**
     * @inner
     */
    onReferenceLineMounted(adsorption: boolean): void;
    /**
     * @inner
     */
    onReferenceLineUnMounted(): void;
}
