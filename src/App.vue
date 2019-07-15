<template>
  <div>
    <img src="./assets/logo.png" />
    <div v-for="item in list" :key="item">{{ item }}</div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      list: [1, 'chup', 3, 4, 5]
    }
  },
  created() {
    console.log('this is a vue app')
  }
}
</script>

<style lang="stylus" scoped>
h2 {
  background-color: red;
}
</style>
