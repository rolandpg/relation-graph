import {devLog, sleep} from '../utils/RGCommon';
import RGForceLayout from '../layouts/RGForceLayout';
import {RGEventNames, RGLayout, RGLayoutOptions, RGNode} from '../../types';
import RGTreeLayout from "../layouts/RGTreeLayout";
import RGCenterLayout from "../layouts/RGCenterLayout";
import RGCircleLayout from "../layouts/RGCircleLayout";
import RGFixedLayout from "../layouts/RGFixedLayout";
import RGSmartTreeLayout from "../layouts/RGSmartTreeLayout";
import RGFolderLayout from "../layouts/RGFolderLayout";
import {RelationGraphWith6Effect} from "./RelationGraphWith6Effect";
import {appendDefaultOptions4Layout} from "../data/RGOptionsDataUtils";
import RGIOTreeLayout from "../layouts/RGIOTreeLayout";
import {rgSimpleGridLayout} from "../utils/RGGraphMath";

/**
 * Methods related to layout in the relation-graph component
 */
export class RelationGraphWith6Layout extends RelationGraphWith6Effect {
    constructor() {
        super();
    }

    /**
     * Assign positions to the nodes in the current graph based on the layout configuration set in the options
     * - By default, the first node in the graph is used as the root node for layout. You can also specify a custom root node by passing a node object or node id as a parameter.
     * - If nodes were added to the graph shortly before calling this method, it will wait for a short time to ensure that the addition of nodes is completed before performing the layout.
     * @param customRootNode Optional, specify a custom root node for layout, can be a node object or node id
     * @return Promise<void>
     */
    async doLayout(customRootNode?: RGNode | string) {
        const _t = Date.now() - this.prevAddNodeTimestamp;

        if (_t < 300) {
            this.dataProvider.updateOptions({ canvasOpacity: 0.01 });
            this._dataUpdated();
            await sleep(300 - _t);
        }

        if (!this._layoutPromise) {
            this._layoutPromise = new Promise<void>((resolve, reject) => {
                this._layoutResolve = resolve;
                this._layoutReject = reject;
            });
        }

        clearTimeout(this._layoutTimer);
        this._layoutTimer = setTimeout(async () => {
            let hasLayoutError = false;
            let layoutError: unknown;
            try {
                await this._doLayout(customRootNode);
            } catch (error) {
                hasLayoutError = true;
                layoutError = error;
            } finally {
                this.dataProvider.updateOptions({ canvasOpacity: 1 });
                this._dataUpdated();
                if (hasLayoutError) {
                    this._layoutReject?.(layoutError);
                } else {
                    this._layoutResolve?.();
                }
                this._layoutResolve = null;
                this._layoutReject = null;
                this._layoutPromise = null;
            }
        }, 50);

        return this._layoutPromise;
    }
    private _layoutTimer: any = null;
    private _layoutPromise: Promise<void> | null = null;
    private _layoutResolve: (() => void) | null = null;
    private _layoutReject: ((reason?: unknown) => void) | null = null;
    /**
     * Immediately assign positions to the nodes in the current graph based on the layout configuration set in the options
     * - By default, the first node in the graph is used as the root node for layout. You can also specify a custom root node by passing a node object or node id as a parameter.
     * - Unlike doLayout, this method directly performs the layout logic without the outer scheduling, merge, or delay handling.
     * @param customRootNode Optional, specify a custom root node for layout, can be a node object or node id
     * @return Promise<void>
     */
    public async _doLayout(customRootNode?: RGNode | string) {
        this.updateNodesVisibleProperty();
        const allNodes = this.getNodes();
        devLog('node size：', allNodes.length);
        let rootNode = this.dataProvider.getRootNode();
        if (customRootNode) {
            rootNode = typeof customRootNode === 'string' ? this.getNodeById(customRootNode as string) : customRootNode;
        }
        if (!rootNode) {
            rootNode = allNodes[0];
            if (!this._rgAsConnectArea) {
                devLog('[relation-graph]No root node, use first node as root:', rootNode);
                devLog('[relation-graph]You can set rootNode call doLayout(rootNode | nodeId) with a node id');
            }
        }
        if (!rootNode) {
            throw new Error('custom rootNode not found, id:' + customRootNode);
        }
        const options = this.getOptions();
        this.dataProvider.setRootNodeId(rootNode ? rootNode.id : '');
        this.stopAutoLayout();
        const layoutor = this.createLayout<RGForceLayout>(options.layout, true);
        if (layoutor.layoutOptions.layoutName === 'force') {
            layoutor.isMainLayouer = true;
            layoutor.onFinish(() => {
                this.emitEvent(RGEventNames.onForceLayoutFinish);
            });
            await sleep(100);
            devLog('doLayout:start force:', allNodes.length);
            layoutor.placeNodes(allNodes, rootNode!);
        } else {
            this.enableNodeXYAnimation();
            let mainGroupNodes: RGNode[] = [];
            if (rootNode) {
                mainGroupNodes = this.getNetworkNodesByNode(rootNode);
                layoutor.placeNodes(mainGroupNodes, rootNode);
            }
            devLog('doLayout:placeOtherNodes:all:', allNodes.length, 'mainGroupNodes:', mainGroupNodes.length);
            this.placeOtherNodes(mainGroupNodes);
            setTimeout(()=> {
                this.disableNodeXYAnimation();
            }, 300);
            devLog('doLayout:placeOtherNodes ok!');
        }
        allNodes.forEach(node => this.dataProvider.updateNode(node.id, {
            x: node.x || 0,
            y: node.y || 0,
            rgChildrenSize: node.rgChildrenSize || 0,
        }));
        this.updateElementLines();
    }

