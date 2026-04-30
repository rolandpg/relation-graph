import React, {MutableRefObject, useEffect, useRef} from 'react';
import RGNodeExpandHolder from './RGNodeExpandHolder';
import {RGNodeExpandHolderProps} from '../../../types-react';
import {useGraphInstance} from "../hooks/useGraphInstance";
import {RGNode, RGNodeSlotProps} from "../../../../../../types";

export type RGNodeProps = {
    nodeProps: RGNode
    nodeSlot?: React.FC<RGNodeSlotProps> | ((props: RGNodeSlotProps) => React.ReactNode)
    nodeExpandButtonSlot?: React.FC<RGNodeExpandHolderProps> | ((props: RGNodeExpandHolderProps) => React.ReactNode)
    defaultExpandHolderPosition?: string,
    dragging?: boolean,
    checked?: boolean,
};
const RGNodePeel: React.FC<RGNodeProps> = (
    {
        nodeProps, nodeSlot, nodeExpandButtonSlot,
        defaultExpandHolderPosition,
        dragging,
        checked
    }
) => {
    const graphInstance = useGraphInstance();
    const nodePeelRef = useRef() as MutableRefObject<HTMLDivElement>;
    useEffect(() => {
        graphInstance.addNodeResizeListener(nodePeelRef.current, nodeProps);
        return () => {
            nodePeelRef.current && graphInstance.removeNodeResizeListener(nodePeelRef.current);
        };
    }, []);
    const expandOrCollapseNode = async (e: React.MouseEvent | React.TouchEvent) => {
        graphInstance.expandOrCollapseNode(nodeProps, e.nativeEvent);
    };

    const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (e.type === "mousedown" && e.button !== 0) {
            return;
        }
        e.stopPropagation();
        graphInstance.onNodeDragStart(nodeProps, e.nativeEvent);
    };
    const nodeWidth = nodeProps.width ? (nodeProps.width + 'px') : undefined;
    const nodeHeight = nodeProps.height ? (nodeProps.height + 'px') : undefined;
    const borderWidth = nodeProps.borderWidth === undefined ? undefined : (nodeProps.borderWidth + 'px');
    const borderColor = nodeProps.borderColor;
    const opacity = nodeProps.opacity;
    const showNode = nodeProps.rgCalcedVisibility;
    const expandButtonPosition = nodeProps.expandHolderPosition || defaultExpandHolderPosition || 'hide';
    const showExpandHolder = (nodeProps.expandHolderPosition && nodeProps.expandHolderPosition !== 'hide') || ( defaultExpandHolderPosition !== 'hide' && nodeProps.rgChildrenSize > 0);
    return (
        <div
            ref={nodePeelRef}
            style={{
                display: showNode ? undefined : 'none',
                '--rg-node-z-index': nodeProps.zIndex ? nodeProps.zIndex : undefined,
                pointerEvents: opacity === 0 ? 'none' : undefined,
                transform: `translate(${nodeProps.x}px, ${nodeProps.y}px)`,
                '--rg-node-color': nodeProps.color,
                '--rg-node-font-color': nodeProps.fontColor,
                '--rg-node-font-size': nodeProps.fontSize ? (nodeProps.fontSize + 'px') : undefined,
                '--rg-node-border-width': borderWidth,
                '--rg-node-border-radius': nodeProps.borderRadius && (nodeProps.borderRadius + 'px'),
                '--rg-node-border-color': borderColor,
                '--rg-node-width': nodeWidth,
                '--rg-node-height': nodeHeight,
                '--rg-node-opacity': nodeProps.opacity === undefined ? undefined : nodeProps.opacity,
            }}
            className={[
                'rg-node-peel',
                (nodeProps.selected && 'rg-node-selected'),
                (dragging && 'rg-node-dragging'),
                (checked && 'rg-node-checked'),
                `rg-node-shape-${nodeProps.nodeShape === undefined ? 1 : nodeProps.nodeShape}`,
                `rg-node-type-${nodeProps.type}`,
                nodeProps.className,
                ((nodeProps.disablePointEvent || nodeProps.opacity === 0) && 'rg-node-disable-events')
            ].filter(Boolean).join(' ')}
            data-id={nodeProps.id}
        >
            {showExpandHolder &&
                (
                    nodeExpandButtonSlot ?
                        nodeExpandButtonSlot({
                            node: nodeProps,
                            expandOrCollapseNode,
                            expandHolderPosition: expandButtonPosition
                        }) : <RGNodeExpandHolder
                            node={nodeProps}
                            expandOrCollapseNode={expandOrCollapseNode}
                            expandHolderPosition={expandButtonPosition}
                        />
                )
            }
            <div
                className={`rg-node`}
                onMouseDown={(e) => {
                    onDragStart(e);
                }}
                onTouchStart={(e) => {
                    onDragStart(e);
                }}
            >
                {
                    nodeSlot ? nodeSlot({node: nodeProps, defaultExpandHolderPosition, checked, dragging}) :
                        <div
                            className="rg-node-text"
                        >
                            <span>{nodeProps.text}</span>
                        </div>
                }
            </div>
        </div>
    );
};

export default RGNodePeel;
