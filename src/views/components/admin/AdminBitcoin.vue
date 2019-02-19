<template>
<div>
  <h2 class="title">Bitcoin Data</h2>
  <div class="row">
    <div class="col-md-2">Chain:</div>
    <div class="col-md-10">{{ bitcoinState.chain }}</div>
  </div>
  <div class="row">
    <div class="col-md-2">Blocks:</div>
    <div class="col-md-10">{{ bitcoinState.blocks }}</div>
  </div>
  <h3>API Settings</h3>
  <div class="row">
    <div class="col-md-2">Bitcoin Gateway:</div>
    <div class="col-md-10">{{ constants.ethGatewayUrl }}</div>
  </div>

</div>
</template>

<script>
import ethereumService from "@/services/ethereumService";
import axios from "axios";

export default {
  components: {
  },
  data() {
    return {
      gaiaHubUrl: "",
      address: "",
      network: "",
      networkExpected: "",
      contract: "",
      numberOfItems: "",
      contractAddress: "",
      gaiaListResult: [],
      gaiaResult: null,
      gaiaStoreResult: null,
      gaiaFileResult: null
    };
  },
  mounted() {
    this.gaiaHubUrl = this.$store.state.constants.gaiaHubUrl;
    this.network = ethereumService.getNetworkType();
    this.networkExpected = this.$store.state.constants.networkExpected;
    let hubConfig = localStorage.getItem("blockstack-gaia-hub-config");
    let hubJSON = JSON.parse(hubConfig);
    this.address = hubJSON.address;
  },
  methods: {
    listUnspent() {
      ethereumService.loadContract(this.contractAddress);
      location.reload();
    }
  },
  computed: {
    bitcoinState() {
      let state = this.$store.getters["bitcoinStore/getBitcoinState"];
      return state;
    }
  }
};
</script>
