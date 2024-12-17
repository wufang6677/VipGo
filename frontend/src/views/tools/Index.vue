<template>
  <div id="app-cross-go">
    <div style="height: 100%;width: 100%">
      <iframe class="iframe" :src="[url]"></iframe>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {url: ''};
  },
  created() {
    this.$data.url = history.state.url
  }
};
</script>
<style lang="less" scoped>
#app-cross-go {
  padding: 0;
  text-align: left;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .iframe {
    width: 100%;
    height: 100%;
    border-width: 0;
  }
}
</style>
