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

import store from './store/index'

Vue.component('v-chart', ECharts);

Vue.component('msg',message);
Vue.component('radio',radio);

library.add(fas);

Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(vueAxios, axios);

Vue.prototype.$store = store;

Vue.prototype.$fetch = function (url,body,then){
  return fetch(this.$store.url(url),{
    method:"POST",
    headers:new Headers({'Content-Type': 'application/json'}),
    body
  }).then(d=>d.json()).then(d=>then ? then(d):'')
};


new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
