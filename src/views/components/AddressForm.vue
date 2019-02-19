<template>
<div>
  <div class="row mb-4">
    <div class="col-md-12">
      <mdb-popover trigger="click" :options="{placement: 'top'}">
        <div class="popover">
          <div class="popover-header">
            {{addressTitle}}
          </div>
          <div class="popover-body">{{addressBlurb}}</div>
        </div>
        <a @click.prevent="" slot="reference">
          {{addressTitle}} <mdb-icon far icon="question-circle" />
        </a>
      </mdb-popover>
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline1" placeholder="Address line 1" v-model="address.line1" required @change="addressChange">
    </div>
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline2" placeholder="Address line 2" v-model="address.line2" @change="addressChange">
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline3" placeholder="Address line 3" v-model="address.line3" @change="addressChange">
    </div>
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline4" placeholder="Town or city" v-model="address.city" @change="addressChange">
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline5" placeholder="Region" v-model="address.region" required @change="addressChange">
    </div>
    <div class="col-md-6">
      <input type="text" class="form-control" id="vline6" placeholder="Zip or postcode*" v-model="address.postcode" required @change="addressChange">
    </div>
  </div>
</div>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "AddressForm",
  components: {
    mdbContainer,
    mdbIcon,
    mdbPopover,
    mdbCol,
    mdbRow
  },
  props: ["address", "addressTitle", "addressBlurb"],
  data() {
    return {
      errors: [],
    };
  },
  mounted() {},
  computed: {
    blockstackProfile() {
      let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return blockstackProfile;
    }
  },
  methods: {
    addressChange: function() {
      this.$emit("addressUpdate", this.address);
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
