<template>
<div class="md-layout">
  <md-dialog-alert
    :md-active.sync="showAlert"
    :md-content="alertMessage"
    md-confirm-text="OK!" />
  <form novalidate class="md-layout" @submit.prevent="validateArtwork">
    <md-card class="md-layout-item md-size-50 md-small-size-100">
      <md-card-header>
        <div class="md-title">{{formTitle}}</div>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('title')">
              <label for="title">Title</label>
              <md-input name="title" id="title" v-model="artwork.title" :disabled="sending" />
              <span class="md-error" v-if="!$v.artwork.title.required">The title name is required</span>
              <span class="md-error" v-else-if="!$v.artwork.title.minlength">Invalid first name</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('description')">
              <label for="description">Description</label>
              <md-textarea name="description" id="description" v-model="artwork.description" required></md-textarea>
              <span class="md-error">The description is required</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('keywords')">
              <label for="keywords">Keywords</label>
              <md-textarea name="keywords" id="keywords" v-model="artwork.keywords" required></md-textarea>
              <span class="md-error">Enter some keywords</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('editions')">
              <label for="editions">editions</label>
              <md-input name="editions" id="title" autocomplete="editions" v-model="artwork.editions" :disabled="sending" />
              <span class="md-error" v-if="!$v.artwork.editions">Number of editions is required</span>
              <span class="md-error" v-else-if="!$v.artwork.editions.minlength">At least 1 edition.</span>
              <span class="md-error" v-else-if="!$v.artwork.editions.maxlength">At most 10 editions.</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('owner')">
              <label for="owner">owner</label>
              <md-input name="owner" type="text" id="title" autocomplete="owner" v-model="artwork.owner" :disabled="sending" />
              <span class="md-error" v-if="!$v.artwork.owner.required">The owner is required</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('artist')">
              <label for="artist">artist</label>
              <md-input name="owner" type="text" id="title" autocomplete="artist" v-model="artwork.artist" :disabled="sending" />
              <span class="md-error" v-if="!$v.artwork.artist.required">The artist is required</span>
            </md-field>
          </div>
        </div>
      </md-card-content>
      <md-card-actions>
        <md-button type="submit" class="md-primary">Upload</md-button>
      </md-card-actions>
    </md-card>

    <md-card class="md-layout-item md-size-50 md-small-size-100">
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-100">
            <md-radio v-model="artwork.itemType" value="digiart">Digital</md-radio>
            <md-radio v-model="artwork.itemType" value="physart">Physical</md-radio>
            <md-radio v-model="artwork.itemType" value="photoart">Photographic</md-radio>
          </div>
          <div class="md-layout-item md-size-100" v-if="artwork.itemType === 'digiart' || artwork.itemType === 'photoart'">
            <div class="md-title">Artwork Images</div>
            <md-field :class="getValidationClass('artwork')">
              <div class="md-error" v-if="!$v.artwork.artwork.required">The artwork is required</div>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100" style="margin-top: 20px;" v-if="artwork.itemType === 'digiart' || artwork.itemType === 'photoart'">
            <div id="load-artwork">
              <div class="drop_area" @drop.prevent="loadArtwork" @dragover.prevent>
                Drop artwork file here!
              </div>
            </div>
            <my-artwork-manage-image v-for="(file, index) in artwork.artwork" :key="index" :file="file"/>
            <div class="form-group pull-right" v-if="artwork.artwork.length > 0">
              <button type="submit" class="btn btn-default" @click.prevent="deleteArtwork()">Restart Artwork</button>
            </div>
          </div>
        </div>
        <!-- end layout -->
      </md-card-content>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100">
            <div class="md-title">Other Images</div>
            <div id="load-artwork">
              <div class="drop_area" @drop.prevent="loadImageFiles" @dragover.prevent>
                Drop your images of your art here!
              </div>
            </div>
            <my-artwork-manage-image v-for="(file, index) in artwork.images" :key="index" :file="file"/>
            <div class="form-group pull-right" v-if="artwork.images.length > 0">
              <button type="submit" class="btn btn-default" @click.prevent="deleteImages()">Restart Images</button>
            </div>
          </div>
        </div>
        <!-- end layout -->
      </md-card-content>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100">
            <div class="md-title">Supporting Documents</div>
            <div id="load-artwork">
              <div class="drop_area" @drop.prevent="loadSupportingFiles" @dragover.prevent>
                Drop supporting documents here!
              </div>
            </div>
            <my-artwork-manage-image v-for="(file, index) in artwork.supportingDocuments" :key="index" :file="file"/>
            <div class="form-group pull-right" v-if="artwork.supportingDocuments.length > 0">
              <button type="submit" class="btn btn-default" @click.prevent="deleteDocuments()">Restart Documents</button>
            </div>
          </div>
        </div>
        <!-- end layout -->
      </md-card-content>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </md-card>
  </form>
</div>
</template>

<script>
import MyArtworkManageImage from "./MyArtworkManageImage";
// import { validationMixin } from "vuelidate";
// import { required, minLength, maxLength } from "vuelidate/lib/validators";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkUploadForm",
//  mixins: [validationMixin],
  components: { MyArtworkManageImage },
  props: ["artworkId", "mode", "formTitle"],
  data() {
    return {
      errors: [],
      sending: false,
      showAlert: false,
      alertMessage: null,
      artwork: {
        itemType: "digiart",
        keywords: "Photography,Illustration.3D,2D,Film & Video,Mix-media",
        artist: "unknown",
        owner: "unknown",
        editions: 1,
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
  },
  computed: {},
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
    getValidationClass(fieldName) {
      const field = this.$v.artwork[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.artwork.title = null;
      this.artwork.description = null;
      this.artwork.keywords = null;
      this.artwork.itemType = null;
      this.artwork.editions = 1;
      this.artwork.owner = null;
      this.artwork.artist = null;
    },
    validateArtwork() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.upload();
      } else {
        this.showAlert = true;
        console.log("errros", this.$v);
        this.alertMessage = "Please fix the form errors indicated in red.. ";
      }
    },
    validate: function() {
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
      if (
        this.artwork.itemType !== "physart" &&
        this.artwork.artwork &&
        this.artwork.artwork.length === 0
      ) {
        this.errors.push("Please attach an artwork.");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        return true;
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
#load-artwork {
  height: 90px;
  background: #ccc;
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  margin: 5px;
  border: 2pt solid #333;
  border-radius: 10px;
}
</style>
