<template>
<mdb-card>
  <mdb-card-image :src="file.dataUrl" alt="Card image cap"></mdb-card-image>
  <mdb-card-body>
    <mdb-card-title>{{ file.name }}</mdb-card-title>
    <mdb-card-text>({{ file.size }}) type: {{ file.type }}</mdb-card-text>
    <mdb-card-text>Last Changed: {{ file.lastModifiedDate }}</mdb-card-text>
  </mdb-card-body>
</mdb-card>
</template>

<script>
import { mdbCol, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

export default {
  props: ["file"],
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
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
</style>
