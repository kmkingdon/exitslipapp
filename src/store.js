import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id:'',
      name: '',
      image: '',
      email: ''
    }
  },
  mutations: {
    saveUserState(state, profile) {
      state.user = {
        id: profile.Eea,
        name: profile.ig,
        image: profile.Paa,
        email: profile.U3
      }
    }
  },
  actions: {
    saveUser({commit}, profile){
      commit('saveUserState', profile);
    },
    postToken({ commit }, id_token){
      const tokenObject = {
        'token': id_token
      }
      fetch('http://localhost:3000/verify', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(tokenObject),
      })
      .then(response => response.json())
      .then(response => console.log(response))
    },
    signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    },
    getData({commit}) {
      fetch('http://localhost:3000/', {
        credentials: 'include'
      });
    }
  },
  getters: {
    user: state => state.user
  }
})
