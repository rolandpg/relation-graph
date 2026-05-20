import { RGLayout, RGLayoutOptions, RGNode } from '../../types';
import { RelationGraphWith6Effect } from './RelationGraphWith6Effect';
/**
 * Methods related to layout in the relation-graph component
 */
export declare class RelationGraphWith6Layout extends RelationGraphWith6Effect {
    constructor();
    /**
     * Assign positions to the nodes in the current graph based on the layout configuration set in the options
     * - By default, the first node in the graph is used as the root node for layout. You can also specify a custom root node by passing a node object or node id as a parameter.
     * - If nodes were added to the graph shortly before calling this method, it will wait for a short time to ensure that the addition of nodes is completed before performing the layout.
     * @param customRootNode Optional, specify a custom root node for layout, can be a node object or node id
     * @return Promise<void>
     */
    doLayout(customRootNode?: RGNode | string): Promise<void>;
    private _layoutTimer;
    private _layoutPromise;
    private _layoutResolve;
    private _layoutReject;
    /**
     * Immediately assign positions to the nodes in the current graph based on the layout configuration set in the options
     * - By default, the first node in the graph is used as the root node for layout. You can also specify a custom root node by passing a node object or node id as a parameter.
     * - Unlike doLayout, this method directly performs the layout logic without the outer scheduling, merge, or delay handling.
     * @param customRootNode Optional, specify a custom root node for layout, can be a node object or node id
     * @return Promise<void>
     */
    _doLayout(customRootNode?: RGNode | string): Promise<void>;
    /**
     * @inner
     * @protected
     * @param doLayout
     */
    refresh(doLayout?: boolean): Promise<void>;
    /**
     * @inner
     * @private
     */
    private placeOtherNodes;
    /**
     * @inner
     * @private
     */
    private placeSingleNodes;
    /**
     * @inner
     * @private
     */
    private sortGroups;
    /**
     * @inner
     * @private
     */
    private placeNextNetwork;
    /**
     * If the current layout is force-directed, you can call this method to start or stop the real-time force-directed calculation
     * - Note: The center layout inherits the force layout and also supports auto layout functionality.
     */
    toggleAutoLayout(): void;
    layoutor: RGLayout | undefined;
    /**
     * If the current layout is force, you can call this method to start the force-directed calculation
     * - Note: The center layout inherits the force layout and also supports auto layout functionality.
     */
    startAutoLayout(): void;
    /**
     * If the current layout is force, you can call this method to stop the force-directed calculation
     */
    stopAutoLayout(): void;
    /**
     * Create a layout instance. After creating the layout instance, you can use the placeNodes method of the layout instance to layout nodes.
     * - Through this method, you can create multiple layout instances with different configurations to layout different nodes of the same graph in different ways, forming a composite layout effect.
     * - Example:
     * ```ts
     * const layoutor = graphInstance.createLayout({
     *    layoutName: 'tree',
     *    from: 'left', // left, right, top, bottom
     *    treeNodeGapH: 200, // Horizontal spacing between nodes
     *    treeNodeGapV: 50, // Vertical spacing between nodes
     * });
     * layoutor.placeNodes(nodes, rootNode);
     * ```
     * @param layoutOptions Layout configuration items, type: RGLayoutOptions. When isMainLayout is true, the configuration items here will override the layout configuration items in the overall configuration items of the graph.
     * @param isMainLayout Whether it is the main layout instance. The main layout instance will affect the layout-related configuration items of the graph, and can control the auto layout function through the startAutoLayout and stopAutoLayout methods of the graph. Default value: false
     * @return Layout instance A layout instance with a placeNodes method
     *
     */
    createLayout<Layout extends RGLayout>(layoutOptions: RGLayoutOptions, isMainLayout?: boolean): Layout;
    setLayoutor(layoutor: RGLayout, isMainLayout: boolean, supportAutoLayout?: boolean): void;
}
