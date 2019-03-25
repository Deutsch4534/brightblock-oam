<template>
<!-- droppable area 1 -->
<div class="col-md-12 mb-0 px-3">
  <mdb-popover trigger="click" :options="{placement: 'top'}">
    <div class="popover">
      <div class="popover-header">
        {{contentModel.title}}
      </div>
      <div class="popover-body" v-html="contentModel.popoverBody">
      </div>
    </div>
    <a @click.prevent="" slot="reference">
      {{contentModel.title}}
      <mdb-icon far icon="question-circle"/>
    </a>
  </mdb-popover>
  <div class="mt-2">
    <div class="invalid-feedback d-block" v-if="showError">
      {{contentModel.errorMessage}}
    </div>
    <div class="invalid-feedback d-block" v-if="parentalError">
      {{parentalError}}
    </div>
    <div class="invalid-feedback d-block" v-if="internalError">
      {{internalError}}
    </div>
    <!-- Drop area -->
    <div class="load-artwork" v-if="checkQuantity">
      <div class="drop-area" @drop.prevent="loadMediaObjects" @dragover.prevent>
        <p class="drop-label">Drop file here</p>
      </div>
    </div>
  </div>

  <div class="row">
    <div v-for="(file, index) in mediaObjects" :key="index" :file="file" class="col-md-6">
      <img :src="missing" alt="Card image cap" class="img-fluid" style="max-height: 250px;" v-if="ispdf(file)">
      <img :src="file.dataUrl" alt="Card image cap" class="img-fluid mb-2" style="max-height: 250px;" v-else>
      <div v-if="ispdf(file)">
        <p class="mb-0 small">{{ file.type }}</p>
        <!--
        <mdb-card-text>({{ file.size }}) type: {{ file.type }}</mdb-card-text>
        <mdb-card-text>Last Changed: {{ file.lastModifiedDate }}</mdb-card-text>
        -->
      </div>
    </div>
  </div>
  <div class="row mt-2">
    <div class="col-6">
      <p class="grey-text small">
        Max Files: {{limit}}
        <br/>
        Max Size: {{sizeLimit}}Kb
      </p>
    </div>
    <div class="col-6 text-right">
      <a class="d-inline-block" @click.prevent="clearMediaObjects" v-if="mediaObjects.length > 0">
        <mdb-btn color="white" size="md" class="mx-0">Clear</mdb-btn>
      </a>
    </div>
  </div>
</div>
<!--/droppable area 1 -->
</template>

<script>
import { mdbCol, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import { mdbIcon, mdbPopover } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MediaFilesUpload",
  components: {
    mdbContainer,
    mdbCol,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbIcon,
    mdbPopover
  },
  props: {
    showError: {
      type: Boolean,
      default: () => (false),
      required: false
    },
    sizeLimit: {
      type: Number,
      default: () => (450),
      required: true
    },
    parentalError: {
      type: String,
      default: () => (""),
      required: false
    },
    mediaTypes: {
      type: String,
      default: () => ("all"),
      required: false
    },
    limit: {
      type: Number,
      default: () => (2),
      required: true
    },
    contentModel: {
      type: Object,
      default: () => ({}),
      required: true
    },
    mediaFiles: {
      type: Array,
      default: () => ([]),
      required: false
    }
  },
  data() {
    return {
      mediaObjects: [],
      internalError: null,
      missing: require("@/assets/img/missing/artwork-missing.jpg"),
    };
  },
  created() {
    if (this.mediaFiles && this.mediaFiles.length > 0) {
      Object.assign(this.mediaObjects, this.mediaFiles);
    }
  },
  computed: {
    checkQuantity: function() {
      return this.mediaObjects.length < Number(this.limit);
    },
    columns() {
      return "col-" + this.size;
    }
  },
  methods: {
    clearMediaObjects: function() {
      this.mediaObjects = [];
      this.$emit('updateMedia', this.mediaObjects);
    },
    ispdf(file) {
      try {
        return file.type.indexOf("pdf") > -1;
      } catch (err) {
        return false;
      }
    },
    isImage(file) {
      try {
        let image = file.type.indexOf("img") > -1 ||
              file.type.indexOf("image") > -1 ||
              file.type.indexOf("png") > -1 ||
              file.type.indexOf("jpeg") > -1 ||
              file.type.indexOf("jpg") > -1 ||
              file.type.indexOf("gif") > -1;
        return image;
      } catch (err) {
        return false;
      }
    },
    loadMediaObjects: function(e) {
      this.load(e, this.mediaObjects, 1);
    },
    load: function(e, arrayToLoad, limit) {
      let $self = this;
      this.internalError = null;
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
          this.internalError = "This file (" + ksize + " Kb) exceeds the size limit of " + this.sizeLimit + " Kb";
          return;
        }
        if (this.mediaTypes === "images" && !$self.isImage(fileObject)) {
          this.internalError = "Image files only please.";
          return;
        } else if (!$self.ispdf(fileObject) && !$self.isImage(fileObject)) {
          this.internalError = "Image / pdf files only please.";
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
