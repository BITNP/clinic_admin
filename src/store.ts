import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

// for django csrf token
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    version: "0.13.5",
    count: 0,
    drawer: false,
    loading: {
      loading: true,
      color: "blue"
    },
    // 校区表 ['良乡校区', '中关村校区']
    campus: Array(),
    dataStore: {
      next: null
    },
    data: Array(),
    user: {
      url: "",
      username: "",
      realname: "",
      school: "",
      campus: ""
    },
    users: {},
    workers: [],
    dates: [],
    snackbar: {
      text: "Done",
      display: true,
      color: "success"
    }
  },
  getters: {
    url2UserLocal: state => (url: string) => {
      return (state.users as any)[url];
    }
  },
  mutations: {
    toggleDrawer(state) {
      state.drawer = !state.drawer;
    },
    closeDrawer(state) {
      state.drawer = false;
    },
    updateData(state, d) {
      state.data = d;
    },
    getWorkers(state) {
      console.log(state.user);
      axios
        .get("/api/users/", {
          params: {
            today: "True",
            is_staff: "True",
            campus: state.user.campus
          }
        })
        .then(response => (state.workers = response.data.results))
        .catch(error => {
          console.log(error);
        })
        .finally(() => null);
    },
    getCampus(state) {
      // initualize campus
      axios
        .get("/api/campus/")
        .then(({ data }) => {
          // console.group("Campus");
          // console.log(data);
          let _t = data.map((v: any) => v.name);
          // console.log(_t);

          state.campus = _t;
          // console.log(state.campus);
          // console.groupEnd();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getUser(state, user) {
      // save user data to store.js
      state.user = user;
    },
    updateUser(state, { thenFun, catchFun, finallyFun }) {
      // 被action 调用
      console.log(thenFun);
      axios
        .put(state.user.url, state.user)
        .then(thenFun())
        .catch(error => catchFun(error))
        .finally(finallyFun());
    },
    loading(state) {
      state.loading.loading = true;
    },
    loaded(state) {
      state.loading.loading = false;
    },
    getData(state, url) {
      // 获取data，并更新缓存
      state.loading.loading = true;
      axios
        .get(url, {
          params: {
            campus: state.user.campus
          }
        })
        .then(response => {
          state.dataStore = response.data;
          console.log(response.data.results);
          state.data = state.data.concat(response.data.results);
          // fetchList 存放了本地没有具体用户信息的相应url
          let fetchList = new Map();
          response.data.results.forEach((v: any) => {
            if (v.worker && !(state.users as any)[v.worker])
              fetchList.set(v.worker, null);
            if (v.user && !(state.users as any)[v.user])
              fetchList.set(v.user, null);
          });

          for (let [key, value] of fetchList) {
            let v = key;
            if (!(state.users as any)[v]) {
              axios
                .get(v)
                .then(response => {
                  Vue.set(state.users, v, response.data);
                })
                .catch(error => {
                  console.log(error);
                  state.snackbar = {
                    text: "无法加载用户信息",
                    color: "error",
                    display: true
                  };
                });
              state.snackbar = {
                text: "成功读取数据",
                color: "success",
                display: true
              };
            }
          }
        })
        .catch(error => {
          console.log(error);
          state.snackbar = {
            text: "无法获取数据",
            color: "error",
            display: true
          };
        })
        .finally(() => {
          state.loading.loading = false;
          console.log(state.users);
        });
    },
    insertRecord(state, record: object) {
      // 向总Data中插入一条数据，一般是创建了一个新工单以后调用
      console.log(record);
      state.data.unshift(record);
    },
    getDates(state) {
      axios
        .get("/api/date/")
        .then(({ data }) => {
          state.dates = data;
        })
        .catch(({ response }) => {});
    },
    fetchUser(state, url) {
      // 获取用户信息,仅当本地不存在时候调用
      axios
        .get(url)
        .then(response => {
          // console.log('FETCHUSER:[url]:' + url);
          // state.users[url] = response.data; SEE doc
          Vue.set(state.users, url, response.data);
        })
        .catch(error => {
          console.log(error);
          state.snackbar = {
            text: "无法加载用户信息",
            color: "error",
            display: true
          };
        });
    },
    ifNotFetchUsers(state, url) {
      // 如果本地不存在，则获取该User，比上边的函数多了一个判断
      if ((state.users as any)[url]) return;
      axios
        .get(url)
        .then(response => {
          Vue.set(state.users, url, response.data);
        })
        .catch(error => {
          console.log(error);
          state.snackbar = {
            text: "无法加载用户信息",
            color: "error",
            display: true
          };
        });
    },
    popInfo(state, string) {
      state.snackbar = {
        text: string,
        color: "info",
        display: true
      };
    },
    popSuccess(state, string) {
      state.snackbar = {
        text: string,
        color: "success",
        display: true
      };
    },
    popError(state, string) {
      state.snackbar = {
        text: string,
        color: "error",
        display: true
      };
    },
    clearData(state) {
      state.data = [];
      state.dataStore = { next: null };
      state.users = {};
    }
  },
  actions: {
    updateUser({ commit }) {
      commit("loading");
      commit("updateUser", {
        thenFun: () => {
          commit("popSuccess", "提交成功");
        },
        catchFun: () => {
          // console.log(error);
          commit("popError", "提交失败");
        },
        finallyFun: () => commit("loaded")
      });
    },
    initData({ commit }) {
      commit("loading");
      axios
        .get("/api/user/")
        .then(({ data }) => {
          commit("getUser", data);
          commit("getWorkers");
          commit("getCampus");
          commit("getDates");
          commit("getData", "/api/records/");
        })
        .catch(error => console.log(error))
        .finally(() => commit("loaded"));
    },
    insertRecord({ commit }, record) {
      if (record.user) commit("ifNotFetchUsers", record.user);
      commit("insertRecord", record);
    }
  }
});
