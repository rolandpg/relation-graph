import { useGraphInstance, useAutoUpdateView } from './useGraphInstance';
import { useRelationGraph } from './useRelationGraph';
import { useCheckedItem, useConnectingNode, useEditingLine, useEditingNodes, useGraphStore, useSelection, useViewInformation, useCreatingLine, useCreatingNode } from './useGraphStore';
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
    useRelationGraph: typeof useRelationGraph;
    useGraphInstance: typeof useGraphInstance;
    useAutoUpdateView: typeof useAutoUpdateView;
    useCreatingLine: typeof useCreatingLine;
    useCreatingNode: typeof useCreatingNode;
    useEditingNodes: typeof useEditingNodes;
    useEditingLine: typeof useEditingLine;
    useViewInformation: typeof useViewInformation;
    useSelection: typeof useSelection;
    useConnectingNode: typeof useConnectingNode;
    useCheckedItem: typeof useCheckedItem;
    useGraphStore: typeof useGraphStore;
};
