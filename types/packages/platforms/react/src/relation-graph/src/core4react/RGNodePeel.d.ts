import { default as React } from 'react';
import { RGNodeExpandHolderProps } from '../../../types-react';
import { RGNode, RGNodeSlotProps } from '../../../../../../types';
export type RGNodeProps = {
    nodeProps: RGNode;
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode);
    nodeExpandButtonSlot?: React.FC<RGNodeExpandHolderProps> | ((props: RGNodeExpandHolderProps) => React.ReactNode);
    defaultExpandHolderPosition?: string;
    dragging?: boolean;
    checked?: boolean;
};
declare const RGNodePeel: React.FC<RGNodeProps>;
export default RGNodePeel;
