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
      cardTitle1: "Artists",
      cardDescription1: "Upload your artworks to your own storage register provenance and list them on our the open marketplace. All transactions are done in bitcoin and directly atributed to your wallet. Once the artwork is sold it moves its physical location from artist storage to collector storage.",
      cardTitle2: "Collectors",
      cardDescription2: "Collect works of art from up and coming artists. Each art purchase makes you the owner of the artwork with registered provenance on the blockchain, as well you are the sole owner of digital artwork as well. If you destroy the file, the original is lost forever.",
      cardTitle3: "Institutions",
      cardDescription3: "Be part of our art movement by providing grants or starting competitions on our platform, use transit8 tools to engage with the community and create something exceptional together.",
    };
  }
};
</script>

<style scoped>



</style>
