import xhrService from "@/services/xhrService";

const bitcoinService = {
  fetchClientState: function(success, failure) {
    let callee =
      process.env.VUE_APP_BTC_GATEWAY_URL + "/bitcoin/getblockchaininfo";
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
    let callee = process.env.VUE_APP_BTC_GATEWAY_URL + "/bitcoin/getbalance";
    xhrService
      .makeDirectCall(callee)
      .then(function(response) {
        success(response.details.result);
      })
      .catch(function(e) {
        failure(e);
      });
  }
};
export default bitcoinService;
