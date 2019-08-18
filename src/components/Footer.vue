<template>
  <v-footer app height="auto" class="pa-3">
    <v-layout wrap>
      <v-flex text-xs-center xs6>
        <strong>网络开拓者协会</strong>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-flex>
      <v-progress-linear
        :active="loading.loading"
        :indeterminate="loading.loading"
        absolute
        top
        color="deep-purple accent-4"
      ></v-progress-linear>
      <v-spacer></v-spacer>
      <v-flex class="text-right" xs1>
        <router-link to="about" tag="span">
          <span> v{{ version }}</span></router-link
        ></v-flex
      >
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  computed: {
    version() {
      return this.$store.state.version;
    },
    loading: function() {
      return this.$store.state.loading;
    }
  }
};
</script>

<style></style>
