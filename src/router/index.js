import Vue from "vue";
import Router from "vue-router";
import routes from "./data";
Vue.use(Router);

const router = new Router({
  routes: routes,
  mode: "history"
});

router.beforeEach((to, from, next) => {
  if (!to.fullPath) next();
});

router.afterEach(() => {});

export default router;
