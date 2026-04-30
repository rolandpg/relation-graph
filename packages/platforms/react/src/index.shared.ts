/*
* relation-graph
* (c) 2019-2026 relation-graph.com
* Released under the MIT License.
* More info: https://relation-graph.com
*/
import { version as _version } from '../../../relation-graph-models/constants';
import _RelationGraph from './relation-graph/RelationGraph';
import {RGHooks as _RGHooks} from './relation-graph/src/hooks/RGHooks';
import _RGDebugView from './relation-graph/src/core4react/widgets/RGDebugView';
import RGToolBarComponent from './relation-graph/src/core4react/widgets/GraphToolBar';
import RGFakeNodeComponent from './relation-graph/src/core4react/RGFakeNode';
import RGLinePathComponent from './relation-graph/src/core4react/RGLinePath';
import RGLineTextComponent from './relation-graph/src/core4react/RGLineText';
import NodeExpandHolder from './relation-graph/src/core4react/RGNodeExpandHolder';
import RGSlotOnViewComponent from './relation-graph/src/core4react/slots/RGSlotOnView';
import RGSlotOnCanvasAboveComponent from './relation-graph/src/core4react/slots/RGSlotOnCanvasAbove';
import RGSlotOnCanvasComponent from './relation-graph/src/core4react/slots/RGSlotOnCanvas';
import RGSlotOnNodeComponent from './relation-graph/src/core4react/slots/RGSlotOnNode';
import RGSlotOnLineComponent from './relation-graph/src/core4react/slots/RGSlotOnLine';
import GraphXsToolBarComponent from './relation-graph/src/core4react/widgets/GraphXsToolBar';
import RGEditingNodeControllerComponent from './relation-graph/src/core4react/editing/RGEditingNodeController';
import RGEditingResizeComponent from './relation-graph/src/core4react/editing/RGEditingResize';
import RGMiniViewComponent from './relation-graph/src/core4react/editing/RGMiniView';
import GraphWatermarkComponent from './relation-graph/src/core4react/widgets/GraphWatermark';
import GraphBackgroundComponent from './relation-graph/src/core4react/widgets/GraphBackground';
import RGEditingNearNodeWidgetComponent from './relation-graph/src/core4react/editing/RGEditingNearNodeWidget';
import RGEditingLineControllerComponent from './relation-graph/src/core4react/editing/RGEditingLineController';
import RGEditingConnectControllerComponent from './relation-graph/src/core4react/editing/RGEditingConnectController';
import RGConnectSourceComponent from './relation-graph/src/core4react/editing/RGConnectSource';
import RGConnectTargetComponent from './relation-graph/src/core4react/editing/RGConnectTarget';
import RGEditingConnectPointsComponent from './relation-graph/src/core4react/editing/RGEditingConnectPoints';
import RGEditingReferenceLineComponent from './relation-graph/src/core4react/editing/RGEditingReferenceLine';
import _RelationLinker from './relation-graph/RelationLinker';

import _RGProvider from "./relation-graph/RGProvider";

import { RelationGraphCore as _RelationGraphCore } from '../../../relation-graph-models/models/RelationGraphCore';
import {RelationGraphComponent as _RelationGraphComponent} from "./types-react";

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
export * from './types-react';
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
export const RGDebugView = _RGDebugView;
export const RGToolBar = RGToolBarComponent;
export const RGNodeExpandHolder = NodeExpandHolder;
export const RGMiniToolBar = GraphXsToolBarComponent;
export const RGMiniView = RGMiniViewComponent;
export const RGBackground = GraphBackgroundComponent;
export const RGWatermark = GraphWatermarkComponent;
export const RGEditingNodeController = RGEditingNodeControllerComponent;
export const RGEditingResize = RGEditingResizeComponent;
export const RGEditingNearNodeWidget = RGEditingNearNodeWidgetComponent;
export const RGEditingLineController = RGEditingLineControllerComponent;
export const RGEditingConnectController = RGEditingConnectControllerComponent;
export const RGConnectSource = RGConnectSourceComponent;
export const RGConnectTarget = RGConnectTargetComponent;
export const RGEditingConnectPoints = RGEditingConnectPointsComponent;
export const RGEditingReferenceLine = RGEditingReferenceLineComponent;

export const RGSlotOnGraph = RGSlotOnViewComponent;
export const RGSlotOnView = RGSlotOnViewComponent;
export const RGSlotOnCanvasAbove = RGSlotOnCanvasAboveComponent;
export const RGSlotOnCanvas = RGSlotOnCanvasComponent;
export const RGSlotOnNode = RGSlotOnNodeComponent;
export const RGSlotOnLine = RGSlotOnLineComponent;
export const RelationLinker = _RelationLinker;

export {RGHooks as _RGHooks} from './relation-graph/src/hooks/RGHooks';
export const RGHooks = _RGHooks;
export const useRelationGraph = RGHooks.useRelationGraph;
export const RGProvider = _RGProvider;

export {RelationGraphStoreContext, RelationGraphStoreContext as RGInstanceContext, RGUpdateContext, RGUpdateSignalContext as RGUpdateSingalContext, RGUpdateSignalContext} from './relation-graph/src/core4react/store/reducers/RGStore';
export type RelationGraphComponent = _RelationGraphComponent;
export const RelationGraph = _RelationGraph;
export default _RelationGraph;
