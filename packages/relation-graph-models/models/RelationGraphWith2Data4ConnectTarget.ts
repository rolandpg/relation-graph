import {findParentByClassName} from '../utils/RGCommon';
import {
    RGConnectTargetData,
    RGConnectTargetDomMode,
    RGInnerConnectTargetType,
    RGJunctionPoint,
    RGRegisterConnectTargetOptions
} from '../../types';
import {RelationGraphWith2Data3Update} from "./RelationGraphWith2Data3Update";

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

type RGConnectTargetUpdateRequest = {
    connectTarget: RGConnectTargetData;
    by: string;
    relativeEl: Element;
    measureEl?: Element;
    stableTimes: number;
};

/**
 * The class related to connection point management in the relation-graph component, where the connection point refers to the connection point registered through the <RGConnectTarget> component
 */
export class RelationGraphWith2Data4ConnectTarget extends RelationGraphWith2Data3Update {
    constructor() {
        super();
    }

    private canvasConnectTargetsMap: Map<'behind' | 'above', RGConnectTargetData[]> = new Map();

    private nodeConnectTargetsMap: Map<string, RGConnectTargetData[]> = new Map();
    private connectTargetRuntimeMap: Map<string, RGRegisteredConnectTargetRuntime> = new Map();
    private connectTargetIdByHostElement: WeakMap<Element, string> = new WeakMap();
    private connectTargetIdByMeasureElement: WeakMap<Element, string> = new WeakMap();
    private connectTargetIdByTriggerElement: WeakMap<Element, string> = new WeakMap();
    protected _observeConnectTargetElement(_targetId: string, _runtime: RGRegisteredConnectTargetRuntime) {}
    protected _unobserveConnectTargetElement(_targetId: string, _runtime: RGRegisteredConnectTargetRuntime) {}

    /**
     * In general, relation-graph will automatically update the position of the connection points.
     * - This method is only used for manual calls in some special scenarios.
     * - It is provided for external calls to update the connection point positions of the specified canvas slot, and is not suitable for high-frequency calls.
     * @param by
     * @param canvasSlotDom
     * @protected
     */
    protected updateConnectTargetsOnCanvas(by: string, canvasSlotDom: Element) {
        if (!canvasSlotDom) {
            return;
        }
        const canvasType = canvasSlotDom.classList.contains('rg-canvas-slot-above') ? 'above' : 'behind';
        const connectTargets = this.canvasConnectTargetsMap.get(canvasType);
        if (connectTargets && connectTargets.length > 0) {
            this.updateConnectTargetList(by, canvasSlotDom, connectTargets);
        }
    }

    /**
     * In general, relation-graph will automatically update the position of the connection points.
     * - This method is only used for manual calls in some special scenarios.
     * - It is provided for external calls to update the connection point positions of the specified node, and is not suitable for high-frequency calls.
     *
     */
    public updateConnectTargetsByNodeId(nodeId: string) {
        const nodeEl = this.getNodeElByNodeId(nodeId);
        this.updateConnectTargetsOnNode('API', nodeId, nodeEl);
    }

    /**
     * @inner
     */
    private getNodeElByNodeId(nodeId: string) {
        return this.$dom.querySelector(`.rg-node-peel[data-id="${nodeId}"]`) as HTMLDivElement;
    }

    /**
     * @inner
     */
    protected getConnectTargetRuntimeById(targetId: string) {
        return this.connectTargetRuntimeMap.get(targetId);
    }

    /**
     * @inner
     */
    protected getConnectTargetElementById(targetId: string) {
        return this.connectTargetRuntimeMap.get(targetId)?.measureEl;
    }

    /**
     * @inner
     */
    protected getConnectTargetHostElementById(targetId: string) {
        return this.connectTargetRuntimeMap.get(targetId)?.hostEl;
    }

