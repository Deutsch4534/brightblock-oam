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

  <mdb-container>
    <h2>Featured Images</h2>
    <mdb-row class="article py-5 d-flex">
      <single-result-index v-for="(artwork, index) of artworks" :key="index" :artwork="artwork" class="result-item col-12"/>
    </mdb-row>
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
import SingleResultIndex from "./components/search/SingleResultIndex";
import _ from "lodash";
import artworkSearchService from "@/services/artworkSearchService";

const STORE_NAMESPACE = 'landingPage/home';

export default {
  components: {
    SingleResultIndex,
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
      ecosystem: null,
      artworks: [],
      featuredProd: [
        1552477645810, 1552434828757, 1552408014929, 1552424628546, 1552424579103, 1552407560197, 1554285566531, 1550604743317, 1550604524358
      ],
      featuredDev: [
        1545314729978, 1545391942889, 1553779100600, 1551860708115, 1553778477967, 1553778888278, 1552395050543, 1553779020152, 1553780414385
      ]
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
  },
  mounted() {
    let env = this.$store.state.constants.nodeEnv;
    let featured = this.featuredProd;
    if (env === "development") {
      featured = this.featuredDev;
    }
    let $self = this;
    _.forEach(featured, function(artworkId) {
      let artwork = $self.$store.getters["artworkSearchStore/getArtwork"](artworkId);
      if (!artwork || !artwork.id) {
        artworkSearchService.newQuery({field: "id", query: artworkId}, function(artwork) {
          $self.artworks.push(artwork);
        });
      } else {
        $self.artworks.push(artwork);
      }
    });
  },
  computed: {
  }
};
</script>

<style>
.contact-section >>> p { color: #EFF1F2; }
.article {
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: center;
}

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
