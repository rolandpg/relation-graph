import {RGGenerateLinePrams, RGLinePathInfo, RGLineTextPosition} from "../../../types";
import RGGraphMath from "../RGGraphMath";
import {structuredPathToSvgD, RGLinePathCommands} from "./RGLinePath";

/**
 * 确定性伪随机函数
 */
const pseudoRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

/**
 * 内部工具函数：生成单条抖动路径指令
 */
const createSketchedCommands = (
    fx: number, fy: number, tx: number, ty: number,
    seed: number, roughness: number
): RGLinePathCommands => {
    const segmentLength = 12;
    const dx = tx - fx;
    const dy = ty - fy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const segments = Math.max(2, Math.floor(distance / segmentLength));

    // 法向量
    const nx = -dy / distance;
    const ny = dx / distance;

    const commands: RGLinePathCommands = [{ type: 'M', x: fx, y: fy }];
    let lastX = fx;
    let lastY = fy;

    for (let i = 1; i <= segments; i++) {
        let targetX = fx + (dx * i) / segments;
        let targetY = fy + (dy * i) / segments;

        if (i < segments) {
            // 根据 i 和种子生成确定的偏移
            const shift = pseudoRandom(seed + i) - 0.5;
            targetX += nx * shift * roughness;
            targetY += ny * shift * roughness;
        }

        commands.push({
            type: 'l',
            dx: targetX - lastX,
            dy: targetY - lastY
        });
        lastX = targetX;
        lastY = targetY;
    }
    return commands;
};

export const generateLineFor8 = (
    linePathGenerateParmas: RGGenerateLinePrams,
    textPosition: RGLineTextPosition = {x: 0, y: 0, rotate: 0}
): RGLinePathInfo => {
    const { fx, fy, tx, ty } = linePathGenerateParmas;

    // 1. 计算文本位置
    textPosition.rotate = RGGraphMath.getTextAngle(fx, fy, tx, ty);
    textPosition.x = fx + (tx - fx) / 2;
    textPosition.y = fy + (ty - fy) / 2;
    if (Number.isNaN(textPosition.rotate)) textPosition.rotate = 0;

    // 2. 生成两条互有偏差的路径，模拟“修正笔触”
    // baseSeed 保证相同位置的线条形态固定
    const baseSeed = fx + fy + tx + ty;

    // 第一笔：较粗略的轮廓
    const commands1 = createSketchedCommands(fx, fy, tx, ty, baseSeed, 2.5);
    // 第二笔：稍微偏离的“修正”笔触，改变种子和粗糙度
    const commands2 = createSketchedCommands(fx, fy, tx, ty, baseSeed + 99, 1.5);

    // 3. 合并路径数据
    // SVG 的 d 属性可以接受多个 M...L... 结构
    const pathData = `${structuredPathToSvgD(commands1)} ${structuredPathToSvgD(commands2)}`;

    return {
        pathCommands: [...commands1, ...commands2],
        pathData,
        textPosition,
        points: []
    };
}
