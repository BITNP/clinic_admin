/*
 * @Date: 2019-08-12 21:22:19
 * @LastEditTime: 2019-08-12 21:22:35
 * @Description: file content
 * @LastEditors: Feng Kaiyu
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify';
import axios from "axios";

// for django csrf token
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
