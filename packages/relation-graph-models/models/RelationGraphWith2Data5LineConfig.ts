import {
    RGJunctionPoint,
    JsonLineLike,
    RGFakeLine,
    RGFakeLineTargetRender,
    RGGenerateLineConfig,
    RGInnerConnectTargetType,
    RGLine,
    RGLineTarget,
    RGOptionsFull
} from '../../types';
import {RelationGraphWith2Data4ConnectTarget} from "./RelationGraphWith2Data4ConnectTarget";

type ResolveTargetRectOptions = {
    preferLiveTarget?: boolean;
    connectTargetEl?: Element;
};
type ResolvedConnectTargetDescriptor = {
    targetId: string;
    targetType: string;
    junctionPoint: RGJunctionPoint;
    connectTargetEl: Element;
    hostEl: Element;
    measureEl: Element;
    triggerEl: Element;
};

/**
 * API class for generating line configuration and line connection point information in relation-graph component, providing data support for drawing lines
 */
export class RelationGraphWith2Data5LineConfig extends RelationGraphWith2Data4ConnectTarget {
    constructor() {
        super();
    }
    private resolvedTargetCache = new Map<string, RGLineTarget | null>();
    protected _beforeViewDataUpdated() {
        this.resolvedTargetCache.clear();
        super._beforeViewDataUpdated();
    }
    protected resolveTargetDescriptorByElement(targetEl: Element): ResolvedConnectTargetDescriptor | undefined {
        const registeredTarget = this.getRegisteredConnectTargetByElement(targetEl);
        if (!registeredTarget) {
            return;
        }
        const {
            connectTarget,
            connectTargetEl,
            runtime
        } = registeredTarget;
        return {
            targetId: connectTarget.targetId,
            targetType: connectTarget.targetType,
            junctionPoint: connectTarget.junctionPoint,
            connectTargetEl,
            hostEl: runtime.hostEl,
            measureEl: runtime.measureEl,
            triggerEl: runtime.triggerEl
        };
    }

    /**
     * @inner
     */
    generateCreatingLineConfig(options?: RGOptionsFull): RGGenerateLineConfig {
        if (!options) options = this.dataProvider.getOptions();
        const {newLinkTemplate, newLineTemplate} = options;
        const fromTarget = newLinkTemplate.fromNode;
        if (!fromTarget) {
            return {
                line: newLineTemplate,
                from: null,
                to: null,
                totalLinesBetweenNodes: 1,
                currentLineIndex: 0
            };
        }
        const resolvedFrom = this.resolveTargetRect(fromTarget.targetType, fromTarget.id, newLineTemplate, {
            preferLiveTarget: true
        });
        const toNode = newLinkTemplate.toNode;
        if (!toNode) {
            return {
                line: Object.assign({}, newLineTemplate, {isFakeLine: false}),
                from: resolvedFrom,
                to: null,
                totalLinesBetweenNodes: 1,
                currentLineIndex: 0
            };
        }
        const toTarget = toNode.targetType === RGInnerConnectTargetType.Node ? newLinkTemplate.toNode : this.resolveTargetRect(toNode.targetType, toNode.id, newLineTemplate, {
            preferLiveTarget: true
        });
        // console.error('generateCreatingLineConfig:::', fromTarget, toNode.targetType, toNode.id, toTarget)
        const creatingLineConfig: RGGenerateLineConfig = {
            line: Object.assign({}, newLineTemplate, {isFakeLine: false}),
            from: resolvedFrom,
            to: toTarget,
            totalLinesBetweenNodes: 1,
            currentLineIndex: 0
        };
        return creatingLineConfig;
    }

    /**
     *  Generate configuration information for drawing lines based on line information
     * @param line
     */
    generateLineConfig(line: RGLine): RGGenerateLineConfig | false {
        const link = this.getLinkByLine(line);
        if (!link || !link.rgCalcedVisibility) {
            return false;
        }
        // English: Do not check the visibility of the line here, because invisible lines will not call this method to render them.
        // if (!link.fromNode.rgCalcedVisibility || !link.toNode.rgCalcedVisibility) {
        //     return false;
        // }
        const lineConfig = {
            line: link.line,
            from: link.fromNode as unknown as RGLineTarget,
            to: link.toNode as unknown as RGLineTarget,
            totalLinesBetweenNodes: link.totalLinesBetweenNodes,
            currentLineIndex: link.currentLineIndex
        };
        return lineConfig;
    }

