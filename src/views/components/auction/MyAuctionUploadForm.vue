<template>
<mdb-container class="py-5">
  <!-- Supported elements -->
  <h1 class="h1-responsive">{{formTitle}}</h1>
  <form class="needs-validation py-5 form-transparent" novalidate @submit.prevent="checkForm" id="auctionForm">

    <!-- Input fields section -->
    <div class="row justify-content-between">
      <!-- Left column -->
      <div class="col-md-5 mb-4">

        <!-- Errors row -->
        <div class="row mb-3" :key="errors.length">
          <mdb-alert color="danger" v-if="errors.length" :key="errors.length" class="w-100">
            <h4 class="alert-heading h6">Please correct the following error(s):</h4>
            <hr>
            <ul class="list-unstyled small mb-0">
              <li :key="index" v-bind:error="error">{{ error }}</li>
              <li v-for="(error, index) in errors" :key="index" v-bind:error="error">{{ error }}</li>
            </ul>
          </mdb-alert>
        </div>

        <!-- Radio buttons row -->
        <div class="row mb-3">
          <div class="col-4 custom-control custom-radio mb-0">
            <input type="radio" class="custom-control-input" id="customControlValidation2" name="auction.auctionType"
                   v-model="auction.auctionType" value="webcast" required>
            <label class="custom-control-label" for="customControlValidation2">Webcast</label>
          </div>
          <div class="col-4 custom-control custom-radio mb-0">
            <input type="radio" class="custom-control-input" id="customControlValidation1" name="auction.auctionType"
                   v-model="auction.auctionType" value="timed" required>
            <label class="custom-control-label" for="customControlValidation1">Timed</label>
          </div>
          <div class="col-4 custom-control custom-radio mb-0">
            <input type="radio" class="custom-control-input" id="customControlValidation3" name="auction.auctionType"
                   v-model="auction.auctionType" value="sealed" required>
            <label class="custom-control-label" for="customControlValidation3">Sealed Bid</label>
          </div>
        </div>

        <div class="row mb-3" v-if="auction.auctionType === 'sealed'">
          <input type="text" class="form-control" id="sealedAddress" placeholder="Bitcoin address" v-model="auction.sealedAddress" required>
          <div class="invalid-feedback">
            Please enter bitcoin address!
          </div>
        </div>

        <div class="row mb-3">
          <input type="text" class="form-control" id="title" placeholder="Title of the auction" v-model="auction.title" required>
          <div class="invalid-feedback">
            Please enter a title!
          </div>
        </div>

        <div class="row mb-3">
          <textarea type="text" class="form-control" id="description" placeholder="Description of your auction" v-model="auction.description" required></textarea>
          <div class="invalid-feedback">
            Please enter a description!
          </div>
        </div>

        <div class="row mb-3">
          <textarea type="text" class="form-control" id="keywords" placeholder="Keywords" v-model="auction.keywords" required></textarea>
          <!--<p class="muted small mt-1">Enter keywords / tags separated by commas</p>-->
          <div class="invalid-feedback">
            Enter keywords / tags separated by commas
          </div>
        </div>

        <!-- Public / private buttons row -->
          <mdb-btn-group class="row my-3 d-flex">
            <div class="col-6">
              <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block" id="custom-public"
                       value="public" v-model="auction.privacy" @click.native="toggleActiveState1" :active="active1" required>
                Public
              </mdb-btn>
            </div>
            <div class="col-6">
              <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block" id="custom-private"
                       value="private" v-model="auction.privacy" @click.native="toggleActiveState2" :active="active2" required>
                Private
              </mdb-btn>
            </div>
          </mdb-btn-group>
      </div>

      <!-- Right column -->
      <div class="col-md-6">

        <!-- Auction dates -->
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="startDate" slot="before">Bidding starts at</label>
              <datetime type="datetime" v-model="startDate" input-id="startDate" input-class="form-control bg-transparent">
                <input id="startDate">
              </datetime>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group" v-if="auction.auctionType !== 'webcast'">
              <label for="endDate" slot="before">Bidding ends at</label>
              <datetime type="datetime" v-model="endDate" input-id="endDate" input-class="form-control bg-transparent">
                <input id="endDate">
              </datetime>
            </div>
          </div>
        </div>

        <!-- Drag and drop  -->
        <div class="row">
          <div class="col-12">
            <h2 class="h3-responsive my-4">Set Auction Cover Image</h2>
          </div>
          <div class="col-12 col-md-6">
            <media-upload :logo="auction.logo" @updateMedia="setByEventLogo($event)"/>
            <p class="grey-text small mt-2">Size limit: 500Kb</p>
            <!--<p class="muted mt-2" v-if="auction.logo && auction.logo.dataUrl"><small>{{auction.logo.name}}</small></p>-->
          </div>
        </div>
      </div>
    </div>
    <!-- /Input fields section -->

    <!-- Submit button row -->
    <div class="row">
      <div class="col-12 col-md-5 mt-4">
        <mdb-btn type="submit" size="lg" class="btn-main btn-block">Submit</mdb-btn>
      </div>
    </div>
    <div class="w-100"></div>
    <!-- /Submit button row -->
  </form>
</mdb-container>
</template>

<script>
import moment from "moment";
import { mdbBtn, mdbBtnGroup, mdbContainer, mdbRow, mdbCol, mdbAlert } from 'mdbvue';
import { Datetime } from 'vue-datetime'
import MediaUpload from "../MediaUpload";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUploadForm",
  props: ["auctionId", "mode"],
  components: {
    mdbContainer,
    mdbBtn,
    mdbBtnGroup,
    mdbRow,
    mdbCol,
    mdbAlert,
    datetime: Datetime,
    MediaUpload
  },
  data () {
    return {
      isModalActive: false,
      errors: [],
      formTitle: "Submit Auction",
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
        logo: {},
      },
      active1: false,
      active2: false,
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
    },
    toggleActiveState1() {
      this.active1 = true;
      this.active2 = false;
    },
    toggleActiveState2() {
      this.active1 = false;
      this.active2 = true;
    },
  }
};
</script>
<style>
</style>
<style scoped>
  .form-transparent .form-control,
  .form-transparent >>> .form-control,
  .form-transparent input,
  .form-transparent textarea,
  .form-transparent label {
    background-color: transparent;
    color: black;
    font-weight: 300;
    font-size: 0.85rem;
  }

  .form-transparent input::-webkit-input-placeholder,
  .form-transparent input::-moz-placeholder,
  .form-transparent input:-ms-input-placeholder,
  .form-transparent input:-moz-placeholder {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 300;
    font-size: 0.85rem;
  }

</style>
