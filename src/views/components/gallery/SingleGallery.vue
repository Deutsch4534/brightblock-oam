<template>
  <mdb-col sm="6" md="4" lg="3" class="mb-3 d-flex">
    <confirmation-modal v-if="showModal" :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
    <mdb-card class="bg-transparent mb-5 w-100">
      <mdb-view hover>
        <mdb-card-image :src="logo" alt="Gallery cover image" class="img-square"></mdb-card-image>
        <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
      </mdb-view>
      <mdb-card-body class="px-0 pb-2 mb-0">
        <mdb-card-title class="subtitle">
          <mdb-dropdown>
            <mdb-dropdown-toggle color="white" slot="toggle"><mdb-icon icon="ellipsis-v" /></mdb-dropdown-toggle>
            <mdb-dropdown-menu color="primary">
              <mdb-dropdown-item><a @click.prevent="deleteMe">Delete</a></mdb-dropdown-item>
              <mdb-dropdown-item><router-link :to="editUrl">Edit</router-link></mdb-dropdown-item>
            </mdb-dropdown-menu>
          </mdb-dropdown>
           {{gallery.title}}</mdb-card-title>
        <mdb-card-text>{{gallery.description}}</mdb-card-text>
      </mdb-card-body>
      <div class="card-buttons d-flex align-items-end justify-content-between flex-wrap">
        <router-link :to="newAuctionUrl" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mx-0">Upload Auction</mdb-btn></router-link>
      </div>


    </mdb-card>
  </mdb-col>
</template>

<script>
import { mdbCard, mdbIcon, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn, mdbCol, mdbView, mdbMask } from 'mdbvue';
import { mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle } from 'mdbvue';
import ConfirmationModal from "@/views/components/utils/ConfirmationModal";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleGallery",
  components: {
    mdbCard,
    ConfirmationModal,
    mdbIcon,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbCol,
    mdbView,
    mdbMask,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle
  },
  props: {
    gallery: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showModal: false,
      modalTitle: "Delete..",
      modalContent: "<p>Can't delete galleries just - please stay tuned for this.</p>",
    };
  },
  methods: {
    closeModal: function() {
      this.showModal = false;
    },
    deleteMe() {
       this.showModal = true;
    }
  },
  computed: {
    logo() {
      if (this.gallery.coverImage && this.gallery.coverImage.dataUrl) {
        return this.gallery.coverImage.dataUrl;
      }
      return require("@/assets/img/missing/artwork-missing.jpg");
    },
    editUrl() {
      return `/gallery/update/${this.gallery.galleryId}`;
    },
    newAuctionUrl() {
      return `/my-auctions/upload?galleryId=${this.gallery.galleryId}`;
    }
  }
};
</script>
<style scoped>
  .subtitle,
  .card-body p {
    color: #000!important;
  }
  .dropdown-toggle {
    padding: 5px 10px;
    margin: 0px;
  }
  .dropdown-toggle::after {
      display: none;
  }
  </style>
