<template>
  <div>
    <div class="view" :style="headerStyle">
      <div class="mask d-flex justify-content-center">
        <div class="container">
          <div class="row">
            <div class="col-md-10 offset-1 mb-4 mt-5 white-text text-center">
              <h3 class="about1" v-html="about1"></h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Full Page Intro -->
    <mdb-container fluid class="pt-5" style="font-size: 0.9em;">
      <mdb-row class="py-2 d-flex align-items-center text-center intro-title">
        <mdb-col md="12"  class="about2 px-5">
          <h4 class="about2" v-html="about2"></h4>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbView, mdbMask } from 'mdbvue';
  import Navbar from '../../../layout/Navbar';

  export default {
    name: 'AboutSection',
    data() {
      return {
        about1: "Since this is a paradigm shift in how the internet of the future will work it takes some time to understand what is going on here. Learn more...",
        about2: "We have built a platform that will change the way art is both traded and collected.",
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
      let content = this.$store.state.contentStore.content["help-list"];
      if (content) {
        this.about1 = content["about1"][0].text;
        this.about2 = content["about2"][0].text;
      }
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
          "background-position": "center center",
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

h3.about1 {
  /* font-family: 'Noto Serif Disp ExtCond'; */
  font-size: 1.6em;
  font-weight: 900;
  margin: 5px 50px;
}
h4.about2 {
  /* font-family: 'Noto Serif Disp ExtCond'; */
  font-size: 0.9em;
  font-weight: 900;
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

  .view {
    min-height: 200px;
  }

</style>
