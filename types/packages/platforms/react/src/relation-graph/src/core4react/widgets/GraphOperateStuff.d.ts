import { default as React } from 'react';
import { RGNodeSlotProps } from '../../../../../../../types';
export interface GraphOperateStuffProps {
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode);
}
declare const GraphOperateStuff: React.FC<GraphOperateStuffProps>;
export default GraphOperateStuff;
