import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primevue/resources/primevue.min.css'
import 'remixicon/fonts/remixicon.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(createPinia())
app.use(router)

app.mount('#app')
