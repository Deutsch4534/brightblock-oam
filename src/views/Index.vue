<template>
<div>
  <mdb-container>
    <mdb-row class="py-5 mx-auto">
      <div class="col-md-8 offset-md-2">
        <h1 class="mb-0 pt-md-5 pt-5">{{title1}}</h1>
        <hr class="hr-light my-4">
        <p class="mb-4">{{description1}}</p>
      </div>
    </mdb-row>
    <mdb-row class="py-5 mx-auto">
      <div class="col-md-8 offset-md-2">
        <h1 class="mb-0 pt-md-5 pt-5">{{title2}}</h1>
        <hr class="hr-light my-4">
        <p class="mb-4">{{description2}}</p>
      </div>
    </mdb-row>
    <audience-section/>
    <features-section/>
    <!--
      <mdb-row class="py-5">
        <mission-section/>
      </mdb-row>
    -->
    <mdb-row class="py-5">
      <team-section/>
    </mdb-row>
    <mdb-row class="py-5">
      <donate-section/>
    </mdb-row>
  </mdb-container>
  <div class="container-fluid px-0 mx-0">
    <contact-section/>
  </div>
</div>
</template>

<script>
import { mdbContainer, mdbRow } from 'mdbvue';
import ContactSection from "./components/splash/ContactSection";
import MissionSection from "./components/splash/MissionSection";
import TeamSection from "./components/splash/TeamSection";
import DonateSection from "./components/splash/DonateSection";
import AudienceSection from "./components/splash/AudienceSection";
import FeaturesSection from "./components/splash/FeaturesSection";

export default {
  components: {
    mdbContainer,
    mdbRow,
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
      description2: "Using Transit8 contemporary artists showcase and sell their digital artworks to collectors and investors, who in turn can trade art amongst each other.<br/><br/> The digital artworks traded on Transit8 can both be created traditionally or digitally, but the essence is that they are always preserved digitally. Transit8 uses blockchain technology to secure originality and ownership of digital artworks, as well as to enable real-time auctioning and one enabling originality of digital file.",
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
</style>
