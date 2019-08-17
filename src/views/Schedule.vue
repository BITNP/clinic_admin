<template>
  <v-container fluid fill-height>
    <v-row
      ><v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="dates"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>服务时间管理</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on"
                    >新建服务时间</v-btn
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
                            v-model="editedItem.name"
                            label="服务描述"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-menu
                            v-model="menu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="editedItem.start"
                                label="日期"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="editedItem.start"
                              :allowed-dates="valid_dates"
                              @input="menu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.capacity"
                            label="服务容纳量"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
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
      </v-col></v-row
    >
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    menu: false,
    dialog: false,
    headers: [
      {
        text: "服务描述",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "时间", value: "start" },
      { text: "容纳量 （人）", value: "capacity" },
      { text: "已报名 （人）", value: "count" },
      { text: "已完成 （人）", value: "finish" },
      { text: "骚操作", value: "action", sortable: false }
    ],
    dates: [],
    editedIndex: -1,
    editedItem: {
      name: "正常营业",
      start: "",
      capacity: 20
    },
    defaultItem: {
      name: "正常营业",
      start: "",
      capacity: 20
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新建服务时间" : "编辑服务时间";
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
    initialize() {
      axios
        .get("/api/date/")
        .then(({ data }) => {
          this.dates = data;
        })
        .catch(({ response }) => {
          this.$store.commit("popError", response.data);
        });
    },

    editItem(item) {
      this.editedIndex = this.dates.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.dates.indexOf(item);
      if (confirm("确定删除此时间安排？")) {
        axios
          .delete(item.url)
          .then(({ statusCode }) => {
            this.dates.splice(index, 1);
            this.$store.commit("popSuccess", "已删除");
          })
          .catch(({ response }) => {
            if (response.data) this.$store.commit("popError", response.data);
          });
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
      let ds = this.dates.map(d => d.start);
      return (
        new Date(val) >= new Date(new Date().toDateString()) &&
        !ds.includes(val)
      );
    },
    save() {
      if (this.editedIndex > -1) {
        //   update
        axios
          .put(this.editedItem.url, {
            ...this.editedItem
          })
          .then(({ statusCode }) => {
            this.$store.commit("popSuccess", "修改成功");

            Object.assign(this.dates[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch(({ response }) => {
            this.$store.commit("popError", response.data);
          });
      } else {
        //   create
        axios
          .post("/api/date/", {
            ...this.editedItem
          })
          .then(({ statusCode }) => {
            this.$store.commit("popSuccess", "创建成功");
            this.editedItem.count = 0;
            this.editedItem.finish = 0;
            this.dates.push(this.editedItem);
            this.close();
          })
          .catch(({ response }) => {
            this.$store.commit("popError", response.data);
          });
      }
    }
  }
};
</script>

<style></style>
