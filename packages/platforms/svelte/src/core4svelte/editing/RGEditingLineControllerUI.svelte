<script lang="ts">
    import {tick, type EventDispatcher} from 'svelte';
    import type {
        JsonLine, RelationGraphInstance,
        RGCtrlPointForLine44,
        RGLineTarget,
        RGNode, RGOptionsFull,
        RGPosition
    } from '../../../../../types';
    import type {Readable} from "svelte/store";
    import {type RGEditingLineControllerEvents} from "../../types-svelte";


    let lineText = '';
    let editing = false;
    let prevClickTime = 0;
    let inputRef: HTMLInputElement;

    export let textEditable = true;
    export let pathEditable = true;
    export let dispatch: EventDispatcher<RGEditingLineControllerEvents>;
    export let optionsStore: Readable<RGOptionsFull>;
    export let graphInstance: RelationGraphInstance;
    $: options = $optionsStore;
    $: editingLineController = options.editingLineController;
    $: editingLine = editingLineController.line;
    // 注意：在 Svelte 中，如果 editingLine 是 undefined，访问其属性会报错
    $: editingLineShape = editingLine ? editingLine.lineShape : undefined;
    $: ctrlPoint1 = editingLineController.ctrlPoint1;
    $: ctrlPoint2 = editingLineController.ctrlPoint2;

    $: ctrlPoint1SvgPath = `M ${editingLineController.startPoint.x} ${editingLineController.startPoint.y} L ${ctrlPoint1.x} ${ctrlPoint1.y}`;
    $: ctrlPoint2SvgPath = `M ${editingLineController.endPoint.x} ${editingLineController.endPoint.y} L ${ctrlPoint2.x} ${ctrlPoint2.y}`;

    $: line44Splits = editingLineController.line44Splits as RGCtrlPointForLine44[];
    $: text = editingLine ? editingLine.text : '';

    // 监听 text 变化并更新 lineText
    $: if (text !== lineText && !editing) {
        lineText = text || '';
        tick().then(() => {
            graphInstance.updateEditingLineView();
        });
    }

    // 监听 shape 变化
    $: if (editingLineShape) {
        tick().then(() => {
            graphInstance.updateEditingLineView();
        });
    }

    function onCtrlPointMouseDown(ctrlPointIndex: number, e: MouseEvent) {
        graphInstance.startMoveLine6CtrlPoint(ctrlPointIndex, e, (line) => {
            dispatch('onLinePathChanged', { line, params: ctrlPointIndex });
        });
    }

    function onLine44CtrlPointMouseDown(split: any, e: MouseEvent) {
        graphInstance.startMoveLine44CtrlPoint(split, e, (line) => {
            dispatch('onLinePathChanged', { line, params: split });
        });
    }

    function onMouseDown(type: 'start' | 'end', e: MouseEvent) {
        const line = options.editingLineController.line;
        dispatch('onMoveLineVertexStart', { type, line });

        graphInstance.startMoveLineVertex(type, e, (fromNode: RGNode | RGLineTarget | RGPosition, toNode: RGNode | RGLineTarget | RGPosition, newLineJson?: JsonLine) => {
            dispatch('onMoveLineVertexEnd', { from: fromNode, to: toNode, newLineJson });
            graphInstance.defaultLineVertexBeChangedHandler(fromNode, toNode, newLineJson);
        });
    }

    function startMoveText(e: MouseEvent) {
        graphInstance.startMoveLineText(e, () => {
            const line = options.editingLineController.line;
            dispatch('onLineTextDragEnd', { line });
        });
    }

    function startEditingLineText(e: MouseEvent) {
        if (prevClickTime && (Date.now() - prevClickTime) < 500) {
            editing = true;
            tick().then(() => {
                if (inputRef) inputRef.focus();
            });
        }
        prevClickTime = Date.now();
    }

    function onLineTextChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (editingLine && editingLine.text !== input.value) {
            graphInstance.updateLine(editingLine.id, {
                text: input.value,
            });
            dispatch('onLineTextChanged', { line: editingLine });
        }
        editing = false;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if editingLineController.show && editingLine}
    <div class="rg-editing-line-ctrl">
        <slot />

        {#if pathEditable}
            <svg class="rg-edt-ctrl-svg" xmlns="http://www.w3.org/2000/svg">
                <g>
                    {#if editingLine.lineShape === 6 && ctrlPoint1}
                        <path d={ctrlPoint1SvgPath} />
                    {/if}
                    {#if editingLine.lineShape === 6 && ctrlPoint2}
                        <path d={ctrlPoint2SvgPath} />
                    {/if}
                </g>
            </svg>
        {/if}

        <div
                class="rg-line-ctrl-dot start-dot"
                style:--rg-ctl-x="{editingLineController.startPoint.x}px"
                style:--rg-ctl-y="{editingLineController.startPoint.y}px"
                on:mousedown={(e) => onMouseDown('start', e)}
                on:touchstart={(e) => onMouseDown('start', e)}
        ></div>

        <div
                class="rg-line-ctrl-dot end-dot"
                style:--rg-ctl-x="{editingLineController.endPoint.x}px"
                style:--rg-ctl-y="{editingLineController.endPoint.y}px"
                on:mousedown={(e) => onMouseDown('end', e)}
                on:touchstart={(e) => onMouseDown('end', e)}
        ></div>

        {#if pathEditable && editingLine.lineShape === 6 && ctrlPoint1}
            <div
                    class="rg-line-ctrl-dot ctrl-dot"
                    style:--rg-ctl-x="{ctrlPoint1.x}px"
                    style:--rg-ctl-y="{ctrlPoint1.y}px"
                    on:mousedown={(e) => onCtrlPointMouseDown(0, e)}
                    on:touchstart={(e) => onCtrlPointMouseDown(0, e)}
            ></div>
        {/if}

        {#if pathEditable && editingLine.lineShape === 6 && ctrlPoint2}
            <div
                    class="rg-line-ctrl-dot ctrl-dot"
                    style:--rg-ctl-x="{ctrlPoint2.x}px"
                    style:--rg-ctl-y="{ctrlPoint2.y}px"
                    on:mousedown={(e) => onCtrlPointMouseDown(1, e)}
                    on:touchstart={(e) => onCtrlPointMouseDown(1, e)}
            ></div>
        {/if}

        {#if pathEditable && (editingLine.lineShape === 44 || editingLine.lineShape === 49)}
            {#each line44Splits as split (split.optionName)}
                {#if !split.hide}
                    <div
                            class="rg-line-ctrl-dot ctrl-split"
                            class:ctrl-split-core={!split.optionName.startsWith('cp-')}
                            class:ctrl-split-v={split.direction === 'v'}
                            class:ctrl-split-h={split.direction === 'h'}
                            style:--rg-ctl-x="{split.x}px"
                            style:--rg-ctl-y="{split.y}px"
                            on:mousedown={(e) => onLine44CtrlPointMouseDown(split, e)}
                            on:touchstart={(e) => onLine44CtrlPointMouseDown(split, e)}
                    ></div>
                {/if}
            {/each}
        {/if}

        {#if textEditable && editingLine}
            <div
                    class="rg-line-ctrl-text"
                    class:rg-line-ctrl-text-editing={editing}
                    style:--rg-ctl-x="{editingLineController.text.x}px"
                    style:--rg-ctl-y="{editingLineController.text.y}px"
                    on:click={startEditingLineText}
                    on:mousedown={startMoveText}
                    on:touchstart={(e) => startMoveText(e)}
            >
                {#if !editing}
                    {#if lineText}
                        <p>{lineText}</p>
                    {:else}
                        <p class="empty-text">Add Text...</p>
                    {/if}
                {:else}
                    <input
                            bind:this={inputRef}
                            class="rg-line-text-input"
                            value={lineText}
                            on:blur={onLineTextChange}
                    />
                {/if}
            </div>
        {/if}
    </div>
{/if}
