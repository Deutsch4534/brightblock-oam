<template>
  <section id="AudienceSection" class="py-5">
    <mdb-row class="d-flex py-3 py-md-5">
      <mdb-col col="12">
        <h2 class="large-title mb-5">{{title}}</h2>
      </mdb-col>
      <mdb-col md="12" lg="10" class="border-list">
        <div class="list-item">
          <mdb-col col="12" class="pl-0">
            <h3 class="h2-responsive mb-3">
              <mdb-icon far icon="address-book" class="mr-4"/>
              {{cardTitle1}}
            </h3>
          </mdb-col>
          <mdb-col col="12" lg="10" xl="9" class="pl-0">
            <p class="card-text">{{cardDescription1}}</p>
          </mdb-col>
        </div>
        <div class="list-item">
          <mdb-col col="12" class="pl-0">
            <h3 class="h2-responsive mb-3">
              <mdb-icon far icon="bookmark" class="mr-4"/>
              {{cardTitle2}}
            </h3>
          </mdb-col>
          <mdb-col col="12" lg="10" xl="9" class="pl-0">
            <p class="card-text">{{cardDescription2}}</p>
          </mdb-col>
        </div>
        <div class="list-item">
          <mdb-col col="12" class="pl-0">
            <h3 class="h2-responsive mb-3">
              <mdb-icon icon="university" class="mr-4"/>
              {{cardTitle3}}
            </h3>
          </mdb-col>
          <mdb-col col="12" lg="10" xl="9" class="pl-0">
            <p class="card-text">{{cardDescription3}}</p>
          </mdb-col>
        </div>
      </mdb-col>
    </mdb-row>
  </section>
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



</style>
