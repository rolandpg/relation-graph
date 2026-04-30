// 绝对移动 (MoveTo Absolute)
import {RGCoordinate, RGCtrlPointForLine44} from "../../../types";

interface MoveToCommandAbsolute {
    type: 'M';
    x: number; // 绝对 x 坐标
    y: number; // 绝对 y 坐标
}

// 相对移动 (MoveTo Relative) - 如果您也可能用到 m
// interface MoveToCommandRelative {
//   type: 'm';
//   dx: number; // x方向偏移
//   dy: number; // y方向偏移
// }

// 相对画直线到 (LineTo Relative)
interface LineToCommandRelative {
    type: 'l';
    dx: number; // x方向偏移
    dy: number; // y方向偏移
}
interface LineToCommand {
    type: 'L';
    x: number; // x方向偏移
    y: number; // y方向偏移
}

// 相对水平画直线到 (Horizontal LineTo Relative)
interface HorizontalLineToCommandRelative {
    type: 'h';
    dx: number; // x方向偏移
}

// 相对垂直画直线到 (Vertical LineTo Relative)
interface VerticalLineToCommandRelative {
    type: 'v';
    dy: number; // y方向偏移
}

// 相对三次贝塞尔曲线到 (Cubic Bézier CurveTo Relative)
interface CubicCurveToCommandRelative {
    type: 'c';
    dx1: number; dy1: number; // 第一个控制点相对当前点的偏移
    dx2: number; dy2: number; // 第二个控制点相对当前点的偏移
    dx: number;  dy: number;  // 终点相对当前点的偏移
}

// 相对平滑三次贝塞尔曲线到 (Smooth Cubic Bézier CurveTo Relative)
interface SmoothCubicCurveToCommandRelative {
    type: 's';
    dx2: number; dy2: number; // 第二个控制点相对当前点的偏移
    dx: number;  dy: number;  // 终点相对当前点的偏移
}

// 相对二次贝塞尔曲线到 (Quadratic Bézier CurveTo Relative)
interface QuadraticCurveToCommandRelative {
    type: 'q';
    dx1: number; dy1: number; // 控制点相对当前点的偏移
    dx: number;  dy: number;  // 终点相对当前点的偏移
}
interface QuadraticCurveToCommand {
    type: 'Q';
    x1: number; y1: number; // 控制点相对当前点的偏移
    x: number;  y: number;  // 终点相对当前点的偏移
}

// 相对平滑二次贝塞尔曲线到 (Smooth Quadratic Bézier CurveTo Relative)
interface SmoothQuadraticCurveToCommandRelative {
    type: 't';
    dx: number;  dy: number;  // 终点相对当前点的偏移
}

// 相对椭圆弧 (Elliptical Arc Relative)
interface ArcCommandRelative {
    type: 'a';
    rx: number;
    ry: number;
    xAxisRotation: number;
    largeArcFlag: 0 | 1;
    sweepFlag: 0 | 1;
    dx: number; // 终点x相对当前点的偏移
    dy: number; // 终点y相对当前点的偏移
}

// 关闭路径 (ClosePath) - Z 通常没有相对版本，总是闭合到当前子路径的起点
interface ClosePathCommand {
    type: 'Z'; // Z = closepath
}

// 根据您的描述：M, Z 大写，其他小写
export type PathCommand =
    | MoveToCommandAbsolute // M
    | LineToCommandRelative // l
    | LineToCommand // L
    | HorizontalLineToCommandRelative // h
    | VerticalLineToCommandRelative // v
    | CubicCurveToCommandRelative // c
    | SmoothCubicCurveToCommandRelative // s
    | QuadraticCurveToCommandRelative // q
    | QuadraticCurveToCommand // Q
    | SmoothQuadraticCurveToCommandRelative // t
    | ArcCommandRelative // a
    | ClosePathCommand; // Z

export type RGLinePathCommands = PathCommand[];

// --- 更新后的函数实现 ---

