<template>
<div>
<!--ViewWrapper-->
<mdb-view :style="headerStyle">
  <mdb-mask class="gradient d-flex justify-content-center align-items-center">
    <mdb-container>
      <mdb-row>
        <div class="white-text text-center text-md-left col-md-6 mt-xl-5 mb-5">
          <h1 class="h1-responsive font-weight-bold mt-sm-5">Make purchases with our app </h1>
          <hr class="hr-light"/>
          <h6 class="mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem repellendus quasi fuga nesciunt
          dolorum nulla magnam veniam sapiente, fugiat! Commodi sequi non animi ea dolor molestiae
          iste.</h6>
          <mdb-btn color="white">Download</mdb-btn>
          <mdb-btn outline="white">Learn More</mdb-btn>
        </div>
      </mdb-row>
    </mdb-container>
  </mdb-mask>
</mdb-view>
<!--/.ViewWrapper-->

<mdb-container>
  <mdb-row class="py-5">
    <team-section/>
  </mdb-row>
</mdb-container>
</div>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbNavbar, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbInput, mdbView, mdbMask, mdbBtn, mdbNavbarBrand } from 'mdbvue';
import Contact from "./components/brightblock/Contact";
import Mission from "./components/brightblock/Mission";
import TeamSection from "./components/brightblock/TeamSection";
import Donate from "./components/brightblock/Donate";

export default {
  components: {
    Contact,
    Mission,
    TeamSection,
    Donate,
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
    return {};
  },
  props: {
    image: {
      type: String,
      default: require("@/assets/img/brightblock/gallery.png")
    }
  },
  methods: {},
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.image})`
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