    /**
     * Generate configuration information for drawing fake lines based on fake line information
     * @param fakeLine
     */
    generateFakeLineConfig(fakeLine: RGFakeLine): RGGenerateLineConfig | false {
        let totalLinesBetweenNodes = 1;
        let currentLineIndex = 0;
        if ((fakeLine.fromType === RGInnerConnectTargetType.HTMLElementId && fakeLine.toType === RGInnerConnectTargetType.HTMLElementId)) {
            const sameTargetLines = this.dataProvider.getFakeLines().filter(el => (el.from === fakeLine.from && el.to === fakeLine.to));
            if (sameTargetLines.length > 1) {
                console.warn('sameTargetLines element-line:', fakeLine);
                // return null;
                totalLinesBetweenNodes = sameTargetLines.length;
                currentLineIndex = sameTargetLines.indexOf(fakeLine);
            }
        }
        // Static fake line rendering should use geometry already synced into the registry.
        // Reading live DOM here can observe the previous transform before the canvas zoom commit lands.
        let from: RGLineTarget = this.getFakeLineTarget(fakeLine.fromType, fakeLine.from, fakeLine, {
            preferLiveTarget: false
        });
        let to: RGLineTarget = this.getFakeLineTarget(fakeLine.toType, fakeLine.to, fakeLine, {
            preferLiveTarget: false
        });
        if (!from && fakeLine.fromType === RGInnerConnectTargetType.Node) {
            console.error('[generateFakeLineConfig]error fakeLine from:', fakeLine.fromType, fakeLine.from, fakeLine);
            return false;
        }
        if (!to && fakeLine.toType === RGInnerConnectTargetType.Node) {
            console.error('[generateFakeLineConfig]error fakeLine to:', fakeLine.toType, fakeLine.to, fakeLine);
            return false;
        }
        if (!from || !to) {
            return false;
        }
        return {
            line: fakeLine,
            from,
            to,
            totalLinesBetweenNodes,
            currentLineIndex
        };
    }



    private fakeLineTargetRender: RGFakeLineTargetRender;

    /**
     * Set a custom render method for fake line targets, to provide more types of target rendering capabilities for fake lines
     * @param fakeLineTargetRender
     */
    setFakeLineTargetRender(fakeLineTargetRender: RGFakeLineTargetRender) {
        this.fakeLineTargetRender = fakeLineTargetRender;
    }

    /**
     * Get the target information of a fake line based on the target type and target ID
     * @param targetType
     * @param targetId
     * @param fakeLine
     */
    protected resolveTargetRect(targetType: string, targetId: string, lineContext: JsonLineLike, options: ResolveTargetRectOptions = {}): RGLineTarget | undefined {
        if (targetType === RGInnerConnectTargetType.HTMLElementId) {
            let elementTarget = this.dataProvider.getElLineTargets().find(n => n.id === targetId);
            if (!elementTarget) {
                elementTarget = {
                    x: 300,
                    y: 300,
                    targetType: RGInnerConnectTargetType.HTMLElementId,
                    nodeShape: 1,
                    id: targetId,
                    el_W: 40,
                    el_H: 40,
                    hidden: true
                };
                this.dataProvider.addElLineTarget(elementTarget);
                this.updateElementLines();
            }
            return elementTarget.hidden ? null : elementTarget;
        } else if (targetType === RGInnerConnectTargetType.Node) {
            return this.getNodeById(targetId) as unknown as RGLineTarget;
        } else if (targetType === RGInnerConnectTargetType.NodePoint || targetType === RGInnerConnectTargetType.CanvasPoint) {
            const connectTarget = this.dataProvider.getConnectTargetById(targetId);
            if (!connectTarget) return;
            const actualTargetType = connectTarget.targetType || targetType;
            const cacheKey = `${actualTargetType}:${targetId}:${options.preferLiveTarget === true ? 'live' : 'cached'}`;
            if (options.preferLiveTarget && this.resolvedTargetCache.has(cacheKey)) {
                return this.resolvedTargetCache.get(cacheKey) || null;
            }
            const liveGeometry = options.preferLiveTarget ? this.measureConnectTargetGeometry(connectTarget, options.connectTargetEl || this.getConnectTargetElementById(targetId)) : undefined;
            const lineTarget = this.createLineTargetFromConnectTarget(connectTarget, liveGeometry);
            if (options.preferLiveTarget) {
                this.resolvedTargetCache.set(cacheKey, lineTarget || null);
            }
            return lineTarget;
        }
        if (this.fakeLineTargetRender) {
            return this.fakeLineTargetRender(targetType, targetId, lineContext as RGFakeLine);
        }
    }
    getFakeLineTarget(targetType: string, targetId: string, lineContext: JsonLineLike, options: ResolveTargetRectOptions = {}): RGLineTarget | undefined {
        return this.resolveTargetRect(targetType, targetId, lineContext, options);
    }
}
