import RGGraphMath, {CreateJunctionPointParams, getNodeDistance} from '../utils/RGGraphMath';
import {devLog} from '../utils/RGCommon';
import {
    RGJunctionPoint,
    RGElementLine, RGFakeLine,
    RGGenerateLineConfig, RGGenerateLinePrams,
    RGLine, RGLinePathInfo,
    RGLineTarget,
    RGLineTextPosition,
    RGLink,
    RGLineShape
} from '../../types';
import {RGLinePathCommands, structuredPathToSvgD} from "../utils/line/RGLinePath";
import {generateLineFor1} from "../utils/line/RGPathGeneratorFor1";
import {generateLineFor4} from "../utils/line/RGPathGeneratorFor4";
import {generateLineFor44} from "../utils/line/RGPathGeneratorFor44";
import {generateLineFor49} from "../utils/line/RGPathGeneratorFor49";
import {generateLineForCurve6} from "../utils/line/RGPathGeneratorFor6";
import {generateLineForCurve} from "../utils/line/RGPathGeneratorForCurve";
import {RelationGraphWith3Options2API} from "./RelationGraphWith3Options2API";
import {getNodeShape} from "../utils/RGNodesAnalytic";
import {generateLineFor8} from "../utils/line/RGPathGeneratorFor8";

/**
 * Methods related to line drawing in relation-graph component
 */
export class RelationGraphWith4Line extends RelationGraphWith3Options2API {
    constructor() {
        super();
    }

    /**
     * Get the specific coordinate position of the junction point according to the junction point style
     * @param junctionPointStyle Junction point position definition, type: RGJunctionPoint
     * @param createJunctionPointParams Parameters required to create junction points
     * @return Returns the coordinate position of the junction point
     *
     */
    private _getJunctionPoint(junctionPointStyle: RGJunctionPoint, createJunctionPointParams: CreateJunctionPointParams) {
        if (junctionPointStyle === RGJunctionPoint.border) {
            return RGGraphMath.getBorderPoint4MultiLine(createJunctionPointParams);
        } else if (junctionPointStyle === RGJunctionPoint.ltrb) {
            return RGGraphMath.getRectJoinPoint(createJunctionPointParams);
        } else if (junctionPointStyle === RGJunctionPoint.tb) {
            return RGGraphMath.getRectVJoinPoint(createJunctionPointParams);
        } else if (junctionPointStyle === RGJunctionPoint.lr) {
            return RGGraphMath.getRectHJoinPoint(createJunctionPointParams);
        } else if (junctionPointStyle === RGJunctionPoint.left) {
            return RGGraphMath.getRectLeftJoinPoint(createJunctionPointParams);
        } else if (junctionPointStyle === RGJunctionPoint.right) {
            return RGGraphMath.getRectRightJoinPoint(createJunctionPointParams);
        } else if (junctionPointStyle === RGJunctionPoint.top) {
            return RGGraphMath.getRectTopJoinPoint(createJunctionPointParams);
        } else if (junctionPointStyle === RGJunctionPoint.bottom) {
            return RGGraphMath.getRectBottomJoinPoint(createJunctionPointParams);
        } else if (junctionPointStyle === 'horizontalLine') {
            return RGGraphMath.getRectHorizontalLineJoinPoint(createJunctionPointParams);
        } else if (junctionPointStyle === 'verticalLine') {
            return RGGraphMath.getRectVerticalLineLineJoinPoint(createJunctionPointParams);
        } else {
            return RGGraphMath.getBorderPoint4MultiLine(createJunctionPointParams);
        }
    }

    /**
     * @deprecated This method has been removed, please use createLineDrawInfo() instead.
     */
    createLinePath(link: RGLink | RGElementLine, line: RGLine, ri: number) {
        throw new Error('createLinePath() is deprecated, please use createLineDrawInfo() instead.');
    }

