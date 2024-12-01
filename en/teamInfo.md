---
layout: page
title: About Team
description: Introduction about the Oh-my-rime's team, as well as the discussion group and background of Oh-my-rime.
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme';

const members = [
  {
    avatar: '/avatar.png',
    name: 'Mintimate',
    title: 'Full Stack Development',
    links: [
      { icon: 'github', link: 'https://github.com/Mintimate' },
      { icon: 'youtube', link: 'https://www.youtube.com/@mintimate' },
      {icon: {svg: '<svg t="1692535452107" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32228" width="200" height="200"><path d="M977.2 208.2c33.4 36.2 48.8 79.4 46.6 131.4v404.8c-0.8 52.8-18.4 96.2-53 130.2-34.4 34-78.2 51.8-131 53.4H184.04c-52.9-1.6-96.42-19.6-130.56-54.4C19.364 838.8 1.534 793 0 736.4V339.6c1.534-52 19.364-95.2 53.48-131.4C87.62 175.5 131.14 157.54 184.04 156h58.76L192.1 104.38c-11.5-11.46-17.26-26-17.26-43.58 0-17.6 5.76-32.12 17.26-43.594C203.6 5.736 218.2 0 235.8 0s32.2 5.736 43.8 17.206L426.2 156h176l149-138.794C763.4 5.736 778.4 0 796 0c17.6 0 32.2 5.736 43.8 17.206 11.4 11.474 17.2 25.994 17.2 43.594 0 17.58-5.8 32.12-17.2 43.58L789.2 156h58.6c52.8 1.54 96 19.5 129.4 52.2z m-77.6 139.4c-0.8-19.2-7.4-34.8-21.4-47-10.4-12.2-28-18.8-45.4-19.6H192.1c-19.18 0.8-34.9 7.4-47.16 19.6-12.28 12.2-18.8 27.8-19.56 47v388.8c0 18.4 6.52 34 19.56 47s28.76 19.6 47.16 19.6H832.8c18.4 0 34-6.6 46.6-19.6 12.6-13 19.4-28.6 20.2-47V347.6z m-528.6 85.4c12.6 12.6 19.4 28.2 20.2 46.4V546c-0.8 18.4-7.4 33.8-19.6 46.4-12.4 12.6-28 19-47.2 19-19.2 0-35-6.4-47.2-19-12.2-12.6-18.8-28-19.6-46.4v-66.6c0.8-18.2 7.6-33.8 20.2-46.4 12.6-12.6 26.4-19.2 46.6-20 18.4 0.8 34 7.4 46.6 20z m383 0c12.6 12.6 19.4 28.2 20.2 46.4V546c-0.8 18.4-7.4 33.8-19.6 46.4-12.2 12.6-28 19-47.2 19-19.2 0-34.8-6.4-47.2-19-14-12.6-18.8-28-19.4-46.4v-66.6c0.6-18.2 7.4-33.8 20-46.4 12.6-12.6 28.2-19.2 46.6-20 18.4 0.8 34 7.4 46.6 20z" p-id="32229"></path></svg>'}, link: 'https://space.bilibili.com/355567627'},
    ],
    sponsor:'https://afdian.com/a/mintimate',
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/132128788',
    name: 'YummyCocoa',
    title: 'Key Partners (●\'◡\'●)ﾉ♥',
    links: [
      { icon: 'github', link: 'https://github.com/YummyCocoa' },
    ],
  },
  {
    avatar: '/image/avatar/Jian787.webp',
    name: 'Jian787',
    title: 'One of the maintainers of the Terra Pinyin lexicon configuration for Oh-my-rime, providing a manually verified polyphonic word database.',
    links: [
      { icon: 'github', link: 'https://github.com/Jian787' },
    ],
  },

]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      About This Website
    </template>
    <template #lead>
      Currently it's mainly developed by myself, looking forward to your help
    </template>
  </VPTeamPageTitle>

<VPTeamMembers
:members="members"
/>

  <VPTeamPageSection>
    <template #title>Contact Us</template>
  </VPTeamPageSection>
  <div class="vp-doc " :class="$style.VPTeamContent">
    <div class="container">
      <p>If you need feedback, suggestions:</p>
      <ul>
        <li>QQ Group: 703260572</li>
        <li>Email: mintimate215@gmail.com</li>
      </ul>
    </div>
  </div>

  <VPTeamPageSection>
    <template #title>Third-party evaluation</template>
  </VPTeamPageSection>
  <div class="vp-doc " :class="$style.VPTeamContent">
    <div class="container">
      <p>Thank you to the community members who have promoted the Oh-my-rime scheme in other communities, even leading more developers to contribute to the optimization of the Rime input method. We have collected some articles related to Oh-my-rime from third-party platforms:</p>
      <ul>
        <li>Telegram 开源社区: <a href="https://t.me/opencfdchannel/4727" target="_blank">oh-my-rime 输入法 正在使用小企鹅输入法或者仓输入法的朋友可以试试这个拼音方案，个人感觉很不错，而且部署也很简单。</a></li>
        <li>果核剥壳: <a href="https://www.ghxi.com/wx20240422.html" target="_blank">输入法方案，薄荷输入法软件体验</a> </li>
        <li>小众软件: <a href="https://www.appinn.com/oh-my-rime/" target="_blank">薄荷输入法（oh-my-rime）- 跨平台 Rime 输入法配置套件：无隐私追踪、完全开源、高自定义</a> </li>
        <li>Deepin 论坛: <a href="https://bbs.deepin.org/zh/post/268859" target="_blank">[应用分享] 薄荷输入法不错，大家可以试用下</a> </li>
        <li>V2EX 论坛: <a href="https://www.v2ex.com/t/1027047" target="_blank">一个基于 rime 的输入法方案： oh-my-rime</a> </li>
        <li>博客园: <a href="https://www.cnblogs.com/Undefined443/p/-/rime" target="_blank">Ubuntu 安裝 RIME 輸入法</a> </li>
        <li>X: <a href="https://x.com/iamcheyan/status/1767761177004961926" target="_blank">oh-my-rime，不喜欢输入法联网的朋友可以试试。</a> </li>
        <li>思否-Kenis空间站: <a href="https://segmentfault.com/a/1190000045386216" target="_blank">分享我在Windows下使用的中文输入方案</a> </li>
      </ul>
    </div>
  </div>

</VPTeamPage>

<style module>
.VPTeamContent{
    padding: 20px 32px;
}

@media (min-width: 768px){
.VPTeamContent{
    padding: 20px 128px;
}
}

@media (min-width: 1200px){
.VPTeamContent{
    padding: 20px 256px;
}
}
</style>