/**
 * 将特定场景的结构化路径命令数组转换为 SVG 路径 'd' 属性字符串。
 * (M, Z 大写，其他命令小写)
 * @param pathCommands PathCommandCustom 对象数组。
 * @returns SVG 路径 'd' 字符串。
 */
export const structuredPathToSvgD = (pathCommands: RGLinePathCommands): string => {
    if (!pathCommands || pathCommands.length === 0) {
        return "";
    }

    return pathCommands.map(cmd => {
        // 直接使用 cmd.type 作为命令字母，因为它现在精确反映了大小写
        switch (cmd.type) {
            case 'M': // 大写 M
                return `${cmd.type} ${cmd.x} ${cmd.y}`;
            case 'l': // 小写 l
                return `${cmd.type} ${cmd.dx} ${cmd.dy}`;
            case 'L': // 小写 l
                return `${cmd.type} ${cmd.x} ${cmd.y}`;
            case 'h': // 小写 h
                return `${cmd.type} ${cmd.dx}`;
            case 'v': // 小写 v
                return `${cmd.type} ${cmd.dy}`;
            case 'c': // 小写 c
                return `${cmd.type} ${cmd.dx1} ${cmd.dy1} ${cmd.dx2} ${cmd.dy2} ${cmd.dx} ${cmd.dy}`;
            case 's': // 小写 s
                return `${cmd.type} ${cmd.dx2} ${cmd.dy2} ${cmd.dx} ${cmd.dy}`;
            case 'q': // 小写 q
                return `${cmd.type} ${cmd.dx1} ${cmd.dy1} ${cmd.dx} ${cmd.dy}`;
            case 'Q': // 小写 q
                return `${cmd.type} ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y}`;
            case 't': // 小写 t
                return `${cmd.type} ${cmd.dx} ${cmd.dy}`;
            case 'a': // 小写 a
                return `${cmd.type} ${cmd.rx} ${cmd.ry} ${cmd.xAxisRotation} ${cmd.largeArcFlag} ${cmd.sweepFlag} ${cmd.dx} ${cmd.dy}`;
            case 'Z': // 大写 Z
                return cmd.type; // Z 命令通常不带参数
            default:
                // 利用 TypeScript 的 never 类型来确保所有情况都被处理
                const _exhaustiveCheck: never = cmd;
                console.warn("未知的路径命令类型:", _exhaustiveCheck);
                return "";
        }
    }).join(' ').trim();
}

