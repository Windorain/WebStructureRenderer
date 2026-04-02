/**
 * 本地 Vite 开发入口：挂载 DevApp（Mock /preview-api + URL/localStorage 仅 dev）。
 */
import { createApp } from 'vue'

import DevApp from '@/dev/DevApp.vue'
import '@/styles/nei-tokens.css'

createApp(DevApp).mount('#wiki-multi-structure-render')
