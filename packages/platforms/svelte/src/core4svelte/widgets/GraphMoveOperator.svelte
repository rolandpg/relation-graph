<script lang="ts">
    import { useGraphInstance } from '../../hooks/useGraphInstance';
    import {useGraphStore} from "../../hooks/useGraphStore";

    const graphInstance = useGraphInstance();
    const {optionsStore} = useGraphStore();
    $: options = $optionsStore;
    $: canvasMoveMode = options.canvasMoveMode;

    function onTouchpadMouseDown(e: MouseEvent | TouchEvent) {
        // 注意：原代码中参数类型写的是 KeyboardEvent，但事件是 mousedown/touchstart
        // 这里修正为 MouseEvent | TouchEvent
        graphInstance.startMoveCanvas(e as any, true);
    }
</script>

<div
        class="rg-move-operator"
        class:rg-move-operator-active={canvasMoveMode}
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
            class="rg-move-touchpad"
            on:mousedown={onTouchpadMouseDown}
            on:touchstart={onTouchpadMouseDown}
    ></div>
</div>
