<template>
  <v-container app fill-height>
    <!-- {{users}} -->
    <v-layout wrap>
      <v-flex xs12>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <v-flex
              xs2
              slot="header"
              v-for="(item, i) in LIST_TITLE"
              :key="i + 'p'"
            >
              <div class="margin-fix text-truncate">{{ item }}</div>
            </v-flex>
          </v-expansion-panel-content>
          <v-expansion-panel-content v-for="(r, i) in records" :key="i">
            <v-layout slot="header">
              <v-flex
                xs2
                slot="header"
                v-for="(item, i) in [
                  r.id,
                  url2User(r.user)['username'],
                  url2User(r.user)['realname'],
                  dateTime(r.appointment_time),
                  dateTime(r.arrive_time),
                  STATUS_MAP[r.status]
                ]"
                :key="i + 'i'"
              >
                <div class="margin-fix text-truncate">{{ item || "无" }}</div>
              </v-flex>
            </v-layout>
            <v-card>
              <!-- <v-text-field label="Regular" v-model="r.status"></v-text-field> -->
              <v-card-text>
                <v-layout row wrap>
                  <!-- TEXT显示的内容 -->
                  <template v-for="(text_render_item, ii) in TEXT_RENDER_LIST">
                    <v-flex
                      xs6
                      :key="ii + 'j'"
                      v-if="DISPLAY_LIST[text_render_item].includes(r.status)"
                    >
                      <v-flex xs12 style="height:100%">
                        <v-card hover height="100%">
                          <v-card-title>
                            <v-icon
                              large
                              left
                              :color="ICON_COLOR[text_render_item]"
                              >{{ ICON_LIST[text_render_item] }}</v-icon
                            >
                            <span class="title font-weight-light">{{
                              KEY_TRANSLATION[text_render_item]
                            }}</span>
                          </v-card-title>
                          <v-card-text>
                            <p>
                              {{
                                text_render_item != "worker"
                                  ? r[text_render_item] || "无"
                                  : r[text_render_item]
                                  ? url2User(r[text_render_item])["realname"]
                                  : ""
                              }}
                            </p>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-flex>
                  </template>
                  <!-- INPUT显示的内容 -->
                  <template
                    v-for="(input_render_item, ii) in INPUT_RENDER_LIST"
                  >
                    <v-flex
                      xs6
                      :key="ii + 'k'"
                      v-if="INPUT_LIST[input_render_item].includes(r.status)"
                    >
                      <v-flex xs12 style="height:100%">
                        <v-card hover height="100%">
                          <v-card-title>
                            <v-icon
                              large
                              left
                              :color="ICON_COLOR[input_render_item]"
                              >{{ ICON_LIST[input_render_item] }}</v-icon
                            >
                            <span class="title font-weight-light">{{
                              KEY_TRANSLATION[input_render_item]
                            }}</span>
                          </v-card-title>
                          <v-card-text>
                            <v-text-field
                              v-bind:label="
                                INPUT_HELPER_TEXT[input_render_item]
                              "
                              v-model="r[input_render_item]"
                            ></v-text-field>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-flex>
                  </template>
                  <!-- select显示的内容 -->
                  <v-flex xs6 v-if="SELECT_LIST['worker'].includes(r.status)">
                    <v-flex xs12 style="height:100%">
                      <v-card hover height="100%">
                        <v-card-title>
                          <v-icon large left :color="ICON_COLOR['worker']">
                            {{ ICON_LIST["worker"] }}
                          </v-icon>
                          <span class="title font-weight-light">{{
                            KEY_TRANSLATION["worker"]
                          }}</span>
                        </v-card-title>
                        <v-card-text>
                          <!-- :hint="" -->
                          <v-select
                            v-model="r.worker"
                            :items="workers"
                            item-text="realname"
                            item-value="url"
                            label="Select"
                            persistent-hint
                            single-line
                          ></v-select>
                          <!-- {{ r.worker }} -->
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <!-- 已取走 按钮 -->
                <v-btn
                  v-if="5 <= r.status && r.status <= 8"
                  @click="updateRecord(r.url, r.status, [], r, true)"
                  dark
                  block
                  :color="r.is_taken ? 'success' : 'warning'"
                >
                  {{ r.is_taken ? "已取走" : "未取走" }}
                  <v-icon dark>{{ r.is_taken ? "check" : "close" }}</v-icon>
                </v-btn>
                <!-- 发送短信通知 按钮 -->
                <v-btn
                  v-if="5 <= r.status && r.status <= 8 && r.is_taken == false"
                  @click="sendSMS(r.url)"
                  dark
                  block
                  color="cyan"
                >
                  短信通知取回电脑
                  <v-icon dark>textsms</v-icon>
                </v-btn>
                <template v-for="(item, index) in BUTTON_LIST[r.status]">
                  <!--     updateRecord(url, to_status, fields = [], record = {})  -->
                  <v-btn
                    @click="
                      updateRecord(
                        r.url,
                        TO_STATUS_LIST[r.status][index],
                        [],
                        r
                      )
                    "
                    dark
                    block
                    :key="index + 'r'"
                    :color="item.color"
                  >
                    {{ item.label }}
                    <v-icon dark right>{{ item.icon }}</v-icon>
                  </v-btn>
                </template>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 class="text-xs-center mt-1">
        <v-btn text dark v-if="hasNext" color="teal" @click="next(hasNext)"
          >更多</v-btn
        >
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    LIST_TITLE: ["工单号", "学号", "姓名", "预约时间", "到达时间", "处理状态"],
    STATUS_MAP: {
      0: "上单问题未解决",
      1: "预约待确认",
      2: "预约已确认",
      3: "预约已驳回",
      4: "登记待受理",
      5: "正在处理",
      6: "已解决问题",
      7: "建议返厂",
      8: "交给明天解决",
      _: "error"
    },
    TO_STATUS_LIST: {
      0: [5],
      1: [3, 2],
      2: [5],
      3: [],
      4: [5],
      5: [7, 8, 6]
    },
    INPUT_HELPER_TEXT: {
      worker: "如不填写则为默认为当前登录用户",
      worker_description: "简要描述情况",
      method: "简要描述处理方法",
      reject_reason: "只有驳回时才会提交",
      model: "更专业的记录"
    },
    ICON_LIST: {
      description: "event_note",
      model: "laptop",
      reject_reason: "report",
      password: "vpn_key",
      worker: "how_to_reg",
      worker_description: "add_comment",
      method: "functions"
    },
    ICON_COLOR: {
      description: "indigo",
      model: "deep-purple",
      reject_reason: "teal",
      password: "lime",
      worker: "brown",
      worker_description: "cyan",
      method: "amber"
    },
    DISPLAY_LIST: {
      description: [0, 1, 2, 3, 4, 5, 6, 7],
      model: [6, 7, 8],
      reject_reason: [3],
      password: [5, 6, 7, 8],
      worker: [6, 7, 8],
      worker_description: [6, 7, 8],
      method: [6, 7, 8]
    },
    INPUT_LIST: {
      reject_reason: [1],
      model: [5],
      worker_description: [5],
      method: [5]
    },
    SELECT_LIST: {
      worker: [5]
    },
    KEY_TRANSLATION: {
      description: "问题描述",
      model: "电脑型号",
      reject_reason: "拒绝理由",
      password: "电脑开机密码",
      worker: "维修负责人",
      worker_description: "维修人员问题描述",
      method: "处理方法"
    },
    TEXT_RENDER_LIST: [
      "description",
      "model",
      "reject_reason",
      "password",
      "worker",
      "worker_description",
      "method"
    ],
    BUTTON_LIST: [
      [{ label: "已到诊所", color: "primary", icon: "check_circle" }],
      [
        { label: "驳回预约", color: "error", icon: "block" },
        { label: "确认受理", color: "primary", icon: "check" }
      ],
      [{ label: "已到诊所", color: "primary", icon: "check_circle" }],
      [],
      [{ label: "已到诊所", color: "primary", icon: "check_circle" }],
      [
        { label: "建议返厂", color: "purple", icon: "build" },
        { label: "扔给明天", color: "info", icon: "schedule" },
        { label: "已解决问题", color: "success", icon: "done_all" }
      ],
      [],
      [],
      []
    ],
    INPUT_RENDER_LIST: [
      "model",
      "worker_description",
      "method",
      "reject_reason"
    ],
    SELECT_RENDER_LIST: ["worker"]
  }),
  methods: {
    updateRecord(
      url,
      to_status,
      fields = [],
      record = {},
      changeSomeThing = null
    ) {
      if (to_status == 8) {
        this.$http
          .post("/api/records/", {
            ...record,
            status: 0,
            worker: null,
            arrive_time: null
          })
          .then(response => {
            this.$store.commit("popSuccess", "成功创建新工单");
          })
          .catch(error => {
            console.log(error);
            this.$store.commit("popError", "未能成功创建工单");
          });
      }
      if (record.status != 5 && to_status == 5) {
        // 已到
        record.arrive_time = new Date().toISOString();
      }
      if (changeSomeThing) {
        record.is_taken = !record.is_taken;
      }
      this.$http
        .put(url, { ...record, status: to_status })
        .then(response => {
          record.status = to_status;
          this.$store.commit("popSuccess", "更新成功");
        })
        .catch(error => {
          console.log(error);
          record.status = to_status;
          this.$store.commit("popError", "更新失败");
        });
    },
    next(url) {
      this.$store.commit("getData", url);
    },
    url2User(url) {
      let user = this.$store.getters.url2UserLocal(url);

      if (user) {
        return user;
      } else {
        // console.log("NO such user");
        return {};
      }
    },
    dateTime(ds) {
      if (!ds) return "";
      let d = new Date(ds);
      if (!isNaN(d.getTime())) return d.toLocaleString();
      return "";
    },
    sendSMS(url) {
      this.$http
        .get(url + "call_user_back")
        .then(response => {
          this.$store.commit("popSuccess", response.data.detail);
        })
        .catch(e => this.$store.commit("popError", e));
    }
  },
  computed: {
    records() {
      return this.$store.state.data;
    },
    consts() {
      return this.$store.state.CONST;
    },
    workers() {
      return this.$store.state.workers;
    },
    hasNext() {
      return this.$store.state.dataStore.next;
    },
    users() {
      return this.$store.state.users;
    }
  },
  mounted() {},
  created() {
    // if (!this.$store.state.data.length) {
    //   this.$store.commit("getData", "/api/records/");
    // }
  }
};
</script>

<style>
/*
.margin-fix {
   margin: 0 10px; 
}
*/
</style>
