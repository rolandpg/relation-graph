import { RGCoordinate, RGCtrlPointForLine44 } from '../../../types';
interface MoveToCommandAbsolute {
    type: 'M';
    x: number;
    y: number;
}
interface LineToCommandRelative {
    type: 'l';
    dx: number;
    dy: number;
}
interface LineToCommand {
    type: 'L';
    x: number;
    y: number;
}
interface HorizontalLineToCommandRelative {
    type: 'h';
    dx: number;
}
interface VerticalLineToCommandRelative {
    type: 'v';
    dy: number;
}
interface CubicCurveToCommandRelative {
    type: 'c';
    dx1: number;
    dy1: number;
    dx2: number;
    dy2: number;
    dx: number;
    dy: number;
}
interface SmoothCubicCurveToCommandRelative {
    type: 's';
    dx2: number;
    dy2: number;
    dx: number;
    dy: number;
}
interface QuadraticCurveToCommandRelative {
    type: 'q';
    dx1: number;
    dy1: number;
    dx: number;
    dy: number;
}
interface QuadraticCurveToCommand {
    type: 'Q';
    x1: number;
    y1: number;
    x: number;
    y: number;
}
interface SmoothQuadraticCurveToCommandRelative {
    type: 't';
    dx: number;
    dy: number;
}
interface ArcCommandRelative {
    type: 'a';
    rx: number;
    ry: number;
    xAxisRotation: number;
    largeArcFlag: 0 | 1;
    sweepFlag: 0 | 1;
    dx: number;
    dy: number;
}
interface ClosePathCommand {
    type: 'Z';
}
export type PathCommand = MoveToCommandAbsolute | LineToCommandRelative | LineToCommand | HorizontalLineToCommandRelative | VerticalLineToCommandRelative | CubicCurveToCommandRelative | SmoothCubicCurveToCommandRelative | QuadraticCurveToCommandRelative | QuadraticCurveToCommand | SmoothQuadraticCurveToCommandRelative | ArcCommandRelative | ClosePathCommand;
export type RGLinePathCommands = PathCommand[];
/**
 * 将特定场景的结构化路径命令数组转换为 SVG 路径 'd' 属性字符串。
 * (M, Z 大写，其他命令小写)
 * @param pathCommands PathCommandCustom 对象数组。
 * @returns SVG 路径 'd' 字符串。
 */
export declare const structuredPathToSvgD: (pathCommands: RGLinePathCommands) => string;
export type SvgPathPoints = {
    startPoint: RGCoordinate;
    ctrl1: RGCoordinate;
    ctrl2: RGCoordinate;
    endPoint: RGCoordinate;
    lines: RGCoordinate[];
};
export declare const getPointsByPath: (svgPath: string) => SvgPathPoints;
export declare const getPointValue: (currentX: number, xOrBuffX: string, isRelative: boolean) => number;
/**
 * 修改折线线条路径中点
 * @param points points是折线（线条只允许横向或者纵向前行）线条路径中的所有点，第一个点是起点，最后一个点是终点。
 * @param updatePointIndex updatePointIndex是当前正在被调整的线段，即表示points[updatePointIndex]到points[updatePointIndex + 1]之间的线段
 * @param offsetX 鼠标被移动的x增量值，当updatePointIndex对应的先对是横线，则忽略此值的变动，因为横线只允许被上下调整
 * @param offsetY 鼠标被移动的y增量值，当updatePointIndex对应的先对是纵线，则忽略此值的变动，因为纵线只允许被左右调整
 * @return newPoints 返回调整后的折线路径中的所有点
 */
export declare const updateLinePoints: (points: RGCoordinate[], startPoints: RGCoordinate[], updatePointIndex: number, split: RGCtrlPointForLine44, cursor: {
    indexOffset: number;
}, orignOffsetX: number, orignOffsetY: number) => {
    newPoints: RGCoordinate[];
    pointsChanged: boolean;
};
export {};
