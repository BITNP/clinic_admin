<template>
  <v-footer app height="auto" class="pa-3">
    <v-layout wrap>
      <v-flex text-xs-center xs6>
        <strong>网络开拓者协会</strong>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-flex>
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
    }
  }
};
</script>

<style></style>
