<template>
<mdb-container class="mt-5">
  <!-- Supported elements -->
  <h2 class="my-5">{{formTitle}}</h2>
  <hr class="my-5">
  <form class="needs-validation" novalidate @submit.prevent="checkForm">
    <div class="row">
      <div class="col-md-2 custom-control custom-radio mb-0">
        <input type="radio" class="custom-control-input" id="customControlValidation2" name="auction.auctionType" v-model="auction.auctionType" value="webcast" required>
        <label class="custom-control-label" for="customControlValidation2">Webcast Auction</label>
      </div>
      <div class="col-md-2 custom-control custom-radio mb-0">
        <input type="radio" class="custom-control-input" id="customControlValidation1" name="auction.auctionType" v-model="auction.auctionType" value="timed" required>
        <label class="custom-control-label" for="customControlValidation1">Timed Auction</label>
      </div>
      <div class="col-md-2 custom-control custom-radio mb-0">
        <input type="radio" class="custom-control-input" id="customControlValidation3" name="auction.auctionType" v-model="auction.auctionType" value="sealed" required>
        <label class="custom-control-label" for="customControlValidation3">Sealed Bid Auction</label>
      </div>
      <!--
      <div class="col-md-2 custom-control custom-radio mb-3">
        <input type="radio" class="custom-control-input" id="customControlValidation0" name="auction.auctionType" v-model="auction.auctionType" value="penny" required>
        <label class="custom-control-label" for="customControlValidation0">Penny Auction</label>
      </div>
      -->
    </div>

    <div class="row mt-3">
      <div class="col-md-12">
        <p v-if="errors.length" :key="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, index) in errors" :key="index" v-bind:error="error">{{ error }}</li>
          </ul>
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="form-row" v-if="auction.auctionType === 'sealed'">
          <div class="col-md-12 mb-3">
            <label for="sealedAddress">Destination Bitcoin Address</label>
            <input type="text" class="form-control" id="sealedAddress" placeholder="Bitcoin address" v-model="auction.sealedAddress" required>
            <div class="invalid-feedback">
              Please enter bitcoin address!
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-12 mb-3">
            <label for="title">Title</label>
            <input type="text" class="form-control" id="title" placeholder="Title of the auction" v-model="auction.title" required>
            <div class="invalid-feedback">
              Please enter a title!
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-12 mb-3">
            <label for="description">description</label>
            <textarea type="text" class="form-control" id="description" placeholder="Description of your auction" v-model="auction.description" required></textarea>
            <div class="invalid-feedback">
              Please enter a description!
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-12 mb-3">
            <label for="keywords">Keywords or tags</label>
            <textarea type="text" class="form-control" id="keywords" placeholder="Enter keywords / tags separated by commas" v-model="auction.keywords" required></textarea>
            <div class="invalid-feedback">
              Please enter some keywords!
            </div>
          </div>
        </div>
        <div class="row my-3 ml-5">
          <div class="col-md-4 custom-control">
            <input type="radio" class="custom-control-input" id="custom-public" v-model="auction.privacy" value="public">
            <label class="custom-control-label mr-5" for="custom-public">Public</label>
          </div>
          <div class="col-md-4 custom-control">
            <input type="radio" class="custom-control-input" id="custom-private" v-model="auction.privacy" value="private">
            <label class="custom-control-label" for="custom-private">Private</label>
          </div>
        </div>

        <div class="form-group">
          <datetime type="datetime" v-model="startDate" input-id="startDate">
            <label for="startDate" slot="before">Bidding Starts&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input id="startDate" class="form-control">
          </datetime>
        </div>

        <div class="form-group" v-if="auction.auctionType !== 'webcast'">
          <datetime type="datetime" v-model="endDate" input-id="endDate">
            <label for="endDate" slot="before">Bidding Ends&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input id="endDate" class="form-control">
          </datetime>
        </div>

        <mdb-btn type="submit" class="white">Submit</mdb-btn>

      </div>

      <div class="col-md-4">
        <h4>Set Auction Logo</h4>
        <p class="muted"><small>Size limit: 500Kb</small></p>
        <media-upload :logo="auction.logo" @updateMedia="setByEventLogo($event)"/>
        <p class="muted" v-if="auction.logo && auction.logo.dataUrl"><small>{{auction.logo.name}}</small></p>
      </div>
    </div>
  </form>
</mdb-container>
</template>

<script>
import moment from "moment";
import { mdbBtn } from "mdbvue";
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
import { Datetime } from 'vue-datetime'
import MediaUpload from "../MediaUpload";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUploadForm",
  props: ["auctionId", "mode"],
  components: {
    mdbContainer,
    mdbBtn,
    mdbContainer,
    mdbRow,
    mdbCol,
    datetime: Datetime,
    MediaUpload
  },
  data () {
    return {
      isModalActive: false,
      errors: [],
      formTitle: "Auction Details",
      startDate: null,
      endDate: null,
      auction: {
        title: null,
        description: null,
        keywords: null,
        auctioneer: '',
        privacy: 'public',
        auctionType: "webcast",
        sellingList: [],
        logo: {}
      },
    }
  },
  mounted() {
    let auction = this.$store.getters["myAuctionsStore/myAuction"](
      this.auctionId
    );
    if (auction) {
      this.auction = auction;
      if (!auction.logo) {
        auction.logo = {};
      }
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
    },
    convertToMedia() {
      if (this.auction && this.auction.logo && this.auction.logo.dataUrl) {
        let stuff = [];
        return stuff.push(this.auction.logo);
      }
      return [];
    }
  },
  methods: {
    upload: function() {
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
            this.$router.push("/my-auctions");
          });
      } else {
        this.auction.auctionId = moment({}).valueOf();
        this.$store
          .dispatch("myAuctionsStore/uploadAuction", this.auction)
          .then(auction => {
            this.auction = auction;
            this.$router.push("/my-auctions");
          });
      }
    },
    setByEventLogo (mediaObjects) {
      this.auction.logo = mediaObjects[0];
    },
    checkForm(event) {
      event.preventDefault();
      event.target.classList.add('was-validated');
      if (this.auction.auctionType === "sealed") {
        this.showSealedError = true;
      }
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
        this.upload();
      }
    }
  }
};
</script>
<style>
</style>
