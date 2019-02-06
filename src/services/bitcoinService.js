import xhrService from "@/services/xhrService";
import store from "@/storage/store";

const bitcoinService = {
  fetchClientState: function(success, failure) {
    let callee =
      store.state.constants.btcGatewayUrl + "/bitcoin/getblockchaininfo";
    xhrService
      .makeDirectCall(callee)
      .then(function(response) {
        success(response.details.result);
      })
      .catch(function(e) {
        failure(e);
      });
  },
  fetchBalance: function(success, failure) {
    let callee = store.state.constants.btcGatewayUrl + "/bitcoin/getbalance";
    xhrService
      .makeDirectCall(callee)
      .then(function(response) {
        success(response.details.result);
      })
      .catch(function(e) {
        failure(e);
      });
  },
  register: function(data, success, failure) {
    // let callee = store.state.constants.btcGatewayUrl + "/bitcoin/register";
    return new Promise(resolve => {
      xhrService.makePostCall("/bitcoin/register", data).then(function(response) {
        resolve(response.data.details);
      });
    });
  }
};
export default bitcoinService;