    /**
     * @inner
     */
    protected updateConnectTargetsOnNode(by: string, nodeId: string, nodeEl: Element) {
        const nodeConnectTargetList: RGConnectTargetData[] = this.nodeConnectTargetsMap.get(nodeId) || [];
        if (nodeConnectTargetList.length === 0) {
            return;
        }
        this.updateConnectTargetList(by, nodeEl, nodeConnectTargetList);
    }

    /**
     * @inner
     */
    protected updateConnectTargetList(by: string, relativeNodeEl: Element, connectTargetList: RGConnectTargetData[]) {
        for (const connectTarget of connectTargetList) {
            const runtime = this.getConnectTargetRuntimeById(connectTarget.targetId);
            if (!runtime?.measureEl) {
                console.error('Can not find measure element for connectTarget:', connectTarget.targetId, connectTarget);
                continue;
            }
            this._requestUpdateConnectTargetOffset(by, connectTarget, relativeNodeEl, runtime.measureEl);
        }
    }

    protected getRegisteredConnectTargetByElement(connectTargetEl: Element): RGRegisteredConnectTargetLookup | undefined {
        let currentEl: Element | null = connectTargetEl;
        while (currentEl) {
            const targetId = this.connectTargetIdByTriggerElement.get(currentEl)
                || this.connectTargetIdByHostElement.get(currentEl)
                || this.connectTargetIdByMeasureElement.get(currentEl);
            if (targetId) {
                const connectTarget = this.dataProvider.getConnectTargetById(targetId);
                const runtime = this.connectTargetRuntimeMap.get(targetId);
                if (connectTarget && runtime) {
                    return {
                        matchedEl: currentEl,
                        connectTargetEl: runtime.measureEl,
                        connectTarget,
                        runtime
                    };
                }
            }
            currentEl = currentEl.parentElement;
        }
    }

    protected getConnectTargetByElement(connectTargetEl: Element) {
        return this.getRegisteredConnectTargetByElement(connectTargetEl)?.connectTarget;
    }

    protected refreshConnectTargetRuntimeById(by: string, targetId: string, explicitMeasureEl?: Element) {
        const runtime = this.getConnectTargetRuntimeById(targetId);
        if (!runtime) {
            return;
        }
        const resolvedMeasureEl = this.resolveConnectTargetMeasureElement({
            hostEl: runtime.hostEl,
            targetId: runtime.targetId,
            targetType: RGInnerConnectTargetType.NodePoint,
            domMode: runtime.domMode,
            measureSelector: runtime.measureSelector,
            strictMeasureTarget: runtime.strictMeasureTarget,
            measureEl: explicitMeasureEl
        }) || runtime.measureEl;
        const nextRuntime: RGRegisteredConnectTargetRuntime = {
            ...runtime,
            measureEl: resolvedMeasureEl
        };
        this.applyConnectTargetRuntime(nextRuntime);
        this.updateConnectTargetById(by, targetId, resolvedMeasureEl);
    }

    protected updateConnectTargetById(by: string, targetId: string, connectTargetEl?: Element) {
        const connectTarget = this.dataProvider.getConnectTargetById(targetId);
        if (!connectTarget) {
            return;
        }
        const runtime = this.getConnectTargetRuntimeById(targetId);
        const targetEl = connectTargetEl || runtime?.measureEl;
        const relativeEl = this.getConnectTargetRelativeElement(connectTarget, runtime?.hostEl || targetEl);
        if (!targetEl || !relativeEl) {
            return;
        }
        this._requestUpdateConnectTargetOffset(by, connectTarget, relativeEl, targetEl);
    }

