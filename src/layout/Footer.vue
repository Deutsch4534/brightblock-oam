<template>

<!-- Footer -->
<footer class="page-footer font-small black fixed-bottom" >
  <mdb-container fluid>
    <mdb-row class="d-flex flex-row align-items-center" >
      <mdb-col class="col-md-5 col-xs-4 footer-copyright text-left">
        <router-link to="/" class="navbar-brand"><img :src="logo" height="40px" alt="t8 logo"></router-link>
      </mdb-col>
      <mdb-col class="col-md-5 col-xs-5 footer-copyright funny text-right d-none d-md-block">
        Independent Art Market
      </mdb-col>
      <mdb-col class="col-md-2 col-xs-3 footer-copyright text-right donate-link d-none d-md-block" @click="scrollToElement('DonateSection', $event)">
        <mdb-icon class="mr-4" icon="heart" />
        <strong><router-link to="/" name="sectionUrl('DonateSection')">Donate</router-link></strong>
      </mdb-col>
    </mdb-row>
  </mdb-container>
</footer>
<!-- Footer -->
</template>
<script>
import { mdbContainer, mdbRow, mdbCol, mdbIcon } from 'mdbvue';

export default {
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbIcon
  },
  props: {
    backgroundColor: String,
    type: String
  },
  data() {
    return {
      year: new Date().getFullYear(),
      logo: require("@/assets/img/logo/T_8_Symbolmark_white.png")
    };
  },
  methods: {
    scrollToElement(element, event) {
      let element_id = document.getElementById(element);
      if (element_id) {
        element_id.scrollIntoView({ block: "end", behavior: "smooth" });
        // setTimeout(() => {
        //    window.scrollBy(0, -40);
        //  }, 700);
      }
    }
  }
};
</script>
<style scoped>
  .page-footer { min-height: 56px; }
  .footer-copyright, .footer-copyright a {
    color: #ECEFF1;  font-weight: 300;
    letter-spacing: 0.5px;
  }
  .page-footer .donate-link a { font-size: 20px;  color: #ECEFF1; }
  .funny {
  font-family: 'Noto Serif Disp ExtCond';
  font-size: 18px;
  letter-spacing: 0.5px;
}
</style>
