<template>
  <v-container fluid fill-height>
    <v-row class="about" justify="space-around">
      <v-col cols="sm">
        <v-card v-ripple class="mx-auto" color="#26c6da" dark>
          <v-card-title>
            <span class="title font-weight-bold"
              >{{ editable ? "修改" : "" }}用户信息</span
            >
          </v-card-title>

          <v-card-text class="headline font-weight-bold">
            “维修不规范，同学两行泪。”
          </v-card-text>

          <v-card-actions>
            <v-row align-center justify-end>
              <v-col @click="flip">
                <!-- <v-list-item-avatar color="grey darken-3" @click="flip"> -->
                <v-icon>mdi-account-outline</v-icon>
                <!-- </v-list-item-avatar> -->

                <v-list-item-content>
                  <v-list-item-title>{{ user.username }}</v-list-item-title>
                </v-list-item-content></v-col
              >
              <v-col>
                <span>
                  <v-icon class="mr-1">mdi-account-box-outline</v-icon>
                  <span class="subheading mr-2" v-if="!editable">{{
                    user.realname
                  }}</span>
                  <v-text-field
                    class="shrink"
                    v-model="user.realname"
                    v-else
                  ></v-text-field>
                  <span class="mr-1">·</span>
                  <v-icon class="mr-1">mdi-school</v-icon>
                  <span class="subheading" v-if="!editable">{{
                    user.school
                  }}</span>
                  <v-text-field
                    class="shrink"
                    v-model="user.school"
                    v-else
                  ></v-text-field>
                </span>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="sm">
        <v-card style="height:100%">
          <v-toolbar color="pink" flat dark>
            <v-toolbar-title>今日值班名单</v-toolbar-title>
          </v-toolbar>

          <v-list two-line>
            <template v-for="(item, index) in users">
              <v-list-item :key="index + 'z'" avatar ripple>
                <v-list-item-content>
                  <v-list-item-title>{{ item.realname }}</v-list-item-title>
                  <v-list-item-sub-title class="text--primary">{{
                    CAMPUS_TRANS[item.campus]
                  }}</v-list-item-sub-title>
                  <v-list-item-sub-title>{{
                    item.username
                  }}</v-list-item-sub-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text>{{
                    item.school
                  }}</v-list-item-action-text>
                  <v-icon
                    color="grey lighten-1"
                    v-if="item.username != user.username"
                  >
                    mdi-star_border
                  </v-icon>
                  <v-icon v-else color="yellow darken-2">
                    mdi-star
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-divider
                v-if="index + 1 < users.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    CAMPUS_TRANS: {
      LX: "良乡",
      ZGC: "中关村"
    },
    editable: false
  }),
  computed: {
    user: function() {
      return this.$store.state.user;
    },
    users: function() {
      return this.$store.state.workers;
    }
  },
  methods: {
    flip: function() {
      this.editable = !this.editable;
      if (!this.editable) {
        this.$store.dispatch("updateUser");
      }
    }
  }
};
</script>

<style>
.shrink {
  width: 60px;
}
</style>
