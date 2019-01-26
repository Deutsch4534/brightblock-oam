<template>
<mdb-container>
  <mdb-row class="py-5">
    <mission-section/>
  </mdb-row>
  <mdb-row class="py-5">
    <team-section/>
  </mdb-row>
  <mdb-row class="py-5">
    <contact-section/>
  </mdb-row>
  <mdb-row class="py-5">
    <donate-section/>
  </mdb-row>
</mdb-container>
</template>

<script>
import { mdbContainer, mdbRow } from 'mdbvue';
import ContactSection from "./components/splash/ContactSection";
import MissionSection from "./components/splash/MissionSection";
import TeamSection from "./components/splash/TeamSection";
import DonateSection from "./components/splash/DonateSection";

export default {
  components: {
    mdbContainer,
    mdbRow,
    ContactSection,
    MissionSection,
    TeamSection,
    DonateSection,
  },
  name: "index",
  bodyClass: "index-page",
};
</script>
<style>
</style>
