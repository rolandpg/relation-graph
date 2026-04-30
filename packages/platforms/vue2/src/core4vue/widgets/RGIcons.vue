<template>
    <svg class="rg-icon" :class="className" viewBox="0 0 1024 1024" version="1.1"
         xmlns="http://www.w3.org/2000/svg" v-html="iconInfo.data">
    </svg>
</template>

<script>
import {RGIconsData} from "../../../../../relation-graph-models/utils/RGIconsData";

export default {
    name: 'RGIcons',
    props: {
        iconName: {
            type: String,
            required: true
        },
        className: {
            type: String,
            required: false
        }
    },
    computed: {
        iconInfo() {
            return RGIconsData[this.iconName];
        }
    }
};
</script>
