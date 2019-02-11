<template>

<mdb-card :class="columns">
  <mdb-card-image :src="missing" alt="Card image cap" v-if="ispdf"></mdb-card-image>
  <mdb-card-image :src="file.dataUrl" alt="Card image cap" v-else></mdb-card-image>
  <mdb-card-body v-if="ispdf">
    <mdb-card-text>{{ file.type }}</mdb-card-text>
    <!--
    <mdb-card-text>({{ file.size }}) type: {{ file.type }}</mdb-card-text>
    <mdb-card-text>Last Changed: {{ file.lastModifiedDate }}</mdb-card-text>
    -->
  </mdb-card-body>
</mdb-card>
</template>

<script>
import { mdbCol, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

export default {
  props: ["file", "size"],
  name: "MyArtworkManageImage",
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
  data() {
    return {
      missing: require("@/assets/img/logo/T_8_Symbolmark_black.png")
    };
  },
  mounted() {},
  methods: {},
  computed: {
    ispdf() {
      return this.file.type.indexOf("pdf") > -1;
    },
    columns() {
      return "col-md-" + this.size;
    }
  },
};
</script>

<style scoped>
</style>