    private removeConnectTargetFromOwnerMaps(targetId: string) {
        for (const [nodeId, list] of this.nodeConnectTargetsMap.entries()) {
            const targetIndex = list.findIndex(n => n.targetId === targetId);
            if (targetIndex !== -1) {
                list.splice(targetIndex, 1);
                if (list.length === 0) {
                    this.nodeConnectTargetsMap.delete(nodeId);
                }
            }
        }
        for (const canvasType of ['behind', 'above'] as const) {
            const list = this.canvasConnectTargetsMap.get(canvasType);
            if (!list) {
                continue;
            }
            const targetIndex = list.findIndex(n => n.targetId === targetId);
            if (targetIndex !== -1) {
                list.splice(targetIndex, 1);
                if (list.length === 0) {
                    this.canvasConnectTargetsMap.delete(canvasType);
                }
            }
        }
    }

    /**
     * @inner
     */
    private _connectTargetUpdateRequestedSet = new Map<string, RGConnectTargetUpdateRequest>();

    /**
     * @inner
     */
    private _requestUpdateConnectTargetOffset(by: string, connectTarget: RGConnectTargetData, relativeEl: Element, measureEl?: Element) {
        this._connectTargetUpdateRequestedSet.set(connectTarget.targetId, {
            stableTimes: 0,
            connectTarget,
            by,
            measureEl,
            relativeEl
        });
        clearTimeout(this._updateTimer);
        this._updateTimer = setTimeout(() => {
            this._updateAllRequestedConnectTargetOffsets();
        }, Math.min(this._connectTargetUpdateRequestedSet.size + 10, 50));
        this._dataUpdated();
    }
    private _updateTimer: ReturnType<typeof setTimeout> | undefined;

    /**
     * @inner
     */
    private _updateAllRequestedConnectTargetOffsets() {
        let changedCount = 0;
        for (const item of this._connectTargetUpdateRequestedSet.values()) {
            const {by, relativeEl, connectTarget} = item;
            if (this.dataProvider.isPerformanceMode() && connectTarget.nodeId) {
                const node = this.getNodeById(connectTarget.nodeId);
                if (!node || !node.rgShouldRender || !node.rgCalcedVisibility) {
                    continue;
                }
            }
            if (!this.dataProvider.getConnectTargetById(connectTarget.targetId)) {
                continue;
            }
            const runtimeMeasureEl = this.getConnectTargetElementById(connectTarget.targetId);
            const effectiveMeasureEl = runtimeMeasureEl || item.measureEl;
            if (!effectiveMeasureEl) {
                continue;
            }
            const changed = this._updateConnectTargetOffset(by, connectTarget, effectiveMeasureEl, relativeEl);
            if (changed) {
                changedCount++;
            } else {
                item.stableTimes++;
            }
            if (item.stableTimes > 2) {
                this._connectTargetUpdateRequestedSet.delete(connectTarget.targetId);
            }
        }
        if (changedCount > 0) {
            clearTimeout(this._updateTimer);
            this._updateTimer = setTimeout(() => {
                this._updateAllRequestedConnectTargetOffsets();
            }, Math.min(changedCount / 2 + 10, 100));
            this._dataUpdated();
        } else {
            this._connectTargetUpdateRequestedSet.clear();
            this._dataUpdated();
        }
    }

    /**
     * @inner
     */
    private _updateConnectTargetOffset(by: string, connectTarget: RGConnectTargetData, measureEl: Element, relativeEl: Element) {
        const measuredGeometry = this.measureConnectTargetGeometry(connectTarget, measureEl, relativeEl);
        if (!measuredGeometry) {
            return false;
        }
        const {offsetX: newOffsetX, offsetY: newOffsetY, width: newWidth, height: newHeight} = measuredGeometry;
        const offsetXChanged = connectTarget.offsetX !== newOffsetX;
        const offsetYChanged = connectTarget.offsetY !== newOffsetY;
        const widthChanged = newWidth !== 0 && connectTarget.width !== newWidth;
        const heightChanged = newHeight !== 0 && connectTarget.height !== newHeight;
        if (offsetXChanged || offsetYChanged || widthChanged || heightChanged) {
            this.dataProvider.updateConnectTarget(connectTarget.targetId, {
                offsetX: newOffsetX,
                offsetY: newOffsetY,
                width: newWidth,
                height: newHeight
            });
            return true;
        }
        return false;
    }

