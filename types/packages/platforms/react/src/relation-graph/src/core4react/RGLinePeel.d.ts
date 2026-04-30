import { default as React } from 'react';
import { RGLineSlotProps, RGLinePeelProps } from '../../../../../../types';
declare const RGLinePeel: React.FC<RGLinePeelProps & {
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode);
}>;
export default RGLinePeel;
