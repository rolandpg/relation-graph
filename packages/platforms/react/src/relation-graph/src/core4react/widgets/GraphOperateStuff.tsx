import React from 'react';
import RGNodePeel from '../RGNodePeel';
import {RGNode, RGNodeSlotProps} from '../../../../../../../types';
import GraphMoveOperator from "./GraphMoveOperator";
import GraphLoading from './GraphLoading';
import {useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";

export interface GraphOperateStuffProps {
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode)
}

const GraphOperateStuff: React.FC<GraphOperateStuffProps> = ({nodeSlot}) => {
    const graphInstance = useGraphInstance();
    const {options} = useGraphStore();
    return (
        (options) &&
        <div className="rg-operate">
            <div className="rg-creating-container">
                {options.creatingNodePlot && options.showTemplateNode &&
                    <RGNodePeel
                        nodeProps={options.newNodeTemplate}
                        nodeSlot={nodeSlot}
                    />
                }
                {
                    options.creatingSelection &&
                    <div
                        className="rg-selection"
                        style={{
                            transform: `translate(${options.selectionView.x}px, ${options.selectionView.y}px)`,
                            width: options.selectionView.width + 'px',
                            height: options.selectionView.height + 'px',
                        }}
                    >
                    </div>
                }
            </div>
            <GraphMoveOperator/>
            <GraphLoading />
        </div>
    );
};

export default GraphOperateStuff;
