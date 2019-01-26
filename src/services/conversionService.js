// import eventBus from '@/services/eventBus'
import SockJS from "sockjs-client";
import Stomp from "@stomp/stompjs";
import store from "@/storage/store";

const conversionService = {
  connectExchangeRates: function() {
    let socket = new SockJS(store.state.constants.ethGatewayUrl + "/exchanges");
    let stompClient = Stomp.over(socket);
    let connectSuccess = function() {
      stompClient.subscribe("/topic/exchanges", function(response) {
        conversionService.fiatRates = JSON.parse(response.body);
      });
    };
    let connectError = function(error) {
      if (error.headers) {
        console.log("[SysadmOnly] WebSocket Error: " + error);
      } else {
        console.log("[SysadmOnly] WebSocket Error: " + error);
      }
    };
    stompClient.connect(
      {},
      connectSuccess,
      connectError
    );
  }
};
export default conversionService;