    protected getConnectTargetRelativeElement(connectTarget: RGConnectTargetData, connectTargetEl?: Element) {
        if (connectTargetEl) {
            const ownerNodeEl = this.getNodeElByChildrenTarget(connectTargetEl as HTMLDivElement);
            if (ownerNodeEl) {
                return ownerNodeEl;
            }
            const canvasSlotDom = findParentByClassName(connectTargetEl as HTMLDivElement, 'rg-canvas-slot', 'rg-map');
            if (canvasSlotDom) {
                return canvasSlotDom;
            }
        }
        if (connectTarget.nodeId) {
            return this.getNodeElByNodeId(connectTarget.nodeId);
        }
        const canvasType = connectTarget.targetType === RGInnerConnectTargetType.CanvasPoint && this.canvasConnectTargetsMap.get('above')?.some(target => target.targetId === connectTarget.targetId) ? 'above' : 'behind';
        return this.$dom?.querySelector(`.rg-canvas-slot-${canvasType}`);
    }

    protected measureConnectTargetGeometry(connectTarget: RGConnectTargetData, connectTargetEl?: Element, relativeEl?: Element) {
        const targetEl = connectTargetEl || this.getConnectTargetElementById(connectTarget.targetId);
        const ownerLookupEl = this.getConnectTargetHostElementById(connectTarget.targetId) || targetEl;
        const ownerEl = relativeEl || this.getConnectTargetRelativeElement(connectTarget, ownerLookupEl);
        if (!targetEl || !ownerEl) {
            return;
        }
        const ownerRect = ownerEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const currentScale = this.dataProvider.getCanvasScale();
        const offsetX = Math.round((targetRect.x - ownerRect.x) / currentScale);
        const offsetY = Math.round((targetRect.y - ownerRect.y) / currentScale);
        const width = Math.round(targetRect.width / currentScale);
        const height = Math.round(targetRect.height / currentScale);
        return {
            offsetX,
            offsetY,
            width,
            height
        };
    }

    protected createLineTargetFromConnectTarget(connectTarget: RGConnectTargetData, geometry?: {
        offsetX: number,
        offsetY: number,
        width: number,
        height: number
    }) {
        const offsetX = geometry?.offsetX ?? connectTarget.offsetX;
        const offsetY = geometry?.offsetY ?? connectTarget.offsetY;
        const width = geometry?.width ?? connectTarget.width;
        const height = geometry?.height ?? connectTarget.height;
        if (connectTarget.nodeId) {
            const node = this.getNodeById(connectTarget.nodeId);
            if (!node) {
                console.error('[createLineTargetFromConnectTarget]Can not find NodePoint-s Node:', `${connectTarget.targetId}@${connectTarget.nodeId}`);
                return;
            }
            return {
                x: node.x + (connectTarget.offsetPercentX * node.el_W) + offsetX,
                y: node.y + (connectTarget.offsetPercentY * node.el_H) + offsetY,
                targetType: connectTarget.targetType || RGInnerConnectTargetType.NodePoint,
                targetData: connectTarget.targetData,
                junctionPoint: connectTarget.junctionPoint,
                nodeShape: 0,
                id: connectTarget.targetId,
                el_W: width,
                el_H: height,
                hidden: false
            };
        }
        return {
            x: offsetX,
            y: offsetY,
            targetType: connectTarget.targetType || RGInnerConnectTargetType.CanvasPoint,
            targetData: connectTarget.targetData,
            junctionPoint: connectTarget.junctionPoint,
            nodeShape: 0,
            id: connectTarget.targetId,
            el_W: width,
            el_H: height,
            hidden: false
        };
    }

