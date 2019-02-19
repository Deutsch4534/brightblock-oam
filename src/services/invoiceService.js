import SockJS from "sockjs-client";
import Stomp from "@stomp/stompjs";
import store from "@/storage/store";
import utils from "@/services/utils";
import moneyUtils from "@/services/moneyUtils";
import moment from "moment";
import {
  getFile, putFile
} from "blockstack";

const invoiceService = {
  initInvoiceData: function() {
    store.dispatch("bitcoinStore/fetchBalance");
    store.dispatch("bitcoinStore/fetchBitcoinState");
    const invoicesRootFileName = store.state.constants.invoicesRootFileName;
    getFile(invoicesRootFileName, { decrypt: true }).then(function(file) {
      if (!file) {
        var now = moment({}).valueOf();
        let newRootFile = {
          created: now,
          records: []
        };
        putFile(invoicesRootFileName, JSON.stringify(newRootFile), {encrypt: true}).then(function(file) {
          store.commit("invoiceStore/invoicesRootFile", newRootFile);
          invoiceService.subscribeInvoiceNews();
        });
      } else {
        let invoicesRootFile = JSON.parse(file);
        store.commit("invoiceStore/invoicesRootFile", invoicesRootFile);
        invoiceService.subscribeInvoiceNews();
      }
    });
  },
  subscribeInvoiceNews: function() {
    let socket = new SockJS(store.state.constants.btcGatewayUrl + "/invoices");
    let stompClient = Stomp.over(socket);
    stompClient.debug = null;
    let connectSuccess = function() {
      stompClient.subscribe("/topic/invoices", function(response) {
        let transactions = JSON.parse(response.body);
        store.commit("invoiceStore/transactions", transactions);
      });
    };
    let connectError = function(error) {
      if (error.headers) {
        console.log("[SysadmOnly] WebSocket Error: " + error);
      } else {
        console.log("[SysadmOnly] WebSocket Error: " + error);
      }
    };
    stompClient.connect(
      {},
      connectSuccess,
      connectError
    );
  },
  saveInvoiceClaim: function(invoice, success, failure) {
    store.commit("invoiceStore/addInvoice", invoice);
    let invoices = store.getters["invoiceStore/getInvoices"];
    const invoicesRootFileName = store.state.constants.invoicesRootFileName;
    putFile(invoicesRootFileName, JSON.stringify(invoices), { encrypt: true }).then(function() {
      if (success) {
        success(true);
      }
    })
      .catch(function() {
        if (failure) failure({
          ERR_CODE: 2,
          message: "Error saving invoice file: " + invoice.id
        });
      });
  },
  createInvoiceClaim: function(artwork, invoiceRates, invoiceAmounts) {
    let buyer = store.getters["myAccountStore/getMyProfile"];
    let seller = store.getters["userProfilesStore/getProfile"](artwork.owner);
    return {
      invoiceAmounts: invoiceAmounts,
      invoiceRates: invoiceRates,
      label: artwork.id + " :: " + artwork.title,
      message: "Invoice for artwork purchased on article.art",
      timestamp: moment({}),
      artworkHash: utils.buildBitcoinHash(artwork),
      title: artwork.title,
      artworkId: artwork.id,
      state: "intention",
      seller: {
        blockstackId: seller.username,
        publicKey: seller.auxiliaryProfile.bitcoinAddress,
      },
      buyer: {
        blockstackId: buyer.username,
        publicKey: buyer.auxiliaryProfile.bitcoinAddress,
      }
    };
  },
  getInvoiceAmounts: function(invoiceRates, saleData, includeGallery, includeArtist) {
    try {
      let bitcoinAmount = moneyUtils.valueInBitcoin(saleData.fiatCurrency, saleData.amount);

      let fiatPlatformAmount = moneyUtils.rateInFiat(saleData.amount, invoiceRates.platformFee);
      let bitcoinPlatformAmount = moneyUtils.rateInBitcoin(bitcoinAmount, invoiceRates.platformFee);
      let fiatArtistAmount = (includeArtist) ? moneyUtils.rateInFiat(saleData.amount, invoiceRates.artistResidualFee) : 0;
      let bitcoinArtistAmount = (includeArtist) ? moneyUtils.rateInBitcoin(bitcoinAmount, invoiceRates.artistResidualFee) : 0;
      let fiatGalleryAmount = (includeGallery) ? moneyUtils.rateInFiat(saleData.amount, invoiceRates.galleryResidualFee) : 0;
      let bitcoinGalleryAmount = (includeGallery) ? moneyUtils.rateInBitcoin(bitcoinAmount, invoiceRates.galleryResidualFee) : 0;

      let totalFiat = moneyUtils.round(saleData.amount + fiatPlatformAmount + fiatArtistAmount + fiatGalleryAmount, 8);
      let totalBitcoin = moneyUtils.round(bitcoinAmount + bitcoinPlatformAmount + bitcoinGalleryAmount + bitcoinArtistAmount, 8);
      return {
        bitcoinAmount: bitcoinAmount,
        fiatAmount: saleData.amount,
        fiatPlatformAmount: fiatPlatformAmount,
        bitcoinPlatformAmount: bitcoinPlatformAmount,
        fiatArtistAmount: fiatArtistAmount,
        bitcoinArtistAmount: bitcoinArtistAmount,
        fiatGalleryAmount: fiatGalleryAmount,
        bitcoinGalleryAmount: bitcoinGalleryAmount,
        totalFiat: totalFiat,
        totalBitcoin: totalBitcoin,
      };
    } catch (err) {
      return 0;
    }
  },
  getBitcoinUri: function(invoiceClaim) {
    let uri = "bitcoin:" + invoiceClaim.invoiceRates.platformAddress;
    uri += "?amount=" + invoiceClaim.invoiceAmounts.totalBitcoin;
    uri += "&label=" + invoiceClaim.label;
    uri += "&message=" + invoiceClaim.message;
    return encodeURI(uri);
  },
  populateInvoiceRows: function(artwork, invoiceRates, invoiceAmounts) {
    let sellerIsArtist = artwork.artist === artwork.owner;
    let count = 1;
    let invoiceRows = [];
    invoiceRows.push({
      counter: count++,
      party: (sellerIsArtist) ? "Artist" : "Seller",
      notes: artwork.owner,
      rate: "",
      fiatAmount: invoiceAmounts.fiatAmount,
      bitcoinAmount: invoiceAmounts.bitcoinAmount
    });
    if (!sellerIsArtist) {
      invoiceRows.push({
        counter: count++,
        party: "Artist",
        notes: artwork.artist,
        rate: invoiceRates.artistResidualFee + " %",
        fiatAmount: invoiceAmounts.fiatArtistAmount,
        bitcoinAmount: invoiceAmounts.bitcoinArtistAmount
      });
    }
    invoiceRows.push({
      counter: count++,
      party: "Gallery",
      notes: artwork.gallery,
      rate: (artwork.gallery) ? invoiceRates.galleryResidualFee + " %" : "n/a",
      fiatAmount: invoiceAmounts.fiatGalleryAmount,
      bitcoinAmount: invoiceAmounts.bitcoinGalleryAmount
    });
    invoiceRows.push({
      counter: count++,
      party: "Platform",
      notes: "",
      rate: invoiceRates.platformFee + " %",
      fiatAmount: invoiceAmounts.fiatPlatformAmount,
      bitcoinAmount: invoiceAmounts.bitcoinPlatformAmount
    });
    invoiceRows.push({
      rowClass: "table-info",
      counter: "",
      party: "Total",
      notes: "",
      rate: "",
      fiatAmount: invoiceAmounts.totalFiat,
      bitcoinAmount: invoiceAmounts.totalBitcoin
    });
    return invoiceRows;
  }
};
export default invoiceService;
