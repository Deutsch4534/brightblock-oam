<template>
<div>
<!--ViewWrapper-->
<mdb-view :style="headerStyle">
  <mdb-mask class="gradient d-flex justify-content-center align-items-center">
    <mdb-container>
      <mdb-row>
        <div class="white-text text-center text-md-left col-md-5 mt-xl-4 mb-4">
          <h1 class="h1-responsive font-weight-bold mt-sm-5">{{title}}</h1>
          <hr class="hr-light" v-if="title.length > 0"/>
          <h6 class="mb-4" v-if="tagline.length > 0">{{tagline}}</h6>
          <!-- <mdb-btn color="white" v-if="title.length > 0">Download</mdb-btn> -->
          <mdb-btn outline="white" v-if="title.length > 0">Learn More</mdb-btn>
        </div>
      </mdb-row>
    </mdb-container>
  </mdb-mask>
</mdb-view>
<!--/.ViewWrapper-->

<mdb-container>
  <mdb-row class="py-5">
    <mission-section/>
  </mdb-row>
  <mdb-row class="py-5">
    <team-section/>
  </mdb-row>
  <mdb-row class="py-5">
    <contact-section/>
  </mdb-row>
  <mdb-row class="py-5">
    <donate-section/>
  </mdb-row>
</mdb-container>
</div>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbNavbar, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbInput, mdbView, mdbMask, mdbBtn, mdbNavbarBrand } from 'mdbvue';
import ContactSection from "./components/brightblock/ContactSection";
import MissionSection from "./components/brightblock/MissionSection";
import TeamSection from "./components/brightblock/TeamSection";
import DonateSection from "./components/brightblock/DonateSection";

export default {
  components: {
    ContactSection,
    MissionSection,
    TeamSection,
    DonateSection,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbNavbar,
    mdbNavbarToggler,
    mdbNavbarNav,
    mdbNavItem,
    mdbInput,
    mdbView,
    mdbMask,
    mdbBtn,
    mdbNavbarBrand
  },
  name: "brightBlock",
  data() {
    return {
      imageUrl: null,
      title: '',
      tagline: ''
    };
  },
  created() {
    this.getContent();
  },
  methods: {
    getContent() {
      this.$prismic.client.getSingle("home").then(document => {
        this.title = document.data.title[0].text;
        this.tagline = document.data.richcontent[0].text;
        this.imageUrl = document.data.bgimage.url;
      });
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.imageUrl})`
      };
    }
  }
};
</script>
<style>
.navbar {
  transition: 1s;
}
.navbar .md-form {
  margin: 0;
}
.top-nav-collapse {
  background-color: #424f95 !important;
}
@media (max-width: 990px){
  .navbar {
    background-color: #424f95 !important;
  }
}
.view {
  margin-top: 60px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: calc(100vh - 60px);
}
.gradient {
  background: -moz-linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.7) 100%);
  background: -webkit-linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.7) 100%);
  background: -webkit-gradient(linear, 45deg, from(rgba(42, 27, 161, 0.7)), to(rgba(29, 210, 177, 0.7)));
  background: -o-linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.7) 100%);
  background: linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.4) 80%);
}
h6 {
    line-height: 1.7;
}
</style>
