<template>

<!-- Footer -->
<mdb-footer color="blue-grey" class="font-small pt-4">
  <mdb-container class="text-left">
    <mdb-row>
      <mdb-col sm="6">
        <h5 class="title">BrightBlock</h5>
        <p>Brightons First Bitcoin Hub</p>
      </mdb-col>
      <mdb-col sm="6">
        <h5 class="title"></h5>
        <ul>
          <li class="list-unstyled"><a href="#!"><mdb-icon icon="twitter" /> Twitter</a></li>
          <li class="list-unstyled"><a href="#!"><mdb-icon icon="facebook" /> Facebook</a></li>
        </ul>
      </mdb-col>
    </mdb-row>
  </mdb-container>
  <div class="footer-copyright text-right py-3 mx-auto">
    <mdb-container fluid>
      &copy; {{ year }}, with <mdb-icon icon="heart" /></i>&nbsp; <a href="https://www.brightblock.org">brightblock.org</a>
    </mdb-container>
  </div>
</mdb-footer>
<!-- Footer -->
</template>
<script>
import { mdbFooter, mdbContainer, mdbRow, mdbCol, mdbIcon } from 'mdbvue';

export default {
  components: {
    mdbFooter,
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
      year: new Date().getFullYear()
    };
  },
  methods: {}
};
</script>
