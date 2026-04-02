/**
 * 本地 Vite 开发入口：挂载 DevApp（场景数据经 Vite 代理 → wiki-mock HTTP；配置仅 URL 查询参数）。
 */
import { createApp } from 'vue'

import DevApp from '@/dev/DevApp.vue'
import '@/styles/nei-tokens.css'

createApp(DevApp).mount('#wiki-multi-structure-render')
