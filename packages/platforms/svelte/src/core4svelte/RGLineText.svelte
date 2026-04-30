<script lang="ts">
    import { useGraphInstance } from '../hooks/useGraphInstance';
    import type { RGLineTextProps } from '../../../../types';
    import {useGraphStore} from "../hooks/useGraphStore";

    export let lineConfig: RGLineTextProps['lineConfig'];
    // Svelte 中一般不需要导出 linePathInfo 如果它只在 RGLineContent 中被计算，
    // 但如果 props 接口需要，可以加上：
    export let linePathInfo: any = undefined;
    export let checked: boolean | undefined;

    const graphInstance = useGraphInstance();
    $: line = lineConfig?.line;
    $: lineTextContainer = graphInstance.getLineTextContainer(lineConfig?.line);

    /**
     * Svelte Action for Teleporting
     */
    function portal(node: HTMLElement, target: HTMLElement | undefined) {
        function update(newTarget: HTMLElement | undefined) {
            if (newTarget) {
                newTarget.appendChild(node);
            } else if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }
        update(target);
        return {
            update,
            destroy() {
                if (node.parentNode) node.parentNode.removeChild(node);
            }
        };
    }

</script>

{#if line && lineTextContainer}
    <foreignObject style="display: none;">
    <div
            use:portal={lineTextContainer}
            class={[
      'rg-line-peel',
      line.className,
      checked ? 'rg-line-checked' : '',
      (line.disablePointEvent || line.opacity === 0) ? 'rg-line-disable-events' : '',
      line.selected ? 'rg-line-selected' : ''
    ].filter(Boolean).join(' ')}
            data-id={line.id}
            style:--rg-line-color={line.color}
            style:--rg-line-fontsize={line.fontSize ? line.fontSize + 'px' : undefined}
            style:--rg-line-opacity={line.opacity}
            style:--rg-line-fontcolor={line.fontColor}
    >
        <slot />
    </div>
    </foreignObject>
{/if}
