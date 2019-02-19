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
    fetchMyAccount({ state, commit }) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        if (!myProfile.loggedIn) {
          if (myAccountService.isLoggedIn()) {
            myProfile = myAccountService.myProfile();
            commit("myProfile", myProfile);
          } else {
            myProfile = {
              loggedIn: false
            };
          }
        }
        myAccountService.getAuxiliaryProfile(function(auxiliaryProfile) {
          myProfile.auxiliaryProfile = auxiliaryProfile;
          commit("myProfile", myProfile);
          resolve(myProfile);
        }, function(err) {
          console.log(err);
          resolve(myProfile);
        });
      });
    },
    updateAuxiliaryProfile({ state, commit }, auxiliaryProfile) {
      return new Promise(resolve => {
        myAccountService.updateAuxiliaryProfile(
          auxiliaryProfile,
          function(auxiliaryProfile) {
            let myProfile = state.myProfile;
            myProfile.auxiliaryProfile = auxiliaryProfile;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    }
  }
};
export default myAccountStore;
