import {devLog} from '../utils/RGCommon';
import {RGCoordinate, RGEventNames} from '../../types';
import {RelationGraphWith4Line} from './RelationGraphWith4Line';

export type RGClientXy = RGCoordinate;

/**
 * Class related to zoom functionality in the relation-graph component
 */
export class RelationGraphWith5Zoom extends RelationGraphWith4Line {
    constructor() {
        super();
    }

    protected getClampedZoom(finalZoom: number) {
        const options = this.getOptions();
        return Math.max(options.minCanvasZoom, Math.min(options.maxCanvasZoom, finalZoom));
    }

    protected applyZoom(newZoom: number, canvasOffset: RGCoordinate, e?: WheelEvent) {
        if (this._rgAsConnectArea) {
            return;
        }
        const options = this.getOptions();
        const finalZoom = this.getClampedZoom(newZoom);
        const zoomBuff = finalZoom - options.canvasZoom;
        const offsetChanged = canvasOffset.x !== options.canvasOffset.x || canvasOffset.y !== options.canvasOffset.y;
        if (zoomBuff === 0 && !offsetChanged) {
            return;
        }
        try {
            const abortZoom = this.emitEvent(RGEventNames.beforeZoomStart, options.canvasZoom, zoomBuff, e);
            devLog('[zoom]', 'abortZoom:', abortZoom);
            if (abortZoom === true) {
                return;
            }
            const oldZoom = options.canvasZoom;
            this._performanceModeLogicHook(oldZoom, finalZoom);
            this.dataProvider.updateOptions({
                canvasOffset: {
                    x: canvasOffset.x,
                    y: canvasOffset.y
                },
                canvasZoom: finalZoom
            });
            this.emitEvent(RGEventNames.onZoomEnd, finalZoom, oldZoom);
        } finally {
            this._updateEditingControllerView(); // Includes _dataUpdated call
            this._dataUpdated();
        }
    }

    /**
     * Zoom based on the current zoom level
     * @param buff The additional zoom level to be added based on the current zoom level. A positive number indicates zooming in, and a negative number indicates zooming out, in percentage. For example: 10 means zoom in by 10%, -10 means zoom out by 10%
     * @param userZoomCenter User zoom center point coordinates, default is the center point of the view
     * @param e Mouse wheel event object, optional
     *
     */
    zoom(buff: number, userZoomCenter?: RGClientXy, e?: WheelEvent) {
        if (this._rgAsConnectArea) {
            return;
        }
        const options = this.getOptions();
        const viewRectBox = this.getViewBoundingClientRect();
        const finalZoom = this.getClampedZoom(options.canvasZoom + buff);
        if (!userZoomCenter) {
            userZoomCenter = {
                x: viewRectBox.x + viewRectBox.width / 2,
                y: viewRectBox.y + viewRectBox.height / 2,
            }
        }
        const mouseX = userZoomCenter.x - viewRectBox.left;
        const mouseY = userZoomCenter.y - viewRectBox.top;
        const oldScale = options.canvasZoom / 100;
        const newScale = finalZoom / 100;
        const newX = mouseX - (mouseX - options.canvasOffset.x) * (newScale / oldScale);
        const newY = mouseY - (mouseY - options.canvasOffset.y) * (newScale / oldScale);
        this.applyZoom(finalZoom, {
            x: newX,
            y: newY
        }, e);
    }

    protected setZoomAndOffset(finalZoom: number, canvasOffset: RGCoordinate, e?: WheelEvent) {
        this.applyZoom(finalZoom, canvasOffset, e);
    }

    /**
     * @inner
     * @protected
     */
    protected _performanceModeLogicHook(oldZoomValue: number, newZoomValue: number) {
        const options = this.getOptions();
        if (oldZoomValue <= 40) {
            if (newZoomValue > 40) {
                if (options.performanceMode) {
                    this.updateShouldRenderGraphData(true);
                }
                this.dataProvider.updateOptions({
                    showEasyView: false
                });
                devLog('zoom:hide:showEasyView', oldZoomValue, newZoomValue);
                this.updateElementLines();
            }
        } else if (oldZoomValue > 40) {
            if (newZoomValue <= 40) {
                devLog('zoom:show:showEasyView', oldZoomValue, newZoomValue);
                if (options.performanceMode) {
                    this.dataProvider.updateOptions({
                        showEasyView: true
                    });
                }
            }
        }
    }

    /**
     * Set the canvas zoom to the specified zoom level
     * @param finalZoom Target zoom level, expressed as a percentage, for example: 100 means 100%
     * @param userZoomCenter User zoom center point coordinates, default is the center point of the view
     *
     */
    setZoom(finalZoom: number, userZoomCenter?: RGClientXy) {
        const options = this.getOptions();
        const buff = finalZoom - options.canvasZoom;
        this.zoom(buff, userZoomCenter);
    }
}
