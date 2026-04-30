import { RGCoordinate } from '../../types';
export type RGDraggedCallback = (buffX: number, buffY: number, e: MouseEvent | TouchEvent) => void;
export type RGDraggingCallback = (offsetX: number, offsetY: number, startNodeInfo: RGCoordinate, startEventInfo: RGCoordinate, event: MouseEvent | TouchEvent) => void;
export type RGDragging = (ex: number, ey: number, event: MouseEvent | TouchEvent) => void;
/**
 *  Dragging utility functions
 */
declare const RGDragUtils: {
    /**
     * Start dragging operation
     * @param e
     * @param startPositionOrModel When onDragging is empty, it indicates the position model reference at the start of the drag, used to update the position; when onDragging is not empty, it indicates the position data at the start of the drag, and its value will be directly modified during the drag.
     * @param onDragged
     * @param onDragging
     */
    startDrag(e: MouseEvent | TouchEvent, startPositionOrModel: RGCoordinate, onDragged: RGDraggedCallback, onDragging?: RGDraggingCallback): void;
    onNodeMove(e: MouseEvent | TouchEvent): void;
    onNodeDragend(e: MouseEvent | TouchEvent): void;
};
export default RGDragUtils;
