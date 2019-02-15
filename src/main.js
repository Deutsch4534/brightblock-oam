import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbvue/build/css/mdb.css';
import Vue from "vue";
import App from "./App.vue";
import Vuex from "vuex";
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
  endpoint: "https://transit8.prismic.io/api/v2",
  linkResolver
});
Vue.use(VueMasonryPlugin);

Vue.config.productionTip = false;

const NavbarStore = {
  showNavbar: false
};

Vue.mixin({
  data() {
    return {
      NavbarStore
    };
  },
  methods: {
    toggleMenu(){
      const toggler = document.querySelector('.navbar-toggler');
      toggler.click();
    },
    closeMenu() {
      const nav = document.querySelector('.navbar-collapse');
      if (nav.classList.contains('show-navbar')){
        this.toggleMenu();
      }
    }
  }
});
store.commit("constants", CONSTANTS);
store.dispatch("fetchServerTime");
store.dispatch("myArtworksStore/fetchMyArtworks");
store.dispatch("myAuctionsStore/fetchMyAuctions");
store.dispatch("onlineAuctionsStore/fetchOnlineAuctions");
store.dispatch("conversionStore/fetchConversionData").then(() => {
  store.dispatch("myAccountStore/fetchMyAccount");
  store.dispatch("ethStore/receiveBlockchainEvents").then(() => {
    if (store.getters.isDebugMode) {
      // notify.info({ title: "Blockchain Events.", text: message });
    }
  });
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
