<svelte:options customElement={{ tag:'relation-graph', shadow: 'open'}}/>

<script lang="ts">
    import {RelationGraphCore} from '../../../../../relation-graph-models/models/RelationGraphCore';
    import type {RGGenerateLineConfig, RGJsonData, RGNode, RGOptions} from '../../../../../types';
    import RGProvider4Instance from '../RGProvider4Instance.svelte';
    import RelationGraph from '../RelationGraph.svelte';
    import RGLineContent from "./RGLineContent.svelte";
    import RGNodeExpandHolder from "../RGNodeExpandHolder.svelte";
    import {createEventDispatcher, onDestroy, onMount} from "svelte";
    import type {RelationGraphEvents} from "../../types-svelte";
    import {generateRGInstance} from "../../hooks/useRGDataProvider";
    import globalCss from '../../../../../styles/relation-graph.scss?inline';
    import globalCssToolbar from '../../../../../styles/relation-graph-toolbar.scss?inline';
    import RGEditingReferenceLine from "../editing/RGEditingReferenceLine.svelte";
    import RGEditingConnectController from "../editing/RGEditingConnectController.svelte";
    import {
        appendWebComponentGlobalStyles,
        type WebComponentConnectEventDetail,
        type WebComponentDisconnectEventDetail
    } from "./WebComponentUtils";
    import {relationGraphWebComponentVarCss} from "./WebComponentStyleVariables";

    export let relationGraphCore: (new (...args: any[]) => RelationGraphCore) | undefined;
    export let options: RGOptions | undefined = undefined;
    export let initialData: RGJsonData | undefined = undefined;
    export let renderNode: ((node: RGNode, checked: boolean, dragging: boolean) => string | undefined | null) | undefined = undefined;
    export let renderLine: ((lineConfig: RGGenerateLineConfig, checked: boolean, defaultLineTextOnPath: boolean, graphInstanceId: string) => string | undefined | null) | undefined = undefined;
    export let renderLineText: ((lineConfig: RGGenerateLineConfig, checked: boolean, defaultLineTextOnPath: boolean, graphInstanceId: string) => string | undefined | null) | undefined = undefined;
    const dispatch = createEventDispatcher<RelationGraphEvents & {
        onStoreChange: { storeName: 'editingNodesStore' |
            'editingLineStore' |
            'connectingNodeStore' |
            'viewInformationStore' |
            'selectionStore' |
            'checkedItemStore' |
            'creatingLineStore' |
            'creatingNodeStore'; value: any }
    }>();
    const graphInstance = generateRGInstance(relationGraphCore);
    let hostElement: HTMLElement | null = null;
    const storeUnsubscribes: Array<() => void> = [];

    let rgEditingReferenceLine: boolean = false;
    let rgEditingReferenceLine_showText: boolean = true;
    let rgEditingReferenceLine_adsorption: boolean = true;
    let rgEditingConnectController: boolean = false;
    onMount(() => {
        if (!hostElement) {
            return;
        }
        const emitReady = () => dispatch('onReady', [graphInstance]);
        if (typeof queueMicrotask === 'function') {
            queueMicrotask(emitReady);
        } else {
            setTimeout(emitReady, 0);
        }
        hostElement.addEventListener('connect-to-graph-instance', (e: CustomEvent<WebComponentConnectEventDetail>) => {
            if (e.detail.webComponentName === 'rg-editing-reference-line') {
                rgEditingReferenceLine_showText = e.detail.componentProps?.showText;
                rgEditingReferenceLine_adsorption = e.detail.componentProps?.adsorption;
                rgEditingReferenceLine = true;
            }
            if (e.detail.webComponentName === 'rg-editing-connect-controller') {
                rgEditingConnectController = true;
            }
            if (e.detail.callback) {
                e.detail.callback(graphInstance);
            }
        });
        hostElement.addEventListener('disconnect-to-graph-instance', (e: CustomEvent<WebComponentDisconnectEventDetail>) => {
            if (e.detail.webComponentName === 'rg-editing-reference-line') {
                rgEditingReferenceLine = false;
            }
            if (e.detail.webComponentName === 'rg-editing-connect-controller') {
                rgEditingConnectController = false;
            }
        });
        appendWebComponentGlobalStyles(hostElement, [globalCss, globalCssToolbar, relationGraphWebComponentVarCss]);
        const {
            editingNodesStore,
            editingLineStore,
            connectingNodeStore,
            viewInformationStore,
            selectionStore,
            checkedItemStore,
            creatingLineStore,
            creatingNodeStore
        } = graphInstance.hooksStore;
        storeUnsubscribes.push(editingNodesStore.subscribe((editingNodes: any) => {
            dispatch('onStoreChange', {
                storeName: 'editingNodesStore',
                value: editingNodes
            });
        }));
        storeUnsubscribes.push(editingLineStore.subscribe((editingLine: any) => {
            dispatch('onStoreChange', {
                storeName: 'editingLineStore',
                value: editingLine
            });
        }));
        storeUnsubscribes.push(connectingNodeStore.subscribe((connectingNode: any) => {
            dispatch('onStoreChange', {
                storeName: 'connectingNodeStore',
                value: connectingNode
            });
        }));
        storeUnsubscribes.push(viewInformationStore.subscribe((viewInformation: any) => {
            dispatch('onStoreChange', {
                storeName: 'viewInformationStore',
                value: viewInformation
            });
        }));
        storeUnsubscribes.push(selectionStore.subscribe((selection: any) => {
            dispatch('onStoreChange', {
                storeName: 'selectionStore',
                value: selection
            });
        }));
        storeUnsubscribes.push(checkedItemStore.subscribe((checkedItems: any) => {
            dispatch('onStoreChange', {
                storeName: 'checkedItemStore',
                value: checkedItems
            });
        }));
        storeUnsubscribes.push(creatingLineStore.subscribe((creatingLine: any) => {
            dispatch('onStoreChange', {
                storeName: 'creatingLineStore',
                value: creatingLine
            });
        }));
        storeUnsubscribes.push(creatingNodeStore.subscribe((creatingNode: any) => {
            dispatch('onStoreChange', {
                storeName: 'creatingNodeStore',
                value: creatingNode
            });
        }));
    });
    onDestroy(() => {
        while (storeUnsubscribes.length > 0) {
            const unsubscribe = storeUnsubscribes.pop();
            unsubscribe?.();
        }
    });