    /**
     * @inner
     */
    private _onConnectTargetMounted(by: string, connectTarget: RGConnectTargetData, relativeNodeOrCanvasDom: Element) {
        this._requestUpdateConnectTargetOffset(by, connectTarget, relativeNodeOrCanvasDom);
    }

    /**
     * @inner
     */
    protected getNodeElByChildrenTarget(connectTargetEl: Node | Element) {
        const targetEl = connectTargetEl instanceof Element ? connectTargetEl : connectTargetEl.parentElement;
        if (!targetEl) {
            return null;
        }
        return findParentByClassName(targetEl as HTMLDivElement, 'rg-node-peel', 'rg-map') as HTMLDivElement | null;
    }

    protected normalizeConnectTargetDomMode(hostEl: Element, domMode?: RGConnectTargetDomMode): RGConnectTargetDomMode {
        if (domMode === 'contents' && hostEl instanceof HTMLElement) {
            return 'contents';
        }
        return 'wrap';
    }

    protected resolveConnectTargetMeasureElement(options: RGRegisterConnectTargetOptions): Element | undefined {
        const normalizedDomMode = this.normalizeConnectTargetDomMode(options.hostEl, options.domMode);
        if (options.measureEl) {
            return options.measureEl;
        }
        if (normalizedDomMode !== 'contents') {
            return options.hostEl;
        }
        let resolvedMeasureEl: Element | null = null;
        if (options.measureSelector) {
            try {
                resolvedMeasureEl = options.hostEl.querySelector(options.measureSelector);
            } catch (error) {
                console.warn(`[registerConnectTarget]Invalid measureSelector for target: ${options.targetId}`, options.measureSelector, error);
            }
        }
        if (!resolvedMeasureEl) {
            resolvedMeasureEl = options.hostEl.firstElementChild;
        }
        if (!resolvedMeasureEl) {
            resolvedMeasureEl = options.hostEl.querySelector('*');
        }
        if (resolvedMeasureEl) {
            return resolvedMeasureEl;
        }
        if (options.strictMeasureTarget) {
            console.warn(`[registerConnectTarget]Can not resolve measure element for target: ${options.targetId}`);
            return;
        }
        console.warn(`[registerConnectTarget]Can not resolve measure element for target: ${options.targetId}, fallback to host element.`);
        return options.hostEl;
    }

    private removeRuntimeElementMappings(runtime: RGRegisteredConnectTargetRuntime) {
        this.connectTargetIdByHostElement.delete(runtime.hostEl);
        this.connectTargetIdByMeasureElement.delete(runtime.measureEl);
        this.connectTargetIdByTriggerElement.delete(runtime.triggerEl);
    }

    private addRuntimeElementMappings(runtime: RGRegisteredConnectTargetRuntime) {
        this.connectTargetIdByHostElement.set(runtime.hostEl, runtime.targetId);
        this.connectTargetIdByMeasureElement.set(runtime.measureEl, runtime.targetId);
        this.connectTargetIdByTriggerElement.set(runtime.triggerEl, runtime.targetId);
    }

    private isSameRuntime(prevRuntime: RGRegisteredConnectTargetRuntime | undefined, nextRuntime: RGRegisteredConnectTargetRuntime) {
        return !!prevRuntime
            && prevRuntime.hostEl === nextRuntime.hostEl
            && prevRuntime.measureEl === nextRuntime.measureEl
            && prevRuntime.triggerEl === nextRuntime.triggerEl
            && prevRuntime.domMode === nextRuntime.domMode
            && prevRuntime.measureSelector === nextRuntime.measureSelector
            && prevRuntime.strictMeasureTarget === nextRuntime.strictMeasureTarget;
    }

