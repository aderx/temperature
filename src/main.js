import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import ECharts from 'vue-echarts/components/ECharts'

import message from '@/components/messageBox'
import radio from '@/components/radio'

import vueAxios from 'vue-axios'
import axios from 'axios'

Vue.component('v-chart', ECharts);

Vue.component('msg',message);
Vue.component('radio',radio);

library.add(fas);

Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(vueAxios, axios);



new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
