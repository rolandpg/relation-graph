import React, {useEffect, useRef} from 'react';
import {RGMiniViewProps} from "../../../../../../../types";
import {useAutoUpdateView, useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";

const RGMiniView: React.FC<RGMiniViewProps> = ({className, style, position = 'br', width, height}) => {
    const graphInstance = useGraphInstance();
    useAutoUpdateView();
    const {options} = useGraphStore();
    const $rgMiniView = useRef<HTMLDivElement>(null);
    const $rgMiniViewCanvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        graphInstance.onMiniViewMounted();
        graphInstance.setMiniViewCanvas($rgMiniViewCanvas.current!);

        return () => {
            graphInstance.onMiniViewUnMounted();
        };
    }, []);

    const onMouseDown = (e: React.MouseEvent) => {
        graphInstance.onVisibleViewHandleDragStart(e.nativeEvent);
    };

    const onClickCanvas = async (e: React.MouseEvent) => {
        graphInstance.resetByVisiableView(e.nativeEvent);
    };

    return (
        <div
            className={`rg-miniview rg-miniview-${position} ${className || ''}`}
            ref={$rgMiniView}
            style={{
                ...style,
                '--miniview-width': width,
                '--miniview-height': height
            }}
        >
            <div className="rg-miniview-container">
                <canvas
                    ref={$rgMiniViewCanvas}
                    className={
                        options.miniViewVisibleHandle.emptyContent
                            ? 'rg-mv-canvas-reset'
                            : ''
                    }
                    onClick={onClickCanvas}
                />
                <div
                    className="rg-mv-visible-area"
                    onMouseDown={onMouseDown}
                    style={{
                        transform: `translate(${options.miniViewVisibleHandle.x}px, ${options.miniViewVisibleHandle.y}px)`,
                        // left: `${options.miniViewVisibleHandle.x}px`,
                        // top: `${options.miniViewVisibleHandle.y}px`,
                        width: options.miniViewVisibleHandle.width + 'px',
                        height: options.miniViewVisibleHandle.height + 'px',
                    }}
                ></div>
            </div>
        </div>
    );
};

export default RGMiniView;
