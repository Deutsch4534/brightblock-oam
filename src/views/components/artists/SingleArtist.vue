<template>
<mdb-col lg="4" md="4" class="mb-lg-0 mb-4 mx-auto">
<mdb-testimonial>
  <mdb-avatar class="mx-auto mb-4">
    <router-link class="grid-item" :to="url"><img :src="artist.avatarUrl" :alt="artist.name" width="200px" class="rounded-circle img-fluid"/></router-link>
  </mdb-avatar>
  <p>
    <mdb-icon icon="quote-left"></mdb-icon> {{artist.description}}
  </p>
  <h4 class="font-weight-bold">{{artist.name}}</h4>
  <h6 class="font-weight-bold my-3">{{artist.jobtitle}}</h6>
  <mdb-icon icon="star" class="blue-text"> </mdb-icon>
  <mdb-icon icon="star" class="blue-text"> </mdb-icon>
  <mdb-icon icon="star" class="blue-text"> </mdb-icon>
  <mdb-icon icon="star" class="blue-text"> </mdb-icon>
  <mdb-icon icon="star-half-alt" class="blue-text"> </mdb-icon>
</mdb-testimonial>
</mdb-col>
</template>

<script>
import { mdbTestimonial, mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardBody, mdbCardUp, mdbAvatar, mdbIcon } from 'mdbvue';

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
