<template>
  <mdb-container class="bg-white mt-5 p-3">
    <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
    <mdb-row>
      <mdb-col col="8">
        <h1>
          <router-link :to="myArtworksUrl" class="inline-block">
            <mdb-icon far icon="arrow-alt-circle-left" />
          </router-link>
          {{artwork.title}}
        </h1>
      </mdb-col>
      <mdb-col col="4" class="text-right"><small class="teal-text">{{bitcoinTx}}</small></mdb-col>
    </mdb-row>
    <mdb-row>
      <mdb-col col="4">
        <mdb-view hover>
          <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title">
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
      </mdb-col>
      <mdb-col col="8">
        <mdb-card-text>
          <p>{{artwork.description}}</p>
          <selling-options :artwork="artwork" v-if="sellingStatus === 'unsold'"/>
          <p class="artwork-caption" v-if="debugMode && artwork">{{artwork.bcitem}}</p>
          <p>{{artistProfile.name}}, 11/08/2018</p>
        </mdb-card-text>
        <div class="card-buttons d-flex align-items-end justify-content-start flex-nowrap">
          <router-link :to="registerUrl" class="inline-block" v-if="canRegister">
            <mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">Register</mdb-btn>
          </router-link>
          <router-link :to="registerUrl" class="inline-block" v-else>
            <mdb-btn rounded color="white" size="sm" class="mx-0 waves-light" v-if="artwork.bitcoinTx">CoA</mdb-btn>
          </router-link>
          <router-link :to="registerForSaleUrl" class="inline-block">
            <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="canSell">Sell</mdb-btn>
          </router-link>
          <a @click="deleteArtwork(artwork.id)" class="inline-block">
            <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="debugMode">Delete</mdb-btn>
          </a>
          <router-link :to="editUrl" class="inline-block">
            <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" v-if="editable">Edit</mdb-btn>
          </router-link>
          <router-link :to="artworkUrl" class="inline-block">
            <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Open</mdb-btn>
          </router-link>
        </div>
      </mdb-col>
    </mdb-row>
</mdb-container>
</template>

<script>
import CreateCoa from "./CreateCoa";
import RegisterBitcoin from "./RegisterBitcoin";
import utils from "@/services/utils";
import notify from "@/services/notify";
import ethereumService from "@/services/ethereumService";
import bitcoinService from "@/services/bitcoinService";
// import OpenTimestamps from "javascript-opentimestamps";
import { mdbIcon, mdbPopover, mdbCol, mdbView, mdbMask, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import ConfirmationModal from "../utils/ConfirmationModal";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkManage",
  components: {
    CreateCoa,
    ConfirmationModal,
    RegisterBitcoin,
    mdbPopover, mdbIcon,
    mdbContainer,
    mdbCol,
    mdbMask,
    mdbView,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    sellingStatus: "sold",
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
  data() {
    return {
      showModal: false,
      modalTitle: "Registering Ownership",
      modalContent: "<p>Transaction sent - confirmation takes ~ 6 blocks which is about an hour..</p>" +
            "<p>Once confirmed you'll be able to generate Certificate of Authenticity.</p>",
    };
  },
  mounted() {},
  methods: {
    deleteArtwork(id) {
      this.$store.dispatch("myArtworksStore/deleteMyArtwork", id);
    },
    closeModal: function() {
      this.showModal = false;
    }
  },
  computed: {
    editable() {
      return this.$store.getters["myArtworksStore/editable"](this.artwork.id);
    },
    bitcoinTx() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      if (myProfile.publicKeyData) {
        return myProfile.publicKeyData.bitcoinAddress;
      }
    },
    created() {
      if (this.artwork.created) {
        return moment(this.artwork.created).format("YYYY-MM-DD");
      }
      return moment(this.artwork.id).format("DD/MMM/YYYY");
    },
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    canSell() {
      return this.$store.getters["myArtworksStore/canSell"](this.artwork.id);
    },
    canRegister() {
      let canRegister = this.$store.getters["myArtworksStore/canRegister"](
        this.artwork.id
      );
      return canRegister && !this.sold;
    },
    artistProfile() {
      let profile = this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.artist
      );
      return profile ? profile : {};
    },
    ownerProfile() {
      return this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.owner
      );
    },
    editUrl() {
      return `/my-artwork/update/${this.artwork.id}`;
    },
    artworkUrl() {
      return `/artworks/${this.artwork.id}`;
    },
    myArtworksUrl() {
      return `/my-artworks`;
    },
    registerUrl() {
      return `/my-artwork/register/${this.artwork.id}`;
    },
    registerForSaleUrl() {
      let a = this.$store.getters["myArtworksStore/myArtwork"](this.artwork.id);
      let id = this.artwork.id;
      if (this.artwork.saleData || !this.artwork.saleData.soid) {
        let amount = 0;
        let currency = "EUR";
        return `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
      } else if (this.artwork.saleData.soid <= 1) {
        let amount = a.saleData ? a.saleData.amount : 0;
        let currency = a.saleData ? a.saleData.fiatCurrency : "EUR";
        return `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
      } else if (this.artwork.saleData.soid === 2) {
        let r = a.saleData ? a.saleData.reserve : 0;
        let i = a.saleData ? a.saleData.increment : 0;
        let c = a.saleData ? a.saleData.fiatCurrency : "EUR";
        let aid = -1;
        if (a.saleData && a.saleData.auctionId) {
          aid = a.saleData.auctionId;
        }
        return `/my-artwork/register-for-auction/${id}/${aid}/${r}/${i}/${c}`;
      }
    }
  }
};
</script>
