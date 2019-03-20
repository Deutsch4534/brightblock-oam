import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbvue/build/css/mdb.css';
import './assets/styles.css';
import Vue from "vue";
import App from "./App.vue";
import Vuex from "vuex";
// import injectInitialState from "@/utils/injectInitialState";
import router from "./router";
import store from "@/storage/store";
import Notifications from "vue-notification";
import PrismicVue from "prismic-vue";
import linkResolver from "./prismic/linkResolver";

import { CONSTANTS } from "@/storage/constants";
// import notify from "@/services/notify";
import Datetime from "vue-datetime";
// You need a specific loader for CSS files
import "vue-datetime/dist/vue-datetime.css";
import {VueMasonryPlugin} from 'vue-masonry';

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Notifications);
Vue.use(Datetime);
Vue.use(PrismicVue, {
  endpoint: "https://radicle.prismic.io/api/v2",
  linkResolver
});
Vue.use(VueMasonryPlugin);

Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate () {
    store.commit("constants", CONSTANTS);
    store.dispatch("fetchServerTime");
    store.dispatch("bitcoinStore/fetchBalance");
    store.dispatch("bitcoinStore/fetchBitcoinState");
    store.dispatch("myAccountStore/fetchMyAccount").then(profile => {
      if (profile.loggedIn) {
        store.dispatch("invoiceStore/fetchInvoices");
      }
    });
    store.dispatch("conversionStore/fetchConversionData");
  }
});
app.$mount("#app");
