<template>
<mdb-container class="mt-5">
  <!-- Supported elements -->
  <h2 class="my-5">{{formTitle}}</h2>
  <hr class="my-5">
  <form class="needs-validation" novalidate @submit.prevent="checkForm">
    <div class="row ">
      <div class="col-md-2 custom-control custom-radio mb-0">
        <input type="radio" class="custom-control-input" id="customControlValidation2" name="auction.auctionType" v-model="auction.auctionType" value="webcast" required>
        <label class="custom-control-label" for="customControlValidation2">Webcast Auction</label>
      </div>
      <div class="col-md-2 custom-control custom-radio mb-0">
        <input type="radio" class="custom-control-input" id="customControlValidation3" name="auction.auctionType" v-model="auction.auctionType" value="sealed" required>
        <label class="custom-control-label" for="customControlValidation3">Sealed Bid Auction</label>
      </div>
      <div class="col-md-2 custom-control custom-radio mb-0">
        <input type="radio" class="custom-control-input" id="customControlValidation1" name="auction.auctionType" v-model="auction.auctionType" value="timed" required>
        <label class="custom-control-label" for="customControlValidation1">Timed Auction</label>
      </div>
      <div class="col-md-2 custom-control custom-radio mb-3">
        <input type="radio" class="custom-control-input" id="customControlValidation0" name="auction.auctionType" v-model="auction.auctionType" value="penny" required>
        <label class="custom-control-label" for="customControlValidation0">Penny Auction</label>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2 custom-control custom-radio mb-0">
        <p v-if="errors.length" :key="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, index) in errors" :key="index" v-bind:error="error">{{ error }}</li>
          </ul>
        </p>
      </div>
    </div>

    <div class="form-row" v-if="auction.auctionType === 'sealed'">
      <div class="col-md-12 mb-3">
        <label for="sealedAddress">Destination Bitcoin Address</label>
        <input type="text" class="form-control" id="sealedAddress" placeholder="Title" v-model="auction.sealedAddress">
        <div class="invalid-feedback">
          Please enter sealed address!
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-12 mb-3">
        <label for="title">Title</label>
        <input type="text" class="form-control" id="title" placeholder="Title" v-model="auction.title" required>
        <div class="invalid-feedback">
          Please enter a title!
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="col-md-12 mb-3">
        <label for="description">description</label>
        <textarea type="text" class="form-control" id="description" placeholder="Description" v-model="auction.description" required></textarea>
        <div class="invalid-feedback">
          Please enter a description!
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="col-md-12 mb-3">
        <label for="keywords">Keywords or tags</label>
        <textarea type="text" class="form-control" id="keywords" placeholder="Description" v-model="auction.keywords" required></textarea>
        <div class="invalid-feedback">
          Please enter some keywords!
        </div>
      </div>
    </div>

    <div class="row ">
      <div class="col-md-2 custom-control custom-radio mb-0">
        <input type="radio" class="custom-control-input" id="Public" name="auction.privacy" v-model="auction.privacy" value="public" required>
        <label class="custom-control-label" for="Public">Public</label>
      </div>
      <div class="col-md-2 custom-control custom-radio mb-0">
        <input type="radio" class="custom-control-input" id="Private" name="auction.privacy" v-model="auction.privacy" value="private" required>
        <label class="custom-control-label" for="Private">Private</label>
      </div>
    </div>

    <mdb-row>
      <mdb-col col="6">
        <mdb-time-picker
          :id="'timePickerTwo'"
          :placeholder="'Select your time'"
          :label="'format: 24h'"
          :hoursFormat="24"
          @getValue="getTimePickerValue"
        />
      </mdb-col>
    </mdb-row>

    <mdb-btn type="submit">Submit</mdb-btn>
  </form>
</mdb-container>
</template>

<script>
import moment from "moment";
import { mdbBtn } from "mdbvue";
import { mdbTimePicker, mdbContainer, mdbRow, mdbCol } from 'mdbvue';
import { mdbDatePicker } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUploadForm",
  props: ["auctionId", "mode"],
  components: {
    mdbContainer,
    mdbBtn,
    mdbTimePicker,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbDatePicker
  },
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
      },
      startDate: {
        date: ''
      },
      option: {
        type: 'day',
        week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        format: 'YYYY-MM-DD',
        placeholder: 'Please choose a date',
        inputStyle: {
          'display': 'inline-block',
          'padding': '6px',
          'line-height': '22px',
          'font-size': '16px',
          'border': '2px solid #fff',
          'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
          'border-radius': '2px',
          'color': '#5F5F5F'
        },
        color: {
          header: 'primary',
          headerText: 'white',
          checkedDay: 'primary'
        },
        buttons: {
          ok: 'Ok',
          cancel: 'Cancel'
        }
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
    getPickerValue(value) {
      console.log(value);
    },
    getTimePickerValue(value) {
      console.log(value);
    },
    closeModal() {},
    checkForm(event) {
      event.preventDefault();
      event.target.classList.add('was-validated');
      if (this.auction.auctionType === "sealed") {
        this.showSealedError = true;
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
