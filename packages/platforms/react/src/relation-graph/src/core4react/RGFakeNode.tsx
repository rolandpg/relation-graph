import React, {PropsWithChildren, useEffect, useRef} from 'react';
import type {RGNode} from "../../../../../../types";
import {useAutoUpdateView, useGraphInstance} from "../hooks/useGraphInstance";
import {useGraphStore} from "../hooks/useGraphStore";

const RGFakeNode: React.FC<PropsWithChildren<{
    node: RGNode
}>> = ({ node, children }) => {
    const nodePeelRef = useRef<HTMLDivElement>(null);
    const graphInstance = useGraphInstance();
    useAutoUpdateView();
    const {options} = useGraphStore();

    const borderWidth = node.borderWidth === undefined ? undefined : `${node.borderWidth}px`;
    const nodeWidth = node.width ? (node.width + 'px') : undefined;
    const nodeHeight = node.height ? (node.height + 'px') : undefined;
    useEffect(() => {
        graphInstance.addNodeResizeListener(nodePeelRef.current!, node);
        return () => {
            if (nodePeelRef.current) {
                graphInstance.removeNodeResizeListener(nodePeelRef.current);
            }
        };
    }, []);

    const onDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if ('button' in e && e.button !== 0) return; // Replicates .left modifier
        e.stopPropagation(); // Replicates .stop modifier
        graphInstance.onNodeDragStart(node, e.nativeEvent);
    };
    const peelClasses = [
        'rg-node-peel',
        node.selected && 'rg-node-selected',
        node.id === options.draggingNodeId  && 'rg-node-dragging',
        node.id === options.checkedNodeId && 'rg-node-checked',
        `rg-node-shape-${node.nodeShape === undefined ? 1 : node.nodeShape}`,
        `rg-node-type-${node.type}`,
        node.className,
    ].filter(Boolean).join(' ');

    const peelStyles: React.CSSProperties = {
        transform: `translate(${node.x}px, ${node.y}px)`,
        '--rg-node-z-index': node.zIndex,
        '--rg-node-opacity': node.opacity,
        pointerEvents: node.opacity === 0 ? 'none' : undefined,
        '--rg-node-color': node.color || options.defaultNodeColor,
        '--rg-node-font-color': node.fontColor,
        '--rg-node-font-size': node.fontSize ? `${node.fontSize}px` : undefined,
        '--rg-node-border-width': borderWidth,
        '--rg-node-width': nodeWidth,
        '--rg-node-height': nodeHeight,
        '--rg-node-border-radius': node.borderRadius ? `${node.borderRadius}px` : undefined,
        '--rg-node-border-color': node.borderColor,
    };

    return (
        <div
            ref={nodePeelRef}
            style={peelStyles}
            className={peelClasses}
            data-id={node.id}
        >
            <div
                className="rg-node"
                onMouseDown={onDragStart}
                onTouchStart={onDragStart}
            >
                {children || (
                    <div className="rg-node-text">
                        <span>{node.text}</span>
                    </div>
                )}
            </div>
        </div>
    );
};


export default RGFakeNode;
