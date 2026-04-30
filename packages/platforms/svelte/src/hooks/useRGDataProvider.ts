import { setContext, getContext, onMount } from 'svelte';
import {derived, writable, Writable} from 'svelte/store';
import {
    RelationGraphCore
} from '../../../../relation-graph-models/models/RelationGraphCore';
import {
    RGCheckedItem,
    RGConnectingNode,
    RGCreatingLine, RGCreatingNode, RGEditingLine, RGEditingNodes,
    RGFakeLine, RGLine, RGLineTarget, RGNode,
    type RGOptions, RGOptionsFull, RGSelectionView, RGViewInformation
} from '../../../../types';
import {RELATION_GRAPH_CONTEXT_KEY, RELATION_GRAPH_CONTEXT_KEY_FOR_HOOK_STORES} from '../context';
import {RGSvelteHooksStore} from "../types-svelte"; // 请确保这个路径正确

/**
 * 获取或生成 RelationGraphCore 实例
 * 对应 Vue 的 generateRGInstance
 */
export function generateRGInstance(
    relationGraphCoreClass?: new (...args: any[]) => RelationGraphCore,
    forLinker = false
): RelationGraphCore {
    // console.log('creating new graphInstance', forLinker);
    const RGCore = relationGraphCoreClass || RelationGraphCore;
    const graphInstance = new RGCore();
    graphInstance._rgAsConnectArea = forLinker;
    return graphInstance;
}
/**
 * 获取或生成 RelationGraphCore 实例
 * 对应 Vue 的 generateRGInstance
 */
export function getOrGenerateRGInstance(
    relationGraphCoreClass?: new (...args: any[]) => RelationGraphCore,
    forLinker = false
): RelationGraphCore {
    // 1. 尝试从父级 Context 获取实例
    const parentInstance = getContext<RelationGraphCore | null>(RELATION_GRAPH_CONTEXT_KEY);
    if (parentInstance) {
        // console.log('Use existing graphInstance from parent RGProvider');
        return parentInstance;
    } else {
        // console.log('No parent RGProvider found, creating new graphInstance', forLinker);
        return generateRGInstance(relationGraphCoreClass, forLinker);
    }
}

/**
 * 初始化响应式数据并绑定到 graphInstance
 * 对应 Vue 的 defineRGDataProviderComponent 中的 setup 逻辑
 */
export function initRGDataProvider(
    graphInstance: RelationGraphCore,
    options: RGOptions = {}
) {
    // 1. 提供给子组件 (Context)
    // 注意：Context 必须在组件初始化期间同步调用
    const parentInstance = getContext<RelationGraphCore | null>(RELATION_GRAPH_CONTEXT_KEY);
    if (!parentInstance) {
        const store4Options: Writable<RGOptionsFull> = writable(graphInstance.dataProvider.getOptions());
        const store4ShouldRenderNodes: Writable<RGNode[]> = writable(graphInstance.dataProvider.getShouldRenderNodes());
        const store4ShouldRenderLines: Writable<RGLine[]> = writable(graphInstance.dataProvider.getShouldRenderLines());
        const store4ShouldRenderFakeLines: Writable<RGFakeLine[]> = writable(graphInstance.dataProvider.getShouldRenderFakeLines());
        graphInstance.setReactiveData4Svelte({
            store4Options,
            store4ShouldRenderNodes,
            store4ShouldRenderLines,
            store4ShouldRenderFakeLines,
        },{
            updateStore4Options: (newValue: RGOptionsFull) => {store4Options.set(newValue)},
            updateStore4ShouldRenderNodes: (newValue: RGNode[]) => {store4ShouldRenderNodes.set(newValue)},
            updateStore4ShouldRenderLines: (newValue: RGLine[]) => {store4ShouldRenderLines.set(newValue)},
            updateStore4FakeLines: (newValue: RGFakeLine[]) => {store4ShouldRenderFakeLines.set(newValue)},
        });
        setContext(RELATION_GRAPH_CONTEXT_KEY, graphInstance);
        const creatingLineStore = derived<Writable<RGOptionsFull>, RGCreatingLine>(
            store4Options,
            (options, set) => {
                let creatingLine: RGCreatingLine = {
                    creating: false
                };
                if (options && options.creatingLinePlot) {
                    const {line, from, to} = graphInstance.generateCreatingLineConfig();
                    creatingLine = {
                        creating: true,
                        fromTarget: from,
                        toTarget: to,
                        lineJson: line
                    };
                }
                set(creatingLine);
            }
        );
        const creatingNodeStore = derived<Writable<RGOptionsFull>, RGCreatingNode>(
            store4Options,
            (options, set) => {
                let creatingNode: RGCreatingNode = {
                    creating: false
                };
                if (options && options.creatingNodePlot) {
                    creatingNode = {
                        creating: true,
                        nodeJson: options.newNodeTemplate
                    };
                }
                set(creatingNode);
            }
        );
        const editingNodesStore = derived<Writable<RGOptionsFull>, RGEditingNodes>(
            store4Options,
            ($options) => {
                return $options.editingController;
            }
        );

        const editingLineStore = derived<Writable<RGOptionsFull>, RGEditingLine>(
            store4Options,
            ($options) => {
                return $options.editingLineController;
            }
        );

        const connectingNodeStore = derived<Writable<RGOptionsFull>, RGConnectingNode>(
            store4Options,
            ($options) => {
                return $options.nodeConnectController;
            }
        );

        const viewInformationStore = derived<Writable<RGOptionsFull>, RGViewInformation>(
            store4Options,
            ($options) => {
                const { viewSize, canvasSize, canvasOffset, canvasZoom, fullscreen, showEasyView } = $options;
                return {
                    viewSize,
                    canvasSize,
                    canvasOffset,
                    canvasZoom,
                    fullscreen,
                    showEasyView
                };
            }
        );

        const selectionStore = derived<Writable<RGOptionsFull>, RGSelectionView & { show: boolean }>(
            store4Options,
            ($options) => {
                return {
                    ...$options.selectionView,
                    show: $options.creatingSelection
                };
            }
        );

        const checkedItemStore = derived<Writable<RGOptionsFull>, RGCheckedItem>(
            store4Options,
            ($options) => {
                return {
                    checkedLineId: $options.checkedLineId,
                    checkedNodeId: $options.checkedNodeId,
                    draggingNodeId: $options.draggingNodeId
                };
            }
        );
        const hooksStore: RGSvelteHooksStore = {
            editingNodesStore,
            editingLineStore,
            connectingNodeStore,
            viewInformationStore,
            selectionStore,
            checkedItemStore,
            creatingLineStore,
            creatingNodeStore
        }
        setContext(RELATION_GRAPH_CONTEXT_KEY_FOR_HOOK_STORES, hooksStore);
        graphInstance.hooksStore = hooksStore;
        // console.log('RGProvider provided new instance');
    } else {
        // console.log('RGProvider use parent instance');
    }

    onMount(() => {
        // console.log('RGProvider mounted');
    });
    graphInstance.setOptions(options);
    // // 初始化选项
    // graphInstance.setOptions(fullOptions);

    return {
        graphInstance
    };
}
