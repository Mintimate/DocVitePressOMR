// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import customHomeFeaturesBefore from './customHomeFeaturesBefore.vue'
import {watch} from "vue";
export default {
    ...DefaultTheme,
    Layout: customHomeFeaturesBefore,
    enhanceApp({ app, router, siteData }) {
        watch(router.route, () => {
            if (router.route.path.endsWith('ex.html')) {
                // 解决中文首页切换语言，跳转到dex.html问题
                const newIndex = router.route.path.replace("ex.html","")
                router.go(newIndex)
            }
        })
    }
}