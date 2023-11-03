// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import customHomeFeaturesBefore from './customHomeFeaturesBefore.vue'
export default {
    ...DefaultTheme,
    Layout: customHomeFeaturesBefore,
}