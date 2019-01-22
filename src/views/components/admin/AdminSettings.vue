<template>
<div>
  <h2 class="title">Application Settings</h2>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Domain:</div>
    <div class="md-layout-item md-size-80">{{ constants.domain }}</div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Environment:</div>
    <div class="md-layout-item md-size-80">{{ process.env.NODE_ENV }}</div>
  </div>
  <h3>API Settings</h3>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Shape Shift:</div>
    <div class="md-layout-item md-size-80">{{ process.env.VUE_APP_SHAPE_SHIFT_URL }}</div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Gaia Hub:</div>
    <div class="md-layout-item md-size-80">{{ process.env.VUE_APP_GAIA_HUB_URL }}</div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Search:</div>
    <div class="md-layout-item md-size-80">{{ process.env.VUE_APP_SEARCH_INDEX_URL }}</div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Eth Gateway:</div>
    <div class="md-layout-item md-size-80">{{ process.env.VUE_APP_ETH_GATEWAY_URL }}</div>
  </div>

  <h3>Debug Settings</h3>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Debug Mode:</div>
    <div class="md-layout-item md-size-80"><md-button class="md-primary" @click.prevent="toggleDebugMode">{{debugModeLabel}}</md-button></div>
  </div>

  <h3>Gaia Test Settings</h3>
  <div class="md-layout">
    <div class="col-sm-12">Only works on localhost and mike.personal.id as the oauth token.</div>
    <div class="md-layout-item md-size-20"></div>
    <div class="md-layout-item md-size-80">
      <md-button class="md-primary" @click.prevent="gaiaHubInfoCheck">Check Hub Info</md-button>
      <md-button class="md-primary" @click.prevent="gaiaListFilesCheck">Check List Files</md-button>
      <md-button class="md-primary" @click.prevent="gaiaStoreCheck">Store Random File</md-button>
    </div>
  </div>
  <div class="md-layout" v-if="gaiaResult">
    <div class="md-layout-item md-size-20"></div>
    <div class="md-layout-item md-size-80">{{gaiaResult}}</div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20"></div>
    <div class="md-layout-item md-size-80">
      <ul>
        <li v-for="(index, file) in gaiaListResult" :key="index">{{file}}: <a href="#" @click.prevent="gaiaGetFile(index)">{{ index }}</a></li>
      </ul>
    </div>
  </div>
  <div class="md-layout" v-if="gaiaFileResult">
    <div class="md-layout-item md-size-20"></div>
    <div class="md-layout-item md-size-80">{{gaiaFileResult}}</div>
  </div>

  <h3>Webrtc Settings</h3>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Tokbox API:</div>
    <div class="md-layout-item md-size-80">{{ process.env.VUE_APP_TOK_BOX_API_KEY }}</div>
  </div>

  <h3>Ethereum Settings</h3>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Contract API:</div>
    <div class="md-layout-item md-size-80">{{ clientState.contractAddress }}</div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Load Contract:</div>
    <div class="md-layout-item md-size-80">
      <md-field>
        <label>Initial Value</label>
        <md-input v-model="contractAddress" placeholder="Drop contract address here: 0x..." v-on:keyup.13="loadContract"></md-input>
      </md-field>
    </div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Client:</div>
    <div class="md-layout-item md-size-80">{{ clientState.client }}</div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Meta Mask:</div>
    <div class="md-layout-item md-size-80">{{ clientState.metaMaskNetwork.networkId }} ({{ clientState.metaMaskNetwork.networkName }}</div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Expected:</div>
    <div class="md-layout-item md-size-80">{{ networkExpected }}</div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-20">Items Registered:</div>
    <div class="md-layout-item md-size-80">{{ clientState.numbItems }}</div>
  </div>
</div>
</template>

<script>
import ethereumService from "@/services/ethereumService";
import axios from "axios";

const gaiaAuthToken =
  "v1:eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJnYWlhQ2hhbGxlbmdlIjoiW1wiZ2FpYWh1YlwiLFwiMjAxOFwiLFwiXCIsXCJibG9ja3N0YWNrX3N0b3JhZ2VfcGxlYXNlX3NpZ25cIl0iLCJodWJVcmwiOiJodHRwczovL2dhaWEuYnJpZ2h0YmxvY2sub3JnIiwiaXNzIjoiMDIyNmVlZjk2MDI4YWYwMTQ1M2YwYzk2NGE0MTcxMGEzZDgwNGQ3MGY2MTgyOTZkMGVjMzczY2MxMGFhYjEwNjM4Iiwic2FsdCI6ImRmODk3YWRkMjVjZDBiNjE1MjUxZjViMmY1OGI3ODllIn0.FoeOdvMqWFU9tqVtToUHE7axjsA0YK_YArhFCXQ0eytRvJbkeW2S1h2V_iQF2311wq322CaPoIRZIxC6Rgqccg";

export default {
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
  created() {
    let hubConfig = localStorage.getItem("blockstack-gaia-hub-config");
    let hubJSON = JSON.parse(hubConfig);
    this.address = hubJSON.address;
    this.gaiaHubUrl = process.env.VUE_APP_GAIA_HUB_URL;
    this.network = ethereumService.getNetworkType();
    this.networkExpected = process.env.VUE_APP_ETHEREUM_NETWORK;
  },
  methods: {
    toggleDebugMode() {
      this.$store.commit("debugMode");
    },
    listFilesUrl(file) {
      return this.gaiaHubUrl + "/" + this.address + "/" + file;
    },
    gaiaHubInfoCheck() {
      this.gaiaFileResult = null;
      this.gaiaListResult = [];
      this.gaiaResult = null;
      let callInfo = {
        method: "get",
        url: this.gaiaHubUrl + "/hub_info",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      };
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          this.gaiaResult = response.data;
        })
        .catch(e => {
          this.gaiaResult = e.message;
        });
    },
    gaiaListFilesCheck() {
      this.gaiaFileResult = null;
      this.gaiaListResult = [];
      this.gaiaResult = null;
      let callInfo = {
        method: "get",
        url: this.gaiaHubUrl + "/list-files/" + this.address,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      };
      let $self = this;
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          $self.gaiaListResult = response.data;
        })
        .catch(e => {
          $self.gaiaResult = e.message;
        });
    },
    gaiaStoreCheck() {
      this.gaiaResult = null;
      this.gaiaFileResult = null;
      let data = {
        test: "test storing a file in aws s3 bucket via gaia",
        random: Math.random().toString(36)
      };
      axios({
        method: "post",
        url:
          this.gaiaHubUrl + "/store/" + this.address + "/gaia_store_test.json",
        data: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      })
        .then(response => {
          this.gaiaStoreResult = response.data;
          this.gaiaGetFile("gaia_store_test.json");
        })
        .catch(e => {
          this.gaiaStoreResult = e.message;
        });
    },
    gaiaGetFile(file) {
      this.gaiaResult = null;
      let callInfo = {
        method: "get",
        url: this.gaiaHubUrl + "/read/" + this.address + "/" + file,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + gaiaAuthToken
        }
      };
      let $self = this;
      axios
        .get(callInfo.url, { headers: callInfo.headers })
        .then(response => {
          $self.gaiaFileResult = response.data;
        })
        .catch(e => {
          $self.gaiaFileResult = e.message;
        });
    },
    loadContract() {
      ethereumService.loadContract(this.contractAddress);
      location.reload();
    }
  },
  computed: {
    clientState() {
      let clientState = this.$store.state.ethStore.clientState;
      return clientState;
    },
    debugMode() {
      let debugMode = process.env.VUE_APP_DEBUG_MODE;
      return debugMode;
    },
    debugModeLabel() {
      let debugMode = this.$store.getters["isDebugMode"];
      if (debugMode) {
        return "on";
      } else {
        return "off";
      }
    },
    constants() {
      return this.$store.state.constants;
    },
    localComputed() {
      return "hi there!";
    }
  },
  components: {}
};
</script>
