<template>
<mdb-row id="FeaturesSection" class="py-5 d-flex">
  <mdb-col col="12" lg="8">
    <h2 class="large-title pt-md-5 py-5">{{title}}</h2>
  </mdb-col>
  <div class="w-100"></div>
  <mdb-col md="12" lg="10" class="features-list pb-5">
    <div class="list-item">
      <h3 class="h2-responsive"><a><mdb-icon icon="exchange-alt" class="mr-4" />{{cardDescription1}}</a></h3>
    </div>
    <div class="list-item">
      <h3 class="h2-responsive"><a><mdb-icon icon="boxes" class="mr-4" />{{cardDescription2}}</a></h3>
    </div>
    <div class="list-item">
      <h3 class="h2-responsive"><a><mdb-icon icon="bullseye" class="mr-4" />{{cardDescription3}}</a></h3>
    </div>
    <div class="list-item">
      <h3 class="h2-responsive"><a><mdb-icon icon="campground" class="mr-4" />{{cardDescription4}}</a></h3>
    </div>
  </mdb-col>
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

.features-list .list-item {
  padding: 1.5rem 0;
  border-top: 3px solid black;
}

.features-list .list-item:last-child {
  border-bottom: 3px solid black;
}

 .features-list .list-item h3 {
  margin-bottom: 0;
}

</style>
