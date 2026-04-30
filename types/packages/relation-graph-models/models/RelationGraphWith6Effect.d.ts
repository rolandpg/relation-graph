import { RGNode, RGRectTarget } from '../../types';
import { RelationGraphWith5Zoom } from './RelationGraphWith5Zoom';
/**
* Methods related to effects in the relation-graph component
*/
export declare class RelationGraphWith6Effect extends RelationGraphWith5Zoom {
    constructor();
    /**
     * <RelationGraph/> Automatically adjust the height of the canvas to fit the content, while maintaining the width of the canvas unchanged.
     * - By default, the height of the <RelationGraph/> component is the height of the parent element. Sometimes we want to automatically adjust the height according to the amount of content to fit the content. This method can achieve this function.
     * - Note: This method will modify the height attribute of the canvas. Please ensure that the parent element allows the height of the child element to change, otherwise it may not achieve the expected effect.
     * - Note: This method is suitable for scenarios where there is less content and you want the canvas height to adapt to the content. If there is more content, it is recommended to use the zoomToFit method to ensure that the content is fully displayed.
     * @param padding Padding around the content, default is 20px
     *
     */
    fitContentHeight(padding?: number): void;
    /**
     * Move the specified nodes to the center of the visible area
     * @param nodes Optional, defaults to all nodes in the graph
     * @inner
     * @protected
     */
    protected _moveToCenter(nodes?: (RGNode | RGRectTarget)[]): void;
    /**
     * Move the specified coordinates on the canvas to the center of the visible area
     * @param x X coordinate on the canvas
     * @param y Y coordinate on the canvas
     */
    setCanvasCenter(x: number, y: number): void;
    /**
     * Zoom to fit the appropriate size, which means making the specified nodes visible in the view and occupying the view as much as possible.
     * @param nodes Optional, defaults to all nodes in the graph
     */
    zoomToFit(nodes?: (RGNode | RGRectTarget)[]): void;
    zoomToFitWithAnimation(nodes?: (RGNode | RGRectTarget)[]): Promise<void>;
    moveToCenterWithAnimation(nodes?: (RGNode | RGRectTarget)[]): Promise<void>;
    /**
     * Enable node position animation
     * - After enabling, when the node position changes, there will be a smooth transition animation effect.
     */
    enableNodeXYAnimation(): void;
    /**
     * Disable node position animation
     * - After disabling, when the node position changes, it will directly jump to the new position without animation.
     */
    disableNodeXYAnimation(): void;
    /**
     * Enable canvas transformation animation
     * - After enabling, when the canvas is panned or zoomed, there will be a smooth transition animation effect.
     */
    enableCanvasAnimation(): void;
    /**
     * Disable canvas transformation animation
     * - After disabling, when the canvas is panned or zoomed, it will directly jump to the new position or scale without animation.
     */
    disableCanvasAnimation(): void;
    /**
     * Focus on the specified node by its ID
     * @param nodeId The ID of the node to focus on
     */
    focusNodeById(nodeId: string): void;
    /**
     * @deprecated
     */
    focusRootNode(): void;
    /**
     * @inner
     * @param thisNode
     * @private
     */
    private focusNode;
}
