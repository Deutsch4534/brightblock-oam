<template>
<div>
  <div class="border-top border-dark"></div>
  <mdb-container>
    <mdb-row class="py-5 col-lg-10 mx-auto" id="AboutSection">
      <mdb-col lg="10">
        <h2 class="h1-responsive mb-0 pt-md-5 pt-5">{{title1}}</h2>
        <hr class="hr-light my-4">
        <p class="mb-4" v-html="description1"></p>
      </mdb-col>
    </mdb-row>
  </mdb-container>
  <div class="border-top border-dark"></div>
    <mdb-container>
      <mdb-row class="py-5 col-lg-10 mx-auto">
        <mdb-col md="10">
          <h2 class="h1-responsive mb-0 pt-md-5 pt-5">{{title2}}</h2>
          <hr class="hr-light my-4">
          <p class="mb-4" v-html="description2"></p>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  <div class="border-top border-dark"></div>
    <mdb-container>
    <audience-section/>
    </mdb-container>
  <div class="border-top border-dark"></div>
    <mdb-container>
    <features-section/>
    </mdb-container>
  <div class="border-top border-dark"></div>
    <mdb-container>
    <mdb-row class="py-5">
      <team-section/>
    </mdb-row>
    </mdb-container>
  <div class="border-top border-dark"></div>
    <mdb-container>
      <auction-section/>
    </mdb-container>
  <div class="border-top border-dark"></div>
    <mdb-container>
    <mdb-row class="py-5">
      <donate-section/>
    </mdb-row>
  </mdb-container>
  <mdb-container fluid class="bg-main">
    <mdb-container>
      <div class="container-fluid px-0 mx-0">
        <contact-section/>
      </div>
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
      description2: "Using Transit8 contemporary artists showcase and sell their digital artworks to collectors and investors, who in turn can trade art amongst each other.<br/><br/>The digital artworks traded on Transit8 can both be created traditionally or digitally, but the essence is that they are always preserved digitally. Transit8 uses blockchain technology to secure originality and ownership of digital artworks, as well as to enable real-time auctioning and one enabling originality of digital file.",
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
  @font-face {
    font-family: 'Noto Serif Disp ExtCond';
    src: url('../assets/fonts/NotoSerifDisplay-ExtraCondensedLight.eot');
    src: url('../assets/fonts/NotoSerifDisplay-ExtraCondensedLight.eot?#iefix') format('embedded-opentype'),
    url('../assets/fonts/NotoSerifDisplay-ExtraCondensedLight.woff2') format('woff2'),
    url('../assets/fonts/NotoSerifDisplay-ExtraCondensedLight.woff') format('woff'),
    url('../assets/fonts/NotoSerifDisplay-ExtraCondensedLight.svg#NotoSerifDisplay-ExtraCondensedLight') format('svg');
    font-weight: 300;
    font-style: normal;
  }

  .bg-main {
    background-color: #5400E8;
  }

   /* Extra small devices (portrait phones, less than 576px) */
  @media (max-width: 575px) { }

  /*  Small devices (landscape phones, 576px and up) */
  @media (min-width: 576px) {
    h1.tagline {
      font-size: 300%;
    }
    .large-title {
      font-size: 200%;
    }
  }

  /* Medium devices (tablets, 768px and up) */
  @media (min-width: 768px) {
    h1.tagline {
      font-size: 350%;
    }
    .large-title {
      font-size: 250%;
    }
  }

  /* Large devices (desktops, 992px and up) */
  @media (min-width: 992px) {
    h1.tagline {
      font-size: 500%;
    }

    .h1-responsive {
      font-size: 250%;
    }

    .large-title {
      font-size: 300%;
    }
  }

  /* Extra large devices (large desktops, 1200px and up) */
  @media (min-width: 1200px) {
    .h1-responsive {
      font-size: 300%;
    }
    .large-title {
      font-size: 400%;
    }
  }

</style>

