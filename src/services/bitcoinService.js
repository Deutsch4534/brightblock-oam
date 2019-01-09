import store from "@/storage/store";
import xhrService from "@/services/xhrService";

const bitcoinService = {
  fetchClientState: function(success, failure) {
    let callee =
      store.state.constants.btcGatewayUrl + "/bitcoin/getblockchaininfo";
    xhrService
      .makeDirectCall(callee)
      .then(function(response) {
        success(response);
      })
      .catch(function(e) {
        failure(e);
      });
  }
};
export default bitcoinService;
