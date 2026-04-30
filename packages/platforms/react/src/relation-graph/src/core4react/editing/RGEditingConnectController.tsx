import React, {PropsWithChildren, useRef} from 'react';
import RGEditingConnectPoints from './RGEditingConnectPoints';
import {JsonLine, RGJunctionPoint, RGNode, RGPosition} from "../../../../../../../types";
import {devLog} from "../../../../../../../relation-graph-models/utils/RGCommon";
import {useAutoUpdateView, useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";

const RGEditingConnectController: React.FC<PropsWithChildren<{}>> = ({children}) => {
    const graphInstance = useGraphInstance();
    useAutoUpdateView();
    const connectBoxRef = useRef<HTMLDivElement>();
    const {options} = useGraphStore();

    if (!options.nodeConnectController.show) {
        return <></>;
    }
    const mouseUpOnJunctionPoint = (junctionPoint: RGJunctionPoint, event: any) => {
        graphInstance.onLineVertexBeDroppedOnConnectController(junctionPoint, event, undefined, (fromNode: RGNode, toNode: RGNode | RGPosition, newLineJson?: JsonLine) => {
            devLog('onLineVertexBeDropped:callback:', newLineJson);
            // graphInstance.value.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
        });
    };
    const mouseUpOnJunctionPointWithOffset = (junctionPoint: RGJunctionPoint, event: any) => {
        graphInstance.onLineVertexBeDroppedOnConnectController(junctionPoint, event, connectBoxRef.current, (fromNode: RGNode, toNode: RGNode | RGPosition, newLineJson?: JsonLine) => {
            devLog('onLineVertexBeDropped:callback:', newLineJson);
            // graphInstance.value.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
        });
    };
    return (
        <div
            className="rg-editing-connect-ctrl"
            ref={connectBoxRef}
            style={{
                transform: `translate(${options.nodeConnectController.x}px, ${options.nodeConnectController.y}px)`,
                width: options.nodeConnectController.width + 'px',
                height: options.nodeConnectController.height + 'px',
            }}
        >
            {
                children ? children : <RGEditingConnectPoints
                    mouseUpOnJunctionPoint={mouseUpOnJunctionPoint}
                    mouseUpOnJunctionPointWithOffset={mouseUpOnJunctionPointWithOffset}
                />
            }
        </div>
    );
};

export default RGEditingConnectController;
