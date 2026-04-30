import { JsonLine, RGLine, RGLink, RGOptions } from '../../types';
export declare const json2Line: (originData: JsonLine, options: RGOptions) => RGLine;
export declare const transLineToJson: (line: RGLine) => JsonLine | undefined;
export declare const transLinkToJson: (link: RGLink) => JsonLine | undefined;
declare const _default: {
    json2Line: (originData: JsonLine, options: Partial<import('../../types').RGOptionsInited>) => RGLine;
    transLinkToJson: (link: RGLink) => JsonLine | undefined;
};
export default _default;
