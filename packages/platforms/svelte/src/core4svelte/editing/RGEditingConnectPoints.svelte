<script lang="ts">
      import type { RGUserEvent, RGJunctionPoint } from '../../../../../types';

      export let mouseUpOnJunctionPoint: (type: RGJunctionPoint, $event: RGUserEvent) => void;
      export let mouseUpOnJunctionPointWithOffset: (type: RGJunctionPoint, $event: RGUserEvent) => void;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
        class="rg-connect-ctl"
        on:mouseup={(e) => mouseUpOnJunctionPointWithOffset('', e)}
        on:touchend={(e) => mouseUpOnJunctionPointWithOffset('', e)}
>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-t" data-point="top" on:mouseup={(e) => mouseUpOnJunctionPoint('top', e)}></div>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-b" data-point="bottom" on:mouseup={(e) => mouseUpOnJunctionPoint('bottom', e)}></div>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-center" data-point="border" on:mouseup={(e) => mouseUpOnJunctionPoint('border', e)}></div>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-l" data-point="left" on:mouseup={(e) => mouseUpOnJunctionPoint('left', e)}></div>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-r" data-point="right" on:mouseup={(e) => mouseUpOnJunctionPoint('right', e)}></div>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-lr" data-point="lr" on:mouseup={(e) => mouseUpOnJunctionPoint('lr', e)}></div>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-tb" data-point="tb" on:mouseup={(e) => mouseUpOnJunctionPoint('tb', e)}></div>

      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-bottom-bar" data-point="bottom" data-innode="true" on:mouseup={(e) => mouseUpOnJunctionPointWithOffset('bottom', e)} on:touchend={(e) => mouseUpOnJunctionPointWithOffset('bottom', e)}></div>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-top-bar" data-point="top" data-innode="true" on:mouseup={(e) => mouseUpOnJunctionPointWithOffset('top', e)} on:touchend={(e) => mouseUpOnJunctionPointWithOffset('top', e)}></div>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-left-bar" data-point="left" data-innode="true" on:mouseup={(e) => mouseUpOnJunctionPointWithOffset('left', e)} on:touchend={(e) => mouseUpOnJunctionPointWithOffset('left', e)}></div>
      <div class="rg-connect-ctl-handler rg-connect-ctl-handler-style rg-connect-ctl-right-bar" data-point="right" data-innode="true" on:mouseup={(e) => mouseUpOnJunctionPointWithOffset('right', e)} on:touchend={(e) => mouseUpOnJunctionPointWithOffset('right', e)}></div>
</div>
