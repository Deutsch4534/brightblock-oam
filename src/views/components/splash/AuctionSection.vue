<template>
  <mdb-row id="AuctionSection" class="py-5 col-lg-10 mx-auto d-flex" border-top border-dark>
    <mdb-col md="10" lg="8">
      <h2 class="large-title pt-md-5 pt-5">{{title}}</h2>
      <hr class="hr-light my-4">
      <p>{{description}}</p>
    </mdb-col>

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
        title: "First Auction on Radicle",
        description: "Brightblock and Radicle are starting things off with auction fo 50 digital copyes of Black Swan, from author",
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
