<template>
  <mdb-container class="py-3 py-md-4">
    <!-- Supported elements -->
    <h1 class="h1-responsive">{{formTitle}}</h1>
    <form class="needs-validation py-5 form-transparent" novalidate @submit.prevent="checkForm" id="artworkForm">
      <!-- item type -->
      <div class="row ">
      <div class="col-md-6 mb-4">
        <div class="row ml-1 mb-4">
          <div class="col-12">
            <div class="row">
              <div class="col-6 custom-control custom-radio mb-0">
                <input type="radio" class="custom-control-input teal lighten-1" id="customControlValidation2" name="artwork.itemType" v-model="artwork.itemType" value="digiart" required>
                <label class="custom-control-label" for="customControlValidation2">Digital Artwork</label>
              </div>
              <div class="col-6 custom-control custom-radio mb-0">
                <input type="radio" class="custom-control-input teal lighten-1" id="customControlValidation3" name="artwork.itemType" v-model="artwork.itemType" value="physart" required>
                <label class="custom-control-label" for="customControlValidation3">Physical Artwork</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-row">
            <!--<label for="validationCustom01">Artwork Title</label>-->
            <input type="text" class="form-control" id="validationCustom01" :placeholder="'Artwork Title (' + limits.title + ' chars max)'" v-model="artwork.title" required :maxlength="limits.title">
            <div class="invalid-feedback">
              Please enter a title!
            </div>
        </div>
        <div class="form-row">
            <!--<label for="validationCustom02">Description of Artwork</label>-->
            <textarea type="text" class="form-control" id="validationCustom02" :placeholder="'Description of the Artwork (' + limits.description + ' chars max)'" v-model="artwork.description" required :maxlength="limits.description"></textarea>
            <div class="invalid-feedback">
              Please enter a description!
            </div>
        </div>
        <div class="form-row">
            <!--<label for="validationCustom03">Keywords or tags</label>-->
            <textarea type="text" class="form-control" id="validationCustom03" :placeholder="'Keywords (' + limits.keywords + ' chars max)'" v-model="artwork.keywords" required :maxlength="limits.keywords"></textarea>
            <div class="invalid-feedback">
              Please enter some keywords!
            </div>
        </div>
        <div class="form-row">
          <div class="col-6 form-row">
            <div class="col-4">
              <label for="validationCustom040" class="col-form-label">Edition</label>
            </div>
            <div class="col-8">
              <input class="form-control" id="validationCustom040" type="number" v-model="artwork.edition" required :maxlength="limits.maxEditions">
              <div id="vc-040-error" class="invalid-feedback">
                Please enter number of editions!
            </div>
            </div>
          </div>
          <div class="col-6 form-row">
            <div class="col-4 col-form-label text-center">
              <label for="validationCustom041">of</label>
            </div>
           <div class="col-8">
            <input class="form-control" id="validationCustom041" type="number" v-model="artwork.editions" required :maxlength="limits.maxEditions">
            <div id="vc-041-error" class="invalid-feedback">
              Please enter total number of editions!
            </div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-4">
            <input type="text" class="form-control" id="validationCustom06-1" placeholder="Medium / materials" v-model="artwork.medium" required>
            <div class="invalid-feedback">
              Please enter the Medium / Materials!
            </div>
          </div>
          <div class="col-4">
            <input type="text" class="form-control" id="validationCustom05-1" placeholder="Dimensions" v-model="artwork.dimensions" required>
            <div class="invalid-feedback">
              Please enter the Dimensions!
            </div>
          </div>
          <div class="col-4">
            <input type="text" class="form-control" id="validationCustom05-2" placeholder="Year created" v-model="artwork.yearCreated" required>
            <div class="invalid-feedback">
              Please enter the year created!
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-6">
            <input type="text" class="form-control" id="validationCustom05" placeholder="Owner" v-model="artwork.owner" required>
            <div class="invalid-feedback">
              Please enter the blockstack id of the owner!
            </div>
          </div>
          <div class="col-6">
            <input type="text" class="form-control" id="validationCustom06" placeholder="Artist" v-model="artwork.artist" required>
            <div class="invalid-feedback">
              Please enter the blockstack id of the artist!
            </div>
          </div>
        </div>
        <div class="form-row mb-2">
          <div class="text-danger" v-if="dateError">
            The creation date must be before now!
          </div>
          <label for="created" slot="before" class="col-4 col-form-label">Created</label>
          <datetime type="date" v-model="created" input-id="created" class="col-8" input-class="form-control bg-transparent">
            <input id="created">
          </datetime>
        </div>
        <!-- Submit button row -->
        <div class="row">
          <div class="col-12 mt-3">
            <mdb-btn type="submit" size="sm" class="btn-block teal lighten-1">Submit Changes</mdb-btn>
          </div>
        </div>
      </div>

        <!-- Right column - image drop -->
        <div class="form-row col-md-6" v-if="showMedia">
          <media-files-upload :contentModel="contentModel1" :parentalError="parentalError" :mediaFiles="mediaFiles1" :limit="1" :sizeLimit="5000" :mediaTypes="'images'" @updateMedia="setByEventLogo1($event)"/>
          <media-files-upload :contentModel="contentModel2" :mediaFiles="mediaFiles2" :limit="5" :sizeLimit="2500" :mediaTypes="'all'" @updateMedia="setByEventLogo2($event)"/>
          <media-files-upload :contentModel="contentModel3" :mediaFiles="mediaFiles3" :limit="5" :sizeLimit="2500" :mediaTypes="'images'" @updateMedia="setByEventLogo3($event)"/>
        </div>
      </div>
    </form>
  </mdb-container>
