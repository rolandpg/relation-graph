import { RelationGraphInstance, RGCheckedItem, RGConnectingNode, RGCreatingLine, RGCreatingNode, RGEditingLine, RGEditingNodes, RGOptionsFull, RGSelectionView, RGViewInformation } from '../../../../types';
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
export declare const graphStoreMixin: {
    inject: {
        graphStore: {
            default: () => {
                graphInstance: RelationGraphInstance | null;
                options: RGOptionsFull;
            };
        };
    };
    computed: {
        graphInstance(): RelationGraphInstance;
        shouldRenderLines(): any;
        shouldRenderNodes(): any;
        shouldRenderFakeLines(): any;
        creatingLine(): RGCreatingLine;
        creatingNode(): RGCreatingNode;
        editingNodes(): RGEditingNodes;
        editingLine(): RGEditingLine;
        connectingNode(): RGConnectingNode;
        viewInformation(): RGViewInformation;
        selectionView(): RGSelectionView & {
            show: boolean;
        };
        checkedItem(): RGCheckedItem;
    };
};
