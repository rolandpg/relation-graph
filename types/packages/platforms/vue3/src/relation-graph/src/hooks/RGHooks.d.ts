import { useGraphInstance } from './useGraphInstance';
import { useRelationGraph } from './useRelationGraph';
import { useGraphOptions, useGraphStore, useCreatingLine, useCreatingNode, useEditingNodes, useEditingLine, useViewInformation, useSelection, useConnectingNode, useCheckedItem } from './useGraphStore';
import { useGraphData } from './useGraphData';
/**
 *  By introducing graphStoreMixin through mixins here, you can get the following objects in the options component through this
 * - this.graphInstance : Used to call various APIs provided by the graph
 * The following are reactive state objects that allow you to interact with your UI
 * - this.creatingLine : The line object currently being created
 * - this.creatingNode : The node object currently being created
 * - this.editingNodes : The list of node objects currently being edited
 * - this.editingLine : The line object currently being edited
 * - this.connectingNode : The node object currently being connected
 * - this.viewInformation : The current view information object
 * - this.selectionView : The current selected area view object
 * - this.checkedItem : The currently selected graphic object
 */
export declare const RGHooks: {
    useGraphInstance: typeof useGraphInstance;
    useRelationGraph: typeof useRelationGraph;
    useGraphStore: typeof useGraphStore;
    useGraphData: typeof useGraphData;
    useGraphOptions: typeof useGraphOptions;
    useCreatingLine: typeof useCreatingLine;
    useCreatingNode: typeof useCreatingNode;
    useEditingNodes: typeof useEditingNodes;
    useEditingLine: typeof useEditingLine;
    useViewInformation: typeof useViewInformation;
    useSelection: typeof useSelection;
    useConnectingNode: typeof useConnectingNode;
    useCheckedItem: typeof useCheckedItem;
};
