export const locales_cn = {
    label: '简体中文',
    title: "oh-my-rime输入法",
    description: "一套快速初始化rime的模板，因为平时我使用oh-my-zsh，在使用rime时候，有种用omz的感觉；所以我给它取名叫oh-my-rime，你也可以叫它薄荷拼音，亦或者Mint Input。",
    lang: 'zh',
    link: '/zh/',
    nav: [
        {text: '关于', link: '/zh/teamInfo'},
        {text: '主页', link: '/'},
        {text: '效果演示', link: '/zh/demo/'},
        {text: '配置教程', link: '/zh/guide/'},
    ],
    outlineTitle: '此页面',
    outline: 'deep',
    sidebar: {
        '/zh/demo/': [{
            text: '效果演示',
            items: [
                {text: '梗概', link: '/zh/demo/'},
                {text: '外观展示', link: '/zh/demo/diffAppearance'},
                {text: '反查模块', link: '/zh/demo/reverseWords'},
                {text: '特殊功能键', link: '/zh/demo/funcKeys'},
            ]
        }],
        '/zh/guide/': [{
            text: '配置教程',
            items: [
                {text: '引导', link: '/zh/guide/'},
                {text: '安装rime', link: '/zh/guide/installRime'},
                {text: '导入薄荷输入法', link: '/zh/guide/importMint'},
                {text: '配置覆写和定制', link: '/zh/guide/configurationOverride'},
                {text: 'Emoji配置(OpenCC)', link: '/zh/guide/openccEmoji'},
                {text: '模糊拼音设置', link: '/zh/guide/fuzzyPinyin'},
                {text: '输入法快捷键', link: '/zh/guide/shortcutKeys'},
                {text: '输入个性定制', link: '/zh/guide/customizationInput'},
                {text: '多设备同步', link: '/zh/guide/deviceSync'},
                {text: '[可选]问题答疑', link: '/zh/guide/faQ'},
            ]
        }
        ]
    },
}