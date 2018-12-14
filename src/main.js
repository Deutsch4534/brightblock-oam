import Vue from "vue";
import App from "./App.vue";
import Vuex from "vuex";
import router from "./router";
import store from "@/storage/store";
import MaterialKit from "./plugins/material-kit";

import { CONSTANTS } from "@/storage/constants";
import notify from "@/services/notify";
import ethereumService from "@/services/ethereumService";

Vue.config.productionTip = false;

Vue.use(MaterialKit);
Vue.use(Vuex);

const NavbarStore = {
  showNavbar: false
};

Vue.mixin({
  data() {
    return {
      NavbarStore
    };
  }
});
store.commit("constants", CONSTANTS);
store.dispatch("fetchServerTime");
store.dispatch("conversionStore/fetchConversionData").then(() => {
  store.dispatch("myAccountStore/fetchMyAccount");
  store.dispatch("ethStore/fetchClientState").then(clientState => {
    ethereumService.connectToBlockChain(clientState);
    store.dispatch("ethStore/fetchBlockchainItems").then(blockchainItems => {
      store.dispatch("myArtworksStore/fetchMyArtworks");
      store.dispatch(
        "artworkSearchStore/fetchRegisteredArtworks",
        blockchainItems
      );
      store.dispatch("ethStore/receiveBlockchainEvents").then(message => {
        if (store.getters["isDebugMode"]) {
          notify.info({ title: "Blockchain Events.", text: message });
        }
      });
    });
  });
  store.dispatch("myAuctionsStore/fetchMyAuctions");
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
