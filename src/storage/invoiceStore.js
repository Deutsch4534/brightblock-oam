import _ from "lodash";
import store from "@/storage/store";
import invoiceService from "@/services/invoiceService";
import bitcoinService from "@/services/bitcoinService";

const invoiceStore = {
  namespaced: true,
  state: {
    invoices: {
      records: []
    },
    transactions: null
  },
  getters: {
    getInvoice: state => invoiceId => {
      if (!invoiceId) {
        return null;
      }
      let matches = state.invoices.records.filter(invoice => invoice.invoiceId === invoiceId);
      if (matches.length > 0) {
        return matches[0];
      }
      return null;
    },
    getInvoices: state => {
      return state.invoices;
    },
    getInvoiceById: state => invoiceId => {
      let records = state.invoices.records.filter(invoice => invoice.invoiceId === invoiceId);
      if (!records || records.length === 0) {
        // allows for passing in the artwork id.
        records = state.invoices.records.filter(invoice => invoice.artworkId === invoiceId);
      }
      if (records && records.length === 1) {
        return records[0];
      }
      return null;
    },
    getInvoicesByState: state => istate => {
      let invoices = state.invoices.records.filter(
        invoice => invoice.state === istate
      );
      return invoices;
    }
  },
  mutations: {
    invoicesRootFile(state, invoicesRootFile) {
      state.invoices = invoicesRootFile;
    },
    transactions(state, transactions) {
      state.transactions = transactions;
    },
    addInvoice(state, invoice) {
      if (!invoice || !invoice.invoiceId) {
        return;
      }
      let index = _.findIndex(state.invoices.records, function(u) {
        return u.invoiceId === invoice.invoiceId;
      });
      if (index < 0) {
        state.invoices.records.splice(0, 0, invoice);
      } else {
        state.invoices.records.splice(index, 1, invoice);
      }
    }
  },
  actions: {
    fetchInvoices({ commit, state, getters}, invoiceId) {
      return new Promise(resolve => {
        invoiceService.initInvoiceData(function(invoicesRootFile) {
          commit("invoicesRootFile", invoicesRootFile);
        });
      });
    },
    fetchInvoice({ commit, state, getters}, invoiceId) {
      return new Promise(resolve => {
        // invoices are fetched on page load - see main.js
        invoiceService.initInvoiceData(function(invoicesRootFile) {
          commit("invoicesRootFile", invoicesRootFile);
          let invoiceClaim = getters.getInvoiceById(invoiceId);
          if (invoiceClaim && !invoiceClaim.confirmed) {
            invoiceService.watchForPayment(invoiceClaim);
          }
          resolve(invoiceClaim);
        });
      });
    },
    prepareNewInvoice({ commit, state, getters}, artwork) {
      return new Promise(resolve => {
        store.dispatch("userProfilesStore/fetchUserProfile", { username: artwork.gallerist }, { root: true }).then(profile => {
          let gallerist = profile;
          store.dispatch("userProfilesStore/fetchUserProfile", { username: artwork.owner }, { root: true }).then(profile => {
            let seller = profile;
            store.dispatch("userProfilesStore/fetchUserProfile", { username: artwork.artist }, { root: true }).then(profile => {
              let artist = profile;
              let invoiceClaim = invoiceService.createInvoiceClaim(gallerist, seller, artist, artwork);
              invoiceClaim.invoiceRates = store.state.constants.invoiceRates;
              invoiceClaim.invoiceAmounts = invoiceService.getInvoiceAmounts(invoiceClaim.invoiceRates, artwork.saleData, artwork.gallerist, artwork.artist !== artwork.owner);
              resolve(invoiceClaim);
            });
          });
        });
      });
    },
    paySeller({ commit, state, getters}, invoiceId) {
      return new Promise(resolve => {
        let invoiceClaim = getters.getInvoiceById(invoiceId);
        if (invoiceClaim.state === "confirmed") {
          // settlement is after successful pay seller.
          // can't settle until the buyers original tx is confirmed
          bitcoinService.paySeller(invoiceClaim, function(transaction) {
            invoiceClaim.state = "settling";
            invoiceClaim.sellerTransaction = transaction;
            invoiceService.saveInvoiceClaim(invoiceClaim, function() {
              commit("addInvoice", invoiceClaim);
              resolve(invoiceClaim);
            }, function() {
              resolve();
            });
          });
        } else {
          resolve();
        }
      });
    }
  }
};
export default invoiceStore;
