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
  <h3>Bitcoin Maintenance</h3>
  <div class="row">
    <div class="col-md-4">Consolidate Unspent Outputs:</div>
    <div class="col-md-8"><mdb-btn class="btn teal lighten-1" @click="consolidate">consolidate</mdb-btn></div>
  </div>

</div>
</template>

<script>
import bitcoinService from "@/services/bitcoinService";
import { mdbContainer, mdbRow, mdbCol, mdbInput, mdbTextarea, mdbBtn, mdbIcon, mdbModal, mdbModalHeader, mdbModalBody, mdbModalFooter } from 'mdbvue';

export default {
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbInput,
    mdbTextarea,
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    consolidate() {
      bitcoinService.consolidate(function(result) {
        console.log(result);
      });
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
