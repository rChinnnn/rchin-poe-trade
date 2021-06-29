import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "@/assets/scss/main.scss";

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// BootstrapVue and its default variables
// import 'bootstrap-vue/src/index.scss';
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
Vue.component('v-select', vSelect)

import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
Vue.component('multiselect', Multiselect)

import VueCountdown from '@chenfengyuan/vue-countdown';
Vue.component(VueCountdown.name, VueCountdown);

import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css'
import { Message } from 'element-ui';
const $message = options => {
  return Message({
    ...options,
    offset: 50,
    center: true,
    showClose: true,
  });
};
['success', 'warning', 'info', 'error'].forEach(type => {
  $message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
        offset: 50,
        center: true,
        showClose: true,
      };
    }
    options.type = type;
    return Message(options);
  };
});
Vue.prototype.$message = $message;

import moment from 'moment'
Vue.prototype.$moment = moment

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
