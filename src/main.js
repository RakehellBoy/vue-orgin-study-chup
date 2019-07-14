/* eslint-disable no-new */
// import '@babel/polyfill'
import Vue from "vue";
import App from "./App";
import router from "./router";

new Vue({
  el: "#app",
  router,
  ...App
});
