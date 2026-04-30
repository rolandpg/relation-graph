import React from 'react';
import {useGraphInstance} from "../../hooks/useGraphInstance";

const GraphMoveOperator: React.FC = () => {
    const graphInstance = useGraphInstance();
    const canvasMoveMode = graphInstance?.options.canvasMoveMode || false;
    // Event handler for touchpad
    const onTouchpadMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (graphInstance) {
            graphInstance.startMoveCanvas(e.nativeEvent, true);
        }
    };
    return (
        <div
            className={`rg-move-operator ${canvasMoveMode ? 'rg-move-operator-active' : ''}`}
        >
            <div
                className="rg-move-touchpad"
                onMouseDown={onTouchpadMouseDown}
                onTouchStart={onTouchpadMouseDown}
            ></div>
        </div>
    )
};
export default GraphMoveOperator;
