<template>
  <mdb-card class="bg-transparent mb-4 w-100">
    <router-link class="grid-item" :to="buyNowUrl">
      <mdb-view hover>
        <mdb-card-image :src="artwork.image" :alt="artwork.title" style="height: auto;"></mdb-card-image>
        <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
      </mdb-view>
    </router-link>
    <mdb-card-body class="px-0">
      <router-link :to="buyNowUrl">
        <mdb-card-title class="h2-responsive subtitle">{{artwork.title}}</mdb-card-title>
      </router-link>
      <mdb-card-text>
        <span class="small">by: {{shortName(artwork.artist)}}</span>
        <selling-options-for-search :artwork="artwork"/>
      </mdb-card-text>
      <mdb-card-text v-if="debugMode">of: {{shortName(artwork.owner)}}</mdb-card-text>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import SellingOptionsForSearch from "./SellingOptionsForSearch";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbView, mdbMask } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleResult",
  components: {
    SellingOptionsForSearch,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbView,
    mdbMask
  },
  props: {
    artwork: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  methods: {
    shortName(bsname) {
      if (!bsname) {
        return "";
      }
      let user = this.$store.getters["userProfilesStore/getProfile"](bsname);
      if (user && user.name) {
        return user.name;
      }
      return bsname.split(".")[0];
    }
  },
  computed: {
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    buyNowUrl() {
      return `/artworks/${this.artwork.id}`;
    },
  }
};
</script>
<style scoped>
  .subtitle {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  .subtitle,
  .card-body p {
    color: white!important;
  }
</style>
