import {JsonLine, RGFakeLine, RGInnerConnectTargetType, RGJunctionPoint, RGLine, RGLink, RGOptions} from '../../types';

export type RGTransLineToJsonOptions = {
    mode?: 'compact' | 'effective';
    graphOptions?: RGOptions;
};

export const json2Line = (originData: JsonLine, options: RGOptions) => {
    if (originData.from === undefined) {
        console.log('error,line must has option[from](nodeId):', originData);
        throw new Error('error,line must has option[from]:');
    }
    if (originData.to === undefined) {
        console.log('error,line must has option[to](nodeId):', originData);
        throw new Error('error,line must has option[to]:');
    }
    if (typeof originData.from !== 'string') {
        console.log('error line from, must be string(nodeId):', originData);
        throw new TypeError('error line from, must be string:');
    }
    if (typeof originData.to !== 'string') {
        console.log('error line to, must be string(nodeId):', originData);
        throw new TypeError('error line to, must be string:');
    }
    if (originData.hidden === undefined && originData.isShow !== undefined) {
        originData.hidden = !originData.isShow;
        console.warn('[relation-graph Warning] line option[isShow] is deprecated, please use [hidden] instead.');
    }
    if (originData.hidden === undefined && originData.isHide !== undefined) {
        originData.hidden = originData.isHide;
        console.warn('[relation-graph Warning] line option[isHide] is deprecated, please use [hidden] instead.');
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const jsonData: RGLine = {
        id: originData.id,
        from: originData.from,
        to: originData.to,
        type: originData.type !== undefined ? originData.type : '',
        isFakeLine: originData.isFakeLine !== undefined ? originData.isFakeLine : false,
        fromType: originData.fromType !== undefined ? originData.fromType : (originData.isFakeLine ? RGInnerConnectTargetType.CanvasPoint:RGInnerConnectTargetType.Node),
        toType: originData.toType !== undefined ? originData.toType : (originData.isFakeLine ? RGInnerConnectTargetType.CanvasPoint:RGInnerConnectTargetType.Node),
        selected: false,
        text: originData.text !== undefined ? originData.text : '',
        textOffsetX: originData.textOffsetX !== undefined ? originData.textOffsetX : undefined,
        textOffsetY: originData.textOffsetY !== undefined ? originData.textOffsetY : undefined,
        color: originData.color !== undefined ? originData.color : undefined,
        opacity: originData.opacity !== undefined ? originData.opacity : undefined,
        fontSize: originData.fontSize !== undefined ? originData.fontSize : undefined,
        fontColor:
            originData.fontColor !== undefined ? originData.fontColor : undefined,
        lineWidth:
            originData.lineWidth !== undefined ? originData.lineWidth : undefined,
        lineShape: originData.lineShape || options.defaultLineShape || 1,
        className:
            originData.className !== undefined ? originData.className : undefined,
        animation: originData.animation !== undefined ? originData.animation : 0,
        dashType: originData.dashType !== undefined ? originData.dashType : 0,
        disablePointEvent: originData.disablePointEvent !== undefined ? originData.disablePointEvent : false,
        showStartArrow: originData.showStartArrow !== undefined ? originData.showStartArrow : false,
        showEndArrow: originData.showEndArrow !== undefined ? originData.showEndArrow : true,
        useTextOnPath: originData.useTextOnPath !== undefined ? originData.useTextOnPath : undefined,
        placeText: originData.placeText !== undefined ? originData.placeText : undefined,
        startMarkerId: originData.startMarkerId || '',
        endMarkerId: originData.endMarkerId || '',
        textAnchor: originData.textAnchor !== undefined ? originData.textAnchor : undefined,
        junctionOffset: originData.junctionOffset,
        fromJunctionPoint: originData.fromJunctionPoint,
        toJunctionPoint: originData.toJunctionPoint,
        fromJunctionPointOffsetX: originData.fromJunctionPointOffsetX || 0,
        fromJunctionPointOffsetY: originData.fromJunctionPointOffsetY || 0,
        toJunctionPointOffsetX: originData.toJunctionPointOffsetX || 0,
        toJunctionPointOffsetY: originData.toJunctionPointOffsetY || 0,
        lineRadius: originData.lineRadius,
        force_elastic: originData.force_elastic,
        polyLineStartDistance: originData.polyLineStartDistance,
        ctrlPointsFor49: originData.ctrlPointsFor49,
        ctrlPointsFor44: originData.ctrlPointsFor44,
        ctrlPoints: originData.ctrlPoints,
        lineDirection:
            originData.lineDirection !== undefined
                ? originData.lineDirection
                : undefined,
        forDisplayOnly: originData.forDisplayOnly || (originData.from === originData.to),
        hidden: originData.hidden !== undefined ? originData.hidden : false,
        cssVars: originData.cssVars !== undefined ? originData.cssVars : undefined,
        data: originData.data !== undefined ? originData.data : {}
    };
    return jsonData;
};

const _ignore_link_keys = [
    'arrow',
    'isReverse',
    "selected",
    "shouldRender",
    "rgCalcedVisibility",
];
const transLineToCompactJson = (line: RGLine | RGFakeLine) => {
    if (!line) return;
    const _line_json = {};
    Object.keys(line).forEach((thisKey) => {
        if (!_ignore_link_keys.includes(thisKey)) {
            const optionValue = line[thisKey];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (optionValue !== undefined) {
                if (thisKey === 'isFakeLine' && optionValue === false) {
                    // Do nothing
                } else if (thisKey === 'fromType' && optionValue === RGInnerConnectTargetType.Node) {
                    // Do nothing
                } else if (thisKey === 'toType' && optionValue === RGInnerConnectTargetType.Node) {
                    // Do nothing
                } else if (thisKey === 'animation' && optionValue === 0) {
                    // Do nothing
                } else if (thisKey === 'text' && optionValue === '') {
                    // Do nothing
                } else if (thisKey === 'dashType' && optionValue === 0) {
                    // Do nothing
                } else if (thisKey === 'disablePointEvent' && optionValue === false) {
                    // Do nothing
                } else if (thisKey === 'showStartArrow' && optionValue === false) {
                    // Do nothing
                } else if (thisKey === 'showEndArrow' && optionValue === true) {
                    // Do nothing
                } else if (thisKey === 'startMarkerId' && optionValue === '') {
                    // Do nothing
                } else if (thisKey === 'endMarkerId' && optionValue === '') {
                    // Do nothing
                } else if (thisKey === 'forDisplayOnly' && optionValue === false) {
                    // Do nothing
                } else if (thisKey === 'fromJunctionPointOffsetX' && optionValue === 0) {
                    // Do nothing
                } else if (thisKey === 'fromJunctionPointOffsetY' && optionValue === 0) {
                    // Do nothing
                } else if (thisKey === 'toJunctionPointOffsetX' && optionValue === 0) {
                    // Do nothing
                } else if (thisKey === 'toJunctionPointOffsetY' && optionValue === 0) {
                    // Do nothing
                } else if (thisKey === 'opacity' && optionValue === 1) {
                    // Do nothing
                } else if (thisKey === 'hidden' && optionValue === false) {
                    // Do nothing
                } else if (thisKey === 'data' && (!optionValue || Object.keys(optionValue).length === 0)) {
                    // Do nothing
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    _line_json[thisKey] = line[thisKey];
                }
            }
        }
    });
    return _line_json as JsonLine;
};
const transLineToEffectiveJson = (line: RGLine | RGFakeLine, graphOptions?: RGOptions) => {
    if (!line) return;
    const lineJson = (transLineToCompactJson(line) || {}) as JsonLine;
    const isFakeLine = line.isFakeLine === true;
    return {
        ...lineJson,
        id: line.id,
        from: line.from,
        to: line.to,
        text: line.text !== undefined ? line.text : '',
        type: line.type !== undefined ? line.type : '',
        isFakeLine,
        fromType: line.fromType !== undefined ? line.fromType : (isFakeLine ? RGInnerConnectTargetType.CanvasPoint : RGInnerConnectTargetType.Node),
        toType: line.toType !== undefined ? line.toType : (isFakeLine ? RGInnerConnectTargetType.CanvasPoint : RGInnerConnectTargetType.Node),
        color: line.color !== undefined ? line.color : graphOptions?.defaultLineColor,
        lineWidth: line.lineWidth !== undefined ? line.lineWidth : graphOptions?.defaultLineWidth,
        opacity: line.opacity !== undefined ? line.opacity : 1,
        lineShape: line.lineShape || graphOptions?.defaultLineShape || 1,
        showStartArrow: line.showStartArrow !== undefined ? line.showStartArrow : false,
        showEndArrow: line.showEndArrow !== undefined ? line.showEndArrow : true,
        startMarkerId: line.startMarkerId || '',
        endMarkerId: line.endMarkerId || '',
        useTextOnPath: line.useTextOnPath || graphOptions?.defaultLineTextOnPath || false,
        textOffsetX: line.textOffsetX || graphOptions?.defaultLineTextOffsetX || 0,
        textOffsetY: line.textOffsetY || graphOptions?.defaultLineTextOffsetY || 0,
        disablePointEvent: line.disablePointEvent === undefined ? graphOptions?.disableLinePointEvent : line.disablePointEvent,
        data: line.data !== undefined ? line.data : {},
        animation: line.animation !== undefined ? line.animation : 0,
        dashType: line.dashType !== undefined ? line.dashType : 0,
        lineRadius: line.lineRadius !== undefined ? line.lineRadius : graphOptions?.defaultPolyLineRadius,
        forDisplayOnly: line.forDisplayOnly || (line.from === line.to),
        junctionOffset: line.junctionOffset || graphOptions?.defaultLineJunctionOffset || 0,
        fromJunctionPoint: line.fromJunctionPoint || graphOptions?.defaultJunctionPoint || RGJunctionPoint.border,
        toJunctionPoint: line.toJunctionPoint || graphOptions?.defaultJunctionPoint || RGJunctionPoint.border,
        fromJunctionPointOffsetX: line.fromJunctionPointOffsetX || 0,
        fromJunctionPointOffsetY: line.fromJunctionPointOffsetY || 0,
        toJunctionPointOffsetX: line.toJunctionPointOffsetX || 0,
        toJunctionPointOffsetY: line.toJunctionPointOffsetY || 0,
        hidden: line.hidden !== undefined ? line.hidden : false,
    };
};
export const transLineToJson = (line: RGLine | RGFakeLine, options: RGTransLineToJsonOptions = {}) => {
    if (options.mode === 'effective') {
        return transLineToEffectiveJson(line, options.graphOptions);
    }
    return transLineToCompactJson(line);
};
export const transLinkToJson = (link: RGLink, options: RGTransLineToJsonOptions = {}) => {
    if (!link) return;
    return transLineToJson(link.line, options);
};
export default {
    json2Line,
    transLinkToJson
};
