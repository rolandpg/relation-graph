import {RGNode} from "../../../../../../types";
import {Dispatch, SetStateAction, useCallback, useState} from "react";

export type OnNodesChange<NodeType extends RGNode = RGNode> = (changedNodes: NodeType[]) => void;

export function useFakeNodesState<NodeType extends RGNode>(
    initialNodes: NodeType[]
): [
    nodes: NodeType[],
    setNodes: Dispatch<SetStateAction<NodeType[]>>,
    onNodesChange: OnNodesChange<NodeType>
] {
    const [nodes, setNodes] = useState(initialNodes);
    const onNodesChange: OnNodesChange<NodeType> = useCallback(
        (changedNodes) => {
            return setNodes(changedNodes);
        },
        []
    );

    return [nodes, setNodes, onNodesChange];
}
