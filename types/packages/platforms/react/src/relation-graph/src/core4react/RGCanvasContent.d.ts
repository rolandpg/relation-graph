import { default as React } from 'react';
import { RGLineSlotProps, RGNodeSlotProps } from '../../../../../../types';
import { RGNodeExpandHolderProps } from '../../../types-react';
export interface RGCanvasContentProps {
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode);
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode);
    nodeExpandButtonSlot?: React.FC<RGNodeExpandHolderProps> | ((props: RGNodeExpandHolderProps) => React.ReactNode);
    showEasyView?: boolean;
    creatingLine?: boolean;
    defaultExpandHolderPosition?: string;
    draggingNodeId?: string;
    checkedNodeId?: string;
    checkedLineId?: string;
    defaultLineTextOnPath?: boolean;
    graphInstanceId?: string;
}
declare const RGCanvasContent: React.FC<RGCanvasContentProps>;
export default RGCanvasContent;
