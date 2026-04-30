/*
* relation-graph
* (c) 2019-2026 relation-graph.com
* Released under the MIT License.
* More info: https://relation-graph.com
*/
import "../../../styles/relation-graph.scss";
import "../../../styles/relation-graph-toolbar.scss";
import { version as _version } from '../../../relation-graph-models/constants';
import _RelationGraph from './core4vue/RelationGraph.vue';
// import RGSlotOnCanvasAboveComponent from './core4vue/slots/RGSlotOnCanvasAbove';
// import RGSlotOnViewComponent from './core4vue/slots/RGSlotOnView';
// import RGSlotOnLineComponent from './core4vue/slots/RGSlotOnLine.vue';
// import RGSlotOnNodeComponent from './core4vue/slots/RGSlotOnNode.vue';
// import RGSlotOnNodeExpandHandleComponent from './core4vue/slots/RGSlotOnNodeExpandHandle.vue';
import _RGDebugView from './core4vue/widgets/RGDebugView.vue';
import GraphToolBarComponent from './core4vue/widgets/GraphToolBar.vue';
import NodeExpandHolderComponent from './core4vue/RGNodeExpandHolder.vue';
import GraphXsToolBarComponent from './core4vue/widgets/GraphXsToolBar.vue';
import GraphBackgroundComponent from './core4vue/widgets/GraphBackground.vue';
import GraphWatermarkComponent from './core4vue/widgets/GraphWatermark.vue';
import RgEditingNodeController from './core4vue/editing/RGEditingNodeController.vue';
import RGEditingResizeComponent from './core4vue/editing/RGEditingResize.vue';
import RGMiniViewComponent from './core4vue/editing/RGMiniView.vue';
import RGEditingNearNodeWidgetComponent from './core4vue/editing/RGEditingNearNodeWidget.vue';
import RGEditingLineControllerComponent from './core4vue/editing/RGEditingLineController.vue';
import RGEditingConnectControllerComponent from './core4vue/editing/RGEditingConnectController.vue';
import RgConnectSourceComponent from './core4vue/editing/RGConnectSource.vue';
import RgConnectTargetComponent from './core4vue/editing/RGConnectTarget.vue';
import RGFakeNodeComponent from './core4vue/RGFakeNode.vue';
import RGLinePathComponent from './core4vue/RGLinePath.vue';
import RGLineTextComponent from './core4vue/RGLineText.vue';
import RGEditingConnectPointsComponent from './core4vue/editing/RGEditingConnectPoints.vue';
import RGEditingReferenceLineComponent from './core4vue/editing/RGEditingReferenceLine.vue';
import _RelationLinker from './core4vue/RelationLinker.vue';
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





export {default as RGProvider} from "./core4vue/RGProvider.vue";
export { graphStoreMixin } from "./hooks/GraphStoreMixin";
export * from '../../../types';
export * from './types-vue2';
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




























export const RGFakeNode = RGFakeNodeComponent;
export const RGLinePath = RGLinePathComponent;
export const RGLineText = RGLineTextComponent;
export const RGToolBar = GraphToolBarComponent;
export const RGNodeExpandHolder = NodeExpandHolderComponent;
export const RGDebugView = _RGDebugView;
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
export const RelationLinker = _RelationLinker;



const install = (Vue:any, options?:any) => {
  Vue.component('RelationGraph', _RelationGraph);
};
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export const RelationGraph = _RelationGraph;// as RelationGraphVueComponent;
export default {
  ..._RelationGraph,
  version,
  install
};