    /**
     * Generate line drawing information based on line information
     * - This method is generally used internally by components, but can also be called for external custom rendering of lines to obtain line drawing information.
     * @param link The connection line object that contains the starting and ending point object information
     * @param line The line object
     * @return Returns the line drawing information object
     *
     */
    createLineDrawInfo(link: RGLink | RGElementLine, line: RGLine) {
        let from: RGLineTarget;
        let to: RGLineTarget;
        let totalLinesBetweenNodes = 1;
        let currentLineIndex = 0;
        if (link) {
            currentLineIndex = link.currentLineIndex;
            totalLinesBetweenNodes = link.totalLinesBetweenNodes;
        }
        if (link) {
            from = link.fromNode;
            to = link.toNode;
        } else {
            const fakeLine = line as RGFakeLine;
            from = this.getFakeLineTarget(fakeLine.fromType, fakeLine.from, fakeLine, {
                preferLiveTarget: false
            });
            to = this.getFakeLineTarget(fakeLine.toType, fakeLine.to, fakeLine, {
                preferLiveTarget: false
            });
            if (!from) {
                // 无法获取线条的起点或终点
                console.warn('Invalid line configuration:error from:', line);
                return;
            }
            if (!to) {
                // 无法获取线条的起点或终点
                console.warn('Invalid line configuration:error to:', line);
                return;
            }
        }
        return this.generateLinePath({
            line,
            from,
            to,
            totalLinesBetweenNodes,
            currentLineIndex
        });
    }
    private _getLineDefaultOptions() {
        const options = this.getOptions();
        return {
            layoutDirection: options.layout.layoutDirection,
            multiLineDistance: options.multiLineDistance,
            defaultJunctionPoint: options.defaultJunctionPoint,
            lineRadius: options.defaultPolyLineRadius,
            defaultLineJunctionOffset: options.defaultLineJunctionOffset,
            defaultNodeShape: options.defaultNodeShape
        };
    }
    /**
     * Generate line path data
     * - This method is generally used internally by components, but can also be called for external custom rendering of lines to obtain line drawing information.
     * @param generateConfig Data configuration for generating line paths
     * @return Returns the line path information object
     *
     */
    generateLinePath(generateConfig: RGGenerateLineConfig) {
        // console.warn('generate generateLinePath:', generateConfig.line.isFakeLine, generateConfig.line.text);
        if (generateConfig.totalLinesBetweenNodes === undefined)  generateConfig.totalLinesBetweenNodes = 1;
        if (generateConfig.currentLineIndex === undefined)  generateConfig.currentLineIndex = 0;
        if (generateConfig.defaultOptions === undefined)  generateConfig.defaultOptions = this._getLineDefaultOptions();
        // console.warn('generate generateLinePath:', generateConfig.line.isFakeLine, generateConfig.line.text);
        try {
            const linePathGenerateParmas = this.withLineJunctionPoints(generateConfig);

            const info = this.createLinePathData(linePathGenerateParmas);
            // console.error('generateLinePath:', info.pathData, generateConfig.from, generateConfig.to, linePathGenerateParmas);
            return info;
        } catch (e:any) {
            if (e.rgError) {
                return this.createErrorLineValue(e.errorCode, e.x, e.y);
            } else {
                throw e;
            }
        }
    }

    /**
     * @inner
     * @private
     */
    private throwLineError(errorCode: string, x: number, y: number) {
        return {
            rgError: true,
            errorCode,
            x,
            y
        }
    }

    /**
     * @inner
     * @private
     */
    private createErrorLineValue(errorCode: string, x: number, y: number): RGLinePathInfo {
        const textPosition: RGLineTextPosition = {x: 0, y: 0, rotate: 0};
        const pathCommands: RGLinePathCommands  = [
            {type: 'M', x: 0, y: 0},
            {type: 'l', dx: x, dy: y},
        ];
        return {
            pathCommands,
            pathData: structuredPathToSvgD(pathCommands),
            textPosition,
            points: []
        };
    }

