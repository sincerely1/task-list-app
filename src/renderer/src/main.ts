import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '@renderer/router/index'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//main.js
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import '@renderer/assets/css/ContextMenu.scss'
import ContextMenu from '@imengyu/vue3-context-menu'


import './assets/css/global.scss'
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(ContextMenu)
app.mount('#app')
