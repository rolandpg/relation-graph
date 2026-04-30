import {MutableRefObject, useMemo} from 'react';
import React, {useEffect, useRef} from 'react';
import {devLog} from '../../../../../../relation-graph-models/utils/RGCommon';
import {RGLineSlotProps, RGNodeSlotProps,} from '../../../../../../types';
import RGCanvasContent from './RGCanvasContent';
import {RGNodeExpandHolderProps} from "../../../types-react";
import RGEasyView from "./RGEasyView";
import {useGraphStore} from "../hooks/useGraphStore";
import {useAutoUpdateView, useGraphInstance} from "../hooks/useGraphInstance";

export interface RGCanvasProps {
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode)
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode)
    canvasPlugSlot?: React.FC | React.ReactNode
    canvasPlugAboveSlot?: React.ReactNode
    backgroundSlot?: React.ReactNode
    nodeExpandButtonSlot?: React.FC<RGNodeExpandHolderProps> | ((props: RGNodeExpandHolderProps) => React.ReactNode)
}

const RGCanvas: React.FC<RGCanvasProps> = (canvasProps) => {
    const graphInstance = useGraphInstance();
    const {options} = useGraphStore();
    useAutoUpdateView();
    const rgCanvasRef$ = useRef() as MutableRefObject<HTMLDivElement>;
    const rgMap$ = useRef() as MutableRefObject<HTMLDivElement>;
    const canvasSize = useMemo(() => options.canvasSize, [options.canvasSize]);
    const canvasOffset = useMemo(() => options.canvasOffset, [options.canvasOffset]);
    const scale = useMemo(() => options.canvasZoom! / 100, [options.canvasZoom]);
    const canvasSizeAndPosition = {
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
        backgroundColor: 'transparent',
        'transform': `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${scale},${scale})`
    };

    useEffect(() => {
        devLog('[RGCanvas mounted]');
        graphInstance.setCanvasDom(rgCanvasRef$.current!);
        const mouseWheelListener = (e: WheelEvent) => {
            graphInstance.onMouseWheel(e);
        };
        rgMap$.current.addEventListener('wheel', mouseWheelListener, {passive: false});
        return () => {
            devLog('[RGCanvas UnMounted]');
            rgMap$.current?.removeEventListener('wheel', mouseWheelListener);
        }
    }, []);

    const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (e.type === "mousedown" && e.button !== 0) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        graphInstance.onCanvasDragStart(e.nativeEvent);
    };
    const contextmenu = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        graphInstance.onContextmenu(e.nativeEvent);
    };
    return (
        <div
            ref={rgMap$}
            className={[
                'rg-map',
                (options.canvasOpacity === 1 ? 'rg-map-ready' : '')
            ].join(' ')}
            onContextMenu={($event) => {
                contextmenu($event);
            }}
            onMouseDown={($event) => {
                onDragStart($event);
            }}
            onTouchStart={($event) => {
                onDragStart($event);
            }}
        >
            <div className="rg-map-background">
                {canvasProps.backgroundSlot}
            </div>
            <RGEasyView/>
            <div style={canvasSizeAndPosition} className="rg-map-canvas rg-canvas-behind">
                <div className="rg-canvas-slot rg-canvas-slot-behind">
                    {canvasProps.canvasPlugSlot && (typeof canvasProps.canvasPlugSlot === 'function' ?
                        <canvasProps.canvasPlugSlot/> : canvasProps.canvasPlugSlot)}
                </div>
            </div>
            <div
                ref={rgCanvasRef$}
                style={canvasSizeAndPosition}
                className="rg-map-canvas"
            >
                <RGCanvasContent
                    nodeSlot={canvasProps.nodeSlot}
                    lineSlot={canvasProps.lineSlot}
                    nodeExpandButtonSlot={canvasProps.nodeExpandButtonSlot}
                    showEasyView={options.showEasyView}
                    creatingLine={options.creatingLinePlot && options.newLinkTemplate.fromNode}
                    defaultExpandHolderPosition={options.defaultExpandHolderPosition}
                    draggingNodeId={options.draggingNodeId}
                    checkedNodeId={options.checkedNodeId}
                    defaultLineTextOnPath={options.defaultLineTextOnPath}
                    checkedLineId={options.checkedLineId}
                    graphInstanceId={options.instanceId}
                />
            </div>
            <div style={canvasSizeAndPosition} className="rg-map-canvas rg-canvas-above">
                <div className="rg-canvas-slot rg-canvas-slot-above">
                    {canvasProps.canvasPlugAboveSlot}
                </div>
            </div>
        </div>
    );
};

export default RGCanvas;
