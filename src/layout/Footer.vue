<template>
<!-- Footer -->
  <footer class="page-footer black fixed-bottom py-3">
      <mdb-row class="d-flex flex-row align-items-center">
        <mdb-col col="6">
          <span class="serif"><router-link to="/index">Independent Art Market</router-link></span>
        </mdb-col>
        <mdb-col col="6" class="footer-right text-right">
          <div class="d-inline-block">
            <!--
            <span>
              <router-link to="/index">HOW IT WORKS</router-link>
            </span>
            -->
            <span class="mx-3">
              <router-link to="/about/faq">FAQ</router-link>
            </span>
          </div>
        </mdb-col>
      </mdb-row>
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
    font-weight: 400;
    letter-spacing: 0.5px;
    margin-top: 50px;
  }

  @media (max-width: 576px) {
    .page-footer { font-size: 0.8em; margin-top: 20px; padding: 0px;}
  }
</style>
