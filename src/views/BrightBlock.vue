<template>
<div class="section section-basic">
  <mission/>
  <team/>
  <contact/>
  <donate/>
</div>
</template>

<script>
import Contact from "./components/brightblock/Contact";
import Mission from "./components/brightblock/Mission";
import Team from "./components/brightblock/Team";
import Donate from "./components/brightblock/Donate";

export default {
  components: {
    Contact,
    Mission,
    Team,
    Donate
  },
  name: "brightBlock",
  bodyClass: "index-page",
  data() {
    return {};
  },
  methods: {},
  computed: {}
};
</script>
<style lang="scss">
.section-download {
  .md-button + .md-button {
    margin-left: 5px;
  }
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
