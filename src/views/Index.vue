<template>
<div id="my-app-element" v-if="loaded">

  <div id="introSection">
    <intro-section />
  </div>

  <!-- About section  -->
  <div class="border-top border-dark"></div>
  <mdb-container v-if="empower">
    <section id="AboutSection" class="py-5">
      <mdb-row class="py-3 py-md-5">
        <mdb-col col="12" md="10" lg="8" v-html="empower">
        </mdb-col>
      </mdb-row>
    </section>
  </mdb-container>

  <!-- Features section  -->
  <div class="border-top border-dark"></div>
  <mdb-container>
    <features-section/>
  </mdb-container>

  <!-- Audience section  -->
  <div class="border-top border-dark"></div>
  <mdb-container>
    <audience-section/>
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
  data() {
    return {
      loaded: false,
      empower: null,
      ecosystem: null
    };
  },
  beforeMount() {
    document.querySelector('body').classList.add('index');
    let $self = this;
    this.$prismic.client.getSingle("index-page").then(document => {
      this.$store.commit("contentStore/indexPage", document.data);
      let content = this.$store.state.contentStore.content["index-page"];
      $self.empower = content["section-empower"][0].text;
      $self.ecosystem = content["section-eco"][0].text;
      $self.loaded = true;
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
