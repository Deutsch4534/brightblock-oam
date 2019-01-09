// ethStore.js
import bitcoinService from "@/services/bitcoinService";
// import notify from "@/services/notify";

const bitcoinStore = {
  namespaced: true,
  state: {
    clientState: {}
  },
  getters: {
    getClientState: state => {
      return state.clientState;
    }
  },
  mutations: {
    bitcoinClientState(state, clientState) {
      state.clientState = clientState;
    }
  },
  actions: {
    fetchClientState({ commit }) {
      return new Promise(resolve => {
        bitcoinService.fetchClientState(
          function(clientState) {
            commit("bitcoinClientState", clientState);
            resolve(clientState);
          },
          function(error) {
            /**
            notify.error({
              title: "Blockchain Client.",
              text: "Error fetching blockchain state.<br>" + error
            });
            **/
            resolve({
              client: "Error - client not connected: " + error
            });
          }
        );
      });
    }
  }
};
export default bitcoinStore;
