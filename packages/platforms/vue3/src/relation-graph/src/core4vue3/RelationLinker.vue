<script setup lang="ts">
import {
    JsonLine,
    RGOptions
} from '../../../../../../types';
import {RelationGraphCore} from "../../../../../../relation-graph-models/models/RelationGraphCore";
import {useRelationLinker} from "../hooks/useRelationLinker";
import type {RGEventEmits} from "../../../types-vue3";

interface RelationGraphProps {
    options?: RGOptions;
    lines: JsonLine[];
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
}
const props = defineProps<RelationGraphProps>()
const emit = defineEmits<RGEventEmits>();
const {RelationLinker} = useRelationLinker({
    options: props.options,
    relationGraphCore: props.relationGraphCore,
    emitProxy: emit
});
// console.error('lines:', props.lines)
</script>
<template>
    <RelationLinker :lines="props.lines">
        <template #view>
            <slot name="view" />
        </template>
        <template #line="lineSlotProps">
            <slot v-bind="lineSlotProps" name="line"/>
        </template>
        <slot />
    </RelationLinker>
</template>
