<template>
  <div id="home">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
    };
  },
  computed: mapGetters([
    'user'
  ]),
  methods: mapActions([
  ]),
  mounted(){
  }
};
</script>

<style scoped>

  #home {

  }

</style>
