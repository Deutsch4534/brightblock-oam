<template>
<mdb-row id="AudienceSection" class="py-5 col-lg-10 mx-auto d-flex" border-top border-dark>
  <mdb-col col="12">
    <h2 class="large-title pt-md-5 pt-5">{{title}}</h2>
    <hr class="hr-light my-4">
  </mdb-col>
  <mdb-col lg="4" class="d-flex">
    <!-- Card -->
    <div class="card mb-3 border-shadow">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="h3-responsive card-title"><a>{{cardTitle1}}</a></h4>
        <p class="card-text">{{cardDescription1}}</p>
      </div>
      <div class="card-body pt-0 d-flex align-items-end justify-content-end">
        <mdb-icon far icon="address-book" />
      </div>
    </div>
    <!-- Card -->
  </mdb-col>

  <mdb-col lg="4" class="d-flex">
    <!-- Card -->
    <div class="card mb-3 border-shadow">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="h3-responsive card-title"><a>{{cardTitle2}}</a></h4>
        <p class="card-text">{{cardDescription2}}</p>
      </div>
      <div class="card-body pt-0 d-flex align-items-end justify-content-end">
        <mdb-icon far icon="bookmark" />
      </div>
    </div>
    <!-- Card -->
  </mdb-col>

  <mdb-col lg="4" class="d-flex">
    <!-- Card -->
    <div class="card mb-3 border-shadow">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="h3-responsive card-title"><a>{{cardTitle3}}</a></h4>
        <p class="card-text">{{cardDescription3}}</p>
      </div>
      <div class="card-body pt-0 d-flex align-items-end justify-content-end">
        <mdb-icon icon="university" />
      </div>
    </div>
    <!-- Card -->
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
      title: "WHO IS IT FOR?",
      cardTitle1: "ARTISTS",
      cardDescription1: "Upload to your own storage, create certificates of ownership and sell artwork on our marketplace. Provenance is tracked and secured automatically on the blockchain.",
      cardTitle2: "COLLECTORS",
      cardDescription2: "Collect artworks from up and coming artists. Digital and physical art can be purchased with provenance registered on the blockchain making you the sole owner of the artwork.",
      cardTitle3: "GALLERIES",
      cardDescription3: "Be part of our art movement by providing artworks and artists. Earn residuals on secondary sales of artwork and use radicle tools to run competitions and auction events on our platform.",
    };
  }
};
</script>

<style scoped>
.card {
  border: 3pt solid black;
  box-shadow: none;
  border-radius: 0;
}

h4.card-title {
  margin-bottom: 2rem;
}
.card-body i {
  font-size: 1.8rem;
}
.card .card-body .card-text {
  color: black;
}
</style>
