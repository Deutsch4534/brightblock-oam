<template>
    <mdb-card class="bg-transparent mb-5 w-100">
      <router-link class="grid-item" :to="url">
        <mdb-card-image :src="artist.avatarUrl" :alt="artist.name" class="img-square"></mdb-card-image>
      </router-link>
      <mdb-card-body class="px-0">
        <mdb-card-title class="artist-name h2-responsive">{{artist.name}}</mdb-card-title>
        <mdb-card-text>{{artist.description}}</mdb-card-text>
      </mdb-card-body>
    </mdb-card>
</template>

<script>
import { mdbTestimonial, mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardBody, mdbCardUp, mdbAvatar, mdbIcon, mdbCardImage, mdbCardTitle, mdbCardText } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleArtist',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardBody,
    mdbCardUp,
    mdbAvatar,
    mdbIcon,
    mdbCardImage,
    mdbCardTitle,
    mdbCardText,
    mdbTestimonial
  },
  props: {
    artist: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    url () {
      return '/artists/' + this.artist.username
    }
  }
}
</script>
<style scoped>
  .subtitle,
  .card-body p {
    color: #000!important;
  }
</style>
