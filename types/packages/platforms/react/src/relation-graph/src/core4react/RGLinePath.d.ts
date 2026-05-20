import { default as React, PropsWithChildren } from 'react';
import { RGLinePathProps } from '../../../../../../types';
declare const RGLinePath: React.FC<PropsWithChildren<RGLinePathProps & {
    onLineClick: (e: React.MouseEvent | React.TouchEvent) => void;
}>>;
export default RGLinePath;
