<script lang="ts">
    import { RGIconsData } from '../../../../../relation-graph-models/utils/RGIconsData';

    export let iconName: string;
    export let className: string | undefined = undefined;

    // 响应式获取图标数据
    $: iconInfo = RGIconsData[iconName];
</script>

<!--
  注意：Svelte 使用 {@html ...} 来渲染原始 HTML 字符串。
  一定要确保 RGIconsData 中的内容是安全的（通常这是库内部数据，是安全的）。
-->
<svg
        class="rg-icon {className || ''}"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
>
    {#if iconInfo}
        {@html iconInfo.data}
    {/if}
</svg>
