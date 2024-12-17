<template>
  <a-layout id="app-menu">
    <a-layout-sider
      theme="light"
      class="layout-sider">
      <a-menu
        theme="light"
        mode="inline"
        :selectedKeys="[current]"
        @click="changeMenu">
        <a-menu-item v-for="(menuInfo, subIndex) in menu" :key="subIndex">
          <router-link :to="{ name: menuInfo.pageName, params: menuInfo.params}">
            <span>{{ menuInfo.title }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import subMenu from '@/router/subMenu';

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      menu: {},
      current: 'menu_100',
      keys: []
    };
  },
  watch: {
    id: function () {
      this.current = 'menu_100';
      this.menuHandle();
    },
  },
  created() {
    this.menuHandle();
  },
  mounted() {

  },
  methods: {
    menuHandle() {
      console.info("=====menuHandle============")
      this.menu = subMenu[this.id];
      const data = this.getLinkInfo(this.menu, this.$route.name);
      this.current = data.key
      const linkInfo = data.data;
      this.$router.push({
          name: linkInfo.pageName,
          state: linkInfo.params,
          params: linkInfo.params,
        }
      );
    },
    changeMenu(e) {
      this.current = e.key;
    },
    getLinkInfo(menu, name) {
      for (const key in menu) {
        if (menu[key]['pageName'] === name) {
          return {data: menu[key], key: key}
        }
      }
      return {data: {}, key: ''}
    }
  }
};
</script>
<style lang="less" scoped>
#app-menu {
  height: 100%;
  text-align: center;

  .layout-sider {
    border-top: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    background-color: #FAFAFA;
    overflow: auto;
  }
}
</style>
