import { default as React } from 'react';
import { RGNode, RGNodeSlotProps } from '../../../../../../types';
import { RGNodeExpandHolderProps } from '../../../types-react';
export interface RGCanvasContent4NodesProps {
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode);
    nodeExpandButtonSlot?: React.FC<RGNodeExpandHolderProps> | ((props: RGNodeExpandHolderProps) => React.ReactNode);
    defaultExpandHolderPosition?: string;
    draggingNodeId?: string;
    checkedNodeId?: string;
    allNodeConfigList: RGNode[];
}
declare const RGCanvasContent4NodesContent: React.FC<RGCanvasContent4NodesProps>;
export default RGCanvasContent4NodesContent;
