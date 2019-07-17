<template>
  <div class="hello">
    <h1>{{ msg  }}</h1>
    <h2>{{ name }}</h2>
  </div>
</template>

<script>
         export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    name() {
      return 'chupeng'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
h1, h2 {
  font-weight: normal;
}
</style>
