import { default as React } from 'react';
import { RGLinePathProps } from '../../../../../../types';
declare const RGLinePath: React.FC<RGLinePathProps & {
    onLineClick: (e: React.MouseEvent | React.TouchEvent) => void;
    children?: React.ReactNode;
}>;
export default RGLinePath;
