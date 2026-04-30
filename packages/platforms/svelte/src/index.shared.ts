/*
* relation-graph
* (c) 2019-2026 relation-graph.com
* Released under the MIT License.
* More info: https://relation-graph.com
*/
import { version as _version } from '../../../relation-graph-models/constants';

import { RGHooks as _RGHooks } from './hooks/RGHooks';

import {default as _RelationGraph} from './core4svelte/RelationGraph.svelte';

// export { default as RGDebugView } from './core4svelte/widgets/RGDebugView.svelte';
export { default as RGToolBar } from './core4svelte/widgets/GraphXsToolBar.svelte';
export { default as RGFakeNode } from './core4svelte/RGFakeNode.svelte';
export { default as RGLinePath } from './core4svelte/RGLinePath.svelte';
export { default as RGLineText } from './core4svelte/RGLineText.svelte';
export { default as RGNodeExpandHolder } from './core4svelte/RGNodeExpandHolder.svelte';
export { default as RGMiniToolBar } from './core4svelte/widgets/GraphXsToolBar.svelte';
export { default as RGEditingNodeController } from './core4svelte/editing/RGEditingNodeController.svelte';
export { default as RGEditingResize } from './core4svelte/editing/RGEditingResize.svelte';
export { default as RGMiniView } from './core4svelte/editing/RGMiniView.svelte';

export { default as RelationGraphAsWebComponent } from "./core4svelte/web-components/RelationGraphWithProvider.svelte";
export { default as RGMiniViewAsWebComponent } from './core4svelte/web-components/RGMiniView.svelte';
export { default as RGEditingNodeControllerWebComponenet } from './core4svelte/web-components/RGEditingNodeController.svelte';
export { default as RGEditingResizeWebComponenet } from './core4svelte/web-components/RGEditingResize.svelte';
export { default as RGConnectTargetWebComponenet } from './core4svelte/web-components/RGConnectTarget.svelte';
export { default as RGEditingNearNodeWidgetWebComponenet } from './core4svelte/web-components/RGEditingNearNodeWidget.svelte';
export { default as RGEditingLineControllerWebComponenet } from './core4svelte/web-components/RGEditingLineController.svelte';
export { default as RGEditingConnectControllerWebComponenet } from './core4svelte/web-components/RGEditingConnectController.svelte';
export { default as RGEditingReferenceLineWebComponenet } from './core4svelte/web-components/RGEditingReferenceLine.svelte';

export { default as RGWatermark } from './core4svelte/widgets/GraphWatermark.svelte';
export { default as RGBackground } from './core4svelte/widgets/GraphBackground.svelte';
export { default as RGEditingNearNodeWidget } from './core4svelte/editing/RGEditingNearNodeWidget.svelte';
export { default as RGEditingLineController } from './core4svelte/editing/RGEditingLineController.svelte';
export { default as RGEditingConnectController } from './core4svelte/editing/RGEditingConnectController.svelte';
export { default as RGConnectSource } from './core4svelte/editing/RGConnectSource.svelte';
export { default as RGConnectTarget } from './core4svelte/editing/RGConnectTarget.svelte';
export { default as RGEditingConnectPoints } from './core4svelte/editing/RGEditingConnectPoints.svelte';
export { default as RGEditingReferenceLine } from './core4svelte/editing/RGEditingReferenceLine.svelte';
export { default as RelationLinker } from './core4svelte/RelationLinker.svelte';

export {default as RGProvider} from "./RGProvider.svelte";

import { RelationGraphCore as _RelationGraphCore } from '../../../relation-graph-models/models/RelationGraphCore';
import BaseLayout from "../../../relation-graph-models/layouts/RGBaseLayout";
import BidirectionalTreeLayout from "../../../relation-graph-models/layouts/RGTreeLayout";
import CenterLayout from "../../../relation-graph-models/layouts/RGCenterLayout";
import CircleLayout from "../../../relation-graph-models/layouts/RGCircleLayout";
import FixedLayout from "../../../relation-graph-models/layouts/RGFixedLayout";
import ForceLayout from "../../../relation-graph-models/layouts/RGForceLayout";
import RGFolderLayout from "../../../relation-graph-models/layouts/RGFolderLayout";
import * as RGOptionsDataUtils from "../../../relation-graph-models/data/RGOptionsDataUtils";
import * as RGLineDataUtils from "../../../relation-graph-models/data/RGLineDataUtils";
import * as RGNodeDataUtils from "../../../relation-graph-models/data/RGNodeDataUtils";
import RGGraphMath from "../../../relation-graph-models/utils/RGGraphMath";
import RGNodesAnalyticUtils from "../../../relation-graph-models/utils/RGNodesAnalytic";
import RGEffectUtils from "../../../relation-graph-models/utils/RGDragUtils";




export * from '../../../types';
export * from './types-svelte';

export const version = _version;
export const RelationGraphCore = _RelationGraphCore;



export const RGLayouts = {
    BaseLayout,
    BidirectionalTreeLayout,
    CenterLayout,
    CircleLayout,
    FixedLayout,
    ForceLayout,
    RGFolderLayout: RGFolderLayout
};

export const RGUtils = {
    RGOptionsDataUtils,
    RGLineDataUtils,
    RGNodeDataUtils,
    RGGraphMath,
    RGNodesAnalyticUtils,
    RGEffectUtils
};



export { useRelationGraph } from './hooks/useRelationGraph';

export const RGHooks = _RGHooks;
export const useGraphInstance = _RGHooks.useGraphInstance;

export const RelationGraph = _RelationGraph
/**
const RG_COMPONENTS: Record<string, any> = {
    'relation-graph': RelationGraphAsWebComponent,
    'rg-mini-view': RGMiniViewAsWebComponent,
    'rg-editing-node-controller': RGEditingNodeControllerWebComponenet,
    'rg-editing-resize': RGEditingResizeWebComponenet,
    'rg-connect-target': RGConnectTargetWebComponenet,
    'rg-editing-node-widget': RGEditingNearNodeWidgetWebComponenet,
    'rg-editing-line-controller': RGEditingLineControllerWebComponenet,
    'rg-editing-connect-controller': RGEditingConnectControllerWebComponenet,
    'rg-editing-reference-line': RGEditingReferenceLineWebComponenet,
};

function safeDefine(tag: string, clazz: CustomElementConstructor) {
    if (typeof window === 'undefined') return; // 适配 SSR 环境

    const existing = customElements.get(tag);
    if (existing) {
        if (existing !== clazz) {
            console.warn(`[RelationGraph] Element "${tag}" is already defined with a different class.`);
        }
        return;
    }

    try {
        customElements.define(tag, clazz);
    } catch (err) {
        console.error(`[RelationGraph] Failed to define "${tag}":`, err);
    }
}
export function registerRelationGraphElements(prefix = '') {
    Object.entries(RG_COMPONENTS).forEach(([tag, clazz]) => {
        const finalTag = prefix ? `${prefix}-${tag}` : tag;
        safeDefine(finalTag, clazz);
    });
}
if (typeof window !== "undefined" && typeof customElements !== "undefined") {
    registerRelationGraphElements();
}
    **/
export default _RelationGraph;
