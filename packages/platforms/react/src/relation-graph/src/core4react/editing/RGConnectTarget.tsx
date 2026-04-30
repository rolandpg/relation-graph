import React, {PropsWithChildren, useEffect, useRef} from 'react';
import {
    RGConnectTargetProps,
    RGInnerConnectTargetType,
    RGJunctionPoint
} from "../../../../../../../types";
import {useGraphInstance} from "../../hooks/useGraphInstance";

const RGConnectTarget: React.FC<PropsWithChildren<RGConnectTargetProps>> = ({
                                                             children,
                                                             className,
                                                             style,
                                                             forSvg,
                                                             domMode,
                                                             measureSelector,
                                                             strictMeasureTarget,
                                                             junctionPoint, targetId, targetType, targetData,
                                                             lineTemplate,
                                                             disableDrop, disableDrag,
                                                             onLineVertexBeDropped,
                                                             onDragConnectStart,
                                                         onDragConnectEnd
                                                         }) => {
    const graphInstance = useGraphInstance();
    const targetRef = useRef<SVGGElement | HTMLDivElement | null>(null);
    const actualJunctionPoint = junctionPoint || RGJunctionPoint.border;
    const normalizedDomMode = !forSvg && domMode === 'contents' ? 'contents' : 'wrap';
    const hostStyle = !forSvg && normalizedDomMode === 'contents' ? {
        ...(style || {}),
        display: 'contents'
    } : style;
    const setTargetRef = (element: SVGGElement | HTMLDivElement | null) => {
        targetRef.current = element;
    };
    useEffect(() => {
        if (!targetRef.current) {
            return;
        }
        graphInstance.registerConnectTarget({
            hostEl: targetRef.current,
            targetId,
            targetType: targetType || RGInnerConnectTargetType.CanvasPoint,
            junctionPoint: actualJunctionPoint,
            targetData,
            domMode: normalizedDomMode,
            measureSelector,
            strictMeasureTarget
        });
    }, [actualJunctionPoint, graphInstance, measureSelector, normalizedDomMode, strictMeasureTarget, targetData, targetId, targetType]);
    useEffect(() => {
        return () => {
            graphInstance.unregisterConnectTarget(targetId);
        }
    }, [graphInstance, targetId]);
    const onMouseUp = (type: RGJunctionPoint, event: React.MouseEvent) => {
        event.stopPropagation();
        if (disableDrop) {
            return;
        }
        graphInstance.onLineVertexBeDropped(type, event.nativeEvent, undefined, (fromNode, toNode, newLineJson) => {
            onLineVertexBeDropped && onLineVertexBeDropped(fromNode, toNode, newLineJson);
        });
    };
    const onMouseDown = ($event: React.MouseEvent) => {
        $event.stopPropagation();
        if (disableDrag) {
            return;
        }
        if (graphInstance.options.creatingLinePlot) {
            return;
        }
        const newLineJson = Object.assign({}, lineTemplate || {});
        const actualTargetType = graphInstance.getConnectTargetById(targetId)?.targetType || targetType || RGInnerConnectTargetType.NodePoint;
        if (!newLineJson.from) {
            newLineJson.from = targetId;
        }
        if (!newLineJson.fromType) {
            newLineJson.fromType = actualTargetType;
        }
        if (!newLineJson.fromJunctionPoint) {
            newLineJson.fromJunctionPoint = actualJunctionPoint;
        }
        onDragConnectStart && onDragConnectStart(newLineJson, $event.nativeEvent);
        graphInstance.startCreateLineFromNode(null, newLineJson, $event.nativeEvent, (from, to, newLine) => {
            onDragConnectEnd && onDragConnectEnd(from, to, newLine);
        });
    };
    return (
        forSvg ?
            <g
                ref={setTargetRef as React.Ref<SVGGElement>}
                className={`rg-connect-ctl-handler rg-connect-target ${className || ''}`}
                style={style}
                data-point={actualJunctionPoint}
                onMouseDown={(event) => onMouseDown(event)}
                onMouseUp={(event) => onMouseUp(actualJunctionPoint, event)}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                {children}
            </g>
            :
        <div
            ref={setTargetRef as React.Ref<HTMLDivElement>}
            className={`rg-connect-ctl-handler rg-connect-target ${className || ''}`}
            style={hostStyle}
            data-point={actualJunctionPoint}
            onMouseDown={(event) => onMouseDown(event)}
            onMouseUp={(event) => onMouseUp(actualJunctionPoint, event)}
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            {children}
        </div>
    );
};

export default RGConnectTarget;
