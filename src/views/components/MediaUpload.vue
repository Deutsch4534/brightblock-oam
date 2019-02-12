<template>
<div>

  <!-- Error message -->
  <div class="text-danger">{{errorMessage}}</div>

  <!-- Drop area -->
  <div class="load-artwork" v-if="checkQuantity">
    <div class="drop-area" @drop.prevent="loadMediaObjects" @dragover.prevent>
      <p class="drop-label">Drop image here</p>
    </div>
  </div>

  <!-- Dropped file preview and info -->
  <div v-for="(file, index) in mediaObjects" :key="index" :file="file">
    <img :src="file.dataUrl" alt="Card image cap" class="img-fluid mb-2">
    <p class="mb-0 small">{{ file.name }}</p>
    <p class="mb-0 small">size: {{ file.size }}, type: {{ file.type }}</p>
    <p class="mb-0 small">Last Changed:<br />{{ file.lastModifiedDate }}</p>
  </div>

  <!-- Remove action -->
  <a class="mt-3 d-inline-block" @click.prevent="clearMediaObjects" v-if="mediaObjects.length > 0">
    <mdb-btn color="white" size="md" class="mx-0">Clear</mdb-btn>
  </a>

</div>
</template>

<script>
import { mdbCol, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MediaUpload",
  components: {
    mdbContainer,
    mdbCol,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    logo: {}
  },
  data() {
    return {
      errorMessage: null,
      mediaObjects: [],
      sizeLimit: "500",
      quantityLimit: "1",
    };
  },
  created() {
    if (this.logo && this.logo.dataUrl) {
      this.mediaObjects.push(this.logo);
    }
  },
  computed: {
    checkQuantity: function() {
      return this.mediaObjects.length < Number(this.quantityLimit);
    }
  },
  methods: {
    clearMediaObjects: function() {
      this.mediaObjects = [];
    },
    loadMediaObjects: function(e) {
      this.load(e, this.mediaObjects, 1);
    },
    load: function(e, arrayToLoad, limit) {
      let $self = this;
      this.errorMessage = null;
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
        let ksize = fileObject.size / 1000;
        if (ksize > Number(this.sizeLimit)) {
          this.errorMessage = "This file (" + ksize + " Kb) exceeds the size limit of " + this.sizeLimit + " Kb";
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          thisFile.dataUrl = e.target.result;
          arrayToLoad.push(thisFile);
          $self.$emit('updateMedia', arrayToLoad)
        };
        reader.readAsDataURL(fileObject);
      }
    }
  }
};
</script>
