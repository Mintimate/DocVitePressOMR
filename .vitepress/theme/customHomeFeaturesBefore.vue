<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import Wwads from "./components/wwads.vue";
import Googleads from "./components/googleads.vue";
import donate from "./components/donate.vue";
import aiChat from "./components/aiChat.vue";

const {Layout} = DefaultTheme

// AI聊天组件配置
const aiChatConfig = {
  apiUrl: 'https://rime-knowledge.mintimate.cc/api/v1/chat/stream',
  captchaAppId: "191056602",
  maxHistoryTurns: 3,
  welcomeMessage: '您好！我是薄荷输入法 AI助手 ，可以帮您解答关于薄荷输入法的各种问题。请随时向我提问！<br/> ' +
                  '内容基于`向量化的知识库` 和 `DeepSeek RAG 检索`，不保证正确性，请自行判断 😊… <br/><br/> ' + 
                  '你可能会喜欢 🤔 : [oh-my-rime](https://github.com/Mintimate/oh-my-rime)、[Mintimate\'s Blog](https://www.mintimate.cn)、[Bilibili](https://space.bilibili.com/355567627)'
}
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
       <!-- AI聊天组件 - 固定在导航栏 -->
        <div class="askAi">
          <aiChat 
            :api-url="aiChatConfig.apiUrl" 
            :captcha-app-id="aiChatConfig.captchaAppId"
            :max-history-turns="aiChatConfig.maxHistoryTurns"
            :welcome-message="aiChatConfig.welcomeMessage"
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
      <a href="https://afdian.com/a/mintimate" target="_blank" rel="noopener sponsored">
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