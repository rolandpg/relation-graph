import {MutableRefObject, PropsWithChildren} from 'react';
import React, {useEffect, useRef, useState} from 'react';
import {devLog} from '../../../../../../relation-graph-models/utils/RGCommon';
import GraphOperateStuff from './widgets/GraphOperateStuff';
import {RelationLinkerProps} from "../../../types-react";
import {RGLineSlotProps} from "../../../../../../types";
import RGSlotOnLine from "./slots/RGSlotOnLine";
import RGSlotOnView from "./slots/RGSlotOnView";
import RGSlotOnCanvas from "./slots/RGSlotOnCanvas";
import RGSlotOnCanvasAbove from "./slots/RGSlotOnCanvasAbove";
import RelationLinkerCanvas from "./RelationLinkerCanvas";
import {useAutoUpdateView, useGraphInstance} from "../hooks/useGraphInstance";
import {useGraphStore} from "../hooks/useGraphStore";


const RelationLinkerView: React.FC<PropsWithChildren<RelationLinkerProps>> = (props) => {
    const graphInstance = useGraphInstance();
    useAutoUpdateView();
    const relationGraphRef$ = useRef() as MutableRefObject<HTMLDivElement>;
    const [graphReady, setGraphReady] = useState(false);
    useEffect(() => {
        // devLog('[RelationGraph]setDom:', relationGraphRef$.current);
        graphInstance.setDom(relationGraphRef$.current);
        setGraphReady(true);
        return () => {
            graphInstance.beforeUnmount();
        };
    }, []);
    const {options} = useGraphStore();

    let lineRender: ((props: RGLineSlotProps) => React.ReactNode) | React.FC<RGLineSlotProps> | undefined;
    const slotsOnGraph: React.ReactNode[] = [];
    const slotsOnCanvasBehind: React.ReactNode[] = [];
    const slotsOnCanvasDefault = React.Children.toArray(props.children).filter((child: React.ReactNode) => {
        if (child && React.isValidElement(child)) {
            if (child.type === RGSlotOnLine) {
                const functionChild = (child as React.ReactElement).props.children;
                if (typeof functionChild === 'function') {
                    lineRender = functionChild;
                } else {
                    throw new Error(`RGSlotOnLine children must be a function, e.g. <RGSlotOnLine>{ (line: RGLine) => <g><path d="..." /><text>{line.text}</text></g> }</RGSlotOnLine>`);
                }
            } else if (child.type === RGSlotOnView) {
                slotsOnGraph.push((child as React.ReactElement).props.children);
                return false;
            } else if (child.type === RGSlotOnCanvas) {
                slotsOnCanvasBehind.push((child as React.ReactElement).props.children);
                return false;
            } else if (child.type === RGSlotOnCanvasAbove) {
                return false;
            }
        }
        return true;
    });
    ;
    const graphPlugSlot = slotsOnGraph;
    const canvasPlugBehind = slotsOnCanvasBehind.concat(...slotsOnCanvasDefault);
    if (lineRender && props.lineSlot) {
        throw new Error('You can only provide lineSlot or RGSlotOnLine, but not both.');
    }
    const finalLineRender = lineRender || props.lineSlot;
    return (
        <div
            ref={relationGraphRef$}
            id={`relation-graph-ins-${options?.instanceId}`}
            className={
                [
                    'relation-graph',
                    (options?.creatingLinePlot && 'rg-creating-line')
                ].filter(Boolean).join(' ')
            }
            tabIndex={1}
            style={{
                width: '100%',
                height : 'fit-content',
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
                graphReady && options &&
                <>
                    <RelationLinkerCanvas
                        lineSlot={finalLineRender}
                        canvasPlugBehindSlot={canvasPlugBehind}
                    >
                    </RelationLinkerCanvas>
                    <GraphOperateStuff />
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

export default RelationLinkerView;
