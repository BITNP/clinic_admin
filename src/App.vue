<template>
  <v-app grey lighten-4>
    <Navbar />
    <!-- <Sidebar /> -->
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer />

    <v-snackbar
      v-model="snackbar.display"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
      <v-btn dark text @click="snackbar.display = false">
        <v-icon>mdi-cancel</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default {
  name: "App",
  components: {
    Navbar,
    Footer
  },
  data: () => ({}),
  computed: {
    snackbar() {
      return this.$store.state.snackbar;
    }
  },
  created() {
    this.$store.commit("loading");
  }
};
</script>
