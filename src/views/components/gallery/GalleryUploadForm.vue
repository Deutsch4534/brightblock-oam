<template>
<mdb-container class="">
  <!-- Supported elements -->
  <h3 class="h3-responsive">{{formTitle}}</h3>
  <form class="needs-validation form-transparent" novalidate @submit.prevent="checkForm" id="galleryForm">

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

        <div class="row mb-3">
          <input type="text" class="form-control" id="title" placeholder="Name of your gallery" v-model="gallery.title" required>
          <div class="invalid-feedback">
            Please enter the name of your gallery!
          </div>
        </div>

        <div class="row mb-3">
          <textarea type="text" class="form-control" id="description" placeholder="Gallery bio" v-model="gallery.description" required></textarea>
          <div class="invalid-feedback">
            Please enter a bio!
          </div>
        </div>

        <div class="row mb-3">
          <textarea type="text" class="form-control" id="keywords" placeholder="Main art interests" v-model="gallery.keywords" required></textarea>
          <!--<p class="muted small mt-1">Enter keywords / tags separated by commas</p>-->
          <div class="invalid-feedback">
            Enter keywords / tags separated by commas
          </div>
        </div>

        <!-- Public / private buttons row -->
        <mdb-btn-group class="row my-3 d-flex">
          <div class="col-6">
            <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block" id="custom-public"
                     value="public" v-model="gallery.privacy" @click.native="toggleActiveState1" :active="active1" required>
              Public
            </mdb-btn>
          </div>
          <div class="col-6">
            <mdb-btn type="button" color="white" size="sm" class="btn-rounded btn-block" id="custom-private"
                     value="private" v-model="gallery.privacy" @click.native="toggleActiveState2" :active="active2" required>
              Private
            </mdb-btn>
          </div>
        </mdb-btn-group>

      </div>

      <!-- Right column -->
      <div class="col-md-6">

        <!-- Drag and drop  -->
        <div class="row">
          <div class="col-12">
            <h4 class="h4-responsive my-4">Cover Image</h4>
          </div>
          <div class="col-12 col-md-6">
            <media-upload :coverImage="gallery.coverImage" @updateMedia="setByEventLogo($event)"/>
            <p class="grey-text small mt-2">Size limit: 500Kb</p>
          </div>
        </div>

      </div>
    </div>
    <!-- /Input fields section -->

    <div class="row">
      <div class="col-md-6">
        <a @click="checkForm($event)"><mdb-btn size="sm" type="submit" class="btn teal lighten-1">save</mdb-btn></a>
      </div>
    </div>
  </form>
</mdb-container>
</template>

<script>
import moment from "moment";
import { mdbBtn, mdbBtnGroup, mdbContainer, mdbRow, mdbCol, mdbAlert } from 'mdbvue';
import { Datetime } from 'vue-datetime'
import MediaUpload from "../utils/MediaUpload";
import BitcoinAddressEntry from "../utils/BitcoinAddressEntry";
import EmailAddressEntry from "../utils/EmailAddressEntry";
import AddressForm from "../utils/AddressForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUploadForm",
  props: ["formTitle", "galleryId", "mode"],
  components: {
    BitcoinAddressEntry,
    EmailAddressEntry,
    AddressForm,
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
      errors: [],
      showAddresses: false,
      myProfile: null,
      gallery: {
        title: null,
        description: null,
        addressInfo: {
          bitcoin: null,
          shipping: null,
          email: null
        },
        keywords: null,
        privacy: 'public',
        galleryType: "webcast",
        coverImage: {},
      },
      active1: false,
      active2: false,
      addressBlurb: "Your shipping address is encrypted and stored in your gaia bucket. It will only ever be decrypted in case where this is necessary - such as when you have bought some artwork and the seller needs your shipping information",
    }
  },
  mounted() {
  },
  computed: {
    username() {
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      return profile.username;
    },
    convertToMedia() {
      if (this.gallery && this.gallery.coverImage && this.gallery.coverImage.dataUrl) {
        let stuff = [];
        return stuff.push(this.gallery.coverImage);
      }
      return [];
    }
  },
  methods: {
    upload: function() {
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      this.gallery.administrator = profile.username;
      if (!this.gallery.galleryType) {
        this.gallery.galleryType = "webcast";
      }
      if (!this.gallery.messages) {
        this.gallery.messages = [];
      }
      if (this.mode === "update") {
        this.gallery.galleryId = this.galleryId;
        this.$store
          .dispatch("myAuctionsStore/updateAuction", this.gallery)
          .then(gallery => {
            this.gallery = gallery;
            this.$router.push("/my-gallerys");
          });
      } else {
        this.gallery.galleryId = moment({}).valueOf();
        this.$store
          .dispatch("myAuctionsStore/uploadAuction", this.gallery)
          .then(gallery => {
            this.gallery = gallery;
            this.$router.push("/my-gallerys");
          });
      }
    },
    setByEventLogo (mediaObjects) {
      this.gallery.coverImage = mediaObjects[0];
    },
    checkForm(event) {
      event.preventDefault();
      event.target.classList.add('was-validated');
      if (this.gallery.galleryType === "sealed") {
        this.showSealedError = true;
      }
      this.errors = [];
      if (!this.gallery.title) {
        this.errors.push("title required.");
      }
      if (!this.gallery.description) {
        this.errors.push("description required.");
      }
      if (!this.gallery.keywords) {
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
