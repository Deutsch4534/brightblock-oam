<template>
  <div :class="columns" class="mt-3">
    <img :src="missing" alt="Card image cap" class="img-fluid" v-if="ispdf">
    <img :src="file.dataUrl" alt="Card image cap" class="img-fluid" v-else>
    <div v-if="ispdf">
      <p class="mb-0 small">{{ file.type }}</p>
      <!--
      <mdb-card-text>({{ file.size }}) type: {{ file.type }}</mdb-card-text>
      <mdb-card-text>Last Changed: {{ file.lastModifiedDate }}</mdb-card-text>
      -->
    </div>
</div>

</template>

<script>
import { mdbCol, mdbRow, mdbContainer, mdbBtn } from "mdbvue";

export default {
  props: ["file", "size"],
  name: "MyArtworkManageImage",
  components: {
    mdbContainer,
    mdbCol,
    mdbRow,
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
      return "col-" + this.size;
    }
  },
};
</script>

<style scoped>
</style>
