import React, {PropsWithChildren, useEffect, useState, useRef} from 'react';
import {
    RGEditingLineControllerProps,
    RGLineEditPoint,
    RGCtrlPointForLine44,
    RGLine,
    RGNode,
    RGPosition,
    JsonLine, type RGLineTarget
} from '../../../../../../../types';
import {useAutoUpdateView, useGraphInstance} from "../../hooks/useGraphInstance";
import {useGraphStore} from "../../hooks/useGraphStore";

const RGEditingLineController: React.FC<PropsWithChildren<RGEditingLineControllerProps>> = ({
                                                                             textEditable = true,
                                                                             pathEditable = true,
                                                                             onMoveLineVertexStart,
                                                                             onMoveLineVertexEnd,
                                                                             onLineTextDragEnd,
                                                                             onLineTextChanged,
                                                                             onLinePathChanged,
                                                                             children
                                                                         }) => {
    const graphInstance = useGraphInstance();
    useAutoUpdateView();
    const {options} = useGraphStore();
    const editingLineController = options.editingLineController;
    const editingLine = editingLineController.line;
    const show = editingLineController.show;
    const text = editingLine && editingLine.text;

    const [editing, setEditing] = useState(false);
    const [lineText, setLineText] = useState('');
    const prevClickTime = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!show) {
            setEditing(false);
        }
    }, [show]);

    useEffect(() => {
        if (text !== lineText) {
            setLineText(text || '');
        }
    }, [text]);

    useEffect(() => {
        graphInstance.updateEditingLineView();
    }, [lineText, editingLine?.lineShape]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    const onMouseDown = (type: RGLineEditPoint, event: React.MouseEvent) => {
        if (!editingLine) return;
        onMoveLineVertexStart && onMoveLineVertexStart(type, editingLine);
        graphInstance.startMoveLineVertex(type, event.nativeEvent, (fromNode: RGNode | RGLineTarget | RGPosition, toNode: RGNode | RGLineTarget | RGPosition, newLineJson?: JsonLine) => {
            onMoveLineVertexEnd && onMoveLineVertexEnd(fromNode, toNode, newLineJson);
            graphInstance.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
        });
    };

    const onCtrlPointMouseDown = (ctrlPointIndex: number, event: React.MouseEvent) => {
        graphInstance.startMoveLine6CtrlPoint(ctrlPointIndex, event.nativeEvent, (line) => {
            onLinePathChanged && onLinePathChanged(line, ctrlPointIndex);
        });
    };

    const onLine44CtrlPointMouseDown = (split: RGCtrlPointForLine44, event: React.MouseEvent) => {
        graphInstance.startMoveLine44CtrlPoint(split, event.nativeEvent, (line) => {
            onLinePathChanged && onLinePathChanged(line, split);
        });
    };

    const startMoveText = (event: React.MouseEvent) => {
        graphInstance.startMoveLineText(event.nativeEvent, () => {
            if (editingLine) {
                onLineTextDragEnd && onLineTextDragEnd(editingLine);
            }
        });
    };

    const startEditingLineText = () => {
        if (prevClickTime.current && (Date.now() - prevClickTime.current) < 500) {
            setEditing(true);
        }
        prevClickTime.current = Date.now();
    };

    const onLineTextChange = (event: React.FocusEvent<HTMLInputElement>) => {
        if (editingLine && editingLine.text !== event.target.value) {
            graphInstance.updateLine(editingLine.id, {
                text: event.target.value,
            });
            setLineText(event.target.value);
            onLineTextChanged && onLineTextChanged(editingLine);
        }
        setEditing(false);
    };

    if (!show || !editingLine) {
        return null;
    }

    const { startPoint, endPoint, ctrlPoint1, ctrlPoint2, line44Splits } = editingLineController;
    const { lineShape } = editingLine;

    const ctrlPoint1SvgPath = `M ${startPoint.x} ${startPoint.y} L ${ctrlPoint1?.x || 0} ${ctrlPoint1?.y || 0}`;
    const ctrlPoint2SvgPath = `M ${endPoint.x} ${endPoint.y} L ${ctrlPoint2?.x || 0} ${ctrlPoint2?.y || 0}`;

    return (
        <div className="rg-editing-line-ctrl">
            {children}
            {pathEditable && <svg className="rg-edt-ctrl-svg" xmlns="http://www.w3.org/2000/svg">
                <g>
                    {lineShape === 6 && ctrlPoint1 && <path d={ctrlPoint1SvgPath}/>}
                    {lineShape === 6 && ctrlPoint2 && <path d={ctrlPoint2SvgPath}/>}
                </g>
            </svg>}
            <div
                className="rg-line-ctrl-dot start-dot"
                style={{
                    '--rg-ctl-x': startPoint.x + 'px',
                    '--rg-ctl-y': startPoint.y + 'px'
                }}
                onMouseDown={(event) => onMouseDown('start', event)}
            ></div>
            <div
                className="rg-line-ctrl-dot end-dot"
                style={{
                    '--rg-ctl-x': endPoint.x + 'px',
                    '--rg-ctl-y': endPoint.y + 'px'
                }}
                onMouseDown={(event) => onMouseDown('end', event)}
            ></div>
            {pathEditable && lineShape === 6 && ctrlPoint1 && (
                <div
                    className="rg-line-ctrl-dot ctrl-dot"
                    style={{
                        '--rg-ctl-x': ctrlPoint1.x + 'px',
                        '--rg-ctl-y': ctrlPoint1.y + 'px'
                    }}
                    onMouseDown={(event) => onCtrlPointMouseDown(0, event)}
                ></div>
            )}
            {pathEditable && lineShape === 6 && ctrlPoint2 && (
                <div
                    className="rg-line-ctrl-dot ctrl-dot"
                    style={{
                        '--rg-ctl-x': ctrlPoint2.x + 'px',
                        '--rg-ctl-y': ctrlPoint2.y + 'px'
                    }}
                    onMouseDown={(event) => onCtrlPointMouseDown(1, event)}
                ></div>
            )}
            {pathEditable && (lineShape === 44 || lineShape === 49) && line44Splits.map(split => (
                !split.hide && <div
                    key={split.optionName}
                    className={`rg-line-ctrl-dot ctrl-split ${!split.optionName.startsWith('cp-') ? 'ctrl-split-core' : ''} ${split.direction === 'v' ? 'ctrl-split-v' : ''} ${split.direction === 'h' ? 'ctrl-split-h' : ''}`}
                    style={{
                        '--rg-ctl-x': split.x + 'px',
                        '--rg-ctl-y': split.y + 'px'
                    }}
                    onMouseDown={(event) => onLine44CtrlPointMouseDown(split, event)}
                ></div>
            ))}
            {textEditable && editingLine && (
                <div
                    className={['rg-line-ctrl-text', (editing && 'rg-line-ctrl-text-editing')].filter(Boolean).join(' ')}
                    style={{
                        '--rg-ctl-x': editingLineController.text.x + 'px',
                        '--rg-ctl-y': editingLineController.text.y + 'px'
                    }}
                    onClick={startEditingLineText}
                    onMouseDown={startMoveText}
                >
                    {!editing ? (
                        lineText ? <p>{lineText}</p> : <p className="empty-text">Add Text...</p>
                    ) : (
                        <input
                            ref={inputRef}
                            className="rg-line-text-input"
                            value={lineText}
                            onChange={(event) => setLineText(event.target.value)}
                            onBlur={onLineTextChange}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default RGEditingLineController;