export type SvgPathPoints = {
    startPoint: RGCoordinate,
    ctrl1: RGCoordinate,
    ctrl2: RGCoordinate,
    endPoint: RGCoordinate,
    lines: RGCoordinate[]
};
export const getPointsByPath = (svgPath: string): SvgPathPoints => {
    const commands = svgPath.match(/[a-zA-Z][^a-zA-Z]*/g) as string[];
    let currentX = 0;
    let currentY = 0;
    let startX = 0;
    let startY = 0;
    let controlX1 = 0;
    let controlY1 = 0;
    let controlX2 = 0;
    let controlY2 = 0;
    const startPoint = {x:0,y:0};
    const endPoint = {x:0,y:0};
    const lines: RGCoordinate[] = [];
    for (const command of commands) {
        const parts = command.trim().split(/[ ,]+/);
        const type = parts[0].toUpperCase();
        const isRelative = parts[0] === parts[0].toLowerCase();
        // console.log('command', type, parts.join(','));
        switch (type) {
            case 'M':
                currentX =  getPointValue(startX, parts[1], isRelative);
                currentY =  getPointValue(startY, parts[2], isRelative);
                startX = currentX;
                startY = currentY;
                break;
            case 'L':
                currentX =  getPointValue(startX, parts[1], isRelative);
                currentY =  getPointValue(startY, parts[2], isRelative);
                lines.push({x:currentX,y:currentY});
                break;
            case 'C':
                controlX1 = getPointValue(startX, parts[1], isRelative);
                controlY1 = getPointValue(startY, parts[2], isRelative);
                controlX2 = getPointValue(startX, parts[3], isRelative);
                controlY2 = getPointValue(startY, parts[4], isRelative);
                currentX = getPointValue(startX, parts[5], isRelative);
                currentY = getPointValue(startY, parts[6], isRelative);
                startX = currentX;
                startY = currentY;
                break;
            case 'Q':
                controlX1 = getPointValue(startX, parts[1], isRelative);
                controlY1 = getPointValue(startY, parts[2], isRelative);
                currentX = getPointValue(startX, parts[3], isRelative);
                currentY = getPointValue(startY, parts[4], isRelative);
                startX = currentX;
                startY = currentY;
                break;
            case 'V':
                currentY = getPointValue(startY, parts[1], isRelative);
                startY = currentY;
                break;
            case 'H':
                currentX = getPointValue(startX, parts[1], isRelative);
                startX = currentX;
                break;
            case 'Z':
                break;
            default:
                console.log(`Unsupported command: ${type}`);
        }
        if (command === commands[0]) {
            startPoint.x = currentX;
            startPoint.y = currentY;
        }
        if (command === commands[commands.length - 1]) {
            endPoint.x = currentX;
            endPoint.y = currentY;
        }
    }
    return {
        startPoint,
        ctrl1: {
            x: controlX1,
            y: controlY1
        },
        ctrl2: {
            x: controlX2,
            y: controlY2
        },
        endPoint,
        lines
    };
}

export const getPointValue = (currentX:number, xOrBuffX:string, isRelative: boolean) => {
    return isRelative ? (currentX + parseFloat(xOrBuffX)) : parseFloat(xOrBuffX);
}
/**
 * 修改折线线条路径中点
 * @param points points是折线（线条只允许横向或者纵向前行）线条路径中的所有点，第一个点是起点，最后一个点是终点。
 * @param updatePointIndex updatePointIndex是当前正在被调整的线段，即表示points[updatePointIndex]到points[updatePointIndex + 1]之间的线段
 * @param offsetX 鼠标被移动的x增量值，当updatePointIndex对应的先对是横线，则忽略此值的变动，因为横线只允许被上下调整
 * @param offsetY 鼠标被移动的y增量值，当updatePointIndex对应的先对是纵线，则忽略此值的变动，因为纵线只允许被左右调整
 * @return newPoints 返回调整后的折线路径中的所有点
 */
