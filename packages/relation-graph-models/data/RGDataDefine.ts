import {
    RGGraphData,
    RGNode,
    RGLine,
    RGLink,
    RGOptionsFull,
    RGFakeLine,
    RGConnectTargetData,
    RGLineTarget
} from '../../types';

/**
 * 数据提供者
 * 专门负责数据的增删改查，并自动触发视图更新
 */
export class RGDataDefine {
    constructor() {
    }

    /**
     * All data managed in RelationGraph, including all nodes RGNode, all relationships RGLink, the current root node, and all element lines elementLines
     */
    protected graphData: RGGraphData = {
        rootNode: undefined,
        nodes: [],
        normalLines: [],
        fakeLines: [],
    };
    protected options: RGOptionsFull = {};
    protected runtimeDATA4NodeMap: Map<string, RGNode> = new Map();
    protected runtimeDATA4Links: RGLink[] = [];
    protected runtimeDATA4LinkMap: Map<string, RGLink> = new Map();
    protected runtimeDATA4ConnectTargets: RGConnectTargetData[] = [];
    protected runtimeDATA4ElLineTargets: RGLineTarget[] = [];
    protected runtimeDATA4ShouldRenderItems: {
        nodes: RGNode[],
        lines: RGLine[],
        fakeLines: RGFakeLine[],
    } = {
        nodes: [],
        lines: [],
        fakeLines: [],
    };

}
