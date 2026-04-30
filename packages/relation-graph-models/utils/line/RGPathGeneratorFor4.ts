import {RGGenerateLinePrams, RGJunctionPoint, RGLinePathInfo, RGLineTextPosition} from "../../../types";
import {RGLinePathCommands, structuredPathToSvgD} from "./RGLinePath";

export const generateLineFor4 = (
    linePathGenerateParmas: RGGenerateLinePrams,
    textPosition: RGLineTextPosition = {x: 0, y: 0, rotate: 0},
    defaultOptions = {}
): RGLinePathInfo => {
    const {
        line, fx, fy, fcx, fcy, f_W, f_H, tx, ty, tcx, tcy, t_W, t_H
    } = linePathGenerateParmas;
    const __buff_x = tx - fx;
    const __buff_y = ty - fy;
    const startDirection_x = fx - fcx;
    const startDirection_y = fy - fcy;
    const endDirection_x = tx - tcx;
    const endDirection_y = ty - tcy;
    const radius = line.lineRadius !== undefined ? line.lineRadius : (defaultOptions.lineRadius || 0);
    let radiusX = Math.min(radius, Math.abs(__buff_x)) * (fx < tx ? 1 : -1);
    let radiusY = Math.min(radius, Math.abs(__buff_y)) * (fy < ty ? 1 : -1);
    const fromJunctionPoint = line.fromJunctionPoint || defaultOptions.defaultJunctionPoint || RGJunctionPoint.border;
    const toJunctionPoint = line.toJunctionPoint || defaultOptions.defaultJunctionPoint || RGJunctionPoint.border;
    const startDirection = line.lineDirection || (fromJunctionPoint === RGJunctionPoint.tb || fromJunctionPoint === RGJunctionPoint.top || fromJunctionPoint === RGJunctionPoint.bottom ? 'v' : 'h') || (Math.abs(startDirection_x) >= f_W / 2 ? 'h' : 'v');
    const endDirection = line.lineDirection || (toJunctionPoint === RGJunctionPoint.tb || toJunctionPoint === RGJunctionPoint.top || toJunctionPoint === RGJunctionPoint.bottom ? 'v' : 'h') || (Math.abs(endDirection_x) >= t_W / 2 ? 'h' : 'v');
// line.text = `${fromJunctionPoint}-${toJunctionPoint}::${JSON.stringify(defaultOptions)}::${startDirection}-${endDirection}`; // for debug
    const pathCommands: RGLinePathCommands = [];
    // 文本位置
    let textX = 0, textY = 0;

    if (startDirection === 'v') {
        const force = line.polyLineStartDistance || Math.max(Math.min(30, Math.abs(ty - fy) / 2), 15);
        const startMoveY = (startDirection_y > 0 ? force : -force);

        if (line.placeText === 'start') {
            textX = fx;
            textY = fy + (startDirection_y > 0 ? 20 : -5);
        } else if (line.placeText === 'center' || line.placeText === 'middle') {
            textX = fx + (tx - fx) / 2;
            textY = fy + startMoveY;
        } else {
            textX = tx;
            textY = ty - (startDirection_y > 0 ? 20 : -5);
        }

        pathCommands.push(
            { type: 'M', x: Math.round(fx), y: Math.round(fy) },
            { type: 'v', dy: Math.round(startMoveY - radiusY) },
            { type: 'c', dx1: 0, dy1: Math.round(radiusY), dx2: Math.round(radiusX), dy2: Math.round(radiusY), dx: Math.round(radiusX), dy: Math.round(radiusY) }
        );

        if (endDirection === 'v') {
            pathCommands.push(
                { type: 'h', dx: Math.round((tx - fx) - radiusX * 2) },
                { type: 'c', dx1: Math.round(radiusX), dy1: 0, dx2: Math.round(radiusX), dy2: Math.round(radiusY), dx: Math.round(radiusX), dy: Math.round(radiusY) },
                { type: 'v', dy: Math.round((ty - fy) - startMoveY - radiusY) }
            );
        } else {
            const forceEnd = Math.min(30, Math.abs(tx - fx) / 2);
            const endMoveX = (endDirection_x > 0 ? -forceEnd : forceEnd);
            pathCommands.push(
                { type: 'h', dx: Math.round((tx - fx + endMoveX) - radiusX) },
                { type: 'c', dx1: Math.round(radiusX), dy1: 0, dx2: Math.round(radiusX), dy2: Math.round(radiusY), dx: Math.round(radiusX), dy: Math.round(radiusY) },
                { type: 'v', dy: Math.round((ty - fy) - startMoveY - radiusY) },
                { type: 'h', dx: Math.round(endMoveX - radiusX) }
            );
        }
    } else {
        const force = line.polyLineStartDistance || Math.max(Math.min(30, Math.abs(tx - fx) / 2), 15);
        const startMoveX = (startDirection_x > 0 ? force : -force);

        if (line.placeText === 'start') {
            textX = fx + (startDirection_x > 0 ? 10 : -50);
            textY = fy;
        } else if (line.placeText === 'center' || line.placeText === 'middle') {
            textX = fx + startMoveX;
            textY = fy + (ty - fy) / 2;
        } else {
            textX = tx - (startDirection_x > 0 ? 10 : -50);
            textY = ty;
        }

        radiusX = Math.min(radius, Math.abs(__buff_x)) * (fx > fcx ? 1 : -1);
        radiusY = Math.min(radius, Math.abs(__buff_y)) * (fy < ty ? 1 : -1);
        pathCommands.push(
            { type: 'M', x: Math.round(fx), y: Math.round(fy) },
            { type: 'h', dx: Math.round(startMoveX - radiusX) },
            { type: 'c', dx1: Math.round(radiusX), dy1: 0, dx2: Math.round(radiusX), dy2: Math.round(radiusY), dx: Math.round(radiusX), dy: Math.round(radiusY) }
        );
        if (endDirection === 'v') {
            radiusX = Math.min(radius, Math.abs(__buff_x)) * (ty < tcy ? 1 : -1);
            radiusY = Math.min(radius, Math.abs(__buff_y)) * (ty < tcy ? 1 : -1);
            const forceEnd = Math.min(30, Math.abs(ty - fy) / 2);
            const endMoveY = (endDirection_y > 0 ? -forceEnd : forceEnd);
            pathCommands.push(
                { type: 'v', dy: Math.round((ty - fy) + endMoveY - radiusY) },
                { type: 'h', dx: Math.round((tx - fx - startMoveX - radiusX)) },
                { type: 'c', dx1: 0, dy1: Math.round(radiusY), dx2: Math.round(radiusX), dy2: Math.round(radiusY), dx: Math.round(radiusX), dy: Math.round(radiusY) },
                { type: 'v', dy: Math.round(endMoveY - radiusY) }
            );
        } else {
            radiusX = Math.min(radius, Math.abs(__buff_x)) * ((fx + startMoveX) < tx ? 1 : -1);
            radiusY = Math.min(radius, Math.abs(__buff_y)) * (ty > fy ? 1 : -1);
            pathCommands.push(
                { type: 'v', dy: Math.round((ty - fy) - radiusY * 2) },
                { type: 'c', dx1: 0, dy1: Math.round(radiusY), dx2: Math.round(radiusX), dy2: Math.round(radiusY), dx: Math.round(radiusX), dy: Math.round(radiusY) },
                { type: 'h', dx: Math.round((tx - fx - startMoveX - radiusX)) }
            );
        }
    }

    textPosition.x = textX;
    textPosition.y = textY;

    const pathData = structuredPathToSvgD(pathCommands);

    return {
        pathCommands,
        pathData,
        textPosition,
        points: []
    };
};
