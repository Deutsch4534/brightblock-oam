<template>
  <!-- TODO: connect template with Prismic cms -->
  <mdb-container fluid class="bg-light flex-1">
    <mdb-container class="py-5">
      <mdb-row>
        <mdb-col col="12">
          <h1 class="h1-responsive py-4">About</h1>
        </mdb-col>
        <mdb-col sm="10" md="8">
          <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
          <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>
          <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>
        </mdb-col>
      </mdb-row>
  </mdb-container>
  </mdb-container>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
  export default {
    components: {
      mdbContainer,
      mdbRow,
      mdbCol
    },
    name: "about"
  }
</script>
