<template>
  <mdb-container class="py-5">
    <!-- Supported elements -->
    <h1 class="h1-responsive">{{formTitle}}</h1>
    <form class="needs-validation py-5" novalidate @submit.prevent="checkForm" id="artworkForm">

    <div class="row ml-1 mb-4">
      <div class="col-12 col-md-5">
        <div class="row">
          <div class="col-6 custom-control custom-radio mb-0">
            <input type="radio" class="custom-control-input" id="customControlValidation2" name="artwork.itemType" v-model="artwork.itemType" value="digiart" required>
            <label class="custom-control-label" for="customControlValidation2">Digital Artwork</label>
          </div>
          <div class="col-6 custom-control custom-radio mb-0">
            <input type="radio" class="custom-control-input" id="customControlValidation3" name="artwork.itemType" v-model="artwork.itemType" value="physart" required>
            <label class="custom-control-label" for="customControlValidation3">Physical Artwork</label>
          </div>
        </div>
      </div>

    </div>

  <!-- item type -->
  <div class="row justify-content-between">

  <div class="col-md-5 mb-4">
    <div class="form-row">
      <input type="text" class="form-control" id="validationCustom00" placeholder="Bitcoin Address" v-model="btcAddress" required>
      <div class="invalid-feedback">
        Please enter a Bitcoin address!
      </div>
    </div>
    <div class="form-row">
        <!--<label for="validationCustom01">Artwork Title</label>-->
        <input type="text" class="form-control" id="validationCustom01" placeholder="Artwork Title" v-model="artwork.title" required>
        <div class="invalid-feedback">
          Please enter a title!
        </div>
    </div>
    <div class="form-row">
        <!--<label for="validationCustom02">Description of Artwork</label>-->
        <textarea type="text" class="form-control" id="validationCustom02" placeholder="Description of the Artwork" v-model="artwork.description" required></textarea>
        <div class="invalid-feedback">
          Please enter a description!
        </div>
    </div>
    <div class="form-row">
        <!--<label for="validationCustom03">Keywords or tags</label>-->
        <textarea type="text" class="form-control" id="validationCustom03" placeholder="Keywords" v-model="artwork.keywords" required></textarea>
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
          <input class="form-control" id="validationCustom040" type="number" v-model="artwork.edition" required>
          <div class="invalid-feedback">
          Please enter number of editions!
        </div>
        </div>
      </div>
      <div class="col-6 form-row">
        <div class="col-4 col-form-label text-center">
          <label for="validationCustom041">of</label>
        </div>
       <div class="col-8">
        <input class="form-control" id="validationCustom041" type="number" v-model="artwork.editions" required>
        <div class="invalid-feedback">
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
          Please enter the owner!
        </div>
      </div>
      <div class="col-6">
        <input type="text" class="form-control" id="validationCustom06" placeholder="Artist" v-model="artwork.artist" required>
        <div class="invalid-feedback">
          Please enter the artist!
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
  </div>

  <!-- image drop -->
  <div class="col-md-6">
    <h2 class="h3-responsive mb-5">
      Set Artwork Images
    </h2>
    <mdb-row>
      <!-- droppable area 1 -->
      <mdb-col md="6" class="mb-4">
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">
              The Cover
            </div>
            <div class="popover-body">
              Your original digital image or a high res image of your artwork.
            </div>
            <div class="popover-body">
              A single hi-res image up to 2M.
            </div>
          </div>
          <a @click.prevent="" slot="reference">
            The Cover <mdb-icon far icon="question-circle" />
          </a>
        </mdb-popover>
        <div class="mt-2">
          <div class="text-danger" v-if="showAttachArt">
            Main artwork image is required.
          </div>
          <div class="load-artwork" v-if="artwork.artwork.length === 0">
            <div class="drop-area" @drop.prevent="loadArtwork" @dragover.prevent>
              <p class="drop-label">Drop image here</p>
            </div>
          </div>
        </div>
        <div class="row">
          <my-artwork-manage-image v-for="(file, index) in artwork.artwork" :key="index" :file="file" :size="12"/>
        </div>
        <div class="row">
          <div class="col-12 text-right">
            <a class="remove-link text-danger text-sm" v-on:click.prevent="deleteArtwork" v-if="artwork.artwork.length > 0"><mdb-icon icon="minus" /></a>
          </div>
        </div>
        <p class="grey-text mt-2">Size limit: 500Kb</p>
      </mdb-col>
      <!--/droppable area 1 -->

      <!-- droppable area 2 -->
      <mdb-col md="6" class="mb-4">
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">
              Provenance Files
            </div>
            <div class="popover-body">
              Upload files which support the provenance claim for this artwork.
            </div>
            <div class="popover-body">
              E.g. bills of sale, reciepts, images of signatures, short video clips of the artists at work etc.
            </div>
            <div class="popover-body">
              Up to 5 images / documents.
            </div>
          </div>
          <a @click.prevent="" slot="reference">
            Provenance Files <mdb-icon far icon="question-circle" />
          </a>
        </mdb-popover>
          <div class="mt-2">
            <div class="text-danger" v-if="showAttachDocs">
              Attach provenance files.
            </div>
            <div class="load-artwork">
              <div class="drop-area" @drop.prevent="loadSupportingFiles" @dragover.prevent>
                <p class="drop-label">Drop image here</p>
              </div>
            </div>
          </div>
          <div class="row">
            <my-artwork-manage-image v-for="(file, index) in artwork.supportingDocuments" :key="index" :file="file" :size="4"/>
          </div>
          <div class="row">
            <div class="col-md-12 text-right">
              <a class="remove-link text-danger text-sm" v-on:click.prevent="deleteDocuments" v-if="artwork.supportingDocuments.length > 0"><mdb-icon icon="minus" /></a>
            </div>
          </div>
        <p class="grey-text mt-2">Size limit: 500Kb</p>
      </mdb-col>
      <!-- /droppable area 2 -->

      <!-- droppable area 3 -->
      <mdb-col md="6" class="mb-4">
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">
              Artwork Images            </div>
            <div class="popover-body">
              Images for potential buyers to see your artwork from different angles.
            </div>
            <div class="popover-body">
              Up to 5 (100kb or less) images.
            </div>
          </div>
          <a @click.prevent="" slot="reference">
            Artwork Images <mdb-icon far icon="question-circle" />
          </a>
        </mdb-popover>
        <div class="mt-2">
            <div class="load-artwork">
              <div class="drop-area" @drop.prevent="loadImageFiles" @dragover.prevent>
                <p class="drop-label">Drop image here</p>
              </div>
            </div>
        </div>
        <div class="row">
          <my-artwork-manage-image v-for="(file, index) in artwork.images" :key="index" :file="file"  :size="4"/>
        </div>
        <div class="row">
          <div class="col-md-12 text-right">
            <a class="remove-link text-danger text-sm" v-on:click.prevent="deleteImages" v-if="artwork.images.length > 0"><mdb-icon icon="minus" /></a>
          </div>
        </div>
        <p class="grey-text mt-2">Size limit: 500Kb</p>
      </mdb-col>
      <!-- /droppable area 3 -->

    </mdb-row>
  </div>
  <!-- / image drop -->

  <div class="col-md-5">
    <mdb-btn size="lg" type="submit" class="btn-main btn-block">Submit Artwork</mdb-btn>
  </div>


  <!-- item type -->
    </div>
    </form>
  </mdb-container>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import MyArtworkManageImage from "./MyArtworkManageImage";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkUploadForm",
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
  props: ["artworkId", "mode", "formTitle"],
  data() {
    return {
      errors: [],
      showAttachArt: false,
      showAttachDocs: false,
      showAlert: false,
      alertMessage: null,
      dateError: false,
      created: null,
      artwork: {
        artistry: {},
        itemType: null,
        keywords: "Photography,Illustration.3D,2D,Film & Video,Mix-media",
        artist: null,
        owner: null,
        editions: 1,
        edition: 1,
        created: null,
        images: [],
        supportingDocuments: [],
        artwork: []
      }
    };
  },
  mounted() {
    this.artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
      this.artworkId
    );
    if (this.artwork) {
      this.created = moment(this.artwork.created).format();
    }
  },
  computed: {
    headerStyle() {
      return {
        "margin-top": "0px",
        "background-image": `url(/assets/img/upload-icon-3.png)`,
        "background-repeat": "no-repeat",
        "background-size": "cover",
        "background-position": "center center"
      };
    }
  },
  methods: {
    upload: function() {
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
      this.showAttachArt = false;
      this.showAttachDocs = false;
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
      if (this.artwork.editions < 1 || this.artwork.editions > 10) {
        this.errors.push("Editions between 1 and 10.");
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
      if (this.created) {
        this.artwork.created = moment(this.created).valueOf();
      }
      this.dateError = false;
      if (moment(this.created).isAfter(moment({}))) {
        this.dateError = true;
        this.errors.push("Created date is after now?");
      }
      if (
        this.artwork.itemType !== "physart" &&
        this.artwork.artwork &&
        this.artwork.artwork.length === 0
      ) {
        this.showAttachArt = true;
        this.errors.push("Please attach an artwork.");
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
    deleteImages: function() {
      this.artwork.images = [];
    },
    deleteArtwork: function() {
      this.artwork.artwork = [];
    },
    deleteDocuments: function() {
      this.artwork.supportingDocuments = [];
    },
    loadArtwork: function(e) {
      this.load(e, this.artwork.artwork, 1);
    },
    loadSupportingFiles: function(e) {
      this.load(e, this.artwork.supportingDocuments, 5);
    },
    loadImageFiles: function(e) {
      this.load(e, this.artwork.images, 3);
    },
    load: function(e, arrayToLoad, limit) {
      this.showAttachArt = false;
      this.showAttachDocs = false;
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
 #artworkForm .form-control,
 #artworkForm >>> .form-control,
 #artworkForm input,
 #artworkForm textarea,
 #artworkForm label {
   background-color: transparent;
   color: rgba(0, 0, 0, 0.6);
   font-weight: 300;
   font-size: 0.85rem;
  }

#artworkForm input::-webkit-input-placeholder,
#artworkForm input::-moz-placeholder,
#artworkForm input:-ms-input-placeholder,
#artworkForm input:-moz-placeholder {
  color: rgba(0, 0, 0, 0.6);
  font-weight: 300;
  font-size: 0.85rem;
 }

 #artworkForm .form-row {
   margin-bottom: 1rem;
 }

 /* Drag and drop boxes */

 .load-artwork {
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