    /**
     * @inner
     * @private
     */
    private withLineJunctionPoints({line, from, to, totalLinesBetweenNodes, currentLineIndex, defaultOptions}: RGGenerateLineConfig): RGGenerateLinePrams {
        if (!from || !to) {
            devLog('error from-to:', from, to);
            throw this.throwLineError('F', -10, 0);
        }
        let lineShape =
            line.lineShape || 1;
        const lineDirection =
            line.lineDirection || defaultOptions.layoutDirection || 'h';
        let from_x = from.x || 0;
        let from_y = from.y || 0;
        let to_x = to.x || 0;
        let to_y = to.y || 0;
        if (Number.isNaN(from_x) || Number.isNaN(from_y)) {
            devLog('error start node:', from.text, from.x, from.y);
            throw this.throwLineError('A', -10, -10);
        }
        if (Number.isNaN(to_x) || Number.isNaN(to_y)) {
            devLog('error end point:', to.text, to.x, to.y);
            throw this.throwLineError('B', 10, -10);
        }
        let f_W = from.el_W || 60;
        let f_H = from.el_H || 60;
        if (Number.isNaN(f_W) || Number.isNaN(f_H)) {
            throw this.throwLineError('C', -10, 10);
        }
        let t_W = to.el_W || 60;
        let t_H = to.el_H || 60;
        if (Number.isNaN(t_W) || Number.isNaN(t_H)) {
            throw this.throwLineError('D', 10, 10);
        }
        if (from_x === 0 && to_x === 0 && from_y === 0 && to_y === 0) {
            throw this.throwLineError('D', 10, 10);
        }
        const isXYReverse = ((to_x - from_x) + (to_y - from_y)) > 0;
        // console.log('isXYReverse:', isXYReverse, (to_x - from_x), (to_y - from_y))
        const viewFromNode = line.isReverse ? to : from;
        const viewToNode = line.isReverse ? from : to;
        const fromNodeShape = getNodeShape(viewFromNode.nodeShape, defaultOptions.defaultNodeShape);
        const junctionOffset = line.junctionOffset || defaultOptions.defaultLineJunctionOffset || 0;
        from_x -= junctionOffset;
        from_y -= junctionOffset;
        to_x -= junctionOffset;
        to_y -= junctionOffset;
        f_W += junctionOffset * 2;
        f_H += junctionOffset * 2;
        t_W += junctionOffset * 2;
        t_H += junctionOffset * 2;
        const __params4start: CreateJunctionPointParams = {
            from_x,
            from_y,
            to_x,
            to_y,
            f_W,
            f_H,
            t_W,
            t_H,
            nodeShape: fromNodeShape, // TODO from.nodeShape
            isReverse: isXYReverse,
            isEndPoint: false,
            totalLinesBetweenNodes,
            // currentLineIndex: (isReverse ? currentLineIndex : (totalLinesBetweenNodes! - currentLineIndex! - 1)),
            currentLineIndex,
            lineDistance: defaultOptions.multiLineDistance || 30
        };
        const toNodeShape =  getNodeShape(viewToNode.nodeShape, defaultOptions.defaultNodeShape);
        const __params4end: CreateJunctionPointParams = {
                from_x: to_x,
                from_y: to_y,
                to_x: from_x,
                to_y: from_y,
                f_W: t_W,
                f_H: t_H,
                t_W: f_W,
                t_H: f_H,
                nodeShape: toNodeShape, // TODO to.nodeShape
                isReverse: isXYReverse,
                isEndPoint: true,
                totalLinesBetweenNodes,
                currentLineIndex,
                // currentLineIndex: (isReverse ? currentLineIndex : (totalLinesBetweenNodes! - currentLineIndex! - 1)),
                lineDistance: defaultOptions.multiLineDistance || 50
            }
        ;
        const defaultJunctionPointStyle: RGJunctionPoint = (defaultOptions.defaultJunctionPoint || RGJunctionPoint.border) as RGJunctionPoint;

        let fromJunctionPoint: RGJunctionPoint = line.fromJunctionPoint || (viewFromNode as RGLineTarget).junctionPoint || defaultJunctionPointStyle;
        // console.error('fromJunctionPoint:', fromJunctionPoint, line.fromJunctionPoint);
        let toJunctionPoint: RGJunctionPoint = line.toJunctionPoint || (viewToNode as RGLineTarget).junctionPoint || defaultJunctionPointStyle;
        let fromJunctionPointOffsetX = line.fromJunctionPointOffsetX || 0;
        let fromJunctionPointOffsetY = line.fromJunctionPointOffsetY || 0;
        let toJunctionPointOffsetX = line.toJunctionPointOffsetX || 0;
        let toJunctionPointOffsetY = line.toJunctionPointOffsetY || 0;
        if (line.isReverse) {
            [fromJunctionPoint, toJunctionPoint] = [toJunctionPoint, fromJunctionPoint];
            // [fromJunctionPointOffsetX, fromJunctionPointOffsetY, toJunctionPointOffsetX, toJunctionPointOffsetY] = [toJunctionPointOffsetY, toJunctionPointOffsetX, fromJunctionPointOffsetY, fromJunctionPointOffsetX];
            [fromJunctionPointOffsetX, fromJunctionPointOffsetY, toJunctionPointOffsetX, toJunctionPointOffsetY] = [toJunctionPointOffsetX, toJunctionPointOffsetY, fromJunctionPointOffsetX, fromJunctionPointOffsetY ];
        }
        if (from === to || ((from_x === 0 && to_x === 0) && (from_y === 0 && to_y === 0))) {
            if (fromJunctionPointOffsetX === 0 && fromJunctionPointOffsetY === 0 && toJunctionPointOffsetX === 0 && toJunctionPointOffsetY === 0) {
                if (lineShape === RGLineShape.StandardStraight || lineShape === RGLineShape.Curve2 || lineShape === RGLineShape.Curve3 || lineShape === RGLineShape.SimpleOrthogonal || lineShape === RGLineShape.Curve5) {
                    lineShape = RGLineShape.StandardCurve;
                }
                toJunctionPointOffsetY = 20;
            }
        }
        const __start = this._getJunctionPoint(fromJunctionPoint, __params4start);
        __start.x += fromJunctionPointOffsetX;
        __start.y += fromJunctionPointOffsetY;
        const __end = this._getJunctionPoint(toJunctionPoint, __params4end);
        __end.x += toJunctionPointOffsetX;
        __end.y += toJunctionPointOffsetY;
        if (!__start || !__end) {
            throw this.throwLineError('E', -20, -20);
        }

        const fcx = from_x + f_W / 2;
        const fcy = from_y + f_H / 2;
        const tcx = to_x + t_W / 2;
        const tcy = to_y + t_H / 2;
        const directionX = tcx - fcx < 0 ? -5 : 5;
        const directionY = tcy - fcy < 0 ? -5 : 5;
        if (fromJunctionPoint === 'horizontalLine') {
            __start.x = __end.x;
            if (lineShape === 44 || lineShape === 49) {
                __start.x += (__end.x > tcx ? 1 : -1) * 30;
                // __end.x = __end.x + directionX;
            }
        } else if (fromJunctionPoint === 'verticalLine') {
            __start.y = __end.y;
            if (lineShape === 44 || lineShape === 49) {
                __start.y += (__end.y > tcy ? 1 : -1) * 30;
                // __end.y = __end.y + directionY;
            }
        }
        if (toJunctionPoint === 'horizontalLine') {
            __end.x = __start.x;
            if (lineShape === 44 || lineShape === 49) {
                __end.x += (__start.x > fcx ? 1 : -1) * 30;
                // __end.y = __end.y + directionY;
            }
        } else if (toJunctionPoint === 'verticalLine') {
            __end.y = __start.y;
            if (lineShape === 44 || lineShape === 49) {
                __end.y += (__start.y > fcy ? 1 : -1) * 30;
                // __end.x = __end.x + directionX;
            }
        }
        const fx = __start.x;
        const fy = __start.y;
        const tx = __end.x;
        const ty = __end.y;
        if (Number.isNaN(fx) || Number.isNaN(fy)) {
            devLog('error start point:', from.text);
            throw this.throwLineError('F', -10, 0);
        }
        if (Number.isNaN(tx) || Number.isNaN(ty)) {
            devLog('error end point:', to.text);
            throw this.throwLineError('G', 10, 0);
        }

        return {
            line,
            totalLinesBetweenNodes: totalLinesBetweenNodes!,
            currentLineIndex: currentLineIndex!,
            lineDirection: lineDirection === 'v' ? 'v' : 'h',
            lineShape,
            lineRadius: defaultOptions.lineRadius || 0,
            fromJunctionPoint,
            toJunctionPoint,
            fx, fy, fcx, fcy, f_W, f_H,
            tx, ty, tcx, tcy, t_W, t_H
        };
    }

