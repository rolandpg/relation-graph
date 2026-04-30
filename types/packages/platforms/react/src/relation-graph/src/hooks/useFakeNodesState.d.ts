import { RGNode } from '../../../../../../types';
import { Dispatch, SetStateAction } from 'react';
export type OnNodesChange<NodeType extends RGNode = RGNode> = (changedNodes: NodeType[]) => void;
export declare function useFakeNodesState<NodeType extends RGNode>(initialNodes: NodeType[]): [
    nodes: NodeType[],
    setNodes: Dispatch<SetStateAction<NodeType[]>>,
    onNodesChange: OnNodesChange<NodeType>
];