export const updateLinePoints = (points: RGCoordinate[], startPoints: RGCoordinate[], updatePointIndex: number, split: RGCtrlPointForLine44, cursor: {
    indexOffset: number
}, orignOffsetX: number, orignOffsetY: number) => {
    const newPoints: RGCoordinate[] = JSON.parse(JSON.stringify(points));
    let pointsChanged = false;
    if (updatePointIndex < 0 || updatePointIndex >= points.length - 1) {
        // 如果updatePointIndex不在有效范围内，返回原始点数组
        return {newPoints, pointsChanged};
    }
    const prevPoint = newPoints[updatePointIndex - 1];
    const currentPoint = newPoints[updatePointIndex];
    const nextPoint = newPoints[updatePointIndex + 1];
    const startPrevPoint = startPoints[updatePointIndex - 1];
    const startCurrentPoint = startPoints[updatePointIndex];
    const startNextPoint = startPoints[updatePointIndex + 1];
    let offsetX = orignOffsetX;
    let offsetY = orignOffsetY;
    if (split.direction === 'v') {
        const prevVPoint = startPoints[updatePointIndex - 2];
        const nextVPoint = startPoints[updatePointIndex + 2];
        const currentX = startCurrentPoint.x + offsetX;
        let minDistance = 3000;
        if (prevVPoint) {
            const distance = Math.abs(prevVPoint.x - currentX);
            if (distance < 10 && distance < minDistance) {
                minDistance = distance;
                offsetX = prevVPoint.x - startCurrentPoint.x;
            }
        }
        if (nextVPoint) {
            const distance = Math.abs(nextVPoint.x - currentX);
            if (distance < 10 && distance < minDistance) {
                minDistance = distance;
                offsetX = nextVPoint.x - startCurrentPoint.x;
            }
        }
    } else {
        const prevHPoint = startPoints[updatePointIndex - 2];
        const nextHPoint = startPoints[updatePointIndex + 2];
        const currentY = startCurrentPoint.y + offsetY;
        let minDistance = 3000;
        if (prevHPoint) {
            const distance = Math.abs(prevHPoint.y - currentY);
            if (distance < 10 && distance < minDistance) {
                minDistance = distance;
                offsetY = prevHPoint.y - startCurrentPoint.y;
            }
        }
        if (nextHPoint) {
            const distance = Math.abs(nextHPoint.y - currentY);
            if (distance < 10 && distance < minDistance) {
                minDistance = distance;
                offsetY = nextHPoint.y - startCurrentPoint.y;
            }
        }
    }
    if (split.direction === 'v') {
        // 处理纵线（x坐标相同）
        if (updatePointIndex === 0) {
            // console.log('xxxxxxxxxxxxxxxxx:V:start:');
            const dir = currentPoint.y < nextPoint.y ? 1 : -1;
            const newStartPoint = {
                x: currentPoint.x,
                y: currentPoint.y,
            };
            const newPoint1 = {
                x: currentPoint.x,
                y: currentPoint.y + 20 * dir,
            };
            currentPoint.x = newPoint1.x + offsetX;
            currentPoint.y = newPoint1.y;
            newPoints.splice(updatePointIndex, 0, newStartPoint, newPoint1);
            cursor.indexOffset += 2;
            pointsChanged = true;
        } else if (updatePointIndex === points.length - 2) {
            const dir = currentPoint.y < nextPoint.y ? 1 : -1;
            const newPoint1 = {
                x: startCurrentPoint.x + offsetX,
                y: nextPoint.y - 20 * dir,
            };
            const newPoint2 = {
                x: nextPoint.x,
                y: nextPoint.y - 20 * dir,
            };
            newPoints.splice(updatePointIndex + 1, 0, newPoint1, newPoint2);
            pointsChanged = true;
        } else {
            currentPoint.x = startCurrentPoint.x + offsetX;
            nextPoint.x = startCurrentPoint.x + offsetX;
        }
    } else {
        // 处理横线（y坐标相同）
        if (updatePointIndex === 0) {
            const dir = currentPoint.x < nextPoint.x ? 1 : -1;
            const newStartPoint = {
                x: currentPoint.x,
                y: currentPoint.y,
            };
            const newPoint1 = {
                x: currentPoint.x + 20 * dir,
                y: currentPoint.y,
            };
            currentPoint.x = newPoint1.x;
            currentPoint.y = startCurrentPoint.y + offsetY;
            newPoints.splice(updatePointIndex, 0, newStartPoint, newPoint1);
            // nextPoint.y = startCurrentPoint.y + offsetY;
            cursor.indexOffset += 2;
            pointsChanged = true;
        } else if (updatePointIndex === points.length - 2) {
            // console.log('xxxxxxxxxxxxxxxxx:H:end:');
            const dir = currentPoint.x < nextPoint.x ? 1 : -1;
            const newPoint1 = {
                x: nextPoint.x - 20 * dir,
                y: startCurrentPoint.y + offsetY,
            };
            const newPoint2 = {
                x: nextPoint.x - 20 * dir,
                y: nextPoint.y,
            };
            newPoints.splice(updatePointIndex + 1, 0, newPoint1, newPoint2);
            pointsChanged = true;
        } else {
            currentPoint.y = startCurrentPoint.y + offsetY;
            nextPoint.y = startCurrentPoint.y + offsetY;
        }
    }
    return {newPoints, pointsChanged};
};

