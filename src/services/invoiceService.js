import SockJS from "sockjs-client";
import Stomp from "@stomp/stompjs";
import store from "@/storage/store";
import utils from "@/services/utils";
import bitcoinService from "@/services/bitcoinService";
import artworkSearchService from "@/services/artworkSearchService";
import moneyUtils from "@/services/moneyUtils";
import moment from "moment";
import _ from "lodash";
import {
  getFile, putFile
} from "blockstack";

const invoiceService = {
  initInvoiceData: function(success, failure) {
    const invoicesRootFileName = store.state.constants.invoicesRootFileName;
    getFile(invoicesRootFileName, { decrypt: true }).then(function(file) {
      if (!file) {
        var now = moment({}).valueOf();
        let newRootFile = {
          created: now,
          records: []
        };
        putFile(invoicesRootFileName, JSON.stringify(newRootFile), {encrypt: true}).then(function(file) {
          invoiceService.subscribeInvoiceNews();
          if (success) success(newRootFile);
        });
      } else {
        let invoicesRootFile = JSON.parse(file);
        invoiceService.subscribeInvoiceNews();
        if (success) success(invoicesRootFile);
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
  watchForPayment: function(invoice, success, failure) {
    if (invoiceService.intval) {
      clearInterval(invoiceService.intval);
    }
    // check this os the buyer initiating the watch..
    let myProfile = store.getters["myAccountStore/getMyProfile"];
    if (myProfile.username !== invoice.buyer.blockstackId) {
      return;
    }
    invoiceService.intval = setInterval(function() {
      bitcoinService.lookupTransaction({timestamp: invoice.timestamp, amount: invoice.invoiceAmounts.totalBitcoin}, function(transaction) {
        if (!transaction) {
          return;
        }
        if (invoice.buyerTransaction) {
          if (invoice.confirmed) {
            return;
          }
          if (transaction.confirmations > 5) {
            invoice.confirmed = true;
          }
        }
        invoice.buyerTransaction = transaction;
        invoiceService.saveInvoiceClaim(invoice);
        // lookup artwok in buyers gaia - indicates the artwork has already been transferred..
        artworkSearchService.userArtwork(invoice.artworkId, invoice.buyer.blockstackId,
          function(artwork) {
            if (!artwork) { // NOT NOT NOT
              if (!artwork.saleHistories) {
                artwork.saleHistories = [];
              }
              let sh = _.find(artwork.saleHistories, function(o) {
                return o.buyersTxid === transaction.txid;
              });
              if (!sh) {
                artwork.saleHistories.push({
                  seller: artwork.owner,
                  buyer: invoice.buyer.blockstackId,
                  buyersTxid: transaction.txid,
                  buyersInvoiceId: invoice.invoiceId,
                  confirmations: transaction.confirmations
                });
              }
              artwork.buyer = invoice.buyer.blockstackId;
              artwork.status = store.state.constants.statuses.artwork.PURCHASE_BEGUN;
              //searchIndexService.addRecord("artwork", artwork);
              store.dispatch('myAccountStore/addRelationship', invoice.seller.blockstackId);
              store.dispatch('myArtworksStore/transferArtwork', artwork).then(artwork => {
                console.log("transferred artwork: " + artwork.title + " from " + invoice.seller.blockstackId + " to " + invoice.buyer.blockstackId);
                // artwork transferred - don't pay the seller untils goods confirmed...
                // bitcoinService.payUpstreamTransaction({invoice: invoice}, function(result) {
                //  console.log(result);
                //  sh.provenanceTxid = result;
                // });
              });
            }
          },
          function(error) {
            console.log("Error while watching for payment: ", error);
          }
        );
      });
    }, 5000);
  },
  createInvoiceClaim: function(artwork, invoiceRates, invoiceAmounts) {
    let buyer = store.getters["myAccountStore/getMyProfile"];
    let seller = store.getters["userProfilesStore/getProfile"](artwork.owner);
    let gallerist = store.getters["userProfilesStore/getProfile"](artwork.gallerist);
    let artist = store.getters["userProfilesStore/getProfile"](artwork.artist);
    var now = moment({}).valueOf();
    return {
      invoiceId: now,
      timestamp: now,
      invoiceAmounts: invoiceAmounts,
      invoiceRates: invoiceRates,
      label: artwork.id + " :: " + artwork.title,
      message: "Invoice for artwork purchased on article.art",
      artworkHash: utils.buildBitcoinHash(artwork),
      title: artwork.title,
      itemType: artwork.itemType,
      artworkId: artwork.id,
      state: "intention",
      gallerist: (gallerist) ? {
        blockstackId: gallerist.username,
        publicKey: gallerist.publicKeyData.bitcoinAddress,
      } : {},
      artist: (artist) ? {
        blockstackId: artist.username,
        publicKey: artist.publicKeyData.bitcoinAddress,
      } : {},
      seller: {
        blockstackId: seller.username,
        publicKey: seller.publicKeyData.bitcoinAddress,
      },
      buyer: {
        blockstackId: buyer.username,
        publicKey: buyer.publicKeyData.bitcoinAddress,
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
        fiatCurrency: saleData.fiatCurrency,
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
  populateInvoiceRows: function(invoiceClaim) {
    let gallerist = (invoiceClaim.gallerist) ? invoiceClaim.gallerist.blockstackId : null;
    let owner = invoiceClaim.seller.blockstackId;
    let artist = (invoiceClaim.artist) ? invoiceClaim.artist.blockstackId : owner;
    let sellerIsArtist = artist === owner;

    let invoiceRates = invoiceClaim.invoiceRates;
    let invoiceAmounts = invoiceClaim.invoiceAmounts;

    let count = 1;
    let invoiceRows = [];
    invoiceRows.push({
      counter: count++,
      party: (sellerIsArtist) ? "Artist" : "Seller",
      notes: owner,
      rate: "",
      fiatAmount: invoiceAmounts.fiatAmount,
      bitcoinAmount: invoiceAmounts.bitcoinAmount
    });
    if (!sellerIsArtist) {
      invoiceRows.push({
        counter: count++,
        party: "Artist",
        notes: artist,
        rate: invoiceRates.artistResidualFee + " %",
        fiatAmount: invoiceAmounts.fiatArtistAmount,
        bitcoinAmount: invoiceAmounts.bitcoinArtistAmount
      });
    }
    invoiceRows.push({
      counter: count++,
      party: "Gallery",
      notes: gallerist,
      rate: (gallerist) ? invoiceRates.galleryResidualFee + " %" : "n/a",
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