</template>
<div class="form-row col-md-6" v-if="showMedia">
  <media-files-upload :contentModel="contentModel" :mediaFiles="mediaFiles" :limit="1" :sizeLimit="500" :mediaTypes="'images'" @updateMedia="setByEventLogo($event)"/>
</div>

<script>
import MediaFilesUpload from "../utils/MediaFilesUpload";
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer, mdbBtn } from "mdbvue";
import moment from "moment";
import notify from "@/services/notify";

  // noinspection JSUnusedGlobalSymbols
  export default {
    name: "MyArtworkUploadForm",
    components: {
      MediaFilesUpload,
      mdbContainer,
      mdbIcon,
      mdbPopover,
      mdbCol,
      mdbRow,
      mdbBtn
    },
    props: ["artworkId", "mode", "formTitle"],
    data() {
      return {
        errors: [],
        showMedia: false,
        limits: {
          title: 50,
          description: 1000,
          maxEditions: 10,
          keywords: 100
        },
        contentModel1: {
          title: "Cover Image",
          errorMessage: "Cover image is required.",
          popoverBody: "Your original digital image or a high res image of your artwork.<br/><br/>A single hi-res image up to 2M.",
        },
        contentModel2: {
          title: "Provenance Files",
          errorMessage: "",
          popoverBody: "E.g. bills of sale, reciepts, images of signatures, short video clips of the artists at work etc.<br/><br/>Up to 5 images / documents.",
        },
        contentModel3: {
          title: "Gallery Images",
          errorMessage: "",
          popoverBody: "Images for potential buyers to see your artwork from different angles.<br/><br/>Up to 5 (100kb or less) images.",
        },
        parentalError: null,
        showAttachDocs: false,
        showAlert: false,
        alertMessage: null,
        dateError: false,
        created: null,
        artwork: {
          artistry: {},
          itemType: null,
          keywords: "digital,artwork,illustration",
          artist: null,
          owner: null,
          editions: 1,
          edition: 1,
          created: null,
          images: [],
          supportingDocuments: [],
          artwork: [],
          btcAddress: null
        },
      };
    },
    mounted() {
      if (this.artworkId) {
        this.$store.dispatch("myArtworksStore/fetchMyArtwork", this.artworkId).then((artwork) => {
          this.artwork = artwork;
          if (this.artwork) {
            this.created = moment(this.artwork.created).format();
          }
          this.showMedia = true;
        })
      } else {
        this.artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
        this.showMedia = true;
      }
    },
    computed: {
      mediaFiles1() {
        let files = [];
        if (this.artwork.artwork && this.artwork.artwork.length  > 0) {
          files = this.artwork.artwork;
        }
        return files;
      },
      mediaFiles2() {
        let files = [];
        if (this.artwork.supportingDocuments && this.artwork.supportingDocuments.length  > 0) {
          files = this.artwork.supportingDocuments;
        }
        return files;
      },
      mediaFiles3() {
        let files = [];
        if (this.artwork.images && this.artwork.images.length  > 0) {
          files = this.artwork.images;
        }
        return files;
      }
    },
    methods: {
      setByEventLogo1 (mediaObjects) {
        this.artwork.artwork = mediaObjects;
      },
      info() {
        this.$notify({type: 'success', title: 'Notification 2!', text: 'Hi! I am info message.'});
      },
      setByEventLogo2 (mediaObjects) {
        this.artwork.supportingDocuments = mediaObjects;
      },
      setByEventLogo3 (mediaObjects) {
        this.artwork.images = mediaObjects;
      },
      upload: function () {
        if (!this.artwork.status) {
          this.artwork.status = this.$store.state.constants.statuses.artwork.NOT_REGISTERED;
        }
        this.alertMessage =
          "Please wait while we upload your artwork to your storage..";
        this.showAlert = true;
        if (this.mode === "update") {
          this.$store
            .dispatch("myArtworksStore/updateArtwork", this.artwork)
            .then(artwork => {
              this.artwork = artwork;
              this.showAlert = false;
              this.$router.push("/my-artworks");
            });
        } else {
          this.$store
            .dispatch("myArtworksStore/uploadArtwork", this.artwork)
            .then(artwork => {
              this.artwork = artwork;
              this.showAlert = false;
              this.$router.push("/my-artworks");
            });
        }
      },
      checkForm(event) {
        event.preventDefault();
        event.target.classList.add('was-validated');
        this.parentalError = null;
        this.showAttachDocs = false;
        document.getElementById("vc-040-error").style.display = "none";
        document.getElementById("vc-041-error").style.display = "none";
        this.errors = [];
        if (!this.artwork.title) {
          this.errors.push("title required.");
        }
        if (!this.artwork.description) {
          this.errors.push("description required.");
        }
        if (!this.artwork.itemType) {
          this.errors.push("item type required.");
        }
        if (!this.artwork.keywords) {
          this.errors.push("keywords required.");
        }
        if (this.artwork.edition < 1 || this.artwork.edition > this.limits.maxEditions) {
          this.errors.push("Edition between 1 and " + this.limits.maxEditions);
          document.getElementById("vc-040-error").style.display = "block";
          document.getElementById("vc-040-error").innerHTML = "Editions between 1 and " + this.limits.maxEditions;
        }
        if (this.artwork.editions < 1 || this.artwork.editions > this.limits.maxEditions) {
          this.errors.push("Editions between 1 and " + this.limits.maxEditions);
          document.getElementById("vc-041-error").style.display = "block";
          document.getElementById("vc-041-error").innerHTML = "Editions between 1 and " + this.limits.maxEditions;
        }
        if (!this.artwork.yearCreated) {
          this.errors.push("Year created needed.");
        }
        if (!this.artwork.dimensions) {
          this.errors.push("dimensions needed.");
        }
        if (!this.artwork.medium) {
          this.errors.push("medium needed.");
        }
        if (!this.artwork.artist || this.artwork.artist.indexOf(".id") === -1) {
          this.errors.push("Blockstack id of the artist is missing.");
        }
        if (!this.artwork.owner || this.artwork.owner.indexOf(".id") === -1) {
          this.errors.push("Blockstack id of the owner is missing.");
        }
        if (this.created) {
          this.artwork.created = moment(this.created).valueOf();
        }
        this.dateError = false;
        if (moment(this.created).isAfter(moment({}))) {
          this.dateError = true;
          this.errors.push("Created date is after now?");
        }
        if (this.artwork.artwork && this.artwork.artwork.length === 0) {
          this.parentalError = "Please attach your digital artwork or an image of your physical artwork.";
          this.errors.push(this.parentalError);
        }
        if (
          this.artwork.itemType === "physart" &&
          this.artwork.supportingDocuments &&
          this.artwork.supportingDocuments.length === 0
        ) {
          this.showAttachDocs = true;
          this.errors.push("Please attach an artwork.");
        }
        if (this.errors.length > 0) {
          return false;
        } else {
          this.upload();
        }
      },
    }
  };
</script>

<style scoped>
  #artworkForm .form-row {
    margin-bottom: 1rem;
  }
</style>
