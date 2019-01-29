<template>
<div>
<mdb-card>
  <mdb-card-body>
    <mdb-card-title>Upload Media</mdb-card-title>
    <mdb-card-text>
      <div class="text-danger">{{errorMessage}}</div>
        <div class="load-artwork" v-if="checkQuantity">
          <div class="drop_area" @drop.prevent="loadMediaObjects" @dragover.prevent>
            Drop your media file here!
          </div>
        </div>
    </mdb-card-text>
    <a color="white" @click.prevent="clearMediaObjects" v-if="mediaObjects.length > 0"><mdb-btn class="white">Clear</mdb-btn></a>
  </mdb-card-body>
</mdb-card>
<mdb-card v-for="(file, index) in mediaObjects" :key="index" :file="file">
  <mdb-card-image :src="file.dataUrl" alt="Card image cap"></mdb-card-image>
  <mdb-card-body>
    <mdb-card-title>{{ file.name }}</mdb-card-title>
    <mdb-card-text>({{ file.size }}) type: {{ file.type }}</mdb-card-text>
    <mdb-card-text>Last Changed: {{ file.lastModifiedDate }}</mdb-card-text>
  </mdb-card-body>
</mdb-card>
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
  props: ["sizeLimit", "quantityLimit"],
  data() {
    return {
      mediaObjects: [],
      errorMessage: null
    };
  },
  mounted() {},
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
