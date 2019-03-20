<template>
<div id="my-app-element" v-if="loaded">
  <div id="introSection">
    <intro-section />
  </div>
  <!-- About section  -->
  <div class="border-top border-dark"></div>
  <mdb-container>
    <section id="AboutSection" class="py-5">
      <mdb-row class="py-3 py-md-5">
        <mdb-col col="12" md="10" lg="8" >
          <h2 class="h1-responsive mb-0">{{title1}}</h2>
          <hr class="hr-light my-4">
          <p class="mb-4" v-html="description1"></p>
        </mdb-col>
      </mdb-row>
    </section>
  </mdb-container>

  <!-- About section 2  -->
  <div class="border-top border-dark"></div>
    <mdb-container>
      <section id="AboutSection2" class="py-5">
        <mdb-row class="py-3 py-md-5">
          <mdb-col col="12" md="10" lg="8">
            <h2 class="h1-responsive mb-0">{{title2}}</h2>
            <hr class="hr-light my-4">
            <p class="mb-4" v-html="description2"></p>
          </mdb-col>
        </mdb-row>
      </section>
    </mdb-container>

  <!-- Audience section  -->
  <div class="border-top border-dark"></div>
    <mdb-container>
      <audience-section/>
    </mdb-container>

  <!-- Features section  -->
  <div class="border-top border-dark"></div>
    <mdb-container>
      <features-section/>
    </mdb-container>

  <!-- Team section  -->
  <div class="border-top border-dark"></div>
    <mdb-container>
      <team-section/>
    </mdb-container>

  <!-- Auction section  -->
  <!--
  <div class="border-top border-dark"></div>
    <mdb-container>
      <auction-section/>
    </mdb-container> -->

  <!-- Donate section  -->
  <div class="border-top border-dark"></div>
  <mdb-container fluid class="bg-dark text-white">
    <mdb-container>
      <donate-section/>
    </mdb-container>
  </mdb-container>

  <!-- Contact section  -->
  <mdb-container fluid class="bg-main">
    <mdb-container class="text-light contact-section">
      <contact-section class="text-light"/>
    </mdb-container>
  </mdb-container>
</div>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
import ContactSection from "./components/splash/ContactSection";
import TeamSection from "./components/splash/TeamSection";
import DonateSection from "./components/splash/DonateSection";
import AudienceSection from "./components/splash/AudienceSection";
import FeaturesSection from "./components/splash/FeaturesSection";
import AuctionSection from './components/splash/AuctionSection';
import IntroSection from './components/splash/IntroSection';
import { GET_LANDING_PAGE } from '../storage/action-types';
import store from '../storage/store';
import Vue from "vue";

const STORE_NAMESPACE = 'landingPage/home';

export default {
  components: {
    IntroSection,
    AuctionSection,
    mdbContainer,
    mdbRow,
    mdbCol,
    ContactSection,
    TeamSection,
    DonateSection,
    AudienceSection,
    FeaturesSection,
  },
  name: "index",
  /**
  fetch({ store }) {
    // Dynamically register the store module
    // for our landing page data.
    //registerStoreModule({ module: landingPage, name: STORE_NAMESPACE, store });

    // Do not load data again if already in store.
    if (store.state[STORE_NAMESPACE].id) return;

    // Trigger the action for fetching all
    // the necessary data from the API.
    return store.dispatch(`${STORE_NAMESPACE}/${GET_LANDING_PAGE}`, HOME);
  },
  **/
  data() {
    return {
      loaded: false,
      title1: "Empowering the art community with tools to break free and solve current status quo",
      description1: "Artists require the tools to take the heroic quest of art into their own hands. By sidestepping the gatekeepers, artist will participate in creating their own platform and, in consequence, their own destiny.",
      title2: "Art ecosystem for artists and collectors",
      description2: "Using Radicle contemporary artists showcase and sell their artworks to collectors and investors.<br/><br/>Artworks traded on Radicle can both be created traditionally or digitally. We use blockchain technology to secure originality and ownership of digital artworks, as well as to enable running real-time auction events.",
      title3: "Art ecosystem for artists and collectors",
      description3: "",
      title4: "Art ecosystem for artists and collectors",
      description4: "",
      title5: "Art ecosystem for artists and collectors",
      description5: "",
      title6: "Art ecosystem for artists and collectors",
      description6: "",
    };
  },
  beforeMount() {
    document.querySelector('body').classList.add('index');
    this.$prismic.client.getSingle("index-page").then(document => {
      this.$store.commit("contentStore/indexPage", document.data);
      this.loaded = true;
    });
  },
  beforeDestroy() {
    document.querySelector('body').classList.remove('index');
  }
};
</script>

<style>
.contact-section >>> p { color: #EFF1F2; }

.border-list .list-item {
  padding: 1.2rem 0;
  border-top: 3px solid black;
}

.border-list .list-item:last-child {
  border-bottom: 3px solid black;
}

.border-list .list-item h3 {
  margin-bottom: 2rem;
}
</style>
