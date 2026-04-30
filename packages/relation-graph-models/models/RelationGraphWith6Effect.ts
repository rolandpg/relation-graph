import {devLog} from '../utils/RGCommon';
import {RGNode, RGRectTarget} from '../../types';
import {RelationGraphWith5Zoom} from './RelationGraphWith5Zoom';

/**
* Methods related to effects in the relation-graph component
*/
export class RelationGraphWith6Effect extends RelationGraphWith5Zoom {
    constructor() {
        super();
    }

    /**
     * <RelationGraph/> Automatically adjust the height of the canvas to fit the content, while maintaining the width of the canvas unchanged.
     * - By default, the height of the <RelationGraph/> component is the height of the parent element. Sometimes we want to automatically adjust the height according to the amount of content to fit the content. This method can achieve this function.
     * - Note: This method will modify the height attribute of the canvas. Please ensure that the parent element allows the height of the child element to change, otherwise it may not achieve the expected effect.
     * - Note: This method is suitable for scenarios where there is less content and you want the canvas height to adapt to the content. If there is more content, it is recommended to use the zoomToFit method to ensure that the content is fully displayed.
     * @param padding Padding around the content, default is 20px
     *
     */
    fitContentHeight(padding = 20) {
        this.dataProvider.updateOptions({
            canvasOpacity: 0.01
        });
        this._dataUpdated();
        const options = this.getOptions();
        const nodesRect = this.getNodesRectBox();
        const nodesHeight = nodesRect.height;
        const nodesWidth = nodesRect.width;
        const viewWidth = options.viewSize.width - padding * 2;
        // const viewHeight = this.options.viewSize.height;
        const nodesCenterX = nodesRect.minX + nodesRect.width / 2;
        const nodesCenterY = nodesRect.minY + nodesRect.height / 2;
        // console.warn('[fitContentHeight]nodesCenter:', nodesCenterX, nodesCenterY);
        this.dataProvider.setCanvasCenter(nodesCenterX, nodesCenterY);
        const scale = Math.min(1, (viewWidth / nodesWidth));
        const newViewHeight = (nodesHeight * scale + padding * 2);
        this.dataProvider.updateOptions({
            viewSize: {
                ...options.viewSize,
                height: newViewHeight
            },
            viewHeight: newViewHeight + 'px'
        });
        setTimeout(() => {
            this.setZoom(scale * 100);
            this._moveToCenter();
            this.dataProvider.updateOptions({
                canvasOpacity: 1
            });
            this._dataUpdated();
        }, 200);
    }

    /**
     * Move the specified nodes to the center of the visible area
     * @param nodes Optional, defaults to all nodes in the graph
     * @inner
     * @protected
     */
    protected _moveToCenter(nodes?: (RGNode | RGRectTarget)[]) {
        const center = this.getNodesCenter(nodes);
        this.dataProvider.setCanvasCenter(center.x, center.y);
        this._dataUpdated();
    }

    /**
     * Move the specified coordinates on the canvas to the center of the visible area
     * @param x X coordinate on the canvas
     * @param y Y coordinate on the canvas
     */
    setCanvasCenter(x: number, y: number) {
        this.dataProvider.setCanvasCenter(x, y);
        this._dataUpdated();
    }

    /**
     * Zoom to fit the appropriate size, which means making the specified nodes visible in the view and occupying the view as much as possible.
     * @param nodes Optional, defaults to all nodes in the graph
     */
    zoomToFit(nodes?: (RGNode | RGRectTarget)[]) {
        const options = this.getOptions();
        const rectItems = this.getCanvasSlotRectItems(); // 获取画布插槽中的元素大小信息
        const mixedRectItems = rectItems.length > 0 ? [...rectItems, ...(nodes || this.getNodes())] : nodes;
        const stuffSize = this.getNodesRectBox(mixedRectItems);
        const padding = 50;
        const zoomPercentX = options.viewSize.width / (stuffSize.width + padding * 2);
        const zoomPercentY = options.viewSize.height / (stuffSize.height + padding * 2);
        const zoomPercent = Math.min(zoomPercentX, zoomPercentY, 1);
        devLog('zoomToFit:', {stuffSize, zoomPercent, zoomPercentX, zoomPercentY, viewSize: options.viewSize});
        this._moveToCenter(mixedRectItems);
        this.setZoom(zoomPercent * 100);
        this._dataUpdated();
    }
    async zoomToFitWithAnimation(nodes?: (RGNode | RGRectTarget)[]) {
        this.enableCanvasAnimation();
        this.zoomToFit(nodes);
        await this.sleep(330);
        this.disableCanvasAnimation();
    }
    async moveToCenterWithAnimation(nodes?: (RGNode | RGRectTarget)[]) {
        this.enableCanvasAnimation();
        this.moveToCenter(nodes);
        await this.sleep(330);
        this.disableCanvasAnimation();
    }
    /**
     * Enable node position animation
     * - After enabling, when the node position changes, there will be a smooth transition animation effect.
     */
    enableNodeXYAnimation() {
        this.dataProvider.updateOptions({
            enableNodeXYAnimation: true
        });
        this._dataUpdated();
    }

    /**
     * Disable node position animation
     * - After disabling, when the node position changes, it will directly jump to the new position without animation.
     */
    disableNodeXYAnimation() {
        this.dataProvider.updateOptions({
            enableNodeXYAnimation: false
        });
        this._dataUpdated();
    }

    /**
     * Enable canvas transformation animation
     * - After enabling, when the canvas is panned or zoomed, there will be a smooth transition animation effect.
     */
    enableCanvasAnimation() {
        this.dataProvider.updateOptions({
            enableCanvasTransformAnimation: true
        });
        this._dataUpdated();
    }

    /**
     * Disable canvas transformation animation
     * - After disabling, when the canvas is panned or zoomed, it will directly jump to the new position or scale without animation.
     */
    disableCanvasAnimation() {
        this.dataProvider.updateOptions({
            enableCanvasTransformAnimation: false
        });
        this._dataUpdated();
    }

    /**
     * Focus on the specified node by its ID
     * @param nodeId The ID of the node to focus on
     */
    focusNodeById(nodeId: string) {
        const node = this.getNodeById(nodeId);
        if (node) {
            this.focusNode(node);
        }
    }

    /**
     * @deprecated
     */
    focusRootNode() {
        throw new Error('focusRootNode is deprecated, please use focusNodeById instead.');
    }

    /**
     * @inner
     * @param thisNode
     * @private
     */
    private focusNode(thisNode: RGNode) {
        devLog('checked:', thisNode);
        const options = this.getOptions();
        this.setZoom(100);
        const _n_width = thisNode.width || 50;
        const _n_height = thisNode.height || 50;
        const _final_x = thisNode.x * -1 + options.viewSize.width / 2 - _n_width / 2;
        const _final_y = thisNode.y * -1 + options.viewSize.height / 2 - _n_height / 2;
        this.dataProvider.setCanvasOffset(_final_x, _final_y);
        this.dataProvider.updateOptions({
            checkedNodeId: thisNode.id
        });
    }
}
