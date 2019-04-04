<template>
  <mdb-container fluid class="bg-light flex-1 py-5">
    <mdb-container class="py-3 py-md-4">
    <div class="row">
      <div class="col-md-3">
        <mdb-navbar class="blue lighten-5">
          <mdb-navbar-nav nav vertical>
            <mdb-nav-item><h5>My Galleries</h5></mdb-nav-item>
          </mdb-navbar-nav>
        </mdb-navbar>
      </div>
      <div class="col-md-9">
        <mdb-row>

          <div class="col-12" v-for="(gallery, index) of galleries" :key="index">
            <h2 class="h2-responsive mb-5">{{gallery.name}}</span></h2>
          </div>

        </mdb-row>
      </div>
    </div>
    </mdb-container>
  </mdb-container>
</template>

<script>
import MyArtworksList from "./components/myArtwork/MyArtworksList";
import { mdbContainer, mdbRow,  mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn } from 'mdbvue';
import { mdbNavbar, mdbNavbarNav, mdbNavItem } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyGalleries",
  bodyClass: "index-page",
  components: {
    MyArtworksList,
    mdbContainer,
    mdbRow,
     mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn, mdbNavbar, mdbNavbarNav, mdbNavItem
  },
  data() {
    return {
      showNav: 1,
    };
  },
  created() {
  },
  methods: {},
  computed: {
    galleries() {
      return this.$store.getters["galleryStore/getMyGalleries"];
    },
  }
};
</script>
<style scoped>
.active {
  background-color: #fff;
  font-weight: 300;
}
</style>
