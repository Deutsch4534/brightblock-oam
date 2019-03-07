import SockJS from "sockjs-client";
import Stomp from "@stomp/stompjs";
import store from "@/storage/store";
import utils from "@/services/utils";
import bitcoinService from "@/services/bitcoinService";
import artworkSearchService from "@/services/artworkSearchService";
import myArtworksService from "@/services/myArtworksService";
import moneyUtils from "@/services/moneyUtils";
import moment from "moment";
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
    if (invoice.buyerTransaction && invoice.confirmed) {
      if (success) success(invoice);
    }
    // check this os the buyer initiating the watch..
    let myProfile = store.getters["myAccountStore/getMyProfile"];
    if (myProfile.username !== invoice.buyer.blockstackId) {
      if (failure) failure("Current user is not the buyer");
    }
    invoiceService.intval = setInterval(function() {
      bitcoinService.lookupTransaction({timestamp: invoice.timestamp, amount: invoice.invoiceAmounts.totalBitcoin}, function(transaction) {
        if (!transaction) {
          if (success) success(invoice);
          return;
        }
        invoice.state = "confirming";
        if (invoice.buyerTransaction) {
          if (transaction.confirmations > 5) {
            invoice.confirmed = true;
            invoice.state = "confirmed";
          }
        } else {
          // here indicates the first instance of the buyers transaction being detected.
          // i.e. blockchain transaction exits but its not yet been saved on invoice.
        }
        invoice.buyerTransaction = transaction;
        invoiceService.saveInvoiceClaim(invoice);
        // lookup artwork in buyers gaia - indicates the artwork has already been transferred..
        artworkSearchService.userArtwork(invoice.artworkId, invoice.buyer.blockstackId,
          function(artwork) {
            if (!artwork) {
              // artwork not in buyers storage - transfer it now...
              invoiceService.transferArtworkToBuyer(invoice, success);
            } else {
              try {
                if (success) success(invoice);
                if (invoice.state === "confirmed") {
                  clearInterval(invoiceService.intval);
                }
              } catch (err) {
                // console.log("Error");
              }
            }
          },
          function() {
            // artwork not in buyers storage - transfer it now...
            invoiceService.transferArtworkToBuyer(invoice, success);
          }
        );
      });
    }, 5000);
  },
  transferArtworkToBuyer: function(invoice, success) {
    artworkSearchService.userArtwork(invoice.artworkId, invoice.seller.blockstackId,
      function(artwork) {
        artwork.buyer = invoice.buyer.blockstackId;
        artwork.status = store.state.constants.statuses.artwork.PURCHASE_BEGUN;
        myArtworksService.addSaleHistory(artwork, invoice.invoiceId, invoice.buyerTransaction.txid, invoice.buyerTransaction.confirmations);
        store.dispatch('myAccountStore/addRelationship', invoice.seller.blockstackId);
        store.dispatch('myArtworksStore/transferArtwork', artwork).then(artwork => {
          // artwork transferred - don't pay the seller untils goods confirmed...
          console.log("transferred artwork: " + artwork.title + " from " + invoice.seller.blockstackId + " to " + invoice.buyer.blockstackId);
          if (success) success(invoice);
        });
      },
      function(error) {
        console.log("Error while watching for payment: ", error);
        // if (success) success(invoice);
      });
  },
  createInvoiceClaim: function(gallerist, seller, artist, artwork) {
    let buyer = store.getters["myAccountStore/getMyProfile"];
    var now = moment({}).valueOf();
    return {
      invoiceId: now,
      timestamp: now,
      label: artwork.id + " :: " + artwork.title,
      message: "Invoice for artwork purchased on article.art",
      artworkHash: utils.buildBitcoinHash(artwork),
      title: artwork.title,
      itemType: artwork.itemType,
      artworkId: artwork.id,
      state: "unpaid",
      gallerist: (gallerist) ? {
        blockstackId: gallerist.username,
        bitcoinAddress: (gallerist.publicKeyData) ? gallerist.publicKeyData.bitcoinAddress : null,
      } : {},
      artist: (artist) ? {
        blockstackId: artist.username,
        bitcoinAddress: (artist.publicKeyData) ? artist.publicKeyData.bitcoinAddress : null,
      } : {},
      seller: {
        blockstackId: seller.username,
        bitcoinAddress: (seller.publicKeyData) ? seller.publicKeyData.bitcoinAddress : null,
      },
      buyer: {
        blockstackId: buyer.username,
        bitcoinAddress: (buyer.publicKeyData) ? buyer.publicKeyData.bitcoinAddress : null,
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
  getInvoiceLabelFromState: function(state) {
    if (state === "settled") {
      return "settled";
    } else if (state === "settling") {
      return "settling";
    } else if (state === "confirmed") {
      return "confirmed";
    } else if (state === "confirming") {
      return "confirming";
    } else if (state === "unpaid") {
      return "unpaid";
    }
    return "unkown";
  },
  getInvoiceStatusFromState: function(state) {
    if (state === "settled") {
      return 6;
    } else if (state === "settling") {
      return 5;
    } else if (state === "confirmed") {
      return 4;
    } else if (state === "confirming") {
      return 3;
    } else if (state === "settled") {
      return 2;
    } else if (state === "unpaid") {
      return 1;
    }
    return "unkown";
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
      party: (sellerIsArtist) ? "Owner/Artist" : "Owner",
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
      rowClass: "white",
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
