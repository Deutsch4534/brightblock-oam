<template>
<mdb-container class="py-5">
  <!-- Supported elements -->
  <h2 class="h2-responsive">{{formTitle}}</h2>
  <form class="needs-validation py-5" novalidate @submit.prevent="checkForm" id="blockstackProfileForm">
    <div class="row">
      <div class="col-md-2">
        <img :src="blockstackProfile.avatarUrl" class="img-fluid"/>
      </div>
      <div class="col-md-5 mb-4">
        <div class="row">
          <p><a href="http://localhost:8888/profiles" target="_blank">Edit blockstack profile</a></p>
        </div>
        <div class="form-row">
          <mdb-popover trigger="click" :options="{placement: 'top'}">
            <div class="popover">
              <div class="popover-header">
                Public Bitcoin Address
              </div>
              <div class="popover-body">
                We use your bitcoin address for the following;
                <ul>
                  <li>For payments to be made to your bitcoin wallet.</li>
                  <li>For generating certificates of authenticity for artwork.</li>
                </ul>
              </div>
            </div>
            <a @click.prevent="" slot="reference">
              Public Bitcoin Address <mdb-icon far icon="question-circle" />
            </a>
          </mdb-popover>
          <input type="text" class="form-control" id="validationCustom01" placeholder="bitcoin address" v-model="portrayal.bitcoinAddress" required>
          <div class="invalid-feedback">
            Required - an alphanumeric string 26-35 characters in length.
          </div>
        </div>
        <div class="form-row mt-3">
          <mdb-btn size="lg" type="submit" class="btn-main btn-block">Submit Profile</mdb-btn>
        </div>
        <div class="row">
          <mdb-popover trigger="click" :options="{placement: 'top'}">
            <div class="popover">
              <div class="popover-header">
                Bitcoin Wallet
              </div>
              <div class="popover-body">
                You'll need a bitcoin wallet to use radicle. We like the we like
                <a href="https://electrum.org" target="_blank">electrum wallet <mdb-icon icon="external-link-alt" /></a>
                as it's very user friendly.
              </div>
            </div>
            <a @click.prevent="" slot="reference">
              No wallet <mdb-icon far icon="question-circle" />
            </a>
          </mdb-popover>
        </div>
      </div>
    </div>
  </form>
</mdb-container>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import MyArtworkManageImage from "../myArtwork/MyArtworkManageImage";
import moment from "moment";
import myAccountService from "@/services/myAccountService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ProfileUploadForm",
  components: {
    MyArtworkManageImage,
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
      showAttachArt: false,
      portrayal: {},
    };
  },
  mounted() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((profile) => {
      this.portrayal = profile.portrayal;
    });
  },
  computed: {
    blockstackProfile() {
      let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return blockstackProfile;
    }
  },
  methods: {
    upload: function() {
      this.$store
        .dispatch("myAccountStore/updatePortrayal", this.portrayal)
        .then(portrayal => {
          this.$router.push("/my-artwork/upload");
        });
    },
    checkForm(event) {
      event.preventDefault();
      event.target.classList.add('was-validated');
      this.showAttachArt = false;
      this.errors = [];
      if (!this.portrayal.bitcoinAddress) {
        this.errors.push("Your bitcoin public address is required.");
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
