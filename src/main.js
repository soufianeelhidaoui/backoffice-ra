/*!

=========================================================
* BootstrapVue Argon Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/bootstrap-vue-argon-dashboard-pro
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from 'vue';
import DashboardPlugin from './plugins/dashboard-plugin';
import App from './App.vue';
import './util/filters';
import { BVToastPlugin } from 'bootstrap-vue'
import './vee-validate/index.js'

Vue.use(BVToastPlugin)
// router setup
import router from './routes/router';
// store
import store from './services/store'
// plugin setup
Vue.use(DashboardPlugin);

import VueResource from 'vue-resource'
Vue.use(VueResource);
Vue.http.options.root = process.env.VUE_APP_BUSINESS_API_ENDPOINT;
//Ajout d'un bus d'événement
import userRepository from "@/repositories/userRepository";

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  created() {
    // Vue.http.interceptors.push((request, next) => {
    //   request.credentials = true;

    //   let token = localStorage.getItem('token');

    //   if (token)
    //     request.headers.set('Authorization', 'Bearer ' + token);

    //   next()
    // });

    // let token = localStorage.getItem('token');

    // if (!token)
    //   this.$router.push({
    //     name: 'Login'
    //   });

    let self = this;
    let refreshTokenPromise = null;
    Vue.prototype.$eventBus = new Vue()

    Vue.http.interceptors.push(function (request) {
      return function (response) {

        if (response.status === 509) {

          self.$error(response.body.status_text)
          return;
        }

        if (response.status === 401 && localStorage.getItem('refresh_token')) {
          if (!refreshTokenPromise) {

            refreshTokenPromise = userRepository.refresh().then(result => {

              refreshTokenPromise = null

            }).catch(() => {

              let login = localStorage.getItem('login');
              localStorage.clear();

              if (login)
                localStorage.setItem('login', login);

              let prop = router.resolve({
                name: 'Login'
              });

              window.location.href = prop.href;
            })
          }

          return refreshTokenPromise.then(token => {
            return Vue.http(request)
          })
        }
      }
    });

  }
});
