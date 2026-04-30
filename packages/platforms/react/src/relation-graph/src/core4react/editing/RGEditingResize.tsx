import React from 'react';
import {RGResizeHandlePosition} from "../../../../../../../types";
import {useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";

const RGEditingResize: React.FC<{
    disableResizeWidth?: boolean,
    disableResizeHeight?: boolean,
    beforeResizeStart?: () => void;
}> = ({disableResizeWidth, disableResizeHeight, beforeResizeStart}) => {
    const graphInstance = useGraphInstance();
    const {options} = useGraphStore();

    const onMouseDown = (type: RGResizeHandlePosition, event: React.MouseEvent) => {
        event.stopPropagation();
        beforeResizeStart && beforeResizeStart();
        graphInstance.onResizeStart(type, event.nativeEvent);
    };

    return (
        <div className="rg-resize-ctl">
            {options.editingController.width > 30 && (!disableResizeWidth && !disableResizeHeight) && (
                <div
                    className="rg-resize-ctl-handler rg-resize-ctl-tl"
                    onMouseDown={(event) => onMouseDown('tl', event)}
                ></div>
            )}
            {options.editingController.width > 30 && (!disableResizeWidth && !disableResizeHeight) && (
                <div
                    className="rg-resize-ctl-handler rg-resize-ctl-tr"
                    onMouseDown={(event) => onMouseDown('tr', event)}
                ></div>
            )}
            {options.editingController.width > 30 && (!disableResizeWidth && !disableResizeHeight) && (
                <div
                    className="rg-resize-ctl-handler rg-resize-ctl-bl"
                    onMouseDown={(event) => onMouseDown('bl', event)}
                ></div>
            )}
            {(!disableResizeWidth && !disableResizeHeight) && <div
                className="rg-resize-ctl-handler rg-resize-ctl-br"
                onMouseDown={(event) => onMouseDown('br', event)}
            ></div>}
            {(options.editingController.width > 60 || (disableResizeWidth)) && (!disableResizeHeight) && (
                <div
                    className="rg-resize-ctl-handler rg-resize-ctl-t"
                    onMouseDown={(event) => onMouseDown('t', event)}
                ></div>
            )}
            {(options.editingController.width > 60 || (disableResizeWidth)) && (!disableResizeHeight) && (
                <div
                    className="rg-resize-ctl-handler rg-resize-ctl-b"
                    onMouseDown={(event) => onMouseDown('b', event)}
                ></div>
            )}
            {(options.editingController.height > 60 || (disableResizeHeight)) && (!disableResizeWidth) && (
                <div
                    className="rg-resize-ctl-handler rg-resize-ctl-l"
                    onMouseDown={(event) => onMouseDown('l', event)}
                ></div>
            )}
            {(options.editingController.height > 60 || (disableResizeHeight)) && (!disableResizeWidth) && (
                <div
                    className="rg-resize-ctl-handler rg-resize-ctl-r"
                    onMouseDown={(event) => onMouseDown('r', event)}
                ></div>
            )}
        </div>
    );
};

export default RGEditingResize;
