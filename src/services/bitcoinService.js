import xhrService from "@/services/xhrService";
import store from "@/storage/store";

const bitcoinService = {
  fetchBitcoinState: function(success, failure) {
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
    // let decTx = JSON.stringify({decodeTx: "03efesfewfew"});
    // success({"sentTx":"oranges", rawTx: "0r34ewwedscdsvd", decodedTransaction: decTx});
    let endPoint = store.state.constants.btcGatewayUrl + "/bitcoin/register";
    xhrService.makePostCall(endPoint, data).then(function(response) {
      success(response.data.details);
    });
  },
  lookupTransaction: function(data, success, failure) {
    let endPoint = store.state.constants.btcGatewayUrl + "/bitcoin/lookupTransaction";
    xhrService.makePostCall(endPoint, data).then(function(response) {
      success(response.data.details);
    });
  },
  consolidate: function(success, failure) {
    let endPoint = store.state.constants.btcGatewayUrl + "/bitcoin/consolidate";
    xhrService.makePostCall(endPoint).then(function(response) {
      success(response.data.details);
    });
  },
  paySeller: function(invoice, success, failure) {
    let endPoint = store.state.constants.btcGatewayUrl + "/bitcoin/paySeller";
    xhrService.makePostCall(endPoint, invoice).then(function(response) {
      success(response.data.details);
    });
  },
  checkAddress: function(data, success, failure) {
    let endPoint = store.state.constants.btcGatewayUrl + "/bitcoin/checkAddress";
    xhrService.makePostCall(endPoint, data).then(function(response) {
      success(response.data.details);
    });
  },
  messageForSeller: function(data, success, failure) {
    let endPoint = store.state.constants.btcGatewayUrl + "/bitcoin/messageForSeller";
    xhrService.makePostCall(endPoint, data).then(function(response) {
      success(response.data.details);
    });
  }
};
export default bitcoinService;
