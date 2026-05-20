import { JsonNode, RGNode, RGOptions } from '../../types';
export type RGTransNodeToJsonOptions = {
    mode?: 'compact' | 'effective';
    graphOptions?: RGOptions;
    effectiveSizeMode?: 'resolved' | 'node';
};
export declare const newNodeTemplate: {
    id: string;
    x: number;
    y: number;
    text: string;
};
export declare const json2Node: (originData: JsonNode, graphOptions?: RGOptions, nodesSizeMap?: Map<string, [
    number,
    number
]>) => RGNode;
export declare const transNodeToJson: (node: RGNode, options?: RGTransNodeToJsonOptions) => JsonNode | undefined;
declare const _default: {
    json2Node: (originData: JsonNode, graphOptions?: Partial<import('../../types').RGOptionsInited> | undefined, nodesSizeMap?: Map<string, [number, number]> | undefined) => RGNode;
    transNodeToJson: (node: RGNode, options?: RGTransNodeToJsonOptions) => JsonNode | undefined;
};
export default _default;
