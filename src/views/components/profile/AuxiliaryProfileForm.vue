<template>
<mdb-container class="py-5">
  <mdb-modal v-if="modal" @close="modal = false">
    <mdb-modal-header>
      <mdb-modal-title>Profile Change</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body>{{profileUpdateMessage}}
      <ul>
        <li><router-link to="/my-artwork/upload">Upload Artwork</router-link></li>
        <li><router-link to="/gallery">Gallery</router-link></li>
      </ul>
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn color="secondary" @click.native="modal = false">Close</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>

  <!-- Supported elements -->
  <h2 class="h2-responsive">{{formTitle}}: {{myProfile.name}}</h2>
  <form class="needs-validation py-5" novalidate @submit.prevent=checkForm($event) id="blockstackProfileForm">
    <div class="row">
      <div class="col-md-2">
        <img :src="blockstackProfile.avatarUrl" class="img-fluid"/>
      </div>
      <div class="col-md-8 mb-4">
        <div class="row">
          <p><a href="http://localhost:8888/profiles" target="_blank">Edit blockstack profile</a></p>
        </div>
        <div class="row mb-4">
          <p class="muted hint">Note: This data is encrypted and stored in your storage bucket - it is only ever
          decrypted and displayed to buyers / sellers in order to complete transactions.</p>
        </div>

        <bitcoin-address-entry v-if="showBitcoinAddress" :myProfile="myProfile" @bitcoinAddressUpdate="updateBitcoinAddress"/>

        <div class="row mb-4">
          <div class="col-md-12">
            <mdb-popover trigger="click" :options="{placement: 'top'}">
              <div class="popover">
                <div class="popover-header">
                  Email Address
                </div>
                <div class="popover-body">
                  We use your email address for the following;
                  <ul>
                    <li>For notifying about events related to selling your artwork.</li>
                    <li>For notifying about other events you have subscribed to.</li>
                  </ul>
                </div>
              </div>
              <a @click.prevent="" slot="reference">
                Email Address <mdb-icon far icon="question-circle" />
              </a>
            </mdb-popover>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <input type="email" class="form-control" id="vc-email" placeholder="email address" v-model="auxiliaryProfile.emailAddress" required>
          </div>
        </div>
        <!--
        <div class="row mb-4">
          <div class="col-md-6">
            <input type="text" class="form-control" id="vc-bspubkey" placeholder="pubkey" v-model="myProfile.publicKey" readonly>
          </div>
        </div>
        -->

        <div class="row mb-4">
          <div class="col-md-12">
            <mdb-popover trigger="click" :options="{placement: 'top'}">
              <div class="popover">
                <div class="popover-header">
                  Trusted users
                </div>
                <div class="popover-body">
                  Trusted users will be able to decrypt your profile information - please enter as comma separated list of blockstack user ids.
                </div>
              </div>
              <a @click.prevent="" slot="reference">
                Trusted users <mdb-icon far icon="question-circle" />
              </a>
            </mdb-popover>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <input type="text" class="form-control" id="validationCustom03" placeholder="Share data with..." v-model="auxiliaryProfile.trustedIds">
          </div>
        </div>

        <address-form @addressUpdate="updateAddress" :address="auxiliaryProfile.shippingAddress" :addressTitle="'Shipping Address'" :addressBlurb="addressBlurb"/>

        <div class="form-row">
          <div class="col-md-12">
            <mdb-btn size="lg" type="submit" class="btn-main btn-block"><a @click="checkForm($event)">Submit</a></mdb-btn>
          </div>
        </div>
      </div>
    </div>
  </form>
</mdb-container>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter } from 'mdbvue';
import MyArtworkManageImage from "../myArtwork/MyArtworkManageImage";
import AddressForm from "../utils/AddressForm";
import moment from "moment";
import myAccountService from "@/services/myAccountService";
import BitcoinAddressEntry from "../utils/BitcoinAddressEntry";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "AuxiliaryProfileForm",
  components: {
    BitcoinAddressEntry,
    MyArtworkManageImage,
    AddressForm,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbContainer,
    mdbIcon,
    mdbPopover,
    mdbCol,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: ["mode", "formTitle"],
  data() {
    return {
      errors: [],
      modal: false,
      showAttachArt: false,
      addressBlurb: "Your shipping address is encrypted and stored in your gaia bucket. It will only ever be decrypted in case where this is necessary - such as when you have bought some artwork and the seller needs your shipping information",
      myProfile: {
        publicKeyData: {}
      },
      auxiliaryProfile: {
        shippingAddress: {}
      },
      blockstackProfile: {},
      validBitcoinAdress: false,
      showBitcoinAddress: false,
      profileUpdateMessage: "Profile updated successfully: where to next?"
    };
  },
  mounted() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((profile) => {
      if (!profile.auxiliaryProfile) {
        profile.auxiliaryProfile = {};
      }
      this.blockstackProfile = profile;
      this.auxiliaryProfile = profile.auxiliaryProfile;
      if (!this.auxiliaryProfile.shippingAddress) {
        this.auxiliaryProfile.shippingAddress = {};
      }
      this.myProfile = profile;
      this.showBitcoinAddress = true;
    });
  },
  computed: {
  },
  methods: {
    upload: function() {
      let $self = this;
      this.$store.dispatch("myAccountStore/updateAuxiliaryProfile", this.auxiliaryProfile)
        .then(auxiliaryProfile => {
          $self.modal = true;
        })
        .catch(() => {
          $self.profileUpdateMessage = "Error updating profile.";
          $self.modal = true;
        });
    },
    updateBitcoinAddress(newAddress) {
      this.validBitcoinAdress = newAddress;
    },
    updateAddress(newAddress) {
      this.auxiliaryProfile.shippingAddress = newAddress;
    },
    checkForm(event) {
      if (event) {
        event.preventDefault;
        event.target.classList.add('was-validated');
      }
      this.showAttachArt = false;
      this.errors = [];
      if (!this.myProfile.publicKeyData.bitcoinAddress) {
        this.errors.push("Your bitcoin address is required.");
      }
      if (!this.auxiliaryProfile.emailAddress) {
        this.errors.push("Your email address is required.");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        this.upload();
      }
    },
    deleteProfilePicture: function() {
      this.blockstackProfile.images = [];
    },
    loadProfilePicture: function(e) {
      this.load(e, this.blockstackProfile.images, 1);
    },
    load: function(e, arrayToLoad, limit) {
      this.showAttachArt = false;
      let userFiles = e.dataTransfer.files;
      let fileObject = null;
      for (let i = 0; i < userFiles.length; i++) {
        if (i === limit) {
          break;
        }
        fileObject = userFiles[i];
        let thisFile = {
          lastModified: fileObject.lastModified,
          lastModifiedDate: fileObject.lastModifiedDate,
          name: fileObject.name,
          size: fileObject.size,
          type: fileObject.type
        };
        var reader = new FileReader();
        reader.onload = function(e) {
          thisFile.dataUrl = e.target.result;
          arrayToLoad.push(thisFile);
        };
        reader.readAsDataURL(fileObject);
      }
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
