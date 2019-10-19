<template>
  <!-- readonly 是没有任何需要编辑的状态，就不展开了 -->
  <v-expansion-panel :readonly="record.status === 9">
    <v-expansion-panel-header py-0>
      <v-row no-gutters>
        <v-col
          cols="4"
          sm="2"
          v-for="(item, i) in [
            record.id.toString().padStart(8, '0'),
            url2User(record.user)['username'],
            record.realname +
              (record.phone_num ? ' - ' + record.phone_num : ''),
            date(record.appointment_time),
            dateTime(record.arrive_time),
            STATUS_MAP[record.status]
          ]"
          :key="i + 'i'"
        >
          <div
            :class="{
              'grey--text': FINISHED_STATUS.includes(record.status),
              'brown--text': i == 5
            }"
            class="margin-fix text-truncate"
          >
            {{ item || "无" }}
          </div>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text>
          <v-row>
            <!-- TEXT显示的内容 -->
            <template v-for="(text_render_item, ii) in TEXT_RENDER_LIST">
              <v-col
                cols="12"
                sm="6"
                md="3"
                pa-0
                :key="ii + 'j'"
                v-if="DISPLAY_LIST[text_render_item].includes(record.status)"
              >
                <v-card hover height="100%">
                  <v-card-title>
                    <v-icon large left :color="ICON_COLOR[text_render_item]">{{
                      ICON_LIST[text_render_item]
                    }}</v-icon>
                    <span class="title font-weight-light">{{
                      KEY_TRANSLATION[text_render_item]
                    }}</span>
                  </v-card-title>
                  <v-card-text>
                    <p>
                      {{
                        text_render_item != "worker"
                          ? record[text_render_item] || "无"
                          : record[text_render_item]
                          ? url2User(record[text_render_item])["realname"]
                          : ""
                      }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </template>

            <!-- INPUT显示的内容 -->
            <template v-for="(input_render_item, ii) in INPUT_RENDER_LIST">
              <v-col
                cols="12"
                sm="6"
                md="3"
                pa-0
                :key="ii + 'k'"
                v-if="INPUT_LIST[input_render_item].includes(record.status)"
              >
                <v-card hover height="100%">
                  <v-card-title>
                    <v-icon large left :color="ICON_COLOR[input_render_item]">
                      {{ ICON_LIST[input_render_item] }}
                    </v-icon>
                    <span class="title font-weight-light">
                      {{ KEY_TRANSLATION[input_render_item] }}
                    </span>
                  </v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-bind:label="INPUT_HELPER_TEXT[input_render_item]"
                      v-model="record[input_render_item]"
                      :counter="INPUT_COUNTER[input_render_item]"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-col>
            </template>
            <!-- select显示的内容 -->
            <!-- 这里不适用 template 列表渲染，是因为 select 具有特殊性，需要特殊处理 -->
            <v-col
              cols="12"
              sm="6"
              md="3"
              pa-0
              v-if="SELECT_LIST['worker'].includes(record.status)"
              :key="ii + 'kj'"
            >
              <v-card hover height="100%">
                <v-card-title>
                  <v-icon large left :color="ICON_COLOR['worker']">{{
                    ICON_LIST["worker"]
                  }}</v-icon>
                  <span class="title font-weight-light">
                    {{ KEY_TRANSLATION["worker"] }}
                  </span>
                </v-card-title>
                <v-card-text>
                  <!-- :hint="" -->
                  <v-select
                    v-model="record.worker"
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
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="12" sm="6" md="3" v-if="history.length > 0">
              <v-btn @click="regret" dark block color="black">
                后悔药
                <v-icon dark>mdi-back</v-icon>
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
              v-if="5 <= record.status && record.status <= 8"
            >
              <v-btn
                @click="
                  updateRecord(record.url, record.status, [], record, true)
                "
                dark
                block
                :color="record.is_taken ? 'success' : 'warning'"
              >
                {{ record.is_taken ? "已取走" : "未取走" }}
                <v-icon dark
                  >mdi-{{ record.is_taken ? "check" : "close" }}</v-icon
                >
              </v-btn>
            </v-col>
            <!-- 发送短信通知 按钮 -->
            <!-- <v-col v-if="5 <= record.status && record.status <= 8 && record.is_taken == false">
          <v-btn @click="sendSMS(record.url)" dark block color="cyan">
            短信通知取回电脑
            <v-icon dark>mdi-message</v-icon>
          </v-btn>
            </v-col>-->
            <template v-for="(item, index) in BUTTON_LIST[record.status]">
              <!--     updateRecord(url, to_status, fields = [], record = {})  -->
              <v-col cols="12" sm="6" md="3" :key="index + 'r'">
                <v-btn
                  @click="
                    updateRecord(
                      record.url,
                      TO_STATUS_LIST[record.status][index],
                      [],
                      record
                    )
                  "
                  dark
                  block
                  :color="item.color"
                >
                  {{ item.label }}
                  <v-icon dark right>mdi-{{ item.icon }}</v-icon>
                </v-btn>
              </v-col>
            </template>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  data: () => ({
    history: [], // a stack for restoring the status
    WORKING_STATUS: [0, 1, 2, 4, 5],
    FINISHED_STATUS: [3, 6, 7, 8, 9],
    LIST_TITLE: [
      "工单号",
      "学号",
      "姓名 - 电话",
      "预约时间",
      "到达时间",
      "处理状态"
    ],
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
      9: "未到诊所",
      _: "error"
    },
    TO_STATUS_LIST: {
      0: [5],
      1: [3, 2],
      2: [9, 5],
      3: [],
      4: [9, 5],
      5: [7, 8, 6]
    },
    INPUT_HELPER_TEXT: {
      worker: "如不填写则为默认为当前登录用户",
      worker_description: "简要描述情况",
      method: "简要描述处理方法",
      reject_reason: "只有驳回时才会提交",
      model: "更专业的记录"
    },
    INPUT_COUNTER: {
      model: 200,
      worker_description: 600,
      description: 600,
      method: 600,
      reject_reason: 600
    },
    ICON_LIST: {
      description: "mdi-text",
      model: "mdi-laptop",
      reject_reason: "mdi-alert-octagon",
      password: "mdi-key",
      worker: "mdi-hammer",
      worker_description: "mdi-comment",
      method: "mdi-function"
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
      [{ label: "已到诊所", color: "primary", icon: "check" }],
      [
        { label: "驳回预约", color: "error", icon: "cancel" },
        { label: "确认受理", color: "primary", icon: "check" }
      ],
      [
        { label: "未到诊所", color: "grey", icon: "check" },
        { label: "已到诊所", color: "primary", icon: "check" }
      ],
      [],
      [
        { label: "未到诊所", color: "grey", icon: "check" },
        { label: "已到诊所", color: "primary", icon: "check" }
      ],
      [
        { label: "建议返厂", color: "purple", icon: "wrench" },
        { label: "扔给明天", color: "info", icon: "clock-outline" },
        { label: "已解决问题", color: "success", icon: "check-all" }
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
      this.$store.commit("loading");

      if (to_status == 8 && record.status != 8) {
        // 扔给明天
        this.$http
          .post("/api/records/", {
            ...record,
            status: 0,
            appointment_time: new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000
            )
              .toLocaleDateString()
              .replace("/", "-")
              .replace("/", "-"),
            worker: null,
            arrive_time: null
          })
          .then(response => {
            this.$store.commit("popSuccess", "成功创建新工单");
            // 不需要用户手动更新视图
            this.$store.dispatch("insertRecord", response.data);
            // 更新本个工单
            this.$http
              .put(url, { ...record, status: to_status })
              .then(({ data }) => {
                // 保存上一个state
                this.history.push({
                  ...record,
                  next_url: data.url
                });
                record.status = to_status;
              })
              .catch(error => {
                record.status = to_status;
                this.$store.commit("popError", "更新失败");
              })
              .finally(() => {
                this.$store.commit("loaded");
              });
          })
          .catch(error => {
            this.$store.commit("popError", "未能成功创建工单");
            return;
          });

        // 直接退出
        return;
      }
      // 保存上一个state
      this.history.push({ ...record });
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
          this.history.pop();
          record.status = to_status;
          this.$store.commit("popError", "更新失败");
        })
        .finally(() => {
          this.$store.commit("loaded");
        });
    },
    url2User(url) {
      let user = this.$store.getters.url2UserLocal(url);

      if (user) {
        return user;
      } else {
        return {};
      }
    },
    regret() {
      const old_status = this.record.status;
      this.record = this.history.pop();
      this.$http
        .put(this.record.url, this.record)
        .then(({ statusCode }) => {
          // 删除新创建的
          if (old_status == 8) {
            this.$http
              .delete(this.record.next_url)
              .then(response => {
                this.$store.commit("popSuccess", "后悔成功");
              })
              .catch(e => this.$store.commit("popError", "删除新工单失败" + e));
          } else {
            this.$store.commit("popSuccess", "后悔成功");
          }
        })
        .catch(e => this.$store.commit("popError", "后悔失败"));
    },
    date(d) {
      if (!d) return "";
      return new Date(d).toLocaleDateString();
    },
    dateTime(ds) {
      if (!ds) return "";
      let d = new Date(ds);
      if (!isNaN(d.getTime())) return d.toLocaleString();
      return "";
    }
  },
  computed: {
    workers() {
      return this.$store.state.workers;
    },
    history_length() {
      return this.history.length;
    }
  },
  model: {
    prop: "record",
    event: "change"
  },
  props: ["record"],
  mounted() {
    if (!this.record.worker) {
      // 如果没有worker，那么默认是自己
      this.record.worker = this.$store.state.user.url;
    }
  }
};
</script>

<style></style>
