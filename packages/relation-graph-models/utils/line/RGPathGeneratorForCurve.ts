import {RGGenerateLinePrams, RGLinePathInfo, RGLineShape, RGLineTextPosition} from "../../../types";
import {calcCurveLineCenter} from "./RGPathGeneratorFor6";
import {RGLinePathCommands, structuredPathToSvgD} from "./RGLinePath";

export const generateLineForCurve = (
    linePathGenerateParmas: RGGenerateLinePrams,
    textPosition: RGLineTextPosition = {x: 0, y: 0, rotate: 0}
): RGLinePathInfo => {
    const {
        line, totalLinesBetweenNodes, currentLineIndex, lineDirection, lineShape,
        fx, fy, fcx, fcy, f_W, f_H, tx, ty, tcx, tcy, t_W, t_H
    } = linePathGenerateParmas;
    const __buff_x = tx - fx;
    const __buff_y = ty - fy;
    const __buff_type_x = tx > fx ? 1 : -1;
    const __buff_type_y = ty > fy ? 1 : -1;
    const __buff_type = lineDirection === 'v' ? __buff_type_y : __buff_type_x;
    const startDirection_x = fx - fcx;
    const startDirection_y = fy - fcy;
    const endDirection_x = tx - tcx;
    const endDirection_y = ty - tcy;

    const distanceRate = (1 / (totalLinesBetweenNodes + 1)) * (currentLineIndex + 1);
    let ctrl1 = {x: 0, y: 0}, ctrl2 = {x: 0, y: 0};
    if (lineShape === RGLineShape.Curve2) {
        ctrl1 = lineDirection === 'v' ? {x: 0, y: __buff_type * 30} : {x: __buff_type * 30, y: 0};
        ctrl2 = lineDirection === 'v'
            ? {x: __buff_x * distanceRate, y: __buff_type * -10}
            : {x: __buff_type * -10, y: __buff_y * distanceRate};
    } else if (lineShape === RGLineShape.Curve3) {
        ctrl1 = lineDirection === 'v'
            ? {x: 0, y: __buff_y * distanceRate}
            : {x: __buff_type * 30, y: 0};
        ctrl2 = lineDirection === 'v'
            ? {x: 0, y: 0}
            : {x: __buff_type * -10, y: __buff_y * distanceRate};
    } else if (lineShape === RGLineShape.Curve5) {
        ctrl1 = {x: 0, y: 0};
        ctrl2 = lineDirection === 'v'
            ? {x: 0, y: __buff_y * distanceRate}
            : {x: __buff_x * distanceRate, y: 0};
    } else if (lineShape === RGLineShape.Curve7 || lineShape === RGLineShape.Curve8) {
        const forceX = 30;
        const forceY = 30;
        const startForceX = startDirection_x / (Math.abs(startDirection_x) + Math.abs(startDirection_y)) * forceX;
        const startForceY = startDirection_y / (Math.abs(startDirection_x) + Math.abs(startDirection_y)) * forceY;
        ctrl1 = {x: startForceX, y: startForceY};
        const endForceX = endDirection_x / (Math.abs(endDirection_x) + Math.abs(endDirection_y)) * forceX + __buff_x;
        const endForceY = endDirection_y / (Math.abs(endDirection_x) + Math.abs(endDirection_y)) * forceY + __buff_y;
        ctrl2 = {x: endForceX, y: endForceY};
    }

    // 绝对控制点和终点
    const ctrl1Abs = {x: fx + ctrl1.x, y: fy + ctrl1.y};
    const ctrl2Abs = {x: fx + ctrl2.x, y: fy + ctrl2.y};
    const endAbs = {x: fx + __buff_x, y: fy + __buff_y};

    // 生成 pathCommands，c 为小写（相对）
    const pathCommands: RGLinePathCommands = [
        { type: 'M', x: fx, y: fy },
        {
            type: 'c',
            dx1: ctrl1.x, dy1: ctrl1.y,
            dx2: ctrl2.x, dy2: ctrl2.y,
            dx: __buff_x, dy: __buff_y
        }
    ];
    if (lineShape === 8) {
        pathCommands.push({ type: 'Z' });
    }

    // 计算文本位置
    const lineCenter = calcCurveLineCenter(
        {x: fx, y: fy},
        ctrl1Abs,
        ctrl2Abs,
        endAbs,
        lineShape < 6 ? 0.8 : 0.5
    );
    textPosition.x = lineCenter.x;
    textPosition.y = lineCenter.y;

    const pathData = structuredPathToSvgD(pathCommands);

    return {
        pathCommands,
        pathData,
        textPosition,
        points: []
    };
}
