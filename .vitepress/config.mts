import {defineConfig} from 'vitepress'
import {locales_cn} from './config/mySidebar.mjs'
// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "oh-my-rime输入法",
    description: "一套快速初始化rime的模板，因为平时我使用oh-my-zsh，在使用rime时候，有种用omz的感觉；所以我给它取名叫oh-my-rime，你也可以叫它薄荷拼音，亦或者Mint Input。",
    head: [
        [
            'link', {rel: 'apple-touch-icon', sizes: '76x76', href: '/favicon.png'}
        ],
        [
            'link', {rel: 'icon', href: '/favicon.svg'},
        ],
        [
            'meta', {name: 'keywords', content: '薄荷拼音,薄荷输入法,rime,小狼毫,鼠须管,Linux上配置rime,小狼毫初始化'}
        ],
        // 万维AD
        [
            'script', {
            type: 'text/javascript',
            charset: 'UTF-8',
            src: 'https://cdn.wwads.cn/js/makemoney.js',
            async: ''
        }
        ],
        // Google ADSense
        [
            'script', {
            type: 'text/javascript',
            src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8322854923336162',
            async: '',
            crossorigin: 'anonymous'
        }
        ],
        // Umami
        [
            'script', {
            type: 'text/javascript',
            src: 'https://umami-console.mintimate.cn/script.js',
            'data-website-id': 'a8627773-87e5-403f-8579-b3baf4d4e368',
            async: ''
        }
        ],
        // 万维AD检测
        [
            'script', {
            type: 'text/javascript',
            src: '/verifyBlock.js',
        }
        ],
    ],
    /** 多语言设置 */
    locales: {
        root: {
            label: locales_cn.label,
            title: locales_cn.title,
            description: locales_cn.description,
            lang: 'zh',
            link: '/zh/',
            themeConfig: {
                nav: locales_cn.nav,
                outline:{
                    level: locales_cn["outline"]["level"],
                    label: locales_cn["outline"]["label"],
                },
                sidebar: locales_cn.sidebar
            }
        },
        en: {
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
                    {text: 'About', link: '/en/teamInfo'},
                    {text: 'index', link: '/en/'},
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
                            {text: 'Appearance', link: '/en/demo/diffAppearance'},
                            {text: 'Reverse Lookup', link: '/en/demo/reverseWords'},
                            {text: 'Special Function Keys', link: '/en/demo/funcKeys'},
                        ]
                    }],
                    '/en/guide/': [{
                        text: 'Configuration Tutorial',
                        items: [
                            {text: 'Guide', link: '/en/guide/'},
                            {text: 'Install Rime', link: '/en/guide/installRime'},
                            {text: 'Import Oh-my-rime', link: '/en/guide/importMint'},
                            {text: 'Configuration and Overrides', link: '/en/guide/configurationOverride'},
                            {text: 'Emoji Configuration (OpenCC) ', link: '/en/guide/openccEmoji'},
                            {text: 'FuzzyPinyin', link: '/en/guide/fuzzyPinyin'},
                            {text: 'shortcutKeys', link: '/en/guide/shortcutKeys'},
                            {text: 'Customization Input', link: '/en/guide/customizationInput'},
                            {text: 'Device Sync', link: '/en/guide/deviceSync'},
                            {text: '[Optional] Q&A', link: '/en/guide/faQ'},
                        ]
                    }]
                },

            }
        },
    },
    themeConfig: {
        logo: '/favicon.svg',
        docFooter: {prev: '上一篇', next: '下一篇'},
        footer: {
            message: '<a href="https://www.mintimate.cn" target="_blank">Powered by creativity and powered by Mintimate</a>',
            copyright: '<a href="https://beian.miit.gov.cn" target="_blank">闽ICP备2021000722号-3</a> | ' +
                '          <a href="http://www.beian.gov.cn" target="_blank">闽公网安备 35021102001843号</a> <br/>' +
                '友情链接♥️: <a href="http://www.mintimate.cn" target="_blank">Mintimate\'s Blog</a> | <a href="https://www.cloudflare.com/" target="_blank">CloudFlare</a>'
        },
        // https://vitepress.dev/reference/default-theme-config

        socialLinks: [
            {icon: 'github', link: 'https://github.com/Mintimate/oh-my-rime'},
            {
                icon: {
                    svg: '<svg t="1692535423092" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31127" width="200" height="200"><path d="M512 1024c-56.096-89.344-97.184-137.728-123.296-145.184C201.216 825.248 64 652.672 64 448 64 200.576 264.576 0 512 0s448 200.576 448 448c0 203.168-135.232 374.72-320.608 429.632-26.88 7.968-69.376 56.768-127.392 146.368z m208.96-687.488c-0.704-6.752-1.472-13.6-2.368-20.544A32 32 0 0 0 686.848 288H230.496a32 32 0 0 0-31.744 27.968C165.984 574.656 252.64 704 458.656 704c110.848 0 187.136-37.44 228.864-112.288 104.544-3.776 160.48-46.656 160.48-127.712 0-78.784-44.224-122.368-127.04-127.488z m2.784 32.224c63.2 5.056 92.256 35.84 92.256 95.264 0 57.28-35.776 88.64-113.28 94.848 19.072-50.304 26.08-113.664 21.024-190.08zM192 704c0 42.656 106.656 64 320 64s320-21.344 320-64c-64 21.344-170.656 32-320 32s-256-10.656-320-32zM362.24 268.288C408.64 229.664 432 200.416 432 176c0-24.416-23.392-53.664-69.76-92.288a16 16 0 1 0-20.48 24.576C380.736 140.8 400 164.864 400 176c0 11.136-19.264 35.232-58.24 67.712a16 16 0 1 0 20.48 24.576z m96 0C504.64 229.664 528 200.416 528 176c0-24.416-23.392-53.664-69.76-92.288a16 16 0 1 0-20.48 24.576C476.736 140.8 496 164.864 496 176c0 11.136-19.264 35.232-58.24 67.712a16 16 0 1 0 20.48 24.576z m96 0C600.64 229.664 624 200.416 624 176c0-24.416-23.392-53.664-69.76-92.288a16 16 0 1 0-20.48 24.576C572.736 140.8 592 164.864 592 176c0 11.136-19.264 35.232-58.24 67.712a16 16 0 1 0 20.48 24.576z" fill="#BEBEBE" p-id="31128"></path></svg>'
                }, link: 'https://afdian.net/a/mintimate'
            },
            {
                icon: {
                    svg: '<svg t="1692535452107" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32228" width="200" height="200"><path d="M977.2 208.2c33.4 36.2 48.8 79.4 46.6 131.4v404.8c-0.8 52.8-18.4 96.2-53 130.2-34.4 34-78.2 51.8-131 53.4H184.04c-52.9-1.6-96.42-19.6-130.56-54.4C19.364 838.8 1.534 793 0 736.4V339.6c1.534-52 19.364-95.2 53.48-131.4C87.62 175.5 131.14 157.54 184.04 156h58.76L192.1 104.38c-11.5-11.46-17.26-26-17.26-43.58 0-17.6 5.76-32.12 17.26-43.594C203.6 5.736 218.2 0 235.8 0s32.2 5.736 43.8 17.206L426.2 156h176l149-138.794C763.4 5.736 778.4 0 796 0c17.6 0 32.2 5.736 43.8 17.206 11.4 11.474 17.2 25.994 17.2 43.594 0 17.58-5.8 32.12-17.2 43.58L789.2 156h58.6c52.8 1.54 96 19.5 129.4 52.2z m-77.6 139.4c-0.8-19.2-7.4-34.8-21.4-47-10.4-12.2-28-18.8-45.4-19.6H192.1c-19.18 0.8-34.9 7.4-47.16 19.6-12.28 12.2-18.8 27.8-19.56 47v388.8c0 18.4 6.52 34 19.56 47s28.76 19.6 47.16 19.6H832.8c18.4 0 34-6.6 46.6-19.6 12.6-13 19.4-28.6 20.2-47V347.6z m-528.6 85.4c12.6 12.6 19.4 28.2 20.2 46.4V546c-0.8 18.4-7.4 33.8-19.6 46.4-12.4 12.6-28 19-47.2 19-19.2 0-35-6.4-47.2-19-12.2-12.6-18.8-28-19.6-46.4v-66.6c0.8-18.2 7.6-33.8 20.2-46.4 12.6-12.6 26.4-19.2 46.6-20 18.4 0.8 34 7.4 46.6 20z m383 0c12.6 12.6 19.4 28.2 20.2 46.4V546c-0.8 18.4-7.4 33.8-19.6 46.4-12.2 12.6-28 19-47.2 19-19.2 0-34.8-6.4-47.2-19-14-12.6-18.8-28-19.4-46.4v-66.6c0.6-18.2 7.4-33.8 20-46.4 12.6-12.6 28.2-19.2 46.6-20 18.4 0.8 34 7.4 46.6 20z" p-id="32229"></path></svg>'
                }, link: 'https://space.bilibili.com/355567627'
            },
        ],
    },
    sitemap: {
        hostname: 'https://www.mintimate.cc'
    }
})
