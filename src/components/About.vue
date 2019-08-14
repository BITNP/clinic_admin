<template>
  <v-container>
    <h2>v{{ version }}</h2>
    <v-timeline>
      <v-timeline-item
        v-for="(c, i) in changeLog"
        :key="i"
        :color="c.color"
        :small="c.scale == 'small'"
        :large="c.scale == 'large'"
      >
        <span slot="opposite">{{ c.dateTime }}</span>
        <v-card class="elevation-2">
          <v-card-title class="headline">{{ c.version }}</v-card-title>
          <v-card-text>
            <v-list subheader one-line>
              <v-list-tile v-for="(item, ind) in c.change" :key="ind">
                <v-list-tile-content>
                  <v-list-tile-title>{{
                    Object.keys(item)[0]
                  }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{
                    Object.values(item)[0]
                  }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    changeLog: [
      {
        version: "v0.9.11",
        dateTime: "2019-02-24 晚",
        change: [
          { feature: "根据后端变化, 增加短信通知功能" },
          { fix: "修改状态改变问题和本地化" }
        ],
        color: "blue",
        scale: "small"
      },
      {
        version: "v0.9.10",
        dateTime: "2019-02-19 凌晨",
        change: [{ feature: "根据后端变化, 修改初始化顺序实现校区区分" }],
        color: "blue",
        scale: "small"
      },
      {
        version: "v0.9.9",
        dateTime: "2019-02-17 晨",
        change: [
          {
            feature: "新版register界面上线"
          }
        ],
        color: "cyan"
      },
      {
        version: "v0.9.8",
        dateTime: "2019-02-16 晚",
        change: [
          {
            feature: "增加图标颜色"
          },
          {
            feature: "增加按钮图标"
          },
          {
            fix: "空白日期显示错误"
          },
          {
            fix: "选择明天维修后未创建新工单"
          },
          {
            fix: "临时值班无法选择自己"
          },
          {
            fix: "解决对齐问题，但是失去了蛇形的美感QAQ"
          }
        ],
        scale: "large",
        color: "cyan"
      },
      {
        version: "v0.9.7",
        dateTime: "2019-02-16 15:24",
        change: [
          {
            feature: "完成状态依然可以修改电脑的取走状态"
          },
          {
            feature: "增加Change Log（此页面）"
          }
        ],
        color: "red lighten-2",
        scale: "small"
      },
      {
        version: "v0.9.6",
        dateTime: "2019-02-16",
        change: [
          {
            fix: "typo & 时间格式"
          },
          {
            fix: "到达后提交时间"
          }
        ],
        color: "indigo lighten-2",
        scale: "small"
      },
      {
        version: "v0.9.5",
        dateTime: "2019-02-16 凌晨",
        change: [
          {
            fix: "解决疯狂请求用户信息问题"
          }
        ],
        color: "blue lighten-2",
        scale: "large"
      },
      {
        version: "v0.9.0",
        dateTime: "2019-02-15",
        change: [
          {
            feature: "完成主要框架"
          }
        ],
        color: "yellow lighten-2",
        scale: "large"
      }
    ]
  }),
  computed: {
    version() {
      return this.$store.state.version;
    }
  }
};
</script>

<style></style>
