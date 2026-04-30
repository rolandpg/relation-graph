import { getClientCoordinate, isSupportTouch } from './RGCommon';
import {RGCoordinate} from "../../types";

export type RGDraggedCallback = (buffX: number, buffY: number, e: MouseEvent | TouchEvent) => void;
export type RGDraggingCallback = (offsetX: number, offsetY: number, startNodeInfo: RGCoordinate, startEventInfo: RGCoordinate, event: MouseEvent | TouchEvent) => void;
export type RGDragging = (ex: number, ey: number, event: MouseEvent | TouchEvent) => void;
let tempStartPositionModel = { x: 0, y: 0 };
const tempStartNodeInfo: RGCoordinate = { x: 0, y: 0 };
const tempStartEventInfo: RGCoordinate = { x: 0, y: 0 };
const touchMoveListenerOptions: AddEventListenerOptions = { passive: false };
let onDraggingHandler: RGDragging;
let onDraggedHandler: RGDraggedCallback;
const getClientPosition = (e: MouseEvent | TouchEvent) => {
    return getClientCoordinate(e);
};
/**
 *  Dragging utility functions
 */
const RGDragUtils = {
    /**
     * Start dragging operation
     * @param e
     * @param startPositionOrModel When onDragging is empty, it indicates the position model reference at the start of the drag, used to update the position; when onDragging is not empty, it indicates the position data at the start of the drag, and its value will be directly modified during the drag.
     * @param onDragged
     * @param onDragging
     */
    startDrag(e: MouseEvent | TouchEvent, startPositionOrModel: RGCoordinate, onDragged: RGDraggedCallback, onDragging?: RGDraggingCallback) {
        if (onDragging) {
            onDraggingHandler = (ex: number, ey: number, event: MouseEvent | TouchEvent) => {
                const offsetX = (ex - tempStartEventInfo.x);
                const offsetY = (ey - tempStartEventInfo.y);
                onDragging(offsetX, offsetY, tempStartNodeInfo, tempStartEventInfo, event);
            };
        } else {
            onDraggingHandler = (ex: number, ey: number) => {
                tempStartPositionModel.x = tempStartNodeInfo.x + (ex - tempStartEventInfo.x);
                tempStartPositionModel.y = tempStartNodeInfo.y + (ey - tempStartEventInfo.y);
            };
        }
        onDraggedHandler = onDragged;
        tempStartPositionModel = startPositionOrModel;
        tempStartNodeInfo.x = tempStartPositionModel.x;
        tempStartNodeInfo.y = tempStartPositionModel.y;
        try {
            const clientPosition = getClientPosition(e);
            tempStartEventInfo.x = clientPosition.clientX;
            tempStartEventInfo.y = clientPosition.clientY;
            if (isSupportTouch(e)) {
                // e.stopPropagation();
                document.body.addEventListener('touchmove', RGDragUtils.onNodeMove, touchMoveListenerOptions);
                document.body.addEventListener('touchend', RGDragUtils.onNodeDragend);
                document.body.addEventListener('mousemove', RGDragUtils.onNodeMove);
                document.body.addEventListener('mouseup', RGDragUtils.onNodeDragend);
                e.preventDefault();
            } else {
                document.body.addEventListener('mousemove', RGDragUtils.onNodeMove);
                document.body.addEventListener('mouseup', RGDragUtils.onNodeDragend);
            }
        } catch (error: any) {
            console.error(error.message);
        }
    },
    onNodeMove(e: MouseEvent | TouchEvent) {
        const clientPosition = getClientPosition(e);
        onDraggingHandler(clientPosition.clientX, clientPosition.clientY, e);
    },
    onNodeDragend(e: MouseEvent | TouchEvent) {
        if (isSupportTouch(e)) {
            document.body.removeEventListener('touchmove', RGDragUtils.onNodeMove, touchMoveListenerOptions);
            document.body.removeEventListener('touchend', RGDragUtils.onNodeDragend);
            document.body.removeEventListener('mousemove', RGDragUtils.onNodeMove);
            document.body.removeEventListener('mouseup', RGDragUtils.onNodeDragend);
        } else {
            document.body.removeEventListener('mousemove', RGDragUtils.onNodeMove);
            document.body.removeEventListener('mouseup', RGDragUtils.onNodeDragend);
        }
        if (onDraggedHandler) {
            const clientPosition = getClientPosition(e);
            const ex = clientPosition.clientX;
            const ey = clientPosition.clientY;
            const offsetX = (ex - tempStartEventInfo.x);
            const offsetY = (ey - tempStartEventInfo.y);
            onDraggedHandler(
                offsetX,
                offsetY,
                e
            );
        }
    }
};
export default RGDragUtils;
