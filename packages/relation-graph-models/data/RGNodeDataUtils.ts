import {JsonNode, RGInnerConnectTargetType, RGNode, RGOptions} from '../../types';
import {getNodeShape} from "../utils/RGNodesAnalytic";

export type RGTransNodeToJsonOptions = {
    mode?: 'compact' | 'effective';
    graphOptions?: RGOptions;
    effectiveSizeMode?: 'resolved' | 'node';
};

export const newNodeTemplate = {
    id: 'rg-newNodeTemplate',
    x: 0,
    y: 0,
    text: ''
};
export const json2Node = (originData: JsonNode, graphOptions?: RGOptions, nodesSizeMap?: Map<string, [number, number]>) => {
    if (originData.id === undefined) {
        console.log('node must has id:', originData);
        throw new Error('node must has option[id]:');
    }
    if (originData.isShow !== undefined) {
        originData.hidden = !originData.isShow;
        console.warn('[relation-graph Warning] line option[isShow] is deprecated, please use [hidden] instead.');
    }
    if (originData.isHide !== undefined) {
        originData.hidden = originData.isHide;
        console.warn('[relation-graph Warning] line option[isHide] is deprecated, please use [hidden] instead.');
    }
    const nodeWidth = originData.width || originData.width === 0 ? originData.width : graphOptions?.defaultNodeWidth;
    const nodeHeight = originData.height || originData.height === 0 ? originData.height : graphOptions?.defaultNodeHeight;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const jsonData: RGNode = {
        id: originData.id,
        text: originData.text !== undefined ? originData.text : '',
        type: originData.type !== undefined ? originData.type : '',
        targetType: originData.targetType !== undefined ? originData.targetType : RGInnerConnectTargetType.Node,
        expanded: originData.expanded !== undefined ? originData.expanded : true,
        selected: originData.selected !== undefined ? originData.selected : false,
        className:
            originData.className !== undefined ? originData.className : '',
        nodeShape: getNodeShape(originData.nodeShape, graphOptions?.defaultNodeShape),
        borderWidth:
            originData.borderWidth !== undefined ? originData.borderWidth : undefined,
        borderRadius:
            originData.borderRadius !== undefined ? originData.borderRadius : undefined,
        borderColor:
            originData.borderColor !== undefined ? originData.borderColor : undefined,
        fontColor:
            originData.fontColor !== undefined ? originData.fontColor : undefined,
        fontSize:
            originData.fontSize !== undefined ? originData.fontSize : undefined,
        color: originData.color !== undefined ? originData.color : undefined,
        opacity: originData.opacity !== undefined ? originData.opacity : undefined,
        fixed: originData.fixed !== undefined ? originData.fixed : false,
        width: nodeWidth,
        height: nodeHeight,
        force_weight: originData.force_weight,
        x: originData.x !== undefined ? originData.x : 0,
        y: originData.y !== undefined ? originData.y : 0,
        expandHolderPosition:
            originData.expandHolderPosition !== undefined
                ? originData.expandHolderPosition
                : undefined,
        disablePointEvent:
            originData.disablePointEvent !== undefined
                ? originData.disablePointEvent
                : undefined,
        disableDrag:
            originData.disableDrag !== undefined ? originData.disableDrag : false,
        hidden: originData.hidden !== undefined ? originData.hidden : false,
        rgCalcedVisibility: true, // !hidden || (parent !hidden) || (parent collapsed)
        rgShouldRender: true,
        rgChildrenSize: 0,
        zIndex: originData.zIndex || 0,
        el_W: originData.el_W || nodeWidth || 0,
        el_H: originData.el_H || nodeHeight || 0,
        data: originData.data !== undefined ? originData.data : {}
    };
    if (nodesSizeMap && nodesSizeMap.has && nodesSizeMap.has(jsonData.id)) {
        const size = nodesSizeMap.get(jsonData.id);
        if (!jsonData.el_W) {
            if (size) {
                jsonData.el_W = size[0];
            }
        }
        if (!jsonData.el_H) {
            if (size) {
                jsonData.el_H = size[1];
            }
        }
    }
    jsonData.lot = {
        childs: [],
        parent: undefined,
        eached: false,
        strength: 0
    };
    if (jsonData.width) jsonData.el_W = jsonData.width;
    if (jsonData.height) jsonData.el_H = jsonData.height;
    return jsonData;
};
const _ignore_node_keys = [
    'Fx',
    'Fy',
    'appended',
    'dragging',
    'el',
    'el_W',
    'el_H',
    'targetFrom',
    'targetNodes',
    'targetTo',
    'lot',
    'seeks_id',
    "shouldRender",
    "rgCalcedVisibility",
    "rgShouldRender",
    "rgChildrenSize",
    "origin_x",
    "origin_y",
    "selected"
];
const transNodeToCompactJson = (node: RGNode): JsonNode | undefined => {
    if (!node) return;
    const _node_json = {};
    Object.keys(node).forEach((thisKey) => {
        if (!_ignore_node_keys.includes(thisKey)) {
            const optionValue = node[thisKey];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (optionValue !== undefined) {
                if (thisKey === 'offset_x' && optionValue === 0) {
                    // Do nothing
                } else if (thisKey === 'nodeShape' && optionValue === 1) {
                    // Do nothing
                } else if (thisKey === 'offset_y' && optionValue === 0) {
                    // Do nothing
                } else if (thisKey === 'zIndex' && optionValue === 0) {
                    // Do nothing
                } else if (thisKey === 'width' && !optionValue) {
                    // Do nothing
                } else if (thisKey === 'height' && !optionValue) {
                    // Do nothing
                } else if (thisKey === 'fixed' && optionValue === false) {
                    // Do nothing
                } else if (thisKey === 'className' && optionValue === '') {
                    // Do nothing
                } else if (thisKey === 'hidden' && optionValue === false) {
                    // Do nothing
                } else if (thisKey === 'disableDrag' && optionValue === false) {
                    // Do nothing
                } else if (thisKey === 'expanded' && optionValue === true) {
                    // Do nothing
                } else if (thisKey === 'opacity' && optionValue === 1) {
                    // Do nothing
                } else if (thisKey === 'type' && optionValue === 'node') {
                    // Do nothing
                } else if (thisKey === 'targetType' && optionValue === RGInnerConnectTargetType.Node) {
                    // Do nothing
                } else if (thisKey === 'data' && (!optionValue || Object.keys(optionValue).length === 0)) {
                    // Do nothing
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    _node_json[thisKey] = optionValue;
                }
            }
        }
    });
    return _node_json as JsonNode;
};
const transNodeToEffectiveJson = (
    node: RGNode,
    graphOptions?: RGOptions,
    effectiveSizeMode: RGTransNodeToJsonOptions['effectiveSizeMode'] = 'resolved'
): JsonNode | undefined => {
    if (!node) return;
    const nodeJson = (transNodeToCompactJson(node) || {}) as JsonNode;
    const width = effectiveSizeMode === 'node'
        ? node.width
        : ((node.width || node.width === 0) ? node.width : graphOptions?.defaultNodeWidth);
    const height = effectiveSizeMode === 'node'
        ? node.height
        : ((node.height || node.height === 0) ? node.height : graphOptions?.defaultNodeHeight);
    const effectiveNodeJson: JsonNode = {
        ...nodeJson,
        id: node.id,
        text: node.text !== undefined ? node.text : '',
        type: node.type !== undefined ? node.type : '',
        targetType: node.targetType !== undefined ? node.targetType : RGInnerConnectTargetType.Node,
        expanded: node.expanded !== undefined ? node.expanded : true,
        disablePointEvent: node.disablePointEvent === undefined ? graphOptions?.disableNodePointEvent : node.disablePointEvent,
        disableDrag: Boolean(node.disableDrag || graphOptions?.disableDragNode),
        className: node.className !== undefined ? node.className : '',
        nodeShape: getNodeShape(node.nodeShape, graphOptions?.defaultNodeShape),
        borderColor: node.borderColor !== undefined ? node.borderColor : graphOptions?.defaultNodeBorderColor,
        borderWidth: node.borderWidth !== undefined ? node.borderWidth : graphOptions?.defaultNodeBorderWidth,
        borderRadius: node.borderRadius !== undefined ? node.borderRadius : graphOptions?.defaultNodeBorderRadius,
        color: node.color !== undefined ? node.color : graphOptions?.defaultNodeColor,
        opacity: node.opacity !== undefined ? node.opacity : 1,
        fixed: node.fixed !== undefined ? node.fixed : false,
        x: node.x !== undefined ? node.x : 0,
        y: node.y !== undefined ? node.y : 0,
        zIndex: node.zIndex || 0,
        data: node.data !== undefined ? node.data : {},
        expandHolderPosition:
            node.expandHolderPosition !== undefined ? node.expandHolderPosition : graphOptions?.defaultExpandHolderPosition,
        hidden: node.hidden !== undefined ? node.hidden : false,
        ...(width !== undefined ? {width} : {}),
        ...(height !== undefined ? {height} : {}),
    };
    delete effectiveNodeJson.el_W;
    delete effectiveNodeJson.el_H;
    return effectiveNodeJson;
};
export const transNodeToJson = (node: RGNode, options: RGTransNodeToJsonOptions = {}): JsonNode | undefined => {
    if (options.mode === 'effective') {
        return transNodeToEffectiveJson(node, options.graphOptions, options.effectiveSizeMode);
    }
    return transNodeToCompactJson(node);
};
export default {
    json2Node,
    transNodeToJson
};
