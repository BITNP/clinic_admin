import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "profile" */ "./views/Profile.vue")
    },
    {
      path: "/schedule",
      name: "schedule",
      component: () =>
        import(/* webpackChunkName: "schedule" */ "./views/Schedule.vue")
    },
    {
      path: "/announcement",
      name: "announcement",
      component: () =>
        import(
          /* webpackChunkName: "announcement" */ "./views/Announcement.vue"
        )
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
