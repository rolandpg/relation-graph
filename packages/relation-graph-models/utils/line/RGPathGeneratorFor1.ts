import {RGGenerateLinePrams, RGLinePathInfo, RGLineTextPosition} from "../../../types";
import RGGraphMath from "../RGGraphMath";
import {structuredPathToSvgD, RGLinePathCommands} from "./RGLinePath";

export const generateLineFor1 = (
    linePathGenerateParmas: RGGenerateLinePrams,
    textPosition: RGLineTextPosition = {x: 0, y: 0, rotate: 0}
): RGLinePathInfo => {
    const {
        fx, fy, tx, ty
    } = linePathGenerateParmas;

    textPosition.rotate = RGGraphMath.getTextAngle(fx, fy, tx, ty);
    textPosition.x = fx + (tx - fx) / 2;
    textPosition.y = fy + (ty - fy) / 2;
    if (Number.isNaN(textPosition.rotate)) {
        textPosition.rotate = 0;
    }

    // 生成 pathCommands，M 为大写，l 为小写（相对）
    const dx = tx - fx;
    const dy = ty - fy;
    const pathCommands: RGLinePathCommands = [
        { type: 'M', x: fx, y: fy },
        { type: 'l', dx, dy }
    ];

    const pathData = structuredPathToSvgD(pathCommands);

    return {
        pathCommands,
        pathData,
        textPosition,
        points: []
    };
}
