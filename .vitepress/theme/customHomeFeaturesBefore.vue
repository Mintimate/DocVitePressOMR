<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import Wwads from "./components/wwads.vue";

const {Layout} = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-features-before>
      <div class="VPFeatures" style="margin-bottom: 20px">
        <wwads/>
      </div>
    </template>

    <template #aside-ads-before>
      <div class="supportMeCard" style="margin-bottom: 10px">
        <wwads :horizontal="false"/>
      </div>
      <a href="https://afdian.net/a/mintimate" target="_blank" rel="noopener sponsored">
      <div class="supportMeCard">
        <span class="supportMeCardText">
              Sponsor a scoop of matcha powder for better posts. <br/>(●'◡'●)ﾉ♥
          </span>
      </div>
      </a>
    </template>

    <template #sidebar-nav-after>
      <div class="VPCarbonAds" style="margin-top: 20px">
        <wwads :horizontal="false"/>
      </div>
    </template>
    <template #aside-outline-after>

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
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .VPFeatures {
    padding: 0 64px
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px
}

.supportMeCard {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  min-height: 88px;
  text-align: center;
  line-height: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: var(--vp-carbon-ads-bg-color);
}

.supportMeCard .supportMeCardText {
  display: block;
  margin: 0 auto;
  padding-top: 12px;
  color: var(--vp-carbon-ads-text-color);
  transition: color .25s;
}
</style>