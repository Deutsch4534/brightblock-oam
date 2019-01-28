<template>

<!-- Footer -->
<footer class="page-footer font-small black fixed-bottom">
  <mdb-container fluid class="stylish-color-dark">
    <div class="row">
      <div class="col-md-6 col-xs-2 footer-copyright text-left py-1">
        <router-link to="/" class="navbar-brand"><img :src="logo" height="40px" alt="t8 logo"></router-link>
      </div>
      <div class="col-md-4 d-none d-md-block footer-copyright funny text-right pt-3">
        Independent Art Market
      </div>
      <div class="col-md-1 d-none d-md-block footer-copyright text-right pt-3">
        <mdb-icon icon="heart" />
      </div>
      <div class="col-xs-1 d-none d-md-block footer-copyright text-left pt-3" @click="scrollToElement('DonateSection', $event)">
        <strong><router-link to="/" name="sectionUrl('DonateSection')" class="nav-link navbar-link" >Donate</router-link></strong>
      </div>
    </div>
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
.funny {
  font-family: "Noto Serif Display", Noto Serif Display;
  font-size: 14pt;
}
</style>
