/**
 * wiki 专用工作台入口：由独立 Vite 构建产出，供 Huiji 导出时使用。
 */
import { createApp } from 'vue'

import WikiDevApp from '@/dev/WikiDevApp.vue'
import '@/styles/nei-tokens.css'

createApp(WikiDevApp).mount('#wsr-workbench-app')
