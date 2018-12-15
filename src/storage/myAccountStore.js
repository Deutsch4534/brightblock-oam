import myAccountService from "@/services/myAccountService";

const myAccountStore = {
  namespaced: true,
  state: {
    myProfile: {
      username: null,
      loggedIn: false,
      showAdmin: false
    }
  },
  getters: {
    getMyProfile: state => {
      return state.myProfile;
    }
  },
  mutations: {
    myProfile(state, myProfile) {
      state.myProfile = myProfile;
    }
  },
  actions: {
    fetchMyAccount({ commit }) {
      return new Promise(resolve => {
        let myProfile;
        if (myAccountService.isLoggedIn()) {
          myProfile = myAccountService.myProfile();
        } else {
          myProfile = {
            loggedIn: false
          };
        }
        commit("myProfile", myProfile);
        resolve(myProfile);
      });
    }
  }
};
export default myAccountStore;
