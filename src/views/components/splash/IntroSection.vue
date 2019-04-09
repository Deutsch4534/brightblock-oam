<template>
  <div>
    <!-- Full Page Intro https://mdbootstrap.com/img/Photos/Others/img%20%2848%29.jpg -->
    <div class="view jarallax" :style="headerStyle">
      <!-- Mask & flexbox options-->
      <!--  <div class="mask d-flex justify-content-center align-items-center"> -->
      <div class="mask d-flex justify-content-center">
        <div class="container">
          <div class="row">
            <div class="col-md-12 mb-4 mt-5 white-text text-left">
              <h1 class="tagline m-5 text-center fadeInDown" data-wow-delay="0.4s" v-html="tagline"></h1>
            </div>
          </div>
        </div>
      </div>
      <!-- Mask & flexbox options-->
    </div>
    <!-- Full Page Intro -->
    <mdb-container fluid class="px-5" :style="headerStyle">
      <mdb-row class="py-2 d-flex align-items-center intro-title">
        <mdb-col md="4" v-html="cardDescription1">
        </mdb-col>
        <mdb-col md="4" v-html="cardDescription2">
        </mdb-col>
        <mdb-col md="4" v-html="cardDescription3">
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
        strapline: null,
        cardDescription1: null,
        cardDescription2: null,
        cardDescription3: null,
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
      this.tagline = content["section-whofor-title"][0].text;
      this.cardDescription1 = content["section-whofor1"][0].text;
      this.cardDescription2 = content["section-whofor2"][0].text;
      this.cardDescription3 = content["section-whofor3"][0].text;
    },
    computed: {
      headerStyle() {
        //           "background-image": `url(${content["navbar-background"].url})`,
        let content = this.$store.state.contentStore.content["index-page"];
        return {
          "margin-top": "0px",
          "background-repeat": "no-repeat",
          "background-size": "cover",
          "background-color": "#4EAC9A",
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
    /* font-family: 'Noto Serif Disp ExtCond'; */
    font-size: 2.0em;
    font-weight: 400;
  }
  @media (max-width: 576px) {
    .h1.tagline {
      font-size: 1.0em;
    }
  }

  .intro-title {
    min-height: 65px;
    font-size: 0.9em;
    font-weight: 400;
  }

  .intro-title  {
    min-height: 65px;
    font-size: 0.9em;
    font-weight: 400;
  }

  .intro-title a {
    color: initial;
    text-decoration: underline;
  }

  .view {
    /* background-image: url('https://mdbootstrap.com/img/Photos/Others/architecture.jpg'); */
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }

  .jarallax {
    min-height: calc(100vh - 400px);
  }

  @media (max-width: 576px) {
    .jarallax {
      min-height: 380px;
    }
  }
</style>
