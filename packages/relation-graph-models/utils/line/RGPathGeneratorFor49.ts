import {RGCoordinate, RGGenerateLinePrams, RGLinePathInfo, RGLineTextPosition} from "../../../types";
import { structuredPathToSvgD } from "./RGLinePath";
import { calculatePolylineCenter, clearSamePoint, createPathCommandsByPoints, getJunctionPointDirection, getPoints, getReverseJPDirection } from "./RGLinePathUtils";

export const generateLineFor49 = (linePathGenerateParmas: RGGenerateLinePrams, textPosition: RGLineTextPosition = {x: 0, y: 0, rotate: 0}, defaultOptions = {}): RGLinePathInfo => {
    const {line, fromJunctionPoint, toJunctionPoint, lineDirection, lineShape, fx, fy, fcx, fcy, f_W, f_H, tx, ty, tcx, tcy, t_W, t_H} = linePathGenerateParmas;
    const _startDirection_x = fx - fcx;
    const _startDirection_y = fy - fcy;
    let startDirectionX = _startDirection_x > 3 ? 1 : (_startDirection_x < -3 ? -1 : 0);
    let startDirectionY = _startDirection_y > 3 ? 1 : (_startDirection_y < -3 ? -1 : 0);
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
    let endDirectionX = _endDirection_x > 3 ? 1 : (_endDirection_x < -3 ? -1 : 0);
    let endDirectionY = _endDirection_y > 3 ? 1 : (_endDirection_y < -3 ? -1 : 0);
    if (Math.abs(endDirectionX) === 1 && Math.abs(endDirectionY) === 1) {
        if (Math.abs(_endDirection_x) > Math.abs(_endDirection_y)) {
            endDirectionY = 0;
        } else {
            endDirectionX = 0;
        }
    }
    if (endDirectionX === 0 && endDirectionY === 0) startDirectionX = -1;
    let startDirection = getJunctionPointDirection(fromJunctionPoint, startDirectionX, startDirectionY, false, fx, fy, tx, ty);
    let endDirection = getJunctionPointDirection(toJunctionPoint, endDirectionX, endDirectionY, true, fx, fy, tx, ty);


    const radius = line.lineRadius !== undefined ? line.lineRadius : (defaultOptions.lineRadius || 0);
    const points = line.ctrlPointsFor49;
    let fromPoint: RGCoordinate = {
        x: Math.round(fx),
        y: Math.round(fy)
    };
    let toPoint: RGCoordinate = {
        x: Math.round(tx),
        y: Math.round(ty)
    };
    let firstPoint: RGCoordinate = {
        x: Math.round(points[0].x),
        y: Math.round(points[0].y)
    };
    let lastPoint: RGCoordinate = {
        x: Math.round(points[points.length - 1].x),
        y: Math.round(points[points.length - 1].y)
    };
    let fullPoints = [...points];
    if (line.isReverse) {
        [startDirection, endDirection] = [endDirection, startDirection];
    }
    // console.log(`xxxxxxxxxxxxxxxxxxxxxline49:(${fullPoints.length} , ${JSON.stringify(fromPoint)} --> ${JSON.stringify(firstPoint)}):`, JSON.stringify(fullPoints));
    if (Math.abs(fromPoint.x - firstPoint.x) > 3 || Math.abs(fromPoint.y - firstPoint.y) > 3) {
        // fullPoints = clearSamePoint(fullPoints);
        const centerX = fromPoint.x + (firstPoint.x - fromPoint.x) / 2;
        const centerY = fromPoint.y + (firstPoint.y - fromPoint.y) / 2;
        // const targetPosition = getJPDirectionByPoint(fullPoints[1], fullPoints[0]);
        const targetPosition = getReverseJPDirection(startDirection);
        // console.log(`xxxxxxxxxxxxxxxxxxxxxline49:append:prevPoints:(${startDirection} --> ${targetPosition})`);
        const [prevPoints] = getPoints({
            source: fromPoint,
            sourcePosition: startDirection,
            target: firstPoint,
            targetPosition: targetPosition,
            center: {x: centerX, y: centerY},
            sourceOffset: 20,
            targetOffset: 5
        });
        fullPoints = clearSamePoint([...prevPoints, ...fullPoints]);
        // fullPoints = [...prevPoints, ...fullPoints];
    }
    if (Math.abs(toPoint.x - lastPoint.x) > 3 || Math.abs(toPoint.y - lastPoint.y) > 3) {
        // fullPoints = clearSamePoint(fullPoints);
        const centerX = lastPoint.x + (toPoint.x - lastPoint.x) / 2;
        const centerY = lastPoint.y + (toPoint.y - lastPoint.y) / 2;
        // const sourceDirection = getDirectionByPoint(fullPoints[fullPoints.length - 2], fullPoints[fullPoints.length - 1]);
        const sourceDirection = getReverseJPDirection(endDirection);
        // console.log(`xxxxxxxxxxxxxxxxxxxxxline49:append:nextPoints:(${sourceDirection} --> ${endDirection})`);
        const [nextPoints] = getPoints({
            source: lastPoint,
            sourcePosition: sourceDirection,
            target: toPoint,
            targetPosition: endDirection,
            center: {x: centerX, y: centerY},
            sourceOffset: 5,
            targetOffset: 20
        });
        fullPoints = clearSamePoint([...fullPoints, ...nextPoints]);
    }
    // console.log(`xxxxxxxxxxxxxxxxxxxxxline49:append:prevPoints:(${fullPoints.length}):`, JSON.stringify(fullPoints));
    const simpleFullPoints = fullPoints;
    const pathCommands = createPathCommandsByPoints(simpleFullPoints, radius);
    const pathData = structuredPathToSvgD(pathCommands);
    const lineCenter = calculatePolylineCenter(points);
    textPosition.x = lineCenter.x;
    textPosition.y = lineCenter.y;
    return {
        pathCommands: [],
        pathData,
        textPosition,
        points: simpleFullPoints,
        startDirection,
        endDirection
    };
}
