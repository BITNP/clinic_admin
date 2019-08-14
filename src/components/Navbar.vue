<template>
  <nav>
    <v-toolbar flat>
      <!-- <v-icon @click="toggleDrawer">filter_list</v-icon> -->
      <v-toolbar-title class="text-uppercase black--text">
        <span class="font-weight-light">BIT</span>
        <span>np</span>

        <dev text>电脑诊所</dev>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-text-field
        flat
        solo
        light
        hide-details
        label="Search"
        prepend-inner-icon="search"
      ></v-text-field>-->
      <!-- <h5>{{ request }}</h5> -->
      <router-link to="/" tag="span">
        <v-btn text color="grey"><span>管理</span></v-btn>
      </router-link>
      <v-btn text color="grey" @click="updateData">
        <span>刷新</span>
        <v-icon right color="teal darken-2">mdi-cached</v-icon>
      </v-btn>
      <router-link to="profile" tag="div">
        <v-btn text color="gery" @click="clickProfile">
          <span>{{ user.username }}</span>
          <v-icon right color="blue-grey darken-2">mdi-account</v-icon>
        </v-btn>
      </router-link>
    </v-toolbar>
  </nav>
</template>

<script>
export default {
  data: () => ({
    request: false
  }),
  methods: {
    toggleDrawer: function() {
      this.$store.commit("toggleDrawer");
    },
    clickProfile: function() {
      this.$store.commit("closeDrawer");
    },
    updateData: function() {
      this.$store.commit("clearData");
      this.$store.commit("getData", "/api/records/");
    }
  },
  computed: {
    info: function() {
      return this.$store.state.drawer;
    },
    user: function() {
      return this.$store.state.user;
    }
  },
  created() {
    this.$store.dispatch("initData");
  }
};
</script>
