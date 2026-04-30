import { RGFakeLine, RGFakeLineTargetRender, RGGenerateLineConfig, RGLine, RGLineTarget, RGOptionsFull } from '../../types';
import { RelationGraphWith2Data4ConnectTarget } from './RelationGraphWith2Data4ConnectTarget';
/**
 * API class for generating line configuration and line connection point information in relation-graph component, providing data support for drawing lines
 */
export declare class RelationGraphWith2Data5LineConfig extends RelationGraphWith2Data4ConnectTarget {
    constructor();
    /**
     * @inner
     */
    generateCreatingLineConfig(options?: RGOptionsFull): RGGenerateLineConfig;
    /**
     *  Generate configuration information for drawing lines based on line information
     * @param line
     */
    generateLineConfig(line: RGLine): RGGenerateLineConfig | false;
    /**
     * Generate configuration information for drawing fake lines based on fake line information
     * @param fakeLine
     */
    generateFakeLineConfig(fakeLine: RGFakeLine): RGGenerateLineConfig | false;
    private fakeLineTargetRender;
    /**
     * Set a custom render method for fake line targets, to provide more types of target rendering capabilities for fake lines
     * @param fakeLineTargetRender
     */
    setFakeLineTargetRender(fakeLineTargetRender: RGFakeLineTargetRender): void;
    /**
     * Get the target information of a fake line based on the target type and target ID
     * @param targetType
     * @param targetId
     * @param fakeLine
     */
    getFakeLineTarget(targetType: string, targetId: string, fakeLine: RGFakeLine): RGLineTarget | undefined;
}
