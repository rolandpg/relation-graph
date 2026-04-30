/*
* relation-graph
* (c) 2019-2026 relation-graph.com
* Released under the MIT License.
* More info: https://relation-graph.com
*/
import {App} from "vue";
import { version as _version } from './constants';
import _RelationGraph from './relation-graph/src/core4vue3/RelationGraph.vue';
import _RelationLinker from './relation-graph/src/core4vue3/RelationLinker.vue';
import _RGProvider from './relation-graph/src/core4vue3/RGProvider.vue';
import RgFakeNodeComponent from './relation-graph/src/core4vue3/RGFakeNode.vue';
import RGLinePathComponent from './relation-graph/src/core4vue3/RGLinePath.vue';
import RGLineTextComponent from './relation-graph/src/core4vue3/RGLineText.vue';
import _RGDebugView from './relation-graph/src/core4vue3/widgets/RGDebugView.vue';
import GraphToolBar from './relation-graph/src/core4vue3/widgets/GraphToolBar.vue';
import NodeExpandHolder from './relation-graph/src/core4vue3/RGNodeExpandHolder.vue';
import GraphXsToolBarComponent from './relation-graph/src/core4vue3/widgets/GraphXsToolBar.vue';
import GraphBackgroundComponent from './relation-graph/src/core4vue3/widgets/GraphBackground.vue';
import GraphWatermarkComponent from './relation-graph/src/core4vue3/widgets/GraphWatermark.vue';
import RgEditingNodeController from './relation-graph/src/core4vue3/editing/RGEditingNodeController.vue';
import RGEditingResizeComponent from './relation-graph/src/core4vue3/editing/RGEditingResize.vue';
import RGMiniViewComponent from './relation-graph/src/core4vue3/editing/RGMiniView.vue';
import RGEditingNearNodeWidgetComponent from './relation-graph/src/core4vue3/editing/RGEditingNearNodeWidget.vue';
import RGEditingLineControllerComponent from './relation-graph/src/core4vue3/editing/RGEditingLineController.vue';
import RGEditingConnectControllerComponent from './relation-graph/src/core4vue3/editing/RGEditingConnectController.vue';
import RgConnectSourceComponent from './relation-graph/src/core4vue3/editing/RGConnectSource.vue';
import RgConnectTargetComponent from './relation-graph/src/core4vue3/editing/RGConnectTarget.vue';
import RGEditingConnectPointsComponent from './relation-graph/src/core4vue3/editing/RGEditingConnectPoints.vue';
import RGEditingReferenceLineComponent from './relation-graph/src/core4vue3/editing/RGEditingReferenceLine.vue';

import { RGHooks as _RGHooks } from "./relation-graph/src/hooks/RGHooks";
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
export { RelationGraphCore } from '../../../relation-graph-models/models/RelationGraphCore';

export * from './types';
export * from './types-vue3';
export const version = _version;

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

export const RGFakeNode = RgFakeNodeComponent;
export const RGLinePath = RGLinePathComponent;
export const RGLineText = RGLineTextComponent;
export const RGDebugView = _RGDebugView;
export const RGToolBar = GraphToolBar;
export const RGNodeExpandHolder = NodeExpandHolder;
export const RGMiniToolBar = GraphXsToolBarComponent;
export const RGMiniView = RGMiniViewComponent;
export const RGBackground = GraphBackgroundComponent;
export const RGWatermark = GraphWatermarkComponent;
export const RGEditingNodeController = RgEditingNodeController;
export const RGEditingResize = RGEditingResizeComponent;
export const RGEditingNearNodeWidget = RGEditingNearNodeWidgetComponent;
export const RGEditingLineController = RGEditingLineControllerComponent;
export const RGEditingConnectController = RGEditingConnectControllerComponent;
export const RGConnectSource = RgConnectSourceComponent;
export const RGConnectTarget = RgConnectTargetComponent;
export const RGEditingConnectPoints = RGEditingConnectPointsComponent;
export const RGEditingReferenceLine = RGEditingReferenceLineComponent;

export const RGHooks = _RGHooks;
export const useRelationGraph = _RGHooks.useRelationGraph;
export const RGProvider = _RGProvider;
export const RelationLinker = _RelationLinker;

export * from './constants';
_RelationGraph.install = (app: App): void => {
  app.component('RelationGraph', _RelationGraph);
};
export const RelationGraph = _RelationGraph;
export default RelationGraph;
