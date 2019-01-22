// store.js
import Vue from "vue";
import Vuex from "vuex";
import { CONSTANTS } from "./constants";
import myArtworksStore from "./myArtworksStore";
import myAccountStore from "./myAccountStore";
import userProfilesStore from "./userProfilesStore";
import artworkSearchStore from "./artworkSearchStore";
import conversionStore from "./conversionStore";
import ethStore from "./ethStore";
import bitcoinStore from "./bitcoinStore";
import onlineAuctionsStore from "./onlineAuctionsStore";
import myAuctionsStore from "./myAuctionsStore";
import xhrService from "@/services/xhrService";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    myArtworksStore: myArtworksStore,
    myAccountStore: myAccountStore,
    userProfilesStore: userProfilesStore,
    artworkSearchStore: artworkSearchStore,
    conversionStore: conversionStore,
    ethStore: ethStore,
    bitcoinStore: bitcoinStore,
    myAuctionsStore: myAuctionsStore,
    onlineAuctionsStore: onlineAuctionsStore
  },
  state: {
    constants: {},
    serverTime: {}
  },
  getters: {
    isDebugMode: state => {
      return process.env.VUE_APP_DEBUG_MODE;
    },
    serverTime: state => {
      return state.serverTime;
    }
  },
  mutations: {
    serverTime(state, serverTime) {
      state.serverTime = serverTime;
    },
    constants(state) {
      state.constants = CONSTANTS;
    },
    debugMode(state) {
      state.constants.debugMode = !state.constants.debugMode;
    }
  },
  actions: {
    fetchServerTime({ commit, state }) {
      xhrService
        .makeGetCall("/api/server/time")
        .then(function(result) {
          commit("serverTime", result.timestamp + 1000); // add 1s to offset in flight time
          setInterval(function() {
            commit("serverTime", (state.serverTime += 1000));
          }, 1000);
        })
        .catch(function(e) {
          console.log(e);
        });
    }
  }
});
export default store;
