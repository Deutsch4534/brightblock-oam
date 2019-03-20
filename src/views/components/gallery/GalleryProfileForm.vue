<template>
<mdb-container class="py-5">
  <div class="row">
    <div class="col-md-3 nowrap">
      <confirmation-modal :modal="modal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
      <mdb-navbar class="blue lighten-5 py-4">
        <mdb-navbar-nav nav vertical>
          <mdb-nav-item><h5>RA Gallery</h5></mdb-nav-item>
          <mdb-nav-item href="#" active><a @click.prevent="showNav = 1">Main Info</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 2">Email</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 3">Bitcoin</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 4">Address</a></mdb-nav-item>
          <mdb-nav-item href="#"><a @click.prevent="showNav = 5">Administrators</a></mdb-nav-item>
        </mdb-navbar-nav>
      </mdb-navbar>
    </div>
    <div class="col-md-9 py-4" v-if="showNav > 0">

      <h4 class="h4-responsive">{{myProfile.gallery.name}}</h4>
      <p class="text-muted small">Note: Your profile data is encrypted and stored in your storage - it is only ever
      decrypted to display to another user to complete a transaction.</p>

      <gallery-upload-form v-if="showNav === 1" :myProfile="myProfile"/>
      <email-address-entry v-if="showNav === 2" :emailAddress="myProfile.galleryProfile.emailAddress" @saveEmail="saveEmail"/>
      <bitcoin-address-entry v-if="showNav === 3" @bitcoinAddressUpdate="updateBitcoinAddress"/>
      <address-form v-if="showNav === 4" :addressTitle="'Shipping Address'" :addressBlurb="addressBlurb" :address="myProfile.galleryProfile.shippingAddress" @saveAddress="saveAddress"/>
      <trusted-users-section v-if="showNav === 5" :trustedIds="myProfile.galleryProfile.trustedIds" @saveTrustedUsers="saveTrustedUsers"/>

    </div>
  </div>
</mdb-container>
</template>

<script>
import { mdbContainer } from "mdbvue";
import { mdbNavbar, mdbNavbarNav, mdbNavItem } from "mdbvue";
import MyArtworkManageImage from "../myArtwork/MyArtworkManageImage";
import ConfirmationModal from "../utils/ConfirmationModal";
import moment from "moment";
import myAccountService from "@/services/myAccountService";
import TrustedUsersSection from "../utils/TrustedUsersSection";
import BlockstackSection from "../utils/BlockstackSection";
import BitcoinAddressEntry from "../utils/BitcoinAddressEntry";
import EmailAddressEntry from "../utils/EmailAddressEntry";
import AddressForm from "../utils/AddressForm";
import GalleryUploadForm from "./GalleryUploadForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "GalleryProfileForm",
  components: {
    GalleryUploadForm,
    BitcoinAddressEntry,
    TrustedUsersSection,
    BlockstackSection,
    EmailAddressEntry,
    MyArtworkManageImage,
    ConfirmationModal,
    AddressForm,
    mdbContainer,
    mdbNavbar,
    mdbNavbarNav,
    mdbNavItem
  },
  props: ["formTitle", "myProfile"],
  data() {
    return {
      showNav: 0,
      modal: false,
      modalTitle: "Profile updated",
      modalContent: "<p>Profile updated successfully.</p>",
      modalContent1: "<p>Profile updated successfully: where to next?</p><ul class='m-3'>" +
        "<li class='mb-3'><a href='#/my-artwork/upload'>Upload Artwork</a></li>" +
        "<li><a href='#/gallery'>Gallery</a></li></ul>",
      addressBlurb: "Your shipping address is encrypted and stored in your gaia bucket. It will only ever be decrypted in case where this is necessary - such as when you have bought some artwork and the seller needs your shipping information",
    };
  },
  mounted() {
    this.showNav = 1;
  },
  computed: {
  },
  methods: {
    upload: function() {
      let $self = this;
      this.$store.dispatch("myAccountStore/updateGalleryProfile", this.myProfile.galleryProfile)
        .then(galleryProfile => {
          $self.modal = true;
        })
        .catch(() => {
          $self.modalTitle = "Profile.";
          $self.modalContent = "Error updating profile.";
          $self.modal = true;
        });
    },
    saveEmail: function(email) {
      this.myProfile.galleryProfile.emailAddress = email;
      this.upload();
    },
    saveAddress: function(address) {
      this.myProfile.galleryProfile.shippingAddress = address;
      this.upload();
    },
    saveTrustedUsers: function(trustedIds) {
      this.myProfile.galleryProfile.trustedIds = trustedIds;
      this.upload();
    },
    closeModal: function() {
      this.modal = false;
    },
    updateBitcoinAddress(bitcoinAddress) {
      this.$store.dispatch("myAccountStore/updateBitcoinAddress", bitcoinAddress);
      this.modal = true;
    }
  }
};
</script>
<style>

</style>
<style scoped>
 #profileForm .form-control,
 #profileForm >>> .form-control,
 #profileForm input,
 #profileForm textarea,
 #profileForm label {
   background-color: transparent;
   color: rgba(0, 0, 0, 0.6);
   font-weight: 300;
   font-size: 0.85rem;
  }

#profileForm input::-webkit-input-placeholder,
#profileForm input::-moz-placeholder,
#profileForm input:-ms-input-placeholder,
#profileForm input:-moz-placeholder {
  color: rgba(0, 0, 0, 0.6);
  font-weight: 300;
  font-size: 0.85rem;
 }

 #profileForm .form-row {
   margin-bottom: 1rem;
 }

 /* Drag and drop boxes */

 .load-profile {
   display: flex;
   height: 150px;
   text-align: center;
   padding: 20px;
   font-size: 1em;
   background-color: white;
   border-radius: 10px;
 }
.drop-area {
 width: 100%;
 border: 1px dashed rgba(0, 0, 0, 0.24);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.drop-label {
  color: rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  margin-bottom: 0;
}
</style>
