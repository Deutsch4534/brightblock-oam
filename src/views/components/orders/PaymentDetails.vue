<template>
<div class="container">
  <mdb-card-body  v-if="invoiceClaim.buyerTransaction">
    <mdb-card-text>
      <div class="row">Payment has been received with thanks - you can check the status of the order in the confirmation tab.</div>
    </mdb-card-text>
  </mdb-card-body>
  <mdb-card-body v-else>
    <mdb-card-title>
      <mdb-popover trigger="click" :options="{placement: 'top'}">
        <div class="popover">
          <div class="popover-header">
            Ra.Pay
          </div>
          <div class="popover-body">
          Payments are held in an escrow until confirmed on the bitcoin network - this usually takes about an hour.
          If shipping is involved we will hold your payment and pay to the seller once you confirmed
          receipt of the goods.
          </div>
        </div>
        <a @click.prevent="" slot="reference">
          Payment -
          <a @click.prevent="showOrderDetails = !showOrderDetails">click here for details</a>
        </a>
      </mdb-popover>
    </mdb-card-title>
    <mdb-card-text>
      Please pay using your bitcoin wallet. <!-- and then <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" @click="sentPayment">click here.</mdb-btn> -->
    </mdb-card-text>
    <mdb-card-text>
    <div class="w-100"></div>
      <div class="row text-center">
        <div class="col-md-12">
          <div class="row text-center">
            <div class="col-md-12">
              <canvas id="qrcode1" max-width="150px"></canvas>
            </div>
            <div class="col-md-12"><a :href="bitcoinUri">open bitcoin wallet</a></div>
          </div>
        </div>
      </div>
    </mdb-card-text>
    <mdb-card-text>
      <a @click.prevent="showOrderDetails = !showOrderDetails"><small>Order details</small></a>
    </mdb-card-text>
  </mdb-card-body>
  <order-details :invoiceClaim="invoiceClaim" v-if="showOrderDetails"/>
</div>
</template>

<script>
import xhrService from "@/services/xhrService";
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import QRCode from "qrcode";
import moneyUtils from "@/services/moneyUtils";
import OrderDetails from "./OrderDetails";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PaymentDetails",
  components: {
    OrderDetails,
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    bitcoinUri: null,
    invoiceClaim: null
  },
  data() {
    return {
      showOrderDetails: false,
    };
  },
  mounted() {
    if (this.bitcoinUri) {
      this.addQrCode("qrcode1", this.bitcoinUri);
    }
  },
  computed: {
  },
  methods: {
    addQrCode(qrc, bitcoinUri) {
      let $qrCode = document.getElementById(qrc);
      QRCode.toCanvas(
        $qrCode, bitcoinUri, { errorCorrectionLevel: "H" },
        function(error) {
          if (error) console.error(error);
          console.log("success!");
        }
      );
    },
    sentPayment() {
      this.$emit("paymentSent");
    }
  }
};
</script>
