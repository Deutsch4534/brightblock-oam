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
    getPreparedInvoice: state => artwork => {
      if (artwork) {
        let invoiceRates = store.state.constants.invoiceRates;
        let invoiceAmounts = invoiceService.getInvoiceAmounts(invoiceRates, artwork.saleData, artwork.gallerist, artwork.artist !== artwork.owner);
        let invoiceClaim = invoiceService.createInvoiceClaim(artwork, invoiceRates, invoiceAmounts);
        return invoiceClaim;
      }
      return null;
    },
    getInvoiceByLabel: state => label => {
      let invoices = state.invoices.records.filter(
        invoice => invoice.label === label
      );
      if (invoices && invoices.length === 1) {
        return invoices[0];
      }
      return null;
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
    fetchInvoice({ commit, state, getters}, invoiceId) {
      return new Promise(resolve => {
        // invoices are fetched on page load - see main.js
        invoiceService.initInvoiceData(function(invoicesRootFile) {
          commit("invoicesRootFile", invoicesRootFile);
          let invoiceClaim = getters.getInvoiceById(invoiceId);
          if (invoiceClaim) {
            invoiceService.watchForPayment(invoiceClaim);
          }
          resolve(invoiceClaim);
        });
      });
    },
    paySeller({ commit, state, getters}, artwork) {
      return new Promise(resolve => {
        let invoiceClaim = getters.getInvoiceById(artwork.id);
        if (invoiceClaim.sellerTransaction) {
          resolve();
          return;
        }
        bitcoinService.paySeller(function(invoicesRootFile) {
          commit("invoicesRootFile", invoicesRootFile);
          if (invoiceClaim) {
            invoiceService.watchForPayment(invoiceClaim);
          }
          resolve(invoiceClaim);
        });
      });
    }
  }
};
export default invoiceStore;
