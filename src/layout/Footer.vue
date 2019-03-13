<template>
<!-- Footer -->
  <footer class="page-footer font-small black fixed-bottom py-3">
    <mdb-container fluid>
      <mdb-row class="d-flex flex-row align-items-center">
        <mdb-col col="4">
          <span class="serif">Independent Art Market</span>
          <!--
          <span class="d-inline-block">
            <router-link to="/" class="navbar-brand d-inline-block" ><img :src="logo" height="46px" alt="radicle logo"></router-link>
          </span>
          -->
        </mdb-col>
        <mdb-col col="8" class="footer-right text-right">
          <div class="d-inline-block">
            <mdb-icon class="mx-3" icon="heart"/>
            <span class="font-weight-normal">
              <router-link to="/index" name="sectionUrl('DonateSection')">HOW IT WORKS</router-link>
            </span>
          </div>
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
      logo: require("@/assets/img/logo/logo_white.png")
    };
  },
  methods: {
    scrollToElement(element, event) {
      let element_id = document.getElementById(element);
      if (element_id) {
        if (element_id.id === 'introSection'){
          element_id.scrollIntoView({ block: "end", behavior: "smooth" });
        } else {
          element_id.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }
    }
  }
};
</script>
<style scoped>
  .page-footer { min-height: 56px; }

  .page-footer {
    font-size: 1.2em;
    color: #ECEFF1;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  @media (max-width: 576px) {
    .page-footer { font-size: 16px;}
  }
</style>
