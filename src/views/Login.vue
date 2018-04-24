<template>
  <div id="home">
    <div id="google-signin-btn"></div>
    <a href="#" v-on:click="signOut">Sign out</a>
    <button v-on:click="getData">Test Request</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Login',
  components: {
  },
  data() {
    return {
    };
  },
  computed: mapGetters([
      'user'
  ]),
  methods: {
    ... mapActions([
      'signOut',
      'saveUser',
      'postToken',
      'getData'
  ]),
  signIn(googleUser){
      const profile = googleUser.getBasicProfile();
      const id_token = googleUser.getAuthResponse().id_token;
      this.$store.dispatch('saveUser', profile);
      this.$store.dispatch('postToken', id_token);
    }
  },
  mounted(){
    gapi.signin2.render('google-signin-btn', { // this is the button "id"
      onsuccess: this.signIn // note, no "()" here
    })
  }
};
</script>

<style scoped>

  #home {

  }

</style>