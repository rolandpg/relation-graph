import { default as React } from 'react';
import { RGLineSlotProps } from '../../../../../../types';
export interface RGCanvasContent4CreatingLineProps {
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode);
    defaultLineTextOnPath?: boolean;
    checkedLineId?: string;
    graphInstanceId?: string;
}
declare const RGCanvasContent4CreatingLine: React.FC<RGCanvasContent4CreatingLineProps>;
export default RGCanvasContent4CreatingLine;
