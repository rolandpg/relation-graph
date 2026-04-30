import { default as React } from 'react';
import { RGLine, RGLineSlotProps } from '../../../../../../types';
export interface RGCanvasContent4LinesProps {
    showEasyView: boolean;
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode);
    defaultLineTextOnPath?: boolean;
    checkedLineId?: string;
    graphInstanceId?: string;
    allLineConfigList: RGLine[];
}
declare const RGCanvasContent4LinesContent: React.FC<RGCanvasContent4LinesProps>;
export default RGCanvasContent4LinesContent;
