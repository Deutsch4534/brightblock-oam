<template>
<mdb-row id="FeaturesSection" class="py-5 col-md-10 mx-auto d-flex">
  <div class="col-md-12">
    <mdb-row>
      <mdb-col col="10">
        <h2 class="h1 pt-md-5 pt-5">{{title}}</h2>
        <hr class="hr-light my-4">
      </mdb-col>
    </mdb-row>
  </div>
  <div class="d-flex row">
    <div class="col-12 col-md-3 d-flex">
      <!-- Card -->
      <div class="card">
        <!-- Card content -->
        <div class="card-body text-center">
          <h4 class="card-title">
            <a>
            <mdb-icon icon="arrows-alt"/>
            <!--<mdb-icon icon="arrows-alt-h"/>-->
          </a>
          </h4>
          <p class="card-text">{{cardDescription1}}</p>
        </div>
      </div>
      <!-- Card -->
    </div>
    <div class="col-12 col-md-3 d-flex">
      <!-- Card -->
      <div class="card">
        <!-- Card content -->
        <div class="card-body text-center">
          <h4 class="card-title">
            <a>
              <mdb-icon icon="angle-double-right" />
              <!--<mdb-icon icon="boxes" />-->
            </a>
          </h4>
          <p class="card-text">{{cardDescription2}}</p>
        </div>
      </div>
      <!-- Card -->
    </div>
    <div class="col-12 col-md-3 d-flex">
      <!-- Card -->
      <div class="card">
        <!-- Card content -->
        <div class="card-body text-center">
          <h4 class="card-title">
            <a>
              <mdb-icon icon="bullseye" />
            </a>
          </h4>
          <p class="card-text">{{cardDescription3}}</p>
        </div>
      </div>
      <!-- Card -->
    </div>
    <div class="col-12 col-md-3 d-flex">
      <!-- Card -->
      <div class="card">
        <!-- Card content -->
        <div class="card-body text-center">
          <h4 class="card-title">
            <a>
              <mdb-icon icon="chevron-right" />
              <!--<mdb-icon icon="campground" />-->
            </a>
          </h4>
          <p class="card-text">{{cardDescription4}}</p>
        </div>
      </div>
      <!-- Card -->
    </div>
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
  width: 100%;
  border: 2pt solid black;
  margin-bottom: 2rem;
}
</style>
