import { RGGenerateLinePrams, RGLinePathInfo, RGLineTextPosition, RGPosition } from '../../../types';
export declare const generateLineForCurve6: (linePathGenerateParmas: RGGenerateLinePrams, textPosition?: RGLineTextPosition) => RGLinePathInfo;
export declare const calcCurveLineCenter: (P0: RGPosition, P1: RGPosition, P2: RGPosition, P3: RGPosition, t?: number) => {
    x: number;
    y: number;
};