    /**
     * @inner
     * @protected
     * @param doLayout
     */
    async refresh(doLayout = true) {
        this.resetViewSize(true);
        this._dataUpdated();
        if (doLayout) {
            await this.doLayout();
        }
        this.updateElementLines();
        this._dataUpdated();
    }

    /**
     * @inner
     * @private
     */
    private placeOtherNodes(mainGroupNodes: RGNode[] = []) {
        const options = this.getOptions();
        if (options.layout.layoutName === 'fixed') {
            return;
        }
        const placeOtherGroup = options.placeOtherGroup;
        if (!placeOtherGroup) {
            return;
        }
        const notInMainGroupNodes: RGNode[] = [];
        const singleNodes: RGNode[] = [];
        const allNodes = this.getNodes();
        allNodes.forEach((thisNode) => {
            if (thisNode.fixed === true) {
                return;
            }
            if (mainGroupNodes.includes(thisNode)) {
                return;
            }
            const relatedNodes = this.getNodeRelatedNodes(thisNode);
            if (relatedNodes.length === 0) {
                singleNodes.push(thisNode);
            } else {
                notInMainGroupNodes.push(thisNode);
            }
        });
        devLog('doLayout:allNodes:', allNodes.length);
        devLog('doLayout:mainGroupNodes:', mainGroupNodes.length);
        devLog('doLayout:notInMainGroupNodes:', notInMainGroupNodes.length);
        devLog('doLayout:singleNodes:', singleNodes.length);
        const groupList: {nodes: RGNode[]}[] = [{nodes: mainGroupNodes}];
        this.placeNextNetwork(notInMainGroupNodes, [...mainGroupNodes], groupList);
        this.placeSingleNodes(singleNodes);
        groupList.push({nodes: singleNodes});
        this.sortGroups(groupList);
        this._dataUpdated();
    }

    /**
     * @inner
     * @private
     */
    private placeSingleNodes(singleNodes: RGNode[]) {
        if (singleNodes.length > 0) {
            const columns = Math.ceil(Math.sqrt(singleNodes.length));
            const gap = 30;
            rgSimpleGridLayout(
                columns,
                gap,
                singleNodes.map(n => ({width: n.el_W, height: n.el_H, node: n})),
                (item, x, y) => {
                    const node = item.node;
                    node.x = x;
                    node.y = y;
                    if (!node.lot) node.lot = {childs: []};
                }
            );
            devLog('[placeSingleNodes]Single nodes:', singleNodes.length);
        }
    }

    /**
     * @inner
     * @private
     */
    private sortGroups(groupList: {nodes: RGNode[]}[]) {
        devLog('[placeSingleNodes]sortGroups groupList:', groupList.length, groupList.map(n => n.nodes.length));
        const groupsAsNodes = groupList.map(group => {
            const groupViewBox = this.getNodesRectBox(group.nodes);
            return {
                width: groupViewBox.width,
                height: groupViewBox.height,
                nodes: group.nodes,
                orignX: groupViewBox.minX,
                orignY: groupViewBox.minY,
            }
        });
        if (groupsAsNodes.length === 0) {
            return;
        }
        const columns = Math.floor(Math.sqrt(groupsAsNodes.length)) || 1;
        const gap = 100;
        rgSimpleGridLayout(
            columns,
            gap,
            groupsAsNodes,
            (item, x, y) => {
                const buffX = x - item.orignX;
                const buffY = y - item.orignY;
                devLog(`[placeNextNetwork]Move ${item.nodes.length} Nodes :`, buffX, buffY, item, ' > ');
                for (const node of item.nodes) {
                    this.updateNodePosition(node, node.x + buffX, node.y + buffY);
                }
            },
            groupsAsNodes[0].orignX,
            groupsAsNodes[0].orignY
        );
    }

