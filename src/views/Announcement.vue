<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="announcements"
          sort-by="calories"
          class="elevation-1"
          :loading="loading"
          loading-text="正在加载数据"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>公告管理</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on"
                    >新建公告</v-btn
                  >
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.title"
                            label="标题"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            :items="types"
                            label="类型"
                            v-model="editedItem.tag"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-menu
                            v-model="menu"
                            :close-on-content-click="false"
                            :close-on-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="editedItem.expireDate"
                                label="过期时间"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              :allowed-dates="
                                date => new Date(date) >= new Date()
                              "
                              v-model="editedItem.expireDate"
                              @input="menu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            v-model="editedItem.content"
                            label="内容"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="overlay = !overlay"
                      >预览内容</v-btn
                    >
                    <v-overlay :value="overlay">
                      <v-btn icon @click="overlay = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <vue-markdown>{{ editedItem.content }}</vue-markdown>
                    </v-overlay>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"
              >mdi-pencil</v-icon
            >
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import VueMarkdown from "vue-markdown";

export default {
  components: {
    VueMarkdown
  },
  data: () => ({
    overlay: false,
    menu: false,
    dialog: false,
    loading: false,
    types: [
      { text: "免责声明", value: "TOC" },
      { text: "普通公告", value: "AN" }
    ],
    TYPES_MAP: {
      TOC: "免责声明",
      AN: "普通公告"
    },
    headers: [
      {
        text: "服务描述",
        align: "left",
        sortable: false,
        value: "title"
      },
      { text: "内容", value: "content" },
      { text: "标签", value: "tag" },
      { text: "创建时间", value: "createdTime" },
      { text: "最后修改时间", value: "lastEditedTime" },
      { text: "过期时间", value: "expireDate" },
      { text: "骚操作", value: "action", sortable: false }
    ],
    announcements: [],
    editedIndex: -1,
    editedItem: {
      tag: "AN"
    },
    defaultItem: {
      tag: "AN"
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新建公告" : "编辑公告";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    localize(d) {
      d.createdTime = new Date(d.createdTime).toLocaleString();
      d.lastEditedTime = new Date(d.lastEditedTime).toLocaleString();
      d.tag = this.TYPES_MAP[d.tag];
    },
    initialize() {
      this.loading = true;
      axios
        .get("/api/announcement/")
        .then(({ data }) => {
          // d => {
          //   d.createdTime = new Date(d.createdTime).toLocaleString();
          //   d.lastEditedTime = new Date(d.lastEditedTime).toLocaleString();
          //   d.tag = this.TYPES_MAP[d.tag];
          // }
          data.map(this.localize);
          this.announcements = data;
          this.loading = false;
        })
        .catch(error => {
          if (error.response && error.response.data)
            this.$store.commit("popError", response.data);
          else this.$store.commit("popError", error);
        });
    },

    editItem(item) {
      this.editedIndex = this.announcements.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.announcements.indexOf(item);
      if (confirm("确定删除此公告？")) {
        this.$store.commit("loading");
        axios
          .delete(item.url)
          .then(({ statusCode }) => {
            this.announcements.splice(index, 1);
            this.$store.commit("popSuccess", "已删除");
          })
          .catch(({ response }) => {
            if (response && response.data)
              this.$store.commit("popError", response.data);
          })
          .finally(() => this.$store.commit("loaded"));
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    valid_dates(val) {
      let ds = this.announcements.map(d => d.start);
      return (
        new Date(val) >= new Date(new Date().toDateString()) &&
        !ds.includes(val)
      );
    },
    save() {
      this.$store.commit("loading");
      if (this.editedIndex > -1) {
        //   update
        axios
          .put(this.editedItem.url, {
            ...this.editedItem
          })
          .then(({ data, statusCode }) => {
            this.$store.commit("popSuccess", "修改成功");

            this.editedItem.tag = this.TYPES_MAP[this.editItem.tag];
            this.localize(data);
            Object.assign(this.announcements[this.editedIndex], data);
            this.close();
          })
          .catch(({ response }) => {
            this.$store.commit("popError", response.data);
          })
          .finally(() => this.$store.commit("loaded"));
      } else {
        //   create
        axios
          .post("/api/announcement/", {
            ...this.editedItem
          })
          .then(({ data, statusCode }) => {
            this.$store.commit("popSuccess", "创建成功");
            this.createdTime = new Date().toLocaleString();
            this.lastEditedTime = new Date().toLocaleString();
            this.editedItem.tag = this.TYPES_MAP[this.editItem.tag];
            this.localize(data);
            this.announcements.push(data);
            this.close();
          })
          .catch(({ response }) => {
            this.$store.commit("popError", response.data);
          })
          .finally(() => this.$store.commit("loaded"));
      }
    }
  }
};
</script>

<style></style>
