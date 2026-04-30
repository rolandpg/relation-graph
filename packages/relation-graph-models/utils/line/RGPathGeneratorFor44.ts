import {RGGenerateLinePrams, RGLinePathInfo, RGLineTextPosition} from "../../../types";
import { structuredPathToSvgD } from "./RGLinePath";
import {
    calculatePolylineCenter,
    clearSamePoint,
    createPathCommandsByPoints,
    getJunctionPointDirection,
    getPoints
} from "./RGLinePathUtils";

export const generateLineFor44 = (linePathGenerateParmas: RGGenerateLinePrams, textPosition: RGLineTextPosition = {x: 0, y: 0, rotate: 0}, defaultOptions = {}): RGLinePathInfo => {
    const {line, fromJunctionPoint, toJunctionPoint, lineDirection, lineShape, fx, fy, fcx, fcy, f_W, f_H, tx, ty, tcx, tcy, t_W, t_H} = linePathGenerateParmas;
    const _startDirection_x = fx - fcx;
    const _startDirection_y = fy - fcy;
    let startDirectionX = _startDirection_x > 1 ? 1 : (_startDirection_x < -1 ? -1 : 0);
    let startDirectionY = _startDirection_y > 1 ? 1 : (_startDirection_y < -1 ? -1 : 0);
    if (Math.abs(startDirectionX) === 1 && Math.abs(startDirectionY) === 1) {
        if (Math.abs(_startDirection_x) > Math.abs(_startDirection_y)) {
            startDirectionY = 0;
        } else {
            startDirectionX = 0;
        }
    }
    if (startDirectionX === 0 && startDirectionY === 0) startDirectionX = 1;
    const _endDirection_x = tx - tcx;
    const _endDirection_y = ty - tcy;
    let endDirectionX = _endDirection_x > 1 ? 1 : (_endDirection_x < -1 ? -1 : 0);
    let endDirectionY = _endDirection_y > 1 ? 1 : (_endDirection_y < -1 ? -1 : 0);
    if (Math.abs(endDirectionX) === 1 && Math.abs(endDirectionY) === 1) {
        if (Math.abs(_endDirection_x) > Math.abs(_endDirection_y)) {
            endDirectionY = 0;
        } else {
            endDirectionX = 0;
        }
    }
    if (endDirectionX === 0 && endDirectionY === 0) startDirectionX = -1;
    const _startDirection = getJunctionPointDirection(fromJunctionPoint, startDirectionX, startDirectionY, false, fx, fy, tx, ty);
    const _endDirection = getJunctionPointDirection(toJunctionPoint, endDirectionX, endDirectionY, true, fx, fy, tx, ty);
    const startDirection = _startDirection;
    const endDirection = _endDirection;

    // console.log('xxxxxxxxxxxxxxxxx:', relation.text, startDirection, endDirection);
    const centerX = fx + (tx - fx) / 2;
    const centerY = fy + (ty - fy) / 2;
    let centerOffset = { x: 0, y: 0 };
    let sourceOffset = 20;
    let targetOffset = 20;
    if (line.ctrlOptionsFor44) {
        centerOffset = { x: line.ctrlOptionsFor44.cx, y: line.ctrlOptionsFor44.cy };
        sourceOffset += line.ctrlOptionsFor44.fd;
        targetOffset += line.ctrlOptionsFor44.td;
    }
    const radius = line.lineRadius !== undefined ? line.lineRadius : (defaultOptions.lineRadius || 0);
    const [points] = getPoints({
        source: { x: fx, y: fy },
        sourcePosition: startDirection,
        target: { x: tx, y: ty },
        targetPosition: endDirection,
        center: {
            x: centerX + centerOffset.x,
            y: centerY + centerOffset.y
        },
        sourceOffset,
        targetOffset
    });
    const simpleFullPoints = clearSamePoint(points);
    const pathCommands = createPathCommandsByPoints(simpleFullPoints, radius);
    const pathData = structuredPathToSvgD(pathCommands);
    const lineCenter = calculatePolylineCenter(points);
    textPosition.x = lineCenter.x;
    textPosition.y = lineCenter.y;
    if (lineDirection === 'v') {
        const startDY = _startDirection_y > 1 ? 1 : (_startDirection_y < -1 ? -1 : 0);
        const endDY = _endDirection_y > 1 ? 1 : (_endDirection_y < -1 ? -1 : 0);
        if (line.placeText === 'start') {
            textPosition.x = fx;
            textPosition.y = fy + startDY * 10;
        } else if (line.placeText === 'end') {
            textPosition.x = tx;
            textPosition.y = ty + endDY * 10;
        }
    } else {
        const startDX = _startDirection_x > 1 ? 1 : (_startDirection_x < -1 ? -1 : 0);
        const endDX = _endDirection_x > 1 ? 1 : (_endDirection_x < -1 ? -1 : 0);
        if (line.placeText === 'start') {
            textPosition.x = fx + startDX * 10;
            textPosition.y = fy;
        } else if (line.placeText === 'end') {
            textPosition.x = tx + endDX * 10;
            textPosition.y = ty;
        }
    }
    return {
        pathCommands, // TODO need impl
        pathData,
        textPosition,
        points: simpleFullPoints,
        startDirection,
        endDirection
    };
}
