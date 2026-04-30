import {RGGenerateLinePrams, RGJunctionPoint, RGLinePathInfo, RGLineTextPosition, RGPosition} from "../../../types";
import {RGLinePathCommands, structuredPathToSvgD} from "./RGLinePath";

export const generateLineForCurve6 = (
    linePathGenerateParmas: RGGenerateLinePrams,
    textPosition: RGLineTextPosition = {x: 0, y: 0, rotate: 0}
): RGLinePathInfo => {
    const {
        line, lineShape, fx, fy, fcx, fcy, tx, ty, tcx, tcy
    } = linePathGenerateParmas;
    const __buff_x = tx - fx;
    const __buff_y = ty - fy;
    let startDirection_x = fx - fcx;
    let startDirection_y = fy - fcy;
    let endDirection_x = tx - tcx;
    let endDirection_y = ty - tcy;
    let {fromJunctionPoint, toJunctionPoint} = line;
    if (line.isReverse) [fromJunctionPoint, toJunctionPoint] = [toJunctionPoint, fromJunctionPoint];
    if (fromJunctionPoint === RGJunctionPoint.left || fromJunctionPoint === RGJunctionPoint.right) {
        startDirection_y = 0;
    }
    if (fromJunctionPoint === RGJunctionPoint.top || fromJunctionPoint === RGJunctionPoint.bottom) {
        startDirection_x = 0;
    }
    if (toJunctionPoint === RGJunctionPoint.left || toJunctionPoint === RGJunctionPoint.right) {
        endDirection_y = 0;
    }
    if (toJunctionPoint === RGJunctionPoint.top || toJunctionPoint === RGJunctionPoint.bottom) {
        endDirection_x = 0;
    }
    // 计算控制点（相对起点的偏移量）
    const forceX = Math.min(200, Math.max(100, Math.abs(__buff_x / 2)));
    const forceY = Math.min(200, Math.max(100, Math.abs(__buff_y / 2)));
    const startForceX = startDirection_x / (Math.abs(startDirection_x) + Math.abs(startDirection_y)) * forceX;
    const startForceY = startDirection_y / (Math.abs(startDirection_x) + Math.abs(startDirection_y)) * forceY;
    let ctrl1 = {x: startForceX, y: startForceY};
    const endForceX = endDirection_x / (Math.abs(endDirection_x) + Math.abs(endDirection_y)) * forceX + __buff_x;
    const endForceY = endDirection_y / (Math.abs(endDirection_x) + Math.abs(endDirection_y)) * forceY + __buff_y;
    let ctrl2 = {x: endForceX, y: endForceY};

    // 处理自定义控制点
    if (line.ctrlPoints && line.ctrlPoints.length > 0) {
        if (line.isReverse) {
            ctrl1.x += line.ctrlPoints[1].x;
            ctrl1.y += line.ctrlPoints[1].y;
            ctrl2.x += line.ctrlPoints[0].x;
            ctrl2.y += line.ctrlPoints[0].y;
        } else {
            ctrl1.x += line.ctrlPoints[0].x;
            ctrl1.y += line.ctrlPoints[0].y;
            ctrl2.x += line.ctrlPoints[1].x;
            ctrl2.y += line.ctrlPoints[1].y;
        }
    }

    // 绝对控制点和终点，用于文本位置计算
    const ctrl1Abs = { x: fx + ctrl1.x, y: fy + ctrl1.y };
    const ctrl2Abs = { x: fx + ctrl2.x, y: fy + ctrl2.y };
    const endAbs = { x: fx + __buff_x, y: fy + __buff_y };

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

    // 使用 structuredPathToSvgD 生成 pathData
    const pathData = structuredPathToSvgD(pathCommands);

    return {
        pathCommands,
        pathData,
        textPosition,
        points: []
    };
};


export const calcCurveLineCenter = (P0: RGPosition, P1: RGPosition, P2: RGPosition, P3: RGPosition, t = 0.5) => {
    // 计算中间位置的坐标
    // 第一级插值
    const A = {x: (1 - t) * P0.x + t * P1.x, y: (1 - t) * P0.y + t * P1.y};
    const B = {x: (1 - t) * P1.x + t * P2.x, y: (1 - t) * P1.y + t * P2.y};
    const C = {x: (1 - t) * P2.x + t * P3.x, y: (1 - t) * P2.y + t * P3.y};

    // 第二级插值
    const D = {x: (1 - t) * A.x + t * B.x, y: (1 - t) * A.y + t * B.y};
    const E = {x: (1 - t) * B.x + t * C.x, y: (1 - t) * B.y + t * C.y};

    // 第三级插值，即最终点
    return {x: (1 - t) * D.x + t * E.x, y: (1 - t) * D.y + t * E.y};
}
