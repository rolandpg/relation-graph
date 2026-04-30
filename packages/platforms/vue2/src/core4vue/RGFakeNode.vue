<template>
  <div>Fake Node</div>
</template>

<script lang="ts">
import RGNodeExpandHolder from "./RGNodeExpandHolder.vue";
export default {
  name: 'RGFakeNode',
  components: {RGNodeExpandHolder},
  props: {
    node: {
      mustUseProp: true,
      default: () => { return {}; },
      type: Object
    }
  },
  data() {
    return {
      expanding: false
    };
  },
  inject: ['graphInstance']
};
</script>

<style scoped>
</style>
