import React, {useMemo} from 'react';
import {RGLineSlotProps, RGNodeSlotProps} from '../../../../../../types';
import {RGNodeExpandHolderProps} from '../../../types-react';
import RGCanvasContent4Lines from "./RGCanvasContent4Lines";
import RGCanvasContent4Nodes from "./RGCanvasContent4Nodes";
import RGCanvasContent4FakeLines from "./RGCanvasContent4FakeLines";
import RGCanvasContent4CreatingLine from "./RGCanvasContent4CreatingLine";
import {useGraphInstance} from "../hooks/useGraphInstance";
import {useGraphStore} from "../hooks/useGraphStore";

export interface RGCanvasContentProps {
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode)
    lineSlot?: React.FC<RGLineSlotProps> | ((props: RGLineSlotProps) => React.ReactNode)
    nodeExpandButtonSlot?: React.FC<RGNodeExpandHolderProps> | ((props: RGNodeExpandHolderProps) => React.ReactNode)
    showEasyView?: boolean
    creatingLine?: boolean
    defaultExpandHolderPosition?: string,
    draggingNodeId?: string,
    checkedNodeId?: string,
    checkedLineId?: string,
    defaultLineTextOnPath?: boolean,
    graphInstanceId?: string,
}

const RGCanvasContent: React.FC<RGCanvasContentProps> = (
    {
        nodeSlot,
        lineSlot,
        nodeExpandButtonSlot,
        showEasyView,
        creatingLine,
        defaultExpandHolderPosition,
        draggingNodeId,
        checkedNodeId,
        checkedLineId,
        graphInstanceId,
        defaultLineTextOnPath
    }
) => {
    const graphInstance = useGraphInstance();
    const {shouldRenderNodes, shouldRenderLines} = useGraphStore();
    const allNodeConfigList = useMemo(
        () => {
            if (showEasyView) {
                return [];
            }
            // console.log('shouldRenderNodes::useMemo::allNodeConfigList');
            return graphInstance.getShouldRenderNodes(shouldRenderNodes);
        },
        [graphInstance, shouldRenderNodes, showEasyView]);
    // const allNodeConfigList = graphInstance.getShouldRenderNodes(shouldRenderNodes);
    const allLineConfigList = useMemo(
        () => {
            if (showEasyView) {
                return [];
            }
            // console.log('shouldRenderLines::useMemo::shouldRenderLines');
            return graphInstance.getShouldRenderLines(shouldRenderLines);
        },
        [graphInstance, shouldRenderLines, showEasyView]);

    return (
        <div className="rg-single-graph">
            <RGCanvasContent4Lines
                graphInstanceId={graphInstanceId}
                showEasyView={showEasyView}
                defaultLineTextOnPath={defaultLineTextOnPath}
                checkedLineId={checkedLineId}
                lineSlot={lineSlot}
                allLineConfigList={allLineConfigList}
            />
            <div className="rg-nodes-container-wrapper">
                {!showEasyView && <RGCanvasContent4Nodes
                    defaultExpandHolderPosition={defaultExpandHolderPosition}
                    draggingNodeId={draggingNodeId}
                    checkedNodeId={checkedNodeId}
                    nodeSlot={nodeSlot}
                    nodeExpandButtonSlot={nodeExpandButtonSlot}
                    allNodeConfigList={allNodeConfigList}
                />}
            </div>
            <RGCanvasContent4FakeLines
                graphInstanceId={graphInstanceId}
                showEasyView={showEasyView}
                defaultLineTextOnPath={defaultLineTextOnPath}
                checkedLineId={checkedLineId}
                lineSlot={lineSlot}
            >
            </RGCanvasContent4FakeLines>
            {creatingLine && <RGCanvasContent4CreatingLine
                defaultLineTextOnPath={defaultLineTextOnPath}
                checkedLineId={checkedLineId}
                lineSlot={lineSlot}
            >
            </RGCanvasContent4CreatingLine>}
        </div>
    );
};

export default RGCanvasContent;