    /**
     * @inner
     * @private
     */
    private createLinePathData(linePathGenerateParmas: RGGenerateLinePrams) {
        const {lineShape} = linePathGenerateParmas;
        let pathInfo: RGLinePathInfo;
        if (lineShape === RGLineShape.SimpleOrthogonal) {
            pathInfo = generateLineFor4(linePathGenerateParmas, undefined, this._getLineDefaultOptions());
        } else if (lineShape === RGLineShape.StandardOrthogonal) {
            pathInfo = generateLineFor44(linePathGenerateParmas, undefined, this._getLineDefaultOptions());
        } else if (lineShape === RGLineShape.HardOrthogonal) {
            pathInfo = generateLineFor49(linePathGenerateParmas, undefined, this._getLineDefaultOptions());
        } else if (lineShape === RGLineShape.StandardCurve) {
            pathInfo = generateLineForCurve6(linePathGenerateParmas);
        } else if (lineShape === RGLineShape.Curve2 || lineShape === RGLineShape.Curve3 || lineShape === RGLineShape.Curve5 || lineShape === RGLineShape.Curve7) {
            pathInfo = generateLineForCurve(linePathGenerateParmas);
        } else if (lineShape === RGLineShape.Curve8) {
            pathInfo = generateLineFor8(linePathGenerateParmas);
        } else {
            pathInfo = generateLineFor1(linePathGenerateParmas);
        }
        return pathInfo;
    }

