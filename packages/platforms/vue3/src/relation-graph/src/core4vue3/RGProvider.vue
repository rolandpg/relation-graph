<script lang="ts" setup>
import {RelationGraphCore} from '../../../../../../relation-graph-models/models/RelationGraphCore'
import {
    defineRGDataProviderComponent,
    generateNewRGInstance
} from "../hooks/useRGDataProvider";

interface RGProviderProps {
    relationGraphCore?: new (...args: any[]) => RelationGraphCore;
    forLinker?: boolean;
}
const props = defineProps<RGProviderProps>();

const graphInstance = generateNewRGInstance(props.relationGraphCore, props.forLinker);
const rgDataProvider = defineRGDataProviderComponent(graphInstance);
</script>
<template>
    <rgDataProvider>
        <slot />
    </rgDataProvider>
</template>
