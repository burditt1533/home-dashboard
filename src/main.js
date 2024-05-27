import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primevue/resources/primevue.min.css'
import 'remixicon/fonts/remixicon.css'
import Particles from "@tsparticles/vue3";
import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.


import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(createPinia())
app.use(router)
app.use(Particles, {
  init: async engine => {
      await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
      // await loadSlim(engine); // or you can load the slim version from "tsparticles-slim" if don't need Shapes or Animations
  },
});

app.mount('#app')
