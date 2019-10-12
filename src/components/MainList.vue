<template>
  <v-container fluid fill-height>
    <v-row justify="center">
      <v-col cols="12" v-if="filterBar">
        <!-- 这里有用来过滤的几个工具 -->
        <v-row>
          <v-col cols="4" md="6" sm="12">
            <v-text-field
              label="过滤"
              placeholder="i.e. worker=='冯开宇'"
              hint="可以使用javascript语句进行过滤，可使用的字段有id、user、realname、worker。"
              v-model="filterText"
              :color="filterColor"
            ></v-text-field>
          </v-col>
          <v-col cols="4" md="6" sm="12">
            <v-range-slider
              :tick-labels="dateRanges"
              v-model="selectedDateRanges"
              min="0"
              max="3"
              ticks="always"
              tick-size="4"
              color="orange"
              track-color="red"
            >
              <!-- <template v-slot:thumb-label="props">
                <v-icon dark>
                  {{ season(props.value) }}
                </v-icon>
              </template>-->
            </v-range-slider>
          </v-col>
          <v-col cols="4" md="6" sm="12">
            <v-combobox
              v-model="selectedStatus"
              :items="STATUS_LIST"
              label="状态"
              item-text="text"
              item-value="value"
              multiple
              chips
            ></v-combobox>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel readonly>
            <v-expansion-panel-header py-0>
              <v-row no-gutters>
                <v-col v-for="(item, i) in LIST_TITLE" :key="i + 'p'">
                  <div class="margin-fix text-truncate">{{ item }}</div>
                </v-col>
              </v-row>
              <template v-slot:actions>
                <v-icon @click="filterBar = !filterBar" color="primary"
                  >mdi-apps</v-icon
                >
              </template>
            </v-expansion-panel-header>
          </v-expansion-panel>
          <template v-for="(r, i) in records">
            <Record :record="r" :key="i"></Record>
          </template>
        </v-expansion-panels>
      </v-col>

      <v-col cols="3" class="text-xs-center mt-1">
        <v-btn
          text
          block
          rounded
          dark
          v-if="hasNext"
          color="teal"
          @click="next(hasNext)"
          >更多</v-btn
        >
      </v-col>
      <!-- FAB 浮动的button -->
      <FlowActionButton></FlowActionButton>
    </v-row>
  </v-container>
</template>

<script>
import Record from "@/components/Record";
import FlowActionButton from "@/components/FlowActionButton";
export default {
  components: {
    Record,
    FlowActionButton
  },
  data: () => ({
    filterBar: false,
    filterText: "",
    filterColor: "",
    dateRanges: ["往昔", "今日", "翌日", "彼岸"],
    selectedDateRanges: [0, 3],
    selectedStatus: [], // 在 created 中初始化
    // WORKING_STATUS: [0, 1, 2, 4, 5],
    // FINISHED_STATUS: [3, 6, 7, 8],
    STATUS_LIST: [
      // 供 filter 中的combobox使用
      { value: 0, text: "上单问题未解决" },
      { value: 1, text: "预约待确认" },
      { value: 2, text: "预约已确认" },
      { value: 3, text: "预约已驳回" },
      { value: 4, text: "登记待受理" },
      { value: 5, text: "正在处理" },
      { value: 6, text: "已解决问题" },
      { value: 7, text: "建议返厂" },
      { value: 8, text: "交给明天解决" }
    ],
    LIST_TITLE: [
      "工单号",
      "学号",
      "姓名 - 电话",
      "预约时间",
      "到达时间",
      "处理状态"
    ]
  }),
  methods: {
    next(url) {
      this.$store.commit("getData", url);
    },
    filterSuccess(success) {
      // 成功与否
      if (success) {
        this.filterColor = "success";
      } else {
        this.filterColor = "warning";
      }
    }
  },
  computed: {
    records() {
      // 增加更多filter的逻辑
      let result = this.$store.state.data;

      if (this.filterText) {
        try {
          result = result.filter(v => {
            let id = v.id;
            let user = this.url2User(v.user)["username"];
            let realname = v.realname;
            let worker = v.worker ? this.url2User(v.worker)["realname"] : null;
            return eval(this.filterText);
          });
          this.filterSuccess(true);
        } catch (error) {
          this.filterSuccess(false);
          // console.log(error);
        }
      }
      {
        // 过滤时间，这部分其实可以性能优化一下
        let past = new Date("0000-01-01");
        let today = new Date(new Date().toLocaleDateString());
        let tommorow = new Date(today.getTime() + 1000 * 60 * 60 * 24);
        let day_after = new Date(tommorow.getTime() + 1000 * 60 * 60 * 24);
        let future = new Date("9999-12-30");
        let start_range = [past, today, tommorow, future][
          this.selectedDateRanges[0]
        ];
        let end_range = [past, tommorow, day_after, future][
          this.selectedDateRanges[1]
        ];
        result = result.filter(v => {
          let d = new Date(v.appointment_time);
          return start_range <= d && d <= end_range;
        });
      }
      {
        let _t = this.selectedStatus.map(v => v.value);
        result = result.filter(v => _t.includes(v.status));
      }
      return result;
    },
    hasNext() {
      return this.$store.state.dataStore.next;
    }
  },
  created() {
    this.selectedStatus = this.STATUS_LIST;
  }
};
</script>

<style></style>
