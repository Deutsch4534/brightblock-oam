<template>
  <mdb-row id="AuctionSection" class="py-5 col-md-10 mx-auto d-flex" border-top border-dark>
    <div class="col-8">
      <h2 class="h1 pt-md-5 pt-5">{{title}}</h2>
      <hr class="hr-light my-4">
      <p>{{description}}</p>
    </div>
    <div class="col-md-6">
      <figure class="figure">
        <img src="../../../assets/img/bitcoin_swan.jpg" class="figure-img img-fluid z-depth-1"
             alt="...">
        <figcaption class="figure-caption">A caption for the above image.</figcaption>
      </figure>
    </div>
  </mdb-row>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon, mdbInput, mdbTextarea, mdbCard, mdbCardBody } from 'mdbvue';

  export default {
    name: 'AuctionSection',
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
        title: "First Auction on Transit8",
        description: "Brightblock and Transit8 are starting things off with auction fo 50 digital copyes of Black Swan, from author",
      };
    }
  };
</script>

<style scoped>
  .card {
    border: 2pt solid black;
  }
  h4.card-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  .card-body i {
    font-size: 1.5rem;
  }
  .card .card-body .card-text {
    color: black;
  }
  .figure-img {
    box-shadow: none!important;
  }
  .figure-caption {
    color: black;
    font-size: 0.9rem;
  }
</style>
