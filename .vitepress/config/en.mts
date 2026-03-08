import { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const en: LocaleSpecificConfig<DefaultTheme.Config> = {
    label: 'English',
    lang: 'en', // optional, will be added as `lang` attribute on `html` tag
    title: "oh-my-rime",
    head: [
        [
            'meta', {name: 'keywords', content: 'oh-my-rime,rime,Mint Pinyin,Squirrel,Weasel,rime in Linux'}
        ]
    ],
    description: "A template for fast initializing rime, because I usually use oh-my-zsh, when using rime, it feels like using omz; so I named it oh-my-rime, you can also call it Mintimate Pinyin, or Mint Input.",
    link: '/en/', // default /en/ -- shows on navbar translations menu, can be external
    themeConfig: {
        nav: [
            {text: 'ChangeLog', link: '/en/changeLog/'},
            {text: 'About', link: '/en/teamInfo'},
            {text: 'Home', link: '/en/'},
            {text: 'Demo', link: '/en/demo/'},
            {text: 'Configuration', link: '/en/guide/'}
        ],
        outline: {
            level: 'deep',
            label: 'On this page'
        },
        sidebar: {
            '/en/demo/': [{
                text: 'Demo',
                items: [
                    {text: 'Overview', link: '/en/demo/'},
                    {text: 'Online Experience', link: '/en/demo/fcitx5Online'},
                    {text: 'Rime-Ice and Oh-my-rime', link: '/en/demo/diffBetweenIceAndMint'},
                    {text: 'Appearance', link: '/en/demo/diffAppearance'},
                    {text: 'Reverse Lookup', link: '/en/demo/reverseWords'},
                    {text: 'XiaoHe Double Pinyin', link: '/en/demo/doublePinyinFly'},
                    {text: 'Special Function Keys', link: '/en/demo/funcKeys'},
                    {text: 'Kaomoji', link: '/en/demo/kaomoji'},
                ]
            }],
            '/en/guide/': [{
                text: 'Configuration Tutorial',
                items: [
                    {text: 'Guide', link: '/en/guide/'},
                    {text: 'Install Rime', link: '/en/guide/installRime'},
                    {text: 'Import Oh-my-rime', link: '/en/guide/importMint'},
                    {text: 'Configuration and Overrides', link: '/en/guide/configurationOverride'},
                    {text: 'Custom Default Activation Scheme', link: '/en/guide/defaultActivationScheme'},
                    {text: 'Emoji Configuration (OpenCC) ', link: '/en/guide/openccEmoji'},
                    {text: 'FuzzyPinyin', link: '/en/guide/fuzzyPinyin'},
                    {text: 'Language Model', link: '/en/guide/languageModel'},
                    {text: 'Symbols Input', link: '/en/guide/symbolsInput'},
                    {text: 'Lua Extensions', link: '/en/guide/luaExtensions'},
                    {text: 'shortcutKeys', link: '/en/guide/shortcutKeys'},
                    {text: 'Customization Input', link: '/en/guide/customizationInput'},
                    {text: 'Device Sync', link: '/en/guide/deviceSync'},
                    {text: '[Optional] Q&A', link: '/en/guide/faQ'},
                ]
            }]
        },
    }
}
