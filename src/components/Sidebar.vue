<template>
  <div>
    <v-navigation-drawer app v-model="drawer">
      <h2>新功能开发中</h2>
      <v-divider></v-divider>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    drawer: function() {
      return this.$store.state.drawer;
    }
  }
};
</script>

<style></style>
