<template>
<div>
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
  <div class="border-top border-dark"></div>
    <mdb-container>
      <auction-section/>
    </mdb-container>

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
import MissionSection from "./components/splash/MissionSection";
import TeamSection from "./components/splash/TeamSection";
import DonateSection from "./components/splash/DonateSection";
import AudienceSection from "./components/splash/AudienceSection";
import FeaturesSection from "./components/splash/FeaturesSection";
import AuctionSection from './components/splash/AuctionSection';

export default {
  components: {
    AuctionSection,
    mdbContainer,
    mdbRow,
    mdbCol,
    ContactSection,
    MissionSection,
    TeamSection,
    DonateSection,
    AudienceSection,
    FeaturesSection,
  },
  name: "index",
  bodyClass: "index-page",
  data() {
    return {
      title1: "Empowering the art community with tools to break free and solve current status quo",
      description1: "Artists require the tools to take the heroic quest of art into their own hands. By sidestepping the gatekeepers, artist will participate in creating their own platform and, in consequence, their own destiny.",
      title2: "Art ecosystem for artists and collectors",
      description2: "Using Radicle contemporary artists showcase and sell their digital artworks to collectors and investors, who in turn can trade art amongst each other.<br/><br/>The digital artworks traded on Radicle can both be created traditionally or digitally, but the essence is that they are always preserved digitally. Radicle uses blockchain technology to secure originality and ownership of digital artworks, as well as to enable real-time auctioning and one enabling originality of digital file.",
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