    private applyConnectTargetRuntime(nextRuntime: RGRegisteredConnectTargetRuntime) {
        const prevRuntime = this.connectTargetRuntimeMap.get(nextRuntime.targetId);
        if (this.isSameRuntime(prevRuntime, nextRuntime)) {
            this.connectTargetRuntimeMap.set(nextRuntime.targetId, nextRuntime);
            return;
        }
        if (prevRuntime) {
            this._unobserveConnectTargetElement(nextRuntime.targetId, prevRuntime);
            this.removeRuntimeElementMappings(prevRuntime);
        }
        this.connectTargetRuntimeMap.set(nextRuntime.targetId, nextRuntime);
        this.addRuntimeElementMappings(nextRuntime);
        this._observeConnectTargetElement(nextRuntime.targetId, nextRuntime);
    }

    /**
     * @inner
     */
    registerConnectTarget(connectTargetElOrOptions: Element | RGRegisterConnectTargetOptions, targetId?: string, targetType?: string, junctionPoint?: RGJunctionPoint, targetData: Record<string, any> = {}) {
        const registerOptions: RGRegisterConnectTargetOptions = connectTargetElOrOptions instanceof Element ? {
            hostEl: connectTargetElOrOptions,
            targetId: targetId!,
            targetType: targetType!,
            junctionPoint,
            targetData
        } : connectTargetElOrOptions;
        if (registerOptions.targetType !== RGInnerConnectTargetType.NodePoint && registerOptions.targetType !== RGInnerConnectTargetType.CanvasPoint) {
            return;
        }
        if (!registerOptions.hostEl) {
            console.error(`[registerConnectTarget]Can not find CanvasPoint target DOM: ${registerOptions.targetId}`);
            return;
        }
        const normalizedJunctionPoint = registerOptions.junctionPoint || RGJunctionPoint.border;
        const measureEl = this.resolveConnectTargetMeasureElement(registerOptions);
        if (!measureEl) {
            return;
        }
        const runtime: RGRegisteredConnectTargetRuntime = {
            targetId: registerOptions.targetId,
            hostEl: registerOptions.hostEl,
            measureEl,
            triggerEl: registerOptions.triggerEl || registerOptions.hostEl,
            domMode: this.normalizeConnectTargetDomMode(registerOptions.hostEl, registerOptions.domMode),
            measureSelector: registerOptions.measureSelector,
            strictMeasureTarget: registerOptions.strictMeasureTarget
        };
        const nodeEl = this.getNodeElByChildrenTarget(runtime.hostEl);
        const nodeId = nodeEl?.dataset.id as string;
        if (nodeId === 'rg-newNodeTemplate') {
            return;
        }
        let connectTarget = this.dataProvider.getConnectTargetById(registerOptions.targetId);
        if (!connectTarget) {
            const newConnectTarget: RGConnectTargetData = {
                targetId: registerOptions.targetId,
                targetType: registerOptions.targetType,
                junctionPoint: normalizedJunctionPoint,
                nodeId: '',
                width: 20,
                height: 20,
                offsetX: 0,
                offsetY: 0,
                offsetPercentX: 0,
                offsetPercentY: 0,
                targetData: registerOptions.targetData || {}
            };
            this.reuseConnectTarget(newConnectTarget);
            connectTarget = this.dataProvider.addConnectTarget(newConnectTarget);
            if (!connectTarget) {
                return;
            }
        } else {
            this.dataProvider.updateConnectTarget(registerOptions.targetId, {
                junctionPoint: normalizedJunctionPoint,
                targetType: registerOptions.targetType,
                targetData: registerOptions.targetData || {}
            });
        }
        this.removeConnectTargetFromOwnerMaps(registerOptions.targetId);
        this.applyConnectTargetRuntime(runtime);
        const ownerNode = nodeId ? this.getNodeById(nodeId) : null;
        if (ownerNode) {
            this._addConnectTargetToNodeMap(nodeId, connectTarget, runtime.hostEl, nodeEl as HTMLDivElement);
        } else {
            this._addConnectTargetToCanvasMap(connectTarget, runtime.hostEl);
        }
        return connectTarget as RGConnectTargetData;
    }

