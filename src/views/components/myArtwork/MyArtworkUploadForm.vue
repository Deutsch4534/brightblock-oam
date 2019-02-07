<template>
<mdb-container class="mt-5">
  <!-- Supported elements -->
  <h2 class="my-5">{{formTitle}}</h2>
  <hr class="my-5">
  <form class="needs-validation" novalidate @submit.prevent="checkForm">

  <div class="row">
    <div class="col-md-12">
      <h4>Select Type of Artwork</h4>
    </div>
  </div>
  <div class="row ml-5 mb-5">
    <div class="col-md-2 custom-control custom-radio mb-0">
      <input type="radio" class="custom-control-input" id="customControlValidation2" name="artwork.itemType" v-model="artwork.itemType" value="digiart" required>
      <label class="custom-control-label" for="customControlValidation2">Digital</label>
    </div>
    <div class="col-md-2 custom-control custom-radio mb-0">
      <input type="radio" class="custom-control-input" id="customControlValidation3" name="artwork.itemType" v-model="artwork.itemType" value="physart" required>
      <label class="custom-control-label" for="customControlValidation3">Physical</label>
    </div>
  </div>

  <div v-if="showFields">

    <div class="form-row mb-5" v-if="featureBitcoin">
      <div class="col-md-12 mb-3">
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">
              Bitcoin Address
            </div>
            <div class="popover-body">
              We display your bitcoin address with your artwork and in your certificate of authenticity
              to maximise your income from your artwork.
            </div>
          </div>
          <a @click.prevent="" slot="reference">
            Bitcoin Address
          </a>
        </mdb-popover>
        <label for="validationCustom01-1"><mdb-icon icon="question" /></label>
        <input type="text" class="form-control" id="validationCustom01-1" placeholder="Your bitcoin address" v-model="artwork.artistry.btcAddress" required>
        <div class="invalid-feedback">
          Please enter your bitcoin address - used for people to make payments to you!
        </div>
      </div>
    </div>


    <div class="form-row mb-5">
      <div class="col-md-12">
        <label for="validationCustom01">Title of Artwork</label>
        <input type="text" class="form-control" id="validationCustom01" placeholder="Title" v-model="artwork.title" required>
        <div class="invalid-feedback">
          Please enter a title!
        </div>
      </div>
    </div>
    <div class="form-row mb-5">
      <div class="col-md-12">
        <label for="validationCustom02">Description of Artwork</label>
        <textarea type="text" class="form-control" id="validationCustom02" placeholder="Description" v-model="artwork.description" required></textarea>
        <div class="invalid-feedback">
          Please enter a description!
        </div>
      </div>
    </div>
    <div class="form-row mb-5">
      <div class="col-md-12">
        <label for="validationCustom03">Keywords or tags</label>
        <textarea type="text" class="form-control" id="validationCustom03" placeholder="Description" v-model="artwork.keywords" required></textarea>
        <div class="invalid-feedback">
          Please enter some keywords!
        </div>
      </div>
    </div>
    <div class="form-row mb-5">
      <div class="col-md-2">
        <label for="validationCustom040">Edition</label>
        <input class="form-control" id="validationCustom040" type="number" placeholder="Edition" v-model="artwork.edition" required>
        <div class="invalid-feedback">
          Please enter number of editions!
        </div>
      </div>
      <div class="col-md-2">
        <label for="validationCustom041">Of editions</label>
        <input class="form-control" id="validationCustom041" type="number" placeholder="Total editions" v-model="artwork.editions" required>
        <div class="invalid-feedback">
          Please enter total number of editions!
        </div>
      </div>
    </div>
    <div class="form-row mb-5">
      <div class="col-md-4">
        <label for="validationCustom06-1">Medium / Materials</label>
        <input type="text" class="form-control" id="validationCustom06-1" placeholder="Medium / materials" v-model="artwork.medium" required>
        <div class="invalid-feedback">
          Please enter the Medium / Materials!
        </div>
      </div>
      <div class="col-md-4">
        <label for="validationCustom05-1">Dimensions</label>
        <input type="text" class="form-control" id="validationCustom05-1" placeholder="Dimensions" v-model="artwork.dimensions" required>
        <div class="invalid-feedback">
          Please enter the Dimensions!
        </div>
      </div>
      <div class="col-md-4">
        <label for="validationCustom05-1">Year Created</label>
        <input type="text" class="form-control" id="validationCustom05-1" placeholder="Year created" v-model="artwork.yearCreated" required>
        <div class="invalid-feedback">
          Please enter the year created!
        </div>
      </div>
    </div>
    <div class="form-row mb-5">
      <div class="col-md-6">
        <label for="validationCustom05">Current owner</label>
        <input type="text" class="form-control" id="validationCustom05" placeholder="Owner" v-model="artwork.owner" required>
        <div class="invalid-feedback">
          Please enter the owner!
        </div>
      </div>
      <div class="col-md-6">
        <label for="validationCustom06">Artist</label>
        <input type="text" class="form-control" id="validationCustom06" placeholder="Artist" v-model="artwork.artist" required>
        <div class="invalid-feedback">
          Please enter the artist!
        </div>
      </div>
    </div>
    <div class="form-group mb-5">
      <div class="text-danger" v-if="dateError">
        The creation date must be before now!
      </div>
      <datetime type="date" v-model="created" input-id="created">
        <label for="created" slot="before">Created &nbsp;&nbsp;&nbsp;&nbsp;</label>
        <input id="created" class="form-control">
      </datetime>
    </div>

    <mdb-row>
      <mdb-col md="4" v-if="artwork.itemType === 'digiart' || artwork.itemType === 'photoart'">
        <mdb-card>
          <mdb-card-body>
            <mdb-card-title>Digital Artwork</mdb-card-title>
            <mdb-card-text>
              <div class="text-danger" v-if="showAttachArt">
                Attach you artwork by dragging on to the box below.
              </div>
              <div class="load-artwork">
                <div class="drop_area" @drop.prevent="loadArtwork" @dragover.prevent>
                  Drop artwork file here!
                </div>
              </div>
            </mdb-card-text>
            <mdb-btn color="primary" v-on:click="deleteArtwork" v-if="artwork.artwork.length > 0">Restart Artwork</mdb-btn>
          </mdb-card-body>
        </mdb-card>
        <my-artwork-manage-image v-for="(file, index) in artwork.artwork" :key="index" :file="file"/>
      </mdb-col>
      <mdb-col md="4" v-if="artwork.itemType === 'physart'">
        <mdb-card>
          <mdb-card-body>
            <mdb-card-title>Supporting Documents</mdb-card-title>
            <mdb-card-text>
              <div class="text-danger" v-if="showAttachDocs">
                Attach you artwork by dragging on to the box below.
              </div>
              <div class="load-artwork">
                <div class="drop_area" @drop.prevent="loadSupportingFiles" @dragover.prevent>
                  Drop your supporting documents here!
                </div>
              </div>
            </mdb-card-text>
            <mdb-btn color="primary" @click="deleteDocuments" v-if="artwork.supportingDocuments.length > 0">Restart Documents</mdb-btn>
          </mdb-card-body>
        </mdb-card>
        <my-artwork-manage-image v-for="(file, index) in artwork.supportingDocuments" :key="index" :file="file"/>
      </mdb-col>
      <mdb-col md="4">
        <mdb-card>
          <mdb-card-body>
            <mdb-card-title>Other Images</mdb-card-title>
            <mdb-card-text>
                <div class="load-artwork">
                  <div class="drop_area" @drop.prevent="loadImageFiles" @dragover.prevent>
                    Drop your images of your art here!
                  </div>
                </div>
            </mdb-card-text>
            <mdb-btn color="primary" @click="deleteImages" v-if="artwork.images.length > 0">Restart Images</mdb-btn>
          </mdb-card-body>
        </mdb-card>
        <my-artwork-manage-image v-for="(file, index) in artwork.images" :key="index" :file="file"/>
      </mdb-col>
    </mdb-row>
    <mdb-btn type="submit">Submit</mdb-btn>
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
    },
    featureBitcoin() {
      return this.$store.state.constants.featureBitcoin;
    },
    showFields() {
      return this.artwork.itemType != null;
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
.load-artwork {
  height: 90px;
  background-image: require("@/assets/img/upload-icon-3.png");
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  margin: 5px;
  border: 2pt solid #333;
  border-radius: 10px;
}
</style>
