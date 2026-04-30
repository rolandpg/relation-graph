import React, {PropsWithChildren} from 'react';
import {
  RGNode,
  RGNodeSlotProps,
  RGLineSlotProps,
  RelationGraphExpose,
  RGJsonData,
  RGListeners,
  JsonLine,
  RGOptionsFull,
  RGLine, RGFakeLine
} from '../../../types';
import {RGOptions} from "../../../types";
import {RelationGraphCore} from "../../../relation-graph-models/models/RelationGraphCore";

export type RGNodeExpandHolderProps = {
  node: RGNode
  expandOrCollapseNode: (e: React.MouseEvent|React.TouchEvent) => void
  expandHolderPosition?: string
};
export type RelationGraphWithSlots = {
  nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode)
  lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode)
  nodeExpandButtonSlot?: React.FC<RGNodeExpandHolderProps> | ((props: RGNodeExpandHolderProps) => React.ReactNode)
  children?: React.ReactNode;
}
export type RelationGraphWithProps = RGListeners & RelationGraphWithSlots & {
  options: RGOptions;
  initialData?: RGJsonData,
}
export type RelationGraphWithWithCustomCore = {
  relationGraphCore?: new (...args: any[]) => RelationGraphCore;
}
export type RelationGraphJsxProps = PropsWithChildren<RelationGraphWithProps & RelationGraphWithWithCustomCore>
export type RelationGraphComponent = React.ForwardRefExoticComponent<RelationGraphJsxProps & React.RefAttributes<RelationGraphExpose>>;

export type RelationLinkerProps = RGListeners & RelationGraphWithWithCustomCore & {
  lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode)
  children?: React.ReactNode;
  options?: RGOptions;
  lines: JsonLine[];
}

export type RGDataStore = {
  options: RGOptionsFull
  shouldRenderNodes: RGNode[]
  shouldRenderLines: RGLine[]
  shouldRenderFakeLines: RGFakeLine[]
}

