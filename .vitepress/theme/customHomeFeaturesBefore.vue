<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme';
import aiChat from "./components/aiChat/index.vue";
import Googleads from "./components/googleads.vue";
import Wwads from "./components/wwads.vue";

const {Layout} = DefaultTheme

// AI聊天组件配置 - 从环境变量读取（空字符串时使用 undefined，让 prop 默认值生效）
const aiChatConfig = {
  apiUrl: import.meta.env.AI_API_URL || undefined,
  mcpBaseUrl: import.meta.env.AI_MCP_BASE_URL || undefined,
  captchaAppId: import.meta.env.AI_CAPTCHA_APP_ID || undefined,
  enableCaptcha: import.meta.env.AI_ENABLE_CAPTCHA === 'true',
  maxHistoryTurns: Number(import.meta.env.AI_MAX_HISTORY_TURNS) || 3,
  welcomeMessage: import.meta.env.AI_WELCOME_MESSAGE || undefined,
  defaultTools: import.meta.env.AI_DEFAULT_TOOLS || undefined
}
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
       <!-- AI聊天组件 - 固定在导航栏 -->
        <div class="askAi">
          <aiChat 
            :api-url="aiChatConfig.apiUrl" 
            :mcp-base-url="aiChatConfig.mcpBaseUrl"
            :captcha-app-id="aiChatConfig.captchaAppId"
            :enable-captcha="aiChatConfig.enableCaptcha"
            :max-history-turns="aiChatConfig.maxHistoryTurns"
            :welcome-message="aiChatConfig.welcomeMessage"
            :default-tools="aiChatConfig.defaultTools"
          />
        </div>
    </template>
    <template #home-features-before>
      <div class="VPFeatures" style="margin-bottom: 20px">
        <wwads/>
      </div>
    </template>

    <template #aside-ads-before>
      <div class="supportMeCard" style="margin: 10px 0; padding: 0">
        <Googleads :dataAdSlot="'1079004688'"/>
      </div>
      <a href="https://ifdian.net/a/mintimate" target="_blank" rel="noopener sponsored">
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
