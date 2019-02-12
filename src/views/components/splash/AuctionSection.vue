<template>
  <mdb-row id="AuctionSection" class="py-5 d-flex" border-top border-dark>
    <mdb-col col="12" lg="8">
      <h2 class="large-title pt-md-5 pt-5">{{title}}</h2>
      <div class="w-100"></div>
    </mdb-col>
    <mdb-col col="12" class="auctions-list py-5">
      <div class="row list-item">
        <mdb-col md="2">
          <img src="../../../assets/img/bitcoin_swan.jpg" class="img-square"
               alt="...">
        </mdb-col>
        <mdb-col md="6">
          <h3 class="h4-responsive text-uppercase my-2"><a>Title</a></h3>
          <p>{{description}}</p>
          <p class="font-weight-bold">Time: 2D 4H 30M 10S</p>
        </mdb-col>
        <mdb-col md="4" lg="2" offsetLg="2" class="d-flex align-items-center justify-content-end">
          <!-- TODO: add router link to auction page -->
          <a class="btn btn-rounded btn-lg btn-dark mx-0">Register</a>
        </mdb-col>
      </div>
    </mdb-col>
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

  .auctions-list .list-item {
    padding: 0.5rem 0;
    border-top: 3px solid black;
  }

  .auctions-list .list-item:last-child {
    border-bottom: 3px solid black;
  }

  .auctions-list .list-item h3 {
    margin-bottom: 0;
  }

</style>
