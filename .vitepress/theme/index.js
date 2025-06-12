// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import wwads from './components/wwads.vue'
import donate from './components/donate.vue'
import rime from './components/rime.vue'
import customHomeFeaturesBefore from './customHomeFeaturesBefore.vue'
import {watch} from "vue";
export default {
    ...DefaultTheme,
    Layout: customHomeFeaturesBefore,
    enhanceApp({ app, router, siteData }) {
        DefaultTheme.enhanceApp({ app, router, siteData })
        app.component('wwads', wwads)
        app.component('donate', donate)
        app.component('rime', rime)
        watch(router.route, () => {
            if (router.route.path.endsWith('ex.html')) {
                // 解决中文首页切换语言，跳转到dex.html问题
                const newIndex = router.route.path.replace("ex.html","")
                router.go(newIndex)
            }
        })
    }
}