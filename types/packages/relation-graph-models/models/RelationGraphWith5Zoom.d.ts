import { RGCoordinate } from '../../types';
import { RelationGraphWith4Line } from './RelationGraphWith4Line';
export type RGClientXy = RGCoordinate;
/**
 * Class related to zoom functionality in the relation-graph component
 */
export declare class RelationGraphWith5Zoom extends RelationGraphWith4Line {
    constructor();
    protected getClampedZoom(finalZoom: number): number;
    protected applyZoom(newZoom: number, canvasOffset: RGCoordinate, e?: WheelEvent): void;
    /**
     * Zoom based on the current zoom level
     * @param buff The additional zoom level to be added based on the current zoom level. A positive number indicates zooming in, and a negative number indicates zooming out, in percentage. For example: 10 means zoom in by 10%, -10 means zoom out by 10%
     * @param userZoomCenter User zoom center point coordinates, default is the center point of the view
     * @param e Mouse wheel event object, optional
     *
     */
    zoom(buff: number, userZoomCenter?: RGClientXy, e?: WheelEvent): void;
    protected setZoomAndOffset(finalZoom: number, canvasOffset: RGCoordinate, e?: WheelEvent): void;
    /**
     * @inner
     * @protected
     */
    protected _performanceModeLogicHook(oldZoomValue: number, newZoomValue: number): void;
    /**
     * Set the canvas zoom to the specified zoom level
     * @param finalZoom Target zoom level, expressed as a percentage, for example: 100 means 100%
     * @param userZoomCenter User zoom center point coordinates, default is the center point of the view
     *
     */
    setZoom(finalZoom: number, userZoomCenter?: RGClientXy): void;
}
