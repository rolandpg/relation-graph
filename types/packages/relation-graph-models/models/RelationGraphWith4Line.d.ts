import { RGElementLine, RGGenerateLineConfig, RGLine, RGLinePathInfo, RGLineTextPosition, RGLink } from '../../types';
import { RelationGraphWith3Options2API } from './RelationGraphWith3Options2API';
/**
 * Methods related to line drawing in relation-graph component
 */
export declare class RelationGraphWith4Line extends RelationGraphWith3Options2API {
    constructor();
    /**
     * Get the specific coordinate position of the junction point according to the junction point style
     * @param junctionPointStyle Junction point position definition, type: RGJunctionPoint
     * @param createJunctionPointParams Parameters required to create junction points
     * @return Returns the coordinate position of the junction point
     *
     */
    private _getJunctionPoint;
    /**
     * @deprecated This method has been removed, please use createLineDrawInfo() instead.
     */
    createLinePath(link: RGLink | RGElementLine, line: RGLine, ri: number): void;
    /**
     * Generate line drawing information based on line information
     * - This method is generally used internally by components, but can also be called for external custom rendering of lines to obtain line drawing information.
     * @param link The connection line object that contains the starting and ending point object information
     * @param line The line object
     * @return Returns the line drawing information object
     *
     */
    createLineDrawInfo(link: RGLink | RGElementLine, line: RGLine): RGLinePathInfo | undefined;
    private _getLineDefaultOptions;
    /**
     * Generate line path data
     * - This method is generally used internally by components, but can also be called for external custom rendering of lines to obtain line drawing information.
     * @param generateConfig Data configuration for generating line paths
     * @return Returns the line path information object
     *
     */
    generateLinePath(generateConfig: RGGenerateLineConfig): RGLinePathInfo;
    /**
     * @inner
     * @private
     */
    private throwLineError;
    /**
     * @inner
     * @private
     */
    private createErrorLineValue;
    /**
     * @inner
     * @private
     */
    private withLineJunctionPoints;
    /**
     * @inner
     * @private
     */
    private createLinePathData;
    /**
     * Get the arrow marker ID based on the line information, used to set the SVG marker-start or marker-end attribute value
     * @param line The line object
     * @param isStartArrow Whether it is the start arrow, the default value is false, indicating the end arrow
     * @return Returns the arrow marker ID string, or undefined if the arrow is not displayed
     *
     */
    getArrowMarkerId(line: RGLine, isStartArrow?: boolean): string | undefined;
    /**
     * @inner
     * @private
     */
    private getLineArrow;
    /**
     * @deprecated Will be removed in future versions
     * @inner
     */
    getTextTransform(line: RGLine, textPosition: RGLineTextPosition): string;
    /**
     * English: Generate text style information on the line, including position, alignment, rotation, and other CSS styles
     * @param lineConfig RGGenerateLineConfig object, configuration information when generating the line
     * @param linePathInfo RGLinePathInfo object, line path information
     * @return Returns an object containing text content and CSS styles
     *
     */
    generateLineTextStyle(lineConfig: RGGenerateLineConfig, linePathInfo: RGLinePathInfo): {
        cssStyles: {
            transform: string;
            transformOrigin: string;
        };
        text?: undefined;
    } | {
        text: string;
        cssStyles: {
            transform: string;
            transformOrigin: string;
        };
    };
    /**
     * Generate text style information for textPath on the line, including position, alignment, rotation, and other CSS styles
     * @param lineConfig RGGenerateLineConfig object, configuration information when generating the line
     * @return Returns an object containing text content and CSS styles
     *
     */
    generateLineTextStyle4TextOnPath(lineConfig: RGGenerateLineConfig): {
        text: string;
        textOffset: {
            x: number;
            y: number;
        };
        textAnchor: string;
        onPathStartOffset: string;
        textRotate: number;
    } | null;
}
