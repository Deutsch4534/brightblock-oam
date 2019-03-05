<template>
<mdb-modal v-if="modal" @close="closeMe">
  <mdb-modal-header>
    <mdb-modal-title>{{title}}</mdb-modal-title>
  </mdb-modal-header>
  <mdb-modal-body v-html="content"></mdb-modal-body>
  <mdb-modal-footer>
    <mdb-btn color="secondary" @click.native="closeMe">Close</mdb-btn>
  </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ActionConfirmationModal",
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn
  },
  props: ["modal", "title", "content"],
  data() {
    return {
    };
  },
  mounted() {},
  methods: {
    closeMe: function() {
      this.$emit("closeModal");
    }
  }
};
</script>
<style>

</style>
<style scoped>
</style>