    /**
     * Get the arrow marker ID based on the line information, used to set the SVG marker-start or marker-end attribute value
     * @param line The line object
     * @param isStartArrow Whether it is the start arrow, the default value is false, indicating the end arrow
     * @return Returns the arrow marker ID string, or undefined if the arrow is not displayed
     *
     */
    getArrowMarkerId(line: RGLine, isStartArrow = false) {
        let startArrowVisiale = line.showStartArrow === true;
        let endArrowVisiale = line.showEndArrow !== false;
        if (line.isReverse) {
            [startArrowVisiale, endArrowVisiale] = [endArrowVisiale, startArrowVisiale];
        }
        if (isStartArrow) {
            if (!startArrowVisiale) return undefined;
            if (line.startMarkerId) {
                return `url('#${line.startMarkerId}')`;
            }
        } else {
            if (!endArrowVisiale) return undefined;
            if (line.endMarkerId) {
                return `url('#${line.endMarkerId}')`;
            }
        }
        const _arrow = this.getLineArrow(
            line.color,
            isStartArrow,
            false
        );
        return `url('#${_arrow}')`;
    }

    /**
     * @inner
     * @private
     */
    private getLineArrow(_color: string | undefined, isStartArrow = false, checked = false) {
        const arrowType = (isStartArrow ? 'start-' : '');
        return `${this.getOptions().instanceId}-${arrowType}arrow-default`;
    }

    /**
     * @deprecated Will be removed in future versions
     * @inner
     */
    getTextTransform(line: RGLine, textPosition: RGLineTextPosition) {
        if (!line || !textPosition) {
            return 'translate(0,0)';
        }
        const {x,y,rotate} = textPosition;
        if (Number.isNaN(x) || Number.isNaN(y)) {
            return 'translate(0,0)';
        }
        const options = this.getOptions();
        const offsetX = line.textOffsetX || options.defaultLineTextOffsetX || 0;
        const offsetY = line.textOffsetY || options.defaultLineTextOffsetY || 0;
        const lineShape = line.lineShape || 1;
        if (lineShape === RGLineShape.StandardStraight || lineShape === RGLineShape.SimpleOrthogonal) {
            return `translate(-50%, -50%) translate(${(x + offsetX)}px,${(y + offsetY)}px) rotate(${rotate || 0}deg)`;
        } else {
            return `translate(-50%, -50%) translate(${(x + offsetX)}px,${(y + offsetY)}px)`;
        }
    }