</script>
<div style="width: 100%;height: 100%;position: relative;overflow: hidden;" bind:this={hostElement}>
    <RGProvider4Instance graphInstance={graphInstance}>
        <RelationGraph {options} {initialData} eventDispatcher={dispatch}>
            <svelte:fragment slot="view">
                <slot name="view"/>
                {#if rgEditingReferenceLine}
                    <RGEditingReferenceLine adsorption={rgEditingReferenceLine_adsorption}
                                            showText={rgEditingReferenceLine_showText}/>
                {/if}
                {#if rgEditingConnectController}
                    <RGEditingConnectController />
                {/if}
            </svelte:fragment>

            <svelte:fragment slot="canvas">
                <slot name="canvas"/>
                <slot/>
            </svelte:fragment>

            <svelte:fragment slot="canvas-above">
                <slot name="canvas-above"/>
            </svelte:fragment>
            <svelte:fragment slot="background">
                <slot name="background" />
            </svelte:fragment>

            <svelte:fragment slot="node" let:node let:checked let:dragging>
                <slot name="node" {node}>
                    {#if renderNode}
                        {@html renderNode(node, checked, dragging) ?? ''}
                    {:else}
                        <div class="rg-node-text">
                            <span>{node.text}</span>
                        </div>
                    {/if}
                </slot>
            </svelte:fragment>

            <svelte:fragment slot="line" let:lineConfig let:checked let:defaultLineTextOnPath let:graphInstanceId>
                <slot name="line" {lineConfig} {checked} {defaultLineTextOnPath} {graphInstanceId}>
                    <RGLineContent
                        renderLine={renderLine}
                        renderLineText={renderLineText}
                        {lineConfig}
                        {checked}
                        {defaultLineTextOnPath}
                        {graphInstanceId}
                    />
                </slot>
            </svelte:fragment>

            <svelte:fragment slot="node-expand-button" let:node let:expandHolderPosition let:expandOrCollapseNode>
                <slot
                        name="node-expand-button"
                        {node}
                        {expandHolderPosition}
                        {expandOrCollapseNode}
                >
                    <RGNodeExpandHolder {node} {expandOrCollapseNode} {expandHolderPosition}/>
                </slot>
            </svelte:fragment>
        </RelationGraph>
    </RGProvider4Instance>
</div>
