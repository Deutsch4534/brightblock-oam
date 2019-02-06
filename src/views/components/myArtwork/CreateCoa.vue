<template>
<mdb-card-body>
  <mdb-card-title>Certificate of Authenticity</mdb-card-title>
  <h5>{{artwork.title}}</h5>
  <mdb-card-text>
    <a v-if="!coa" class="black-text d-flex justify-content-end"><mdb-btn color="primary" size="sm" @click="generateCoa()">Generate</mdb-btn></a>
    <a v-else :href="downloadLink" _target="blank" class="black-text d-flex justify-content-end"><mdb-btn color="primary" size="sm">Download</mdb-btn></a>
  </mdb-card-text>
  <hr/>
</mdb-card-body>
</template>

<script>
import xhrService from "@/services/xhrService";
import { mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    artwork: {
      type: Object,
      default() {
        return {
          bcitem: {}
        };
      }
    }
  },
  data() {
    return {
      result: null,
      downloadLink: null,
      coa: null
    };
  },
  mounted() {},
  computed: {
  },
  methods: {
    generateCoa: function() {
      let $self = this;
      let siteLogo = require("@/assets/img/logo/T_8_Symbolmark_black.png");
      let data = {
        artwork: this.artwork,
        siteName: "Transit8",
        siteLogo: siteLogo
      }
      xhrService.makePostCall("/api/convert/coa", data).then((response) => {
        $self.coa = response.data;
        $self.downloadLink = $self.getPdfLink();
        $self.$emit('updateCoa', response.data)
      });
    },
    getPdfLink: function() {
      if (this.artwork) {
        let title = this.artwork.title;
        title = title.replace(/\s/g, '_');
        let filename = title + "_" + this.artwork.id + ".pdf";
        return "http://localhost:8191/api/getpdf/" + filename;
      }
    },
    /**
    getPdfLink () {
      let pdfWindow = window.open("");
      pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + (this.coa)+"'></iframe>");
    },
    **/
    openCoa () {
      var downloadLink      = document.createElement('a');
      downloadLink.target   = '_blank';
      downloadLink.download = 'name_to_give_saved_file.pdf';

      var blob = new Blob([this.coa], {type: "application/pdf"})
      // create an object URL from the Blob
      var URL = window.URL || window.webkitURL;
      var downloadUrl = URL.createObjectURL(blob);
      // set object URL as the anchor's href
      downloadLink.href = downloadUrl;

      // append the anchor to document body
      document.body.appendChild(downloadLink);

      // fire a click event on the anchor
      downloadLink.click();

      // cleanup: remove element and revoke object URL
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);

      // window.open("data:application/pdf, " + (this.coa));

      //let pdfWindow = window.open("")
      //pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(artwork.coa)+"'></iframe>")
    },
  }
};
</script>
