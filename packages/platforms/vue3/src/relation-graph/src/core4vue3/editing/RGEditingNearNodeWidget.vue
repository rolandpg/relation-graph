<template>
    <div
            class="rg-editing-bar"
            :class="['rg-editing-bar-' + (position || 'top')]"
    >
        <slot/>
    </div>
</template>

<script lang="ts" setup>
import {RGWidgetPosition} from "../../../../types";

const props = defineProps<{
    position?: RGWidgetPosition
}>();
</script>
