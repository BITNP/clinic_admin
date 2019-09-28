<template>
  <v-container fluid fill-height>
    <v-row class="about" justify="space-around">
      <v-col cols="sm">
        <v-card v-ripple class="mx-auto" color="#26c6da" dark>
          <v-card-title>
            <span class="title font-weight-bold">{{ editable ? "修改" : "" }}用户信息</span>
            <v-spacer></v-spacer>
            <v-btn text @click="flip">
              <v-icon v-if="!editable">mdi-pencil</v-icon>
              <v-icon v-else>mdi-check</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="headline font-weight-bold">“维修不规范，同学两行泪。”</v-card-text>

          <v-card-actions>
            <v-row align-center justify-end v-if="!editable">
              <v-col cols="3">
                <!-- <v-list-item-avatar color="grey darken-3" @click="flip"> -->
                <v-icon>mdi-account-outline</v-icon>
                <span>{{ user.username }}</span>
              </v-col>

              <v-col cols="3">
                <v-icon class="mr-1">mdi-account-box-outline</v-icon>
                <span class="subheading mr-2">{{ user.realname }}</span>
              </v-col>
              <v-col cols="3">
                <v-icon class="mr-1">mdi-school</v-icon>
                <span class="subheading">{{ user.school }}</span>
              </v-col>
              <v-col cols="3">
                <v-icon class="mr-1">mdi-school</v-icon>
                <span class="subheading">{{ user.campus }}</span>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="4">
                <v-text-field label="姓名" v-model="user.realname"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field label="学院" v-model="user.school"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select :items="campus" label="校区" v-model="user.campus"></v-select>
              </v-col>
            </v-row>
            <!-- <span>
                  <span class="mr-1">·</span>
                  
                  
            </span>-->
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
                  <v-list-item-sub-title class="text--primary">
                    {{
                    CAMPUS_TRANS[item.campus]
                    }}
                  </v-list-item-sub-title>
                  <v-list-item-sub-title>
                    {{
                    item.username
                    }}
                  </v-list-item-sub-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text>
                    {{
                    item.school
                    }}
                  </v-list-item-action-text>
                  <v-icon
                    color="grey lighten-1"
                    v-if="item.username != user.username"
                  >mdi-star_border</v-icon>
                  <v-icon v-else color="yellow darken-2">mdi-star</v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-divider v-if="index + 1 < users.length" :key="index"></v-divider>
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
    },
    campus: function() {
      return this.$store.state.campus;
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
