import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './css/app.css'

import App from './App.vue'
import setPageTitle from './boot/set-page-title'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(VueQueryPlugin)
setPageTitle(router)
app.use(router)

app.mount('#app')
