// ethStore.js
import bitcoinService from "@/services/bitcoinService";
// import notify from "@/services/notify";

const bitcoinStore = {
  namespaced: true,
  state: {
    clientState: {},
    balance: 0,
    target: 100.0
  },
  getters: {
    getClientState: state => {
      return state.clientState;
    },
    getBalance: state => {
      return state.balance;
    },
    getTarget: state => {
      return state.target;
    }
  },
  mutations: {
    bitcoinClientState(state, clientState) {
      state.clientState = clientState;
    },
    setBalance(state, balance) {
      state.balance = balance;
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
    },
    fetchBalance({ commit }) {
      return new Promise(resolve => {
        bitcoinService.fetchBalance(
          function(balance) {
            commit("setBalance", balance);
            resolve(balance);
          },
          function() {
            resolve(0);
          }
        );
      });
    }
  }
};
export default bitcoinStore;
