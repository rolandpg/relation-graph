import {
    RelationGraphInstance, RGCheckedItem,
    RGConnectingNode,
    RGCreatingLine,
    RGCreatingNode,
    RGEditingLine,
    RGEditingNodes,
    RGOptionsFull,
    RGSelectionView,
    RGViewInformation
} from "../../../../types";

function assertGraphStore(graphStore: any) {
    if (!graphStore || !graphStore.graphInstance) {
        throw new Error('Components using graphStoreMixin must be placed inside RGProvider or RelationGraph component.');
    }
}

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
export const graphStoreMixin = {
    inject: {
        graphStore: {
            default: () => ({
                graphInstance: null as RelationGraphInstance | null,
                options: {} as RGOptionsFull
            })
        }
    },
    computed: {
        graphInstance(): RelationGraphInstance {
            assertGraphStore(this.graphStore);
            return this.graphStore.graphInstance;
        },
        shouldRenderLines() {
            assertGraphStore(this.graphStore);
            return this.graphInstance.dataStores.shouldRenderLines;
        },
        shouldRenderNodes() {
            assertGraphStore(this.graphStore);
            return this.graphInstance.dataStores.shouldRenderNodes;
        },
        shouldRenderFakeLines() {
            assertGraphStore(this.graphStore);
            return this.graphInstance.dataStores.shouldRenderFakeLines;
        },
        // graphOptions() {
        //     return this.graphStore.options;
        // },
        creatingLine(): RGCreatingLine {
            assertGraphStore(this.graphStore);
            return this.graphStore.graphInstance.getCreatingLine(this.graphStore.options);
        },
        creatingNode(): RGCreatingNode {
            assertGraphStore(this.graphStore);
            return this.graphStore.graphInstance.getCreatingNode(this.graphStore.options);
        },
        editingNodes(): RGEditingNodes {
            assertGraphStore(this.graphStore);
            return this.graphStore.options.editingController;
        },
        editingLine(): RGEditingLine {
            assertGraphStore(this.graphStore);
            return this.graphStore.options.editingLineController;
        },
        connectingNode(): RGConnectingNode {
            assertGraphStore(this.graphStore);
            return this.graphStore.options.nodeConnectController;
        },
        viewInformation(): RGViewInformation {
            assertGraphStore(this.graphStore);
            const options = this.graphStore.options;
            return {
                viewSize: options.viewSize,
                canvasSize: options.canvasSize,
                canvasOffset: options.canvasOffset,
                canvasZoom: options.canvasZoom,
                fullscreen: options.fullscreen,
                showEasyView: options.showEasyView
            };
        },
        selectionView(): RGSelectionView & { show: boolean } {
            const options = this.graphStore.options;
            return {
                ...options.selectionView,
                show: options.creatingSelection
            };
        },
        checkedItem(): RGCheckedItem {
            const options = this.graphStore.options;
            return {
                checkedLineId: options.checkedLineId,
                checkedNodeId: options.checkedNodeId,
                draggingNodeId: options.draggingNodeId
            };
        }
    }
};