    /**
     * @inner
     * @private
     */
    private placeNextNetwork(notPlacedNodes: RGNode[], placedNodes: RGNode[], groupList: {nodes: RGNode[]}[]) {
        if (notPlacedNodes.length > 0) {
            const options = this.getOptions();
            devLog('[placeNextNetwork]notPlacedNodes nodes:', notPlacedNodes.length);
            const currentLayoutOptionsClone = JSON.parse(JSON.stringify(options.layout));
            const newRootNode = notPlacedNodes[0];
            const currentLayoutClone = this.createLayout(currentLayoutOptionsClone);
            currentLayoutClone.isMainLayouer = false;
            devLog('[placeNextNetwork]layoutName:', currentLayoutClone.layoutOptions.layoutName, 'root:', newRootNode.text);
            if (currentLayoutClone.layoutOptions.layoutName === 'force') {
                const forceLayout = currentLayoutClone as RGForceLayout;
                forceLayout.maxLayoutTimes = 0;
            }
            if (!newRootNode.fixed) {
                this.updateNodePosition(newRootNode, 0, 0);
                devLog('[placeNextNetwork]set root x,y:', newRootNode.x, newRootNode.y, newRootNode.text);
            } else {
                devLog('[placeNextNetwork]fixed root x,y:', newRootNode.x, newRootNode.y, newRootNode.text);
            }
            currentLayoutClone.layoutOptions.fixedRootNode = true;
            const thisGroupNodes = this.getNetworkNodesByNode(newRootNode);
            devLog('[placeNextNetwork]thisNetworkNodes:', notPlacedNodes.length);
            currentLayoutClone.placeNodes(thisGroupNodes, newRootNode);
            placedNodes.push(...thisGroupNodes);
            groupList.push({nodes: thisGroupNodes});
            const nextGroup: RGNode[] = [];
            notPlacedNodes.forEach((thisNode) => {
                if (!placedNodes.includes(thisNode)) {
                    nextGroup.push(thisNode);
                }
            });
            if (options.placeOtherGroup) this.placeNextNetwork(nextGroup, placedNodes, groupList);
            this._dataUpdated();
        } else {
            devLog('[placeOtherGroup]thisGroupNodes:all is OK!');
        }
    }

    /**
     * If the current layout is force-directed, you can call this method to start or stop the real-time force-directed calculation
     * - Note: The center layout inherits the force layout and also supports auto layout functionality.
     */
    toggleAutoLayout() {
        const options = this.getOptions();
        devLog('toggleAutoLayout:to:', options.layout.autoLayouting);
        if (options.layout.autoLayouting) {
            this.stopAutoLayout();
        } else {
            this.startAutoLayout();
        }
    }

    public layoutor: RGLayout | undefined;

    /**
     * If the current layout is force, you can call this method to start the force-directed calculation
     * - Note: The center layout inherits the force layout and also supports auto layout functionality.
     */
    startAutoLayout() {
        if (this.layoutor?.start) {
            devLog('Start force layout:' + this.layoutor.instanceId);
            this.layoutor.start();
        }
    }

    /**
     * If the current layout is force, you can call this method to stop the force-directed calculation
     */
    stopAutoLayout() {
        if (this.layoutor?.stop) {
            devLog('Stop force layout:' + this.layoutor.instanceId);
            this.layoutor.stop();
        }
    }

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
    createLayout<Layout extends RGLayout>(layoutOptions: RGLayoutOptions, isMainLayout = false): Layout {
        devLog('########createLayout:', layoutOptions)
        const _options = this.getOptions();
        appendDefaultOptions4Layout(layoutOptions);
        let layoutor: RGLayout | null = null;
        if (layoutOptions.layoutName === 'tree') {
            layoutor = new RGTreeLayout(layoutOptions, _options, this);
        } else if (layoutOptions.layoutName === 'center') {
            layoutor = new RGCenterLayout(layoutOptions, _options, this);
        } else if (layoutOptions.layoutName === 'circle') {
            layoutor = new RGCircleLayout(layoutOptions, _options, this);
        } else if (layoutOptions.layoutName === 'force') {
            layoutor = new RGForceLayout(layoutOptions, _options, this);
            // layoutor = new RGForceLayoutV2(layoutOptions, _options, this);
        } else if (layoutOptions.layoutName === 'fixed') {
            layoutor = new RGFixedLayout(layoutOptions, _options, this);
        } else if (layoutOptions.layoutName === 'smart-tree') {
            layoutor = new RGSmartTreeLayout(layoutOptions, _options, this);
        } else if (layoutOptions.layoutName === 'io-tree') {
            layoutor = new RGIOTreeLayout(layoutOptions, _options, this);
        } else if (layoutOptions.layoutName === 'folder') {
            layoutor = new RGFolderLayout(layoutOptions, _options, this);
        }
        if (!layoutor) {
            throw new Error('unknown layout: ' + layoutOptions.layoutName);
        }
        devLog('########supportAutoLayout:', layoutor.autoLayout !== undefined, layoutOptions.disableAsForceLayout)
        this.setLayoutor(layoutor, isMainLayout, (layoutor.autoLayout !== undefined) && layoutOptions.disableAsForceLayout !== true);
        return layoutor;
    };
    setLayoutor(layoutor: RGLayout, isMainLayout: boolean, supportAutoLayout = false) {
        layoutor.isMainLayouer = isMainLayout;
        layoutor.layoutOptions.fixedRootNode = true;
        if (isMainLayout) {
            this.layoutor = layoutor;
            this._updateOptions({
                layout: {
                    supportAutoLayout: supportAutoLayout
                }
            })
        }
    }
}
