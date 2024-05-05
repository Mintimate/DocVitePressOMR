<script setup>
defineProps({
  horizontal: {
    type: Boolean,
    default: true
  },
})
</script>

<template>
  <div>
    <div class="wwads-cn container" :class="horizontal ? 'wwads-horizontal':'wwads-vertical'" data-id="266">
    </div>
  </div>
</template>

<style scoped>
:deep(.wwads-cn){
  color: var(--vp-c-text-1);
  background-color: var(--vp-carbon-ads-bg-color)!important;
}

:deep(.wwads-text){
  color: var(--vp-c-text-1)!important;
}

</style>