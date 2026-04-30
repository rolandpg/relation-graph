import type {MutableRefObject} from 'react';
import React, {PropsWithChildren, useEffect, useRef} from 'react';
import {devLog} from '../../../../../../relation-graph-models/utils/RGCommon';
import {RGLineSlotProps,} from '../../../../../../types';
import RGCanvasContent from "./RGCanvasContent";
import {useGraphInstance} from "../hooks/useGraphInstance";
import {useGraphStore} from "../hooks/useGraphStore";

const RelationLinkerCanvas: React.FC<PropsWithChildren<{
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode)
    canvasPlugBehindSlot?: React.ReactNode
}>> = (canvasProps) => {
    const graphInstance = useGraphInstance();
    const {options} = useGraphStore();
    const rgCanvasRef$ = useRef() as MutableRefObject<HTMLDivElement>;
    const canvasSizeAndPosition = {
        backgroundColor: 'transparent',
        textWrap: 'unset',
        position: 'relative',
        width: '100%',
        height: 'fit-content'
    };

    useEffect(() => {
        devLog('[RGCanvas mounted]');
        graphInstance.setCanvasDom(rgCanvasRef$.current!);
        return () => {
            devLog('[RGCanvas UnMounted]');
        }
    }, []);

    return (
        <div
            className={[
                'rg-map',
                (options.canvasOpacity === 1 ? 'rg-map-ready' : '')
            ].join(' ')}
        >
            <div
                style={{
                    ...canvasSizeAndPosition,
                    position: 'relative',
                    pointerEvents: 'all',
                    userSelect: 'text',
                }}
                className="rg-map-canvas rg-canvas-behind"
            >
                <div className="rg-canvas-slot rg-canvas-slot-behind">
                    {canvasProps.canvasPlugBehindSlot}
                </div>
            </div>
            <div
                ref={rgCanvasRef$}
                style={{
                    ...canvasSizeAndPosition,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    left: '0px',
                    top: '0px',
                    zIndex: 9,
                }}
                className="rg-map-canvas"
            >
                <RGCanvasContent
                    lineSlot={canvasProps.lineSlot}
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
        </div>
    );
};

export default RelationLinkerCanvas;
