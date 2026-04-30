<svelte:options customElement={{ tag:'rg-editing-line-controller', shadow: 'open', props: {
    textEditable: { attribute: 'text-editable', type: 'String', reflect: true },
    pathEditable: { attribute: 'path-editable', type: 'String', reflect: true }
}}}/>
<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import {type RGEditingLineControllerEvents} from "../../types-svelte";
    import RGEditingLineControllerUI from "../editing/RGEditingLineControllerUI.svelte";
    import globalCss from '../../../../../styles/relation-graph-rg-editing-line.scss?inline';
    import {onWebComponentReady} from "./WebComponentUtils";
    import {editingLineWebComponentVarCss} from "./WebComponentStyleVariables";

    export let textEditable: boolean | string | null = true;
    export let pathEditable: boolean | string | null = true;

    const parseBooleanAttr = (value: boolean | string | null | undefined, defaultValue = true) => {
        if (value === null || value === undefined) return defaultValue;
        if (typeof value === 'boolean') return value;
        const normalized = value.trim().toLowerCase();
        if (normalized === '' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
            return true;
        }
        if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
            return false;
        }
        return defaultValue;
    };

    $: textEditableValue = parseBooleanAttr(textEditable, true);
    $: pathEditableValue = parseBooleanAttr(pathEditable, true);

    const dispatch = createEventDispatcher<RGEditingLineControllerEvents>();

    let optionsStore: any = null;
    let graphInstance: any = null;
    let hostElement: HTMLElement | null = null;
    onMount(() => {
        onWebComponentReady(hostElement, [globalCss, editingLineWebComponentVarCss], {
            webComponentName: 'rg-editing-line-controller',
            callback: (instance: any) => {
                graphInstance = instance;
                optionsStore = graphInstance?.dataStores.optionsStore;
            }
        });
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={hostElement} class="rg-editing-line-ctrl-wrapper">
    {#if optionsStore && graphInstance }
        <RGEditingLineControllerUI
                {dispatch}
                textEditable={textEditableValue}
                pathEditable={pathEditableValue}
                {optionsStore}
                {graphInstance}
        >
            <slot />
        </RGEditingLineControllerUI>
    {/if}
</div>

<style>
.rg-editing-line-ctrl-wrapper {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: var(--rg-editing-line-z-index, 500);
    pointer-events: none;
    user-select: none;
    width: 100%;
    height: 100%;
}
</style>
