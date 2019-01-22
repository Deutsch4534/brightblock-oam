<template>
<div class="md-layout">
  <md-dialog-alert
    :md-active.sync="showAlert"
    :md-content="alertMessage"
    md-confirm-text="OK!" />
  <form novalidate class="md-layout" @submit.prevent="validateAuction">

    <md-card class="md-layout-item md-size-100 md-small-size-100">
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-100">
            <md-radio v-model="auction.auctionType" value="webcast">Webcast Auction</md-radio>
            <md-radio v-model="auction.auctionType" value="sealed">Sealed Bid Auction</md-radio>
            <md-radio v-model="auction.auctionType" value="timed" :disabled="true">Timed Auction</md-radio>
            <md-radio v-model="auction.auctionType" value="penny" :disabled="true">Penny Auction</md-radio>
          </div>
        </div>
      </md-card-content>
    </md-card>

    <md-card class="md-layout-item md-size-100 md-small-size-100">
      <md-card-content>
        <p v-if="errors.length" :key="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, index) in errors" :key="index" v-bind:error="error">{{ error }}</li>
          </ul>
        </p>
      </md-card-content>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-100" v-if="auction.auctionType === 'sealed'">
            <md-field :class="getValidationClass('sealedAddress')">
              <label for="title">Destination Bitcoin Address</label>
              <md-input name="title" id="sealedAddress" v-model="auction.sealedAddress" :disabled="sending" />
              <span class="md-error" v-if="!$v.auction.sealedAddress.required">The address is required for a sealed bid auction.</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('title')">
              <label for="title">Title</label>
              <md-input name="title" id="title" v-model="auction.title" :disabled="sending" />
              <span class="md-error" v-if="!$v.auction.title.required">The title is required</span>
              <span class="md-error" v-else-if="!$v.auction.title.minlength">Invalid first name</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('description')">
              <label for="description">Description</label>
              <md-textarea name="description" id="description" v-model="auction.description" required></md-textarea>
              <span class="md-error">The description is required</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('keywords')">
              <label for="keywords">Keywords</label>
              <md-textarea name="keywords" id="keywords" v-model="auction.keywords" required></md-textarea>
              <span class="md-error">Enter some keywords</span>
            </md-field>
          </div>
          <!--
          <div class="md-layout-item md-size-100" style="margin-top: 30px;" v-if="auction.auctionType === 'webcast' || auction.auctionType === 'sealed'">
              <datetime type="datetime" v-model="startDate" input-id="startDate">
                <label for="startDate" slot="before"><md-icon>calendar_today</md-icon> Auction Starts</label>
                <input id="startDate">
              </datetime>
          </div>
          <div class="md-layout-item md-size-100" v-else>
            <datetime type="datetime" v-model="endDate" input-id="endDate">
              <label for="endDate" slot="before"><md-icon>calendar_today</md-icon> Auction Ends</label>
              <input id="endDate">
            </datetime>
          </div>
          -->
        </div>
      </md-card-content>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-100">
            <md-radio v-model="auction.privacy" value="public">Public</md-radio>
            <md-radio v-model="auction.privacy" value="private">Private</md-radio>
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button type="submit" class="md-primary">Upload</md-button>
      </md-card-actions>
    </md-card>
  </form>
</div>
</template>

<script>
import moment from "moment";
// import { Datetime } from "vue-datetime";
// import { required, minLength } from "vuelidate/lib/validators";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUploadForm",
//  mixins: [validationMixin],
//  components: { datetime: Datetime },
  props: ["auctionId", "mode"],
  data() {
    return {
      errors: [],
      sending: false,
      showAlert: false,
      alertMessage: null,
      formTitle: "Upload Auction",
      startDate: null,
      endDate: null,
      auction: {
        title: "",
        description: "",
        keywords: "",
        auctioneer: "",
        auctionType: "webcast",
        privacy: "public",
        sellingList: [],
        sealedAddress: null
      }
    };
  },
  mounted() {
    let auction = this.$store.getters["myAuctionsStore/myAuction"](
      this.auctionId
    );
    if (auction) {
      this.auction = auction;
      this.startDate = moment(auction.startDate).format();
      this.endDate = moment(auction.endDate).format();
    } else {
      // let daysTillStart = Math.floor(Math.random() * 14) + 7
      let dd = moment({}).add(2, "days");
      dd.hour(10);
      dd.minute(0);
      this.startDate = dd.format();
      this.endDate = dd.add(2, "days").format();
    }
  },
  computed: {
    username() {
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      return profile.username;
    }
  },
  methods: {
    upload: function() {
      if (this.validate()) {
        this.openModal();
        let profile = this.$store.getters["myAccountStore/getMyProfile"];
        this.auction.auctioneer = profile.username;
        this.auction.administrator = profile.username;
        this.auction.startDate = moment(this.startDate).valueOf();
        this.auction.endDate = moment(this.endDate).valueOf();
        if (!this.auction.auctionType) {
          this.auction.auctionType = "webcast";
        }
        if (!this.auction.messages) {
          this.auction.messages = [];
        }
        if (this.mode === "update") {
          this.auction.auctionId = this.auctionId;
          this.$store
            .dispatch("myAuctionsStore/updateAuction", this.auction)
            .then(auction => {
              this.auction = auction;
              this.closeModal();
              this.$router.push("/my-auctions");
            });
        } else {
          this.auction.auctionId = moment({}).valueOf();
          this.$store
            .dispatch("myAuctionsStore/uploadAuction", this.auction)
            .then(auction => {
              this.auction = auction;
              this.closeModal();
              this.$router.push("/my-auctions");
            });
        }
      }
    },
    openModal() {},
    closeModal() {},
    validations() {
      if (this.auction.auctionType === "sealed") {
        return {
          sealedAddress: {
            required
          }
        };
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.auction[fieldName];
      if (field) {
        /**
        if (fieldName === "sealedAddress") {
          if (this.auction.auctionType === "sealed") {
            if (!this.auction.sealedAddress) {
              field.$invalid = true;
              field.$dirty = true;
            }
          }
        }
        **/
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateAuction() {
      this.$v.$touch();
      this.validate();
      if (!this.$v.$invalid && this.errors.length === 0) {
        this.upload();
      } else {
        this.showAlert = true;
        console.log("errros", this.$v);
        this.alertMessage = "Please fix the form errors indicated in red.. ";
      }
    },
    validate: function() {
      this.errors = [];
      if (!this.auction.title) {
        this.errors.push("title required.");
      }
      if (this.auction.auctionType === "sealed") {
        if (!this.auction.sealedAddress) {
          this.errors.push("bitcoin address required for sealed bid auction.");
        }
      }
      if (moment(this.startDate).isBefore(moment({}))) {
        this.errors.push("Start date before now.");
      }
      if (moment(this.endDate).isBefore(moment({}))) {
        this.errors.push("End date before now.");
      }
      if (moment(this.endDate).isBefore(this.startDate)) {
        this.errors.push("Ends before it starts.");
      }
      if (!this.auction.description) {
        this.errors.push("description required.");
      }
      if (!this.auction.keywords) {
        this.errors.push("keywords required.");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
<style>
</style>
