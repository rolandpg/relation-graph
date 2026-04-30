import { default as React } from 'react';
import { RGLineSlotProps } from '../../../../../../types';
export interface RGCanvasContent4FakeLinesProps {
    showEasyView: boolean;
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode);
    defaultLineTextOnPath?: boolean;
    checkedLineId?: string;
    graphInstanceId?: string;
}
declare const RGCanvasContent4FakeLines: React.FC<RGCanvasContent4FakeLinesProps>;
export default RGCanvasContent4FakeLines;
