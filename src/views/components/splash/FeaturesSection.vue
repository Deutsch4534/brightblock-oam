<template>
<mdb-row id="AudienceSection" class="py-5 mx-auto border-top border-dark">
  <div class="col-md-8 offset-md-2">
    <h1 class="mb-0 pt-md-5 pt-5">{{title}}</h1>
    <hr class="hr-light my-4">
  </div>
  <div class="col-md-3">
    <!-- Card -->
    <div class="card">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="card-title text-center"><a><mdb-icon icon="angle-double-right" /></a></h4>
        <p class="card-text">{{cardDescription1}}</p>
      </div>
    </div>
    <!-- Card -->
  </div>
  <div class="col-md-3">
    <!-- Card -->
    <div class="card">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="card-title text-center"><a><mdb-icon fab icon="bullseye" /></a></h4>
        <p class="card-text">{{cardDescription2}}</p>
      </div>
    </div>
    <!-- Card -->
  </div>

  <div class="col-md-3">
    <!-- Card -->
    <div class="card">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="card-title text-center"><a><mdb-icon icon="bullseye" /></a></h4>
        <p class="card-text">{{cardDescription3}}</p>
      </div>
    </div>
    <!-- Card -->
  </div>

  <div class="col-md-3">
    <!-- Card -->
    <div class="card">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="card-title text-center"><a><mdb-icon far icon="angle-double-left" /></a></h4>
        <p class="card-text">{{cardDescription4}}</p>
      </div>
    </div>
    <!-- Card -->
  </div>
</mdb-row>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon, mdbInput, mdbTextarea, mdbCard, mdbCardBody } from 'mdbvue';

export default {
  name: 'AudienceSection',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbIcon,
    mdbInput,
    mdbTextarea,
    mdbCard,
    mdbCardBody
  },
  data() {
    return {
      title: "FEATURES DESIGNED TO MAKE YOU TRULY INDEPENDENT",
      cardTitle1: "ARTISTS",
      cardDescription1: "Buying and selling of digital artworks",
      cardTitle2: "COLLECTORS",
      cardDescription2: "Offering items on the marketplace",
      cardTitle3: "GALLERIES",
      cardDescription3: "Bidding the highest bidder subject",
      cardTitle4: "GALLERIES",
      cardDescription4: "Commissioning and Funding Art projects",
    };
  }
};
</script>

<style scoped>
.card {
  border: 2pt solid black;
}
</style>
