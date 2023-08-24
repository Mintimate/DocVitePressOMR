<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-features-before>
      <div class="VPFeatures" style="margin-bottom: 20px">
        <div class="wwads-cn wwads-horizontal container" data-id="266" ></div>
      </div>
    </template>
  </Layout>
</template>

<style scoped>

.VPFeatures {
  position: relative;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .VPFeatures {
    padding:0 48px;
  }
}

@media (min-width: 960px) {
  .VPFeatures {
    padding:0 64px
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px
}

</style>