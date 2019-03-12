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
    checkPayment({ commit, state, getters}, invoiceId) {
      let invoice = getters.getInvoiceById(invoiceId);
      return new Promise(resolve => {
        bitcoinService.checkTransaction({txid: invoice.buyerTransaction.txid}, function(transaction) {
          if (transaction) {
            invoice.buyerTransaction.confirmations = transaction.result.confirmations;
            invoiceService.saveInvoiceClaim(invoice, function(res) {
              resolve(invoice);
            });
          }
        });
      });
    },
    checkSettlement({ commit, state, getters}, invoiceId) {
      let invoice = getters.getInvoiceById(invoiceId);
      return new Promise(resolve => {
        bitcoinService.checkTransaction({txid: invoice.sellerTransaction.txid}, function(transaction) {
          if (transaction) {
            invoice.sellerTransaction.confirmations = transaction.result.confirmations;
            invoiceService.saveInvoiceClaim(invoice, function(res) {
              resolve(invoice);
            });
          }
        });
      });
    },
    fetchInvoice({ commit, state, getters}, invoiceId) {
      return new Promise(resolve => {
        // invoices are fetched on page load - see main.js
        invoiceService.initInvoiceData(function(invoicesRootFile) {
          commit("invoicesRootFile", invoicesRootFile);
          let invoiceClaim = getters.getInvoiceById(invoiceId);
          if (invoiceClaim) {
            resolve(invoiceClaim);
            if (!invoiceClaim.state === "unpaid") {
            }
          } else {
            resolve(invoiceClaim);
          }
        });
      });
    },
    prepareNewInvoice({ commit, state, getters}, data) {
      let artwork = data.artwork;
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
              if (data.saveInvoice) {
                invoiceService.saveInvoiceClaim(invoiceClaim, function(res) {
                  resolve(invoiceClaim);
                });
              } else {
                resolve(invoiceClaim);
              }
            });
          });
        });
      });
    },
    paySeller({ commit, state, getters}, invoice) {
      return new Promise(resolve => {
        if (!invoice.sellerTransaction) {
          // settlement is after successful pay seller.
          // can't settle until the buyers original tx is confirmed
          bitcoinService.paySeller(invoice, function(transaction) {
            if (transaction && transaction.sentTx) {
              invoice.state = "settling";
              invoice.sellerTransaction = {};
              invoice.sellerTransaction.txid = transaction.sentTx;
              invoice.sellerTransaction.confirmations = 0;
              invoiceService.saveInvoiceClaim(invoice, function() {
                // invoiceService.transferArtworkToBuyer(invoice, true, function(artwork) {
                // need to wait for confirmations before transferring...
                console.log("settling purchase for artwork: " + invoice.title);
                commit("addInvoice", invoice);
                resolve(invoice);
                // });
              }, function() {
                resolve();
              });
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }
  }
};
export default invoiceStore;
