export const locales_cn = {
    label: '简体中文',
    title: "oh-my-rime输入法",
    description: "一套快速初始化rime的模板，因为平时我使用oh-my-zsh，在使用rime时候，有种用omz的感觉；所以我给它取名叫oh-my-rime，你也可以叫它薄荷拼音，亦或者Mint Input。",
    lang: 'zh',
    link: '/zh/',
    nav: [
        {text: '更新日志', link: '/zh/changeLog/'},
        {text: '关于', link: '/zh/teamInfo'},
        {text: '主页', link: '/'},
        {text: '效果演示', link: '/zh/demo/'},
        {text: '配置教程', link: '/zh/guide/'},
    ],
    outline: {
        level: [2, 6] as [number, number],
        label: '此页面'
    },
    sidebar: {
        '/zh/demo/': [{
            text: '效果演示',
            items: [
                {text: '梗概', link: '/zh/demo/'},
                {text: '雾凇和薄荷', link: '/zh/demo/diffBetweenIceAndMint'},
                {text: '外观展示', link: '/zh/demo/diffAppearance'},
                {text: '反查模块', link: '/zh/demo/reverseWords'},
                {text: '小鹤双拼', link: '/zh/demo/doublePinyinFly'},
                {text: '特殊功能键', link: '/zh/demo/funcKeys'},
                {text: '颜文字', link: '/zh/demo/kaomoji'},
            ]
        }],
        '/zh/guide/': [{
            text: '配置教程',
            items: [
                {text: '引导', link: '/zh/guide/'},
                {text: '安装rime', link: '/zh/guide/installRime'},
                {text: '导入薄荷输入法', link: '/zh/guide/importMint'},
                {text: '配置覆写和定制', link: '/zh/guide/configurationOverride'},
                {text: '自定义默认激活方案', link: '/zh/guide/defaultActivationScheme'},
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
    search: {
        translations: {
            button: {
                buttonText: '搜索试试',
                buttonAriaLabel: '搜索文档'
            },
            modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                    selectText: '选择',
                    navigateText: '切换'
                }
            }
        }
    }
}