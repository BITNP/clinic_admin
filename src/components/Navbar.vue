<template>
  <nav>
    <v-toolbar flat dense>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="hidden-md-and-up"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase black--text">
        <span class="font-weight-light">BIT</span>
        <span>np</span>
        <span text>电脑诊所</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          v-for="(btn, idx) in buttons"
          :key="idx"
          color="grey"
          :to="btn.link"
          text
          @click="dispatcher(btn.method)"
        >
          <span>{{ btn.title }}</span>
          <v-icon right :color="btn.color">mdi-{{ btn.icon }}</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-btn color="grey" :to="account.link" text :loading="!account.title">
        <span>{{ account.title }}</span>
        <v-icon right :color="account.color">mdi-{{ account.icon }}</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      absolute
      width="200"
      id="drawer"
    >
      <v-list-item :to="account.link">
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ account.title }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ account.campus }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          v-for="(btn, idx) in buttons"
          :key="idx"
          link
          :to="btn.link"
          @click="dispatcher(btn.method)"
        >
          <v-list-item-icon>
            <v-icon :color="btn.color">mdi-{{ btn.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ btn.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data: () => ({
    request: false,
    drawer: false,
    buttons: [
      {
        title: "公告",
        icon: "bullhorn-outline",
        color: "black darken-2",
        link: "/announcement"
      },
      {
        title: "时间",
        icon: "clock-outline",
        color: "orange darken-2",
        link: "/schedule"
      },
      {
        title: "工单",
        icon: "note-outline",
        color: "red darken-2",
        link: "/"
      },
      {
        title: "刷新",
        icon: "cached",
        color: "teal darken-2",
        method: "updateData"
      },
      {
        title: "退出",
        icon: "tilde",
        color: "black darken-2",
        method: "logout"
      }
    ],
    account: {
      title: "",
      icon: "account",
      campus: "",
      color: "blue-grey darken-2",
      link: "profile"
    }
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
      this.$store.commit("getDates");
      this.$store.commit("getWorkers");
    },
    logout: function() {
      window.location.replace("/logout");
    },
    dispatcher: function(funcname) {
      if (!funcname) {
        return;
      }
      this[funcname]();
    }
  },
  watch: {
    user() {
      // change button to username
      this.account.title = this.user.username;
      this.account.campus = this.user.campus;
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
    this.$store.commit("loading");
    this.$store.dispatch("initData");
  }
};
</script>