    /**
     * @inner
     */
    private _addConnectTargetToNodeMap(nodeId: string, connectTarget: RGConnectTargetData, hostEl: Element, nodeEl: HTMLDivElement) {
        this.dataProvider.updateConnectTarget(connectTarget.targetId, {
            junctionPoint: connectTarget.junctionPoint,
            targetType: RGInnerConnectTargetType.NodePoint,
            nodeId: nodeId,
            targetData: Object.assign({}, connectTarget.targetData || {}, {nodeId: nodeId})
        });
        const list = this.nodeConnectTargetsMap.get(nodeId);
        if (!list) {
            this.nodeConnectTargetsMap.set(nodeId, [connectTarget]);
        } else if (!list.some(n => n.targetId === connectTarget.targetId)) {
            list.push(connectTarget);
        }
        this.refreshConnectTargetRuntimeById('NT-Runtime', connectTarget.targetId);
        this._onConnectTargetMounted('NT-Mounted', connectTarget, nodeEl || hostEl);
    }

    /**
     * @inner
     */
    private _addConnectTargetToCanvasMap(connectTarget: RGConnectTargetData, hostEl: Element) {
        const canvasSlotDom = findParentByClassName(hostEl as HTMLDivElement, 'rg-canvas-slot', 'rg-map');
        if (!canvasSlotDom) {
            return;
        }
        const canvasType = canvasSlotDom.classList.contains('rg-canvas-slot-above') ? 'above' : 'behind';
        this.dataProvider.updateConnectTarget(connectTarget.targetId, {
            junctionPoint: connectTarget.junctionPoint,
            targetType: RGInnerConnectTargetType.CanvasPoint,
            targetData: Object.assign({}, connectTarget.targetData || {})
        });
        const list = this.canvasConnectTargetsMap.get(canvasType);
        if (!list) {
            this.canvasConnectTargetsMap.set(canvasType, [connectTarget]);
        } else if (!list.some(n => n.targetId === connectTarget.targetId)) {
            list.push(connectTarget);
        }
        this.refreshConnectTargetRuntimeById('CT-Runtime', connectTarget.targetId);
        this._onConnectTargetMounted('CT-Mounted', connectTarget, canvasSlotDom as HTMLDivElement);
    }

    /**
     * @inner
     */
    unregisterConnectTarget(targetId: string) {
        const connectTarget = this.dataProvider.getConnectTargetById(targetId);
        const runtime = this.connectTargetRuntimeMap.get(targetId);
        if (runtime) {
            this._unobserveConnectTargetElement(targetId, runtime);
            this.removeRuntimeElementMappings(runtime);
            this.connectTargetRuntimeMap.delete(targetId);
        }
        this._connectTargetUpdateRequestedSet.delete(targetId);
        if (!connectTarget) {
            return;
        }
        this.removeConnectTargetFromOwnerMaps(targetId);
        this.dataProvider.removeConnectTarget(targetId);
        this._removedConnectTargetMap.set(connectTarget.targetId, connectTarget);
    }

    private _removedConnectTargetMap: Map<string, RGConnectTargetData> = new Map();

    /**
     * @inner
     */
    private reuseConnectTarget(connectTarget: RGConnectTargetData) {
        if (this._removedConnectTargetMap.has(connectTarget.targetId)) {
            const oldConnectTarget = this._removedConnectTargetMap.get(connectTarget.targetId)!;
            connectTarget.offsetX = oldConnectTarget.offsetX;
            connectTarget.offsetY = oldConnectTarget.offsetY;
            connectTarget.width = oldConnectTarget.width;
            connectTarget.height = oldConnectTarget.height;
            connectTarget.offsetPercentX = oldConnectTarget.offsetPercentX;
            connectTarget.offsetPercentY = oldConnectTarget.offsetPercentY;
            this._removedConnectTargetMap.delete(connectTarget.targetId);
        }
    }
}
