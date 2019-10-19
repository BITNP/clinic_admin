import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

// for django csrf token
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

Vue.use(Vuex);

function newSnackbar(text: string, error = true, color: string = "") {
  if (!color) {
    // if color undefined
    if (error) {
      return {
        text: text ? text : "操作失败",
        display: true,
        color: "error"
      };
    } else {
      return {
        text: text ? text : "操作成功",
        display: true,
        color: "success"
      };
    }
  } else {
    return {
      text,
      display: true,
      color
    };
  }
}

export default new Vuex.Store({
  state: {
    version: "0.13.11",
    count: 0,
    drawer: false,
    loading: {
      loading: true,
      color: "blue"
    },
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
          state.snackbar = newSnackbar("无法获取数据");
        })
        .finally(() => null);
    },
    getCampus(state) {
      // initualize campus
      axios
        .get("/api/campus/")
        .then(({ data }) => {
          let _t = data.map((v: any) => v.name);
          state.campus = _t;
        })
        .catch(error => {
          state.snackbar = newSnackbar("无法获取校区数据");
        });
    },
    getUser(state, user) {
      // save user data to store.js
      state.user = user;
    },
    updateUser(state, { thenFun, catchFun, finallyFun }) {
      // 被action 调用
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
                  state.snackbar = newSnackbar("无法加载用户信息");
                });
              state.snackbar = newSnackbar("成功读取数据", false);
            }
          }
        })
        .catch(error => {
          state.snackbar = newSnackbar("无法获取数据");
        })
        .finally(() => {
          state.loading.loading = false;
        });
    },
    insertRecord(state, record: object) {
      // 向总Data中插入一条数据，一般是创建了一个新工单以后调用
      state.data.unshift(record);
    },
    getDates(state) {
      axios
        .get("/api/date/")
        .then(({ data }) => {
          state.dates = data;
        })
        .catch(({ response }) => {
          state.snackbar = newSnackbar("无法获取date");
        });
    },
    fetchUser(state, url) {
      // 获取用户信息,仅当本地不存在时候调用
      axios
        .get(url)
        .then(response => {
          Vue.set(state.users, url, response.data);
        })
        .catch(error => {
          state.snackbar = newSnackbar("无法加载用户信息");
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
          state.snackbar = newSnackbar("无法加载用户信息");
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
        .catch(error => {
          commit("popError", "无法获取用户信息");
        })
        .finally(() => commit("loaded"));
    },
    insertRecord({ commit }, record) {
      if (record.user) commit("ifNotFetchUsers", record.user);
      commit("insertRecord", record);
    }
  }
});
