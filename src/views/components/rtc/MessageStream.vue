<template>
<div>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <h3>Messaging</h3>
      <md-field>
        <label>Messages</label>
        <md-textarea class="form-control" v-model="message" v-on:keyup.13.prevent="sendMessage"></md-textarea>
      </md-field>
    </div>
    <div class="md-layout-item md-size-100">
      <md-content class="md-scrollbar">
        <div v-for="(message, index) of messages" :key="index">
          {{message.username}}: {{message.content}} <br/>
        </div>
      </md-content>
    </div>
  </div>
</div>
</template>

<script>
import peerToPeerService from "@/services/peerToPeerService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MessageStream",
  props: {
    auctionId: null,
    admin: false
  },
  data() {
    return {
      message: ""
    };
  },
  computed: {
    messages() {
      let auction = {};
      if (this.admin) {
        auction = this.$store.getters["myAuctionsStore/myAuction"](
          this.auctionId
        );
      } else {
        auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
          this.auctionId
        );
      }
      if (!auction) {
        auction = {};
      }
      return auction.messages;
    }
  },
  methods: {
    sendMessage() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let data = {
        content: this.message,
        username: myProfile.username,
        auctionId: this.auctionId
      };
      this.message = "";
      if (this.admin) {
        this.$store.commit("myAuctionsStore/messageEvent", data);
      } else {
        peerToPeerService.sendPeerSignal({
          type: "wa-message-send-adm",
          data: data
        });
      }
    }
  }
};
</script>
<style>
.md-content {
  max-width: 400px;
  max-height: 200px;
  overflow: auto;
}
</style>
