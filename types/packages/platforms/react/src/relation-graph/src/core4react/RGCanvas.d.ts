import { default as React } from 'react';
import { RGLineSlotProps, RGNodeSlotProps } from '../../../../../../types';
import { RGNodeExpandHolderProps } from '../../../types-react';
export interface RGCanvasProps {
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode);
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode);
    canvasPlugSlot?: React.FC | React.ReactNode;
    canvasPlugAboveSlot?: React.ReactNode;
    backgroundSlot?: React.ReactNode;
    nodeExpandButtonSlot?: React.FC<RGNodeExpandHolderProps> | ((props: RGNodeExpandHolderProps) => React.ReactNode);
}
declare const RGCanvas: React.FC<RGCanvasProps>;
export default RGCanvas;
