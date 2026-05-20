import { RGConnectTargetData, RGConnectTargetDomMode, RGJunctionPoint, RGRegisterConnectTargetOptions } from '../../types';
import { RelationGraphWith2Data3Update } from './RelationGraphWith2Data3Update';
type RGRegisteredConnectTargetRuntime = {
    targetId: string;
    hostEl: Element;
    measureEl: Element;
    triggerEl: Element;
    domMode: RGConnectTargetDomMode;
    measureSelector?: string;
    strictMeasureTarget?: boolean;
};
type RGRegisteredConnectTargetLookup = {
    connectTargetEl: Element;
    matchedEl: Element;
    connectTarget: RGConnectTargetData;
    runtime: RGRegisteredConnectTargetRuntime;
};
/**
 * The class related to connection point management in the relation-graph component, where the connection point refers to the connection point registered through the <RGConnectTarget> component
 */
export declare class RelationGraphWith2Data4ConnectTarget extends RelationGraphWith2Data3Update {
    constructor();
    private canvasConnectTargetsMap;
    private nodeConnectTargetsMap;
    private connectTargetRuntimeMap;
    private connectTargetIdByHostElement;
    private connectTargetIdByMeasureElement;
    private connectTargetIdByTriggerElement;
    protected _observeConnectTargetElement(_targetId: string, _runtime: RGRegisteredConnectTargetRuntime): void;
    protected _unobserveConnectTargetElement(_targetId: string, _runtime: RGRegisteredConnectTargetRuntime): void;
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
    protected getConnectTargetRuntimeById(targetId: string): RGRegisteredConnectTargetRuntime | undefined;
    /**
     * @inner
     */
    protected getConnectTargetElementById(targetId: string): Element | undefined;
    /**
     * @inner
     */
    protected getConnectTargetHostElementById(targetId: string): Element | undefined;
    /**
     * @inner
     */
    protected updateConnectTargetsOnNode(by: string, nodeId: string, nodeEl: Element): void;
    /**
     * @inner
     */
    protected updateConnectTargetList(by: string, relativeNodeEl: Element, connectTargetList: RGConnectTargetData[]): void;
    protected getRegisteredConnectTargetByElement(connectTargetEl: Element): RGRegisteredConnectTargetLookup | undefined;
    protected getConnectTargetByElement(connectTargetEl: Element): RGConnectTargetData | undefined;
    protected refreshConnectTargetRuntimeById(by: string, targetId: string, explicitMeasureEl?: Element): void;
    protected updateConnectTargetById(by: string, targetId: string, connectTargetEl?: Element): void;
    private removeConnectTargetFromOwnerMaps;
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
    protected getConnectTargetRelativeElement(connectTarget: RGConnectTargetData, connectTargetEl?: Element): Element | null;
    protected measureConnectTargetGeometry(connectTarget: RGConnectTargetData, connectTargetEl?: Element, relativeEl?: Element): {
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
    } | undefined;
    protected createLineTargetFromConnectTarget(connectTarget: RGConnectTargetData, geometry?: {
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
    }): {
        x: number;
        y: number;
        targetType: string;
        targetData: Record<string, any>;
        junctionPoint: RGJunctionPoint;
        nodeShape: number;
        id: string;
        el_W: number;
        el_H: number;
        hidden: boolean;
    } | undefined;
    /**
     * @inner
     */
    private _onConnectTargetMounted;
    /**
     * @inner
     */
    protected getNodeElByChildrenTarget(connectTargetEl: Node | Element): HTMLDivElement | null;
    protected normalizeConnectTargetDomMode(hostEl: Element, domMode?: RGConnectTargetDomMode): RGConnectTargetDomMode;
    protected resolveConnectTargetMeasureElement(options: RGRegisterConnectTargetOptions): Element | undefined;
    private removeRuntimeElementMappings;
    private addRuntimeElementMappings;
    private isSameRuntime;
    private applyConnectTargetRuntime;
    /**
     * @inner
     */
    registerConnectTarget(connectTargetElOrOptions: Element | RGRegisterConnectTargetOptions, targetId?: string, targetType?: string, junctionPoint?: RGJunctionPoint, targetData?: Record<string, any>): RGConnectTargetData | undefined;
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
export {};
