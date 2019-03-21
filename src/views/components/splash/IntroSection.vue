<template>
  <div>
    <!-- Full Page Intro https://mdbootstrap.com/img/Photos/Others/img%20%2848%29.jpg -->
    <div class="view jarallax" :style="headerStyle">
      <!-- Mask & flexbox options-->
      <div class="mask rgba-black-light d-flex justify-content-center align-items-center">
        <!-- Content -->
        <div class="container">
          <!--Grid row-->
          <div class="row">
            <!--Grid column-->
            <div class="col-md-12 mb-4 mt-5 white-text text-left">
              <h1 class="tagline mb-4 text-center fadeInDown" data-wow-delay="0.4s" v-html="tagline"></h1>
            </div>
            <!--Grid column-->
          </div>
          <!--Grid row-->
        </div>
        <!-- Content -->
      </div>
      <!-- Mask & flexbox options-->
    </div>
    <!-- Full Page Intro -->
    <mdb-container fluid>
      <mdb-row class="py-2 d-flex align-items-center intro-title">
        <mdb-col md="9">
          <p class="mb-3" v-html="strapline"></p>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask } from 'mdbvue';
  import Navbar from '../../../layout/Navbar';

  export default {
    name: 'IntroSection',
    data() {
      return {
        tagline: null,
        taglink: null,
        backgroundUrl: null,
        strapline: null
      };
    },
    components: {
      mdbContainer,
      mdbRow,
      mdbCol,
      mdbView,
      mdbMask,
      Navbar
    },
    mounted() {
      let content = this.$store.state.contentStore.content["index-page"];
      this.tagline = content["navbar-tagline"][0].text;
      this.strapline = content["navbar-strapline"][0].text;
      this.taglink = content["navbar-taglink"][0].text;
      this.backgroundUrl = content["navbar-background"].url;
    },
    computed: {
      headerStyle() {
        let content = this.$store.state.contentStore.content["index-page"];
        return {
          "margin-top": "0px",
          "background-image": `url(${content["navbar-background"].url})`,
          "background-repeat": "no-repeat",
          "background-size": "cover",
          "background-position": "center center"
        };
      },
      getAuctionLink() {
        let content = this.$store.state.contentStore.content["index-page"];
        return content["navbar-taglink"][0].text;
      }
    },
    methods: {}
  }
</script>
<style scoped>

  h1.tagline {
    font-family: 'Noto Serif Disp ExtCond';
    color: #ECEFF1;
  }

  .intro-title {
    min-height: 65px;
    font-size: 18px;
  }

  .intro-title a {
    color: initial;
    text-decoration: underline;
  }

  .view {
    background-image: url('https://mdbootstrap.com/img/Photos/Others/architecture.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .jarallax {
    min-height: calc(100vh - 170px);
  }

  @media (max-width: 576px) {
    .jarallax {
      min-height: 380px;
    }
  }
</style>
