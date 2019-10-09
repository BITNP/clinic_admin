<template>
  <v-card>
    <v-card-title class="headline">新建今日工单</v-card-title>
    <v-card-text>
      <v-text-field
        label="用户"
        hint="用户学号"
        placeholder="1120171224"
        required
        v-model="record.user"
      ></v-text-field>
      <v-select
        label="校区"
        required
        v-model="record.campus"
        :items="campus"
      ></v-select>
      <v-textarea
        label="问题描述"
        hint="用户对问题的描述"
        required
        v-model="record.description"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <div class="flex-grow-1"></div>
      <v-btn color="orange darken-1" text @click="toggle">取消</v-btn>
      <v-btn color="green darken-1" text @click="submit">确认</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Axios from "axios";
export default {
  data: () => ({
    record: { campus: "良乡校区" }
  }),
  methods: {
    toggle() {
      this.$emit("toggle");
    },
    submit() {
      if (
        !(this.record.campus && this.record.user && this.record.description)
      ) {
        this.$store.commit("popError", "信息没有填写完全");
        return;
      }

      Axios.post("/api/records/insert/", this.record)
        .then(({ data }) => {
          if (typeof data === "object") {
            this.$store.commit("popSuccess", "创建成功");
            this.$store.dispatch("insertRecord", data);
            this.$emit("toggle");
          }
        })
        .catch(e => this.$store.commit("popError", "创建失败"));
    }
  },
  watch: {
    campus() {
      if (this.campus.length > 0) {
        this.record.campus = this.campus[0];
      }
    }
  },
  computed: {
    campus() {
      return this.$store.state.campus;
    }
  }
};
</script>

<style></style>
