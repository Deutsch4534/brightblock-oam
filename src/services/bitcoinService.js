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
  registerTx: function(data, success, failure) {
    //success({
    //  rawTx: "bananas",
    //  decodedTransaction: "oranges"
    //});
    let endPoint = store.state.constants.btcGatewayUrl + "/bitcoin/register";
    xhrService.makePostCall(endPoint, data).then(function(response) {
      success(response.data.details);
    });
  }
};
export default bitcoinService;
