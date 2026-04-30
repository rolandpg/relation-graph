import { default as React, PropsWithChildren } from 'react';
import { RGLineSlotProps } from '../../../../../../types';
declare const RelationLinkerCanvas: React.FC<PropsWithChildren<{
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode);
    canvasPlugBehindSlot?: React.ReactNode;
}>>;
export default RelationLinkerCanvas;
