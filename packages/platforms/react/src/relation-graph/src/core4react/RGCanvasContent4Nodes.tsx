import React from 'react';
import RGNodePeel from './RGNodePeel';
import {RGNode, RGNodeSlotProps} from '../../../../../../types';
import {RGNodeExpandHolderProps} from '../../../types-react';

export interface RGCanvasContent4NodesProps {
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode)
    nodeExpandButtonSlot?: React.FC<RGNodeExpandHolderProps> | ((props: RGNodeExpandHolderProps) => React.ReactNode)
    defaultExpandHolderPosition?: string,
    draggingNodeId?: string,
    checkedNodeId?: string,
    allNodeConfigList: RGNode[]
}

const RGCanvasContent4NodesContent: React.FC<RGCanvasContent4NodesProps> = (
    {
        nodeSlot,
        nodeExpandButtonSlot,
        defaultExpandHolderPosition,
        draggingNodeId,
        checkedNodeId,
        allNodeConfigList
    }
) => {
    // console.log('shouldRenderNodes::::', allNodeConfigList.length);
    return (
        <div className="rg-nodes-container">
            {
                allNodeConfigList.map(thisNode =>
                    <RGNodePeel
                        key={thisNode.id}
                        nodeProps={thisNode}
                        nodeSlot={nodeSlot}
                        nodeExpandButtonSlot={nodeExpandButtonSlot}
                        defaultExpandHolderPosition={defaultExpandHolderPosition}
                        dragging={thisNode.id === draggingNodeId}
                        checked={thisNode.id === checkedNodeId}
                    />
                )
            }
        </div>
    );
};
const RGCanvasContent4Nodes = React.memo(RGCanvasContent4NodesContent, (p1, p2) => {
    if (p1.allNodeConfigList !== p2.allNodeConfigList) {
        // console.log('shouldRenderNodes:::::::props[allNodeConfigList]changed:::');
        return false;
    } else if (p1.draggingNodeId !== p2.draggingNodeId) {
        // console.log('shouldRenderNodes:::::::props[draggingNodeId]changed:::');
        return false;
    } else if (p1.checkedNodeId !== p2.checkedNodeId) {
        // console.log('shouldRenderNodes:::::::props[checkedNodeId]changed:::');
        return false;
    } else if (p1.nodeSlot !== p2.nodeSlot) {
        // console.log('shouldRenderNodes:::::::props[nodeSlot]changed:::');
        return false;
    } else if (p1.nodeExpandButtonSlot !== p2.nodeExpandButtonSlot) {
        // console.log('shouldRenderNodes:::::::props[nodeExpandButtonSlot]changed:::');
        return false;
    } else if (p1.defaultExpandHolderPosition !== p2.defaultExpandHolderPosition) {
        // console.log('shouldRenderNodes:::::::props[defaultExpandHolderPosition]changed:::');
        return false;
    }
    // console.log('shouldRenderNodes:::::::#Not Change#:::');
    return true;
});
export default RGCanvasContent4NodesContent;
