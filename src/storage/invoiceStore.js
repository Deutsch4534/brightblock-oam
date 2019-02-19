import _ from "lodash";

const invoiceStore = {
  namespaced: true,
  state: {
    invoices: {},
    transactions: null
  },
  getters: {
    getInvoice: state => invoiceId => {
      let matches = state.invoices.filter(invoice => invoice.invoiceId === invoiceId);
      if (matches.length > 0) {
        return matches[0];
      }
      return null;
    },
    getInvoices: state => {
      return state.invoices;
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
        let inv = getters.getInvoice(invoiceId);
        if (inv) {
          resolve(inv);
        } else {
        }
      });
    }
  }
};
export default invoiceStore;
