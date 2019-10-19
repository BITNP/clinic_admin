import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
const VueLocalStorage = require("vue-localstorage");

Vue.use(VueLocalStorage);
// for django csrf token
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.config && error.response.data) {
      console.group(
        `(getErr)[${error.response.config.method}] ${error.response.config.url}`
      );
      console.info(error.response.data);
      console.groupEnd();
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
