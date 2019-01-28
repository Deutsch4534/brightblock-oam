<template>
<mdb-row id="AudienceSection" class="py-5 mx-auto">
  <div class="col-md-8 offset-md-2">
    <h1 class="mb-0 pt-md-5 pt-5">{{title}}</h1>
    <hr class="hr-light my-4">
  </div>
  <div class="col-md-3 offset-md-2">
    <!-- Card -->
    <div class="card">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="card-title"><a>{{cardTitle1}}</a></h4>
        <p class="card-text">{{cardDescription1}}</p>
      </div>
      <div class="card-body text-right">
        <mdb-icon far icon="user" />
      </div>
    </div>
    <!-- Card -->
  </div>
  <div class="col-md-3">
    <!-- Card -->
    <div class="card">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="card-title"><a>{{cardTitle2}}</a></h4>
        <p class="card-text">{{cardDescription2}}</p>
      </div>
      <div class="card-body text-right">
        <mdb-icon far icon="users" />
      </div>
    </div>
    <!-- Card -->
  </div>

  <div class="col-md-3">
    <!-- Card -->
    <div class="card">
      <!-- Card content -->
      <div class="card-body">
        <h4 class="card-title"><a>{{cardTitle3}}</a></h4>
        <p class="card-text">{{cardDescription3}}</p>
      </div>
      <div class="card-body text-right">
        <mdb-icon icon="university" />
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
      title: "WHO IS IT FOR?",
      cardTitle1: "ARTISTS",
      cardDescription1: "Upload your artworks to your own storage register provenance and list them on our the open marketplace. All transactions are done in bitcoin and directly atributed to your wallet. Once the artwork is sold it moves its physical location from artist storage to collector storage.",
      cardTitle2: "COLLECTORS",
      cardDescription2: "Collect works of art from up and coming artists. Each art purchase makes you the owner of the artwork with registered provenance on the blockchain, as well you are the sole owner of digital artwork as well. If you destroy the file, the original is lost forever.",
      cardTitle3: "GALLERIES",
      cardDescription3: "Be part of our art movement by providing grants or starting competitions on our platform, use transit8 tools to engage with the community and create something exceptional together.",
    };
  }
};
</script>

<style scoped>
.card {
  border: 2pt solid black;
}
</style>
