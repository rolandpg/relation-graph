<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import type { RGWidgetPosition } from '../../../../../types';
    import {useGraphStore} from "../../hooks/useGraphStore";

    export let forImage = true;
    export let forDisplay = false;
    export let position: RGWidgetPosition = 'br';
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;

    let watermarkRef: HTMLElement;

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;

    $: show = (() => {
        let visible = false;
        if (options.snapshotting) {
            if (forImage === false) {
                visible = false;
            } else {
                visible = true;
            }
        } else {
            if (forDisplay === true) {
                visible = true;
            } else {
                visible = false;
            }
        }
        return visible;
    })();

    onMount(() => {
        if (watermarkRef) {
            graphInstance.setWatermarkDom(watermarkRef, forImage, forDisplay, position);
        }
    });

    onDestroy(() => {
        // 注意：Svelte 的 onDestroy 不接受参数，这里只是调用方法，不需要参数
        // 但 setWatermarkDom 需要参数来做清理判断
        graphInstance.setWatermarkDom(null, forImage, forDisplay, position);
    });
</script>

<div
        bind:this={watermarkRef}
        class="rg-watermark rg-watermark-{position || 'br'}"
        style:display={show ? '' : 'none'}
        style:--watermark-width={width}
        style:--watermark-height={height}
>
    <slot />
</div>
