<script lang="ts">
import { defineComponent } from 'vue';

/**
 * This is a "marker component".
 * Its sole purpose is to allow the parent component to
 * identify it when traversing the VNode tree
 * via `vnode.type === RGSlotOnView`.
 * It does not need a <template> or setup(),
 * because it will never actually be mounted or rendered.
 *
 */
export default defineComponent({
    name: 'RGSlotOnView',
    // Note: We don't need props because slots
    // (children) are passed via the VNode tree.
});
</script>
