import {MutableRefObject, PropsWithChildren} from 'react';
import React, {useEffect, useRef, useState} from 'react';
import {devLog} from '../../../../../../relation-graph-models/utils/RGCommon';
import RGCanvas from './RGCanvas';
import GraphOperateStuff from './widgets/GraphOperateStuff';
import {RelationGraphWithSlots} from "../../../types-react";
import GraphXsToolBar from "./widgets/GraphXsToolBar";
import {RGLineSlotProps, RGNodeSlotProps} from "../../../../../../types";
import {RGSlotOnNode} from "../../../index";
import RGSlotOnLine from "./slots/RGSlotOnLine";
import RGSlotOnView from "./slots/RGSlotOnView";
import RGSlotOnCanvas from "./slots/RGSlotOnCanvas";
import RGSlotOnCanvasAbove from "./slots/RGSlotOnCanvasAbove";
import {useAutoUpdateView, useGraphInstance} from "../hooks/useGraphInstance";
import {useGraphStore} from "../hooks/useGraphStore";
import GraphBackground from "./widgets/GraphBackground";


const RelationGraphView: React.FC<PropsWithChildren<RelationGraphWithSlots>> = (props) => {
    const graphInstance = useGraphInstance();
    useAutoUpdateView();
    const relationGraphRef$ = useRef() as MutableRefObject<HTMLDivElement>;
    const [graphReady, setGraphReady] = useState(false);
    useEffect(() => {
        // devLog('[RelationGraph]setDom:', relationGraphRef$.current);
        devLog('<RelationGraph> Dom Mounted!');
        graphInstance.setDom(relationGraphRef$.current);
        setGraphReady(true);
        return () => {
            devLog('<RelationGraph> Dom UnMounted!');
            graphInstance.beforeUnmount();
        };
    }, []);
    const {options} = useGraphStore();

    let nodeRender: ((props: RGNodeSlotProps) => React.ReactNode) | React.FC<RGNodeSlotProps> | undefined;
    let lineRender: ((props: RGLineSlotProps) => React.ReactNode) | React.FC<RGLineSlotProps> | undefined;
    const slotsOnGraph: React.ReactNode[] = [];
    const slotsOnCanvas: React.ReactNode[] = [];
    const slotsOnCanvasAbove: React.ReactNode[] = [];
    const slotsOnBackground: React.ReactNode[] = [];
    const slotsOnCanvasDefault = React.Children.toArray(props.children).filter((child: React.ReactNode) => {
        if (child && React.isValidElement(child)) {
            if (child.type === RGSlotOnNode) {
                const functionChild = (child as React.ReactElement).props.children;
                if (typeof functionChild === 'function') {
                    nodeRender = functionChild;
                } else {
                    throw new Error(`RGSlotOnNode children must be a function, e.g. <RGSlotOnNode>{ (node: RGNode) => <div>{node.text}</div> }</RGSlotOnNode>`);
                }
            } else if (child.type === RGSlotOnLine) {
                const functionChild = (child as React.ReactElement).props.children;
                if (typeof functionChild === 'function') {
                    lineRender = functionChild;
                } else {
                    throw new Error(`RGSlotOnLine children must be a function, e.g. <RGSlotOnLine>{ (lineConfig: RGGenerateLineConfig) => <RGLineContent lineConfig={lineConfig} /> }</RGSlotOnLine>`);
                }
            } else if (child.type === RGSlotOnView) {
                slotsOnGraph.push((child as React.ReactElement).props.children);
                return false;
            } else if (child.type === RGSlotOnCanvas) {
                slotsOnCanvas.push((child as React.ReactElement).props.children);
                return false;
            } else if (child.type === RGSlotOnCanvasAbove) {
                slotsOnCanvasAbove.push((child as React.ReactElement).props.children);
                return false;
            } else if (child.type === GraphBackground) {
                slotsOnBackground.push((child as React.ReactElement).props.children);
                return false;
            }
        }
        return true;
    });
    const graphPlugSlot = slotsOnGraph;
    const canvasPlugAbove = slotsOnCanvasAbove;
    const canvasPlugBehind = slotsOnCanvas.concat(...slotsOnCanvasDefault);
    if (nodeRender && props.nodeSlot) {
        throw new Error('You can only provide nodeSlot or RGSlotOnNode, but not both.');
    }
    if (lineRender && props.lineSlot) {
        throw new Error('You can only provide lineSlot or RGSlotOnLine, but not both.');
    }
    const finalNodeRender = nodeRender || props.nodeSlot;
    const finalLineRender = lineRender || props.lineSlot;
    const nodeExpandButtonSlot = props.nodeExpandButtonSlot;
    return (
        <div
            ref={relationGraphRef$}
            id={`relation-graph-ins-${options?.instanceId}`}
            className={
                [
                    'relation-graph',
                    (options?.creatingLinePlot && 'rg-creating-line'),
                    ((options?.dragEventAction === 'move') ? 'rg-move-mode':''),
                    (options?.enableNodeXYAnimation ? 'rg-enable-node-xy-animation':''),
                    (options?.enableCanvasTransformAnimation && 'rg-enable-canvas-animation')
                ].filter(Boolean).join(' ')
            }
            tabIndex={1}
            style={{
                width: '100%',
                height : options?.viewHeight ? options?.viewHeight : '100%',
                opacity: graphReady ? 1 : 0,
                '--rg-checked-item-bg-color': options?.checkedItemBackgroundColor,
                '--rg-background-color': options?.backgroundColor,
                '--rg-node-color': options?.defaultNodeColor,
                '--rg-node-border-color': options?.defaultNodeBorderColor,
                '--rg-node-border-width': options?.defaultNodeBorderWidth + 'px',
                '--rg-node-border-radius': options?.defaultNodeBorderRadius + 'px',
                '--rg-line-color': options?.defaultLineColor,
                '--rg-line-width': options?.defaultLineWidth + 'px',
            }}
        >
            {
                options &&
                <>
                    {
                        options.showToolBar &&
                        <GraphXsToolBar/>
                    }
                    <RGCanvas
                        nodeSlot={finalNodeRender}
                        lineSlot={finalLineRender}
                        canvasPlugSlot={canvasPlugBehind}
                        canvasPlugAboveSlot={canvasPlugAbove}
                        nodeExpandButtonSlot={nodeExpandButtonSlot}
                        backgroundSlot={slotsOnBackground}
                    >
                    </RGCanvas>
                    <GraphOperateStuff nodeSlot={finalNodeRender}/>
                    <div className="rg-graph-plugs">
                        <div className="rg-view-slot">
                            {graphPlugSlot}
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default RelationGraphView;
