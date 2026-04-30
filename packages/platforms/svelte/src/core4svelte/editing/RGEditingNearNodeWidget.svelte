<script lang="ts">
    import type { RGWidgetPosition } from '../../../../../types';

    export let position: RGWidgetPosition = 'top';
</script>

<div class="rg-editing-bar rg-editing-bar-{position || 'top'}">
    <slot />
</div>