    /**
     * English: Generate text style information on the line, including position, alignment, rotation, and other CSS styles
     * @param lineConfig RGGenerateLineConfig object, configuration information when generating the line
     * @param linePathInfo RGLinePathInfo object, line path information
     * @return Returns an object containing text content and CSS styles
     *
     */
    generateLineTextStyle(lineConfig: RGGenerateLineConfig, linePathInfo: RGLinePathInfo) {
        const options = this.getOptions();
        const cssStyles = {
            transform: '',
            transformOrigin: '0 0',
        };
        if (!lineConfig || !linePathInfo) {
            return {cssStyles};
        }
        const {line} = lineConfig;
        const {textPosition} = linePathInfo;
        if (!line || !textPosition) {
            return {cssStyles};
        }
        let text = line.text || '';
        if (text.length > options.lineTextMaxLength!) {
            text = text.substring(0, (options.lineTextMaxLength || 15)) + '...';
        }
        const {x,y,rotate} = textPosition;
        if (Number.isNaN(x) || Number.isNaN(y)) {
            return {text, cssStyles};
        }
        const translates = [];
        const textAnchor = line.textAnchor || 'center';
        if (textAnchor === 'start') {
            translates.push('translate(0%, -50%)');
        } else if (textAnchor === 'end') {
            translates.push('translate(-100%, -50%)');
        } else {
            translates.push('translate(-50%, -50%)');
        }
        translates.push(`translate(${x}px,${y}px)`);
        const textOffsetX = line.textOffsetX || options.defaultLineTextOffsetX || 0;
        const textOffsetY = line.textOffsetY || options.defaultLineTextOffsetY || 0;
        const lineShape = line.lineShape || 1;
        const textOnPath = line.useTextOnPath || options.defaultLineTextOnPath;
        if (textOnPath && lineShape === 1 && rotate) {
            translates.push(`rotate(${rotate || 0}deg)`);
        }
        if (lineShape === RGLineShape.StandardStraight) {
            cssStyles.transformOrigin = '50% 50%';
            // translates.push(`translate(0%, -10px)`);
            translates.push(`translate(${textOffsetX}px,${textOffsetY}px)`);
        } else {
            translates.push(`translate(${textOffsetX}px,${textOffsetY}px)`);
        }
        cssStyles.transform = translates.join(' ');
        return {
            text,
            cssStyles
        };
    }

    /**
     * Generate text style information for textPath on the line, including position, alignment, rotation, and other CSS styles
     * @param lineConfig RGGenerateLineConfig object, configuration information when generating the line
     * @return Returns an object containing text content and CSS styles
     *
     */
    generateLineTextStyle4TextOnPath(lineConfig: RGGenerateLineConfig) {
        const {line, from, to } = lineConfig;
        let text = line.text;
        if (!text) {
            return null;
        }
        if (!to || !from) {
            return null;
        }
        let textRotate = 0;
        // const fx = from.x;
        // const fy = from.y;
        // const tx = to.x;
        // const ty = to.y;
        const options = this.getOptions();
        if (text.length > options.lineTextMaxLength!) {
            text = text.substring(0, (options.lineTextMaxLength || 15)) + '...';
        }
        // if (fx > tx) {
        //     textRotate = 180;
        //     text = text.split('').reverse().join('');
        // }
        const textOffsetX = line.textOffsetX || options.defaultLineTextOffsetX || 0;
        const textOffsetY = line.textOffsetY || options.defaultLineTextOffsetY || 0;
        const textOffset = {
            x: textOffsetX,
            y: textOffsetY - 6
        };
        // const lineShape = line.lineShape || 1;
        let onPathStartOffset = '50%';
        if (line.placeText === 'start') {
            onPathStartOffset = '0%';
            textOffset.x += 20;
        } else if (line.placeText === 'end') {
            onPathStartOffset = '100%';
            textOffset.x -= 20;
        } else if (line.placeText === 'center') {
            onPathStartOffset = '50%';
        } else if (line.placeText) { // end
            onPathStartOffset = line.placeText;
        }
        let textAnchor = 'middle';
        if (line.textAnchor) {
            textAnchor = line.textAnchor;
        }
        return {
            text,
            textOffset,
            textAnchor,
            onPathStartOffset,
            textRotate
        };
    }
}
