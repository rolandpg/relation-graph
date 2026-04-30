import { RGConnectTargetData, RGJunctionPoint } from '../../types';
import { RelationGraphWith2Data3Update } from './RelationGraphWith2Data3Update';
/**
 * The class related to connection point management in the relation-graph component, where the connection point refers to the connection point registered through the <RGConnectTarget> component
 */
export declare class RelationGraphWith2Data4ConnectTarget extends RelationGraphWith2Data3Update {
    constructor();
    private canvasConnectTargetsMap;
    private nodeConnectTargetsMap;
    private connectTargetElementMap;
    /**
     * In general, relation-graph will automatically update the position of the connection points.
     * - This method is only used for manual calls in some special scenarios.
     * - It is provided for external calls to update the connection point positions of the specified canvas slot, and is not suitable for high-frequency calls.
     * @param by
     * @param canvasSlotDom
     * @protected
     */
    protected updateConnectTargetsOnCanvas(by: string, canvasSlotDom: Element): void;
    /**
     * In general, relation-graph will automatically update the position of the connection points.
     * - This method is only used for manual calls in some special scenarios.
     * - It is provided for external calls to update the connection point positions of the specified node, and is not suitable for high-frequency calls.
     *
     */
    updateConnectTargetsByNodeId(nodeId: string): void;
    /**
     * @inner
     */
    private getNodeElByNodeId;
    /**
     * @inner
     */
    protected updateConnectTargetsOnNode(by: string, nodeId: string, nodeEl: HTMLDivElement): void;
    /**
     * @inner
     */
    protected updateConnectTargetList(by: string, relativeNodeEl: Element, connectTargetList: RGConnectTargetData[]): void;
    /**
     * @inner
     */
    private _connectTargetUpdateRequestedSet;
    /**
     * @inner
     */
    private _requestUpdateConnectTargetOffset;
    private _updateTimer;
    /**
     * @inner
     */
    private _updateAllRequestedConnectTargetOffsets;
    /**
     * @inner
     */
    private _updateConnectTargetOffset;
    /**
     * @inner
     */
    private _onConnectTargetMounted;
    /**
     * @inner
     */
    private getNodeElByChildrenTarget;
    /**
     * @inner
     */
    registerConnectTarget(connectTargetEl: HTMLDivElement, targetId: string, targetType: string, junctionPoint: RGJunctionPoint, targetData?: Record<string, any>): RGConnectTargetData | undefined;
    /**
     * @inner
     */
    private _addConnectTargetToNodeMap;
    /**
     * @inner
     */
    private _addConnectTargetToCanvasMap;
    /**
     * @inner
     */
    unregisterConnectTarget(targetId: string): void;
    private _removedConnectTargetMap;
    /**
     * @inner
     */
    private reuseConnectTarget;
}
