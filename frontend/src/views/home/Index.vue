<template>
  <div id="app-home">
    <div class="container">
      <div class="a-block-1">
        <div class="a-block-div" @click="open_shell_open()">
          <a-avatar v-if="!is_shell_open" :size="50">open</a-avatar>
          <a-avatar v-if="is_shell_open" :size="50" style="background-color: #7cb305">open</a-avatar>
          <div v-if="!is_shell_open" class="a-block-2">external</div>
          <div v-if="is_shell_open" class="a-block-2" style="color: #7cb305">external</div>
        </div>
        <div class="a-block-div" v-for="(item,index) in urls"
             @mousedown="handleTouchStart(index)"
             @mouseup="handleTouchEnd(index)">
          <a-avatar :src="item['icon_url']" :size="50">{{ item['name'] }}</a-avatar>
          <div class="a-block-2">{{ item['name'] }}</div>
        </div>
        <div class="a-block-div" @click="add_url_open()">
          <a-avatar :size="50">+</a-avatar>
          <div class="a-block-2">添加</div>
        </div>
      </div>

      <a-divider style="height: 1px; background-color: #7cb305;margin: 10px 0"/>

      <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit" :hide-add="true" @change="tab_change"
              style="flex-grow: 1;user-select: none">
        <a-tab-pane v-for="pane in panes" :key="pane.key"
                    :tab="pane.title"
                    :closable="pane.closable">
        </a-tab-pane>
      </a-tabs>
      <iframe class="iframe" :src="open_url"></iframe>
    </div>
    <div>
      <a-modal v-model:visible="visible" title="添加网址" @ok="handleOk">
        <a-input v-model:value="name" placeholder="名称"/>
        <a-input v-model:value="url" style="margin-top: 10px" placeholder="网址"/>
      </a-modal>
    </div>
  </div>
</template>
<script>
import {message, Modal} from 'ant-design-vue';
import axios from 'axios';

export default {
  data() {
    return {
      base_url: "",
      key: "url_record",
      visible: false,
      name: "百度",
      url: "https://www.baidu.com",
      open_url: "https://www.baidu.com",
      urls: [],
      dialog_title: "温馨提示",
      dialog_message: "确认删除?",
      dialog_visible: false,
      panes: [
        {title: '百度', url: 'https://www.baidu.com', key: '1', closable: false},
      ],
      activeKey: "1",
      is_shell_open: false
    };
  },
  created() {
    this.list_net = true
    this.base_url = import.meta.env.VITE_BASE_API_URL
    this.urls = this.$store.state.homePageUrls
    this.get_item()
  },
  methods: {
    get_uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    add_url_open() {
      this.visible = true
    },

    handleOk() {
      this.visible = false
      this.add_item(this.name, this.url)
    },

    add_item(name, url) {
      const item = {"name": name, "url": url}
      const items = [item]

      if (!this.list_net) {
        item['icon_url'] = this.getIco(item.url)
        this.$store.commit("addHomePageUrls", item)
        return
      }

      let params = new URLSearchParams();
      params.append('key', this.key);
      params.append('items', JSON.stringify(items));
      axios.post(this.base_url + "/addItem?" + params.toString())
        .then(res => {
          message.info(res.data.message)
          this.get_item()
        })
        .catch(err => {
          message.error(err)
        })
    },

    delete_item_dialog(item) {
      Modal.confirm({
        title: '温馨提示',
        content: '确认删除?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.delete_item(item)
        }
      });
    },

    delete_item(item) {
      if (!this.list_net) {
        this.$store.commit("deleteHomePageUrls", item)
        this.urls = this.$store.state.homePageUrls
        return
      }

      const items = [item]
      let params = new URLSearchParams();
      params.append('key', this.key);
      params.append('items', JSON.stringify(items));
      axios.post(this.base_url + "/deleteItem?" + params.toString())
        .then(res => {
          message.info(res.data.message)
          this.get_item()
        })
        .catch(err => {
        })
    },

    get_item() {
      let params = new URLSearchParams();
      params.append('key', this.key);
      axios.post(this.base_url + "/getItemAll?" + params.toString())
        .then(res => {
          let data = res.data.data
          for (let i = 0; i < data.length; i++) {
            data[i]['icon_url'] = this.getIco(data[i].url)
          }
          this.urls = data
        })
        .catch(err => {
          this.list_net = false
        })
    },

    open_item(index) {
      let item = this.urls[index]
      let url = item['url']
      if (this.is_shell_open) {
        try {
          window.electronApi.openExternal(url)
        } catch (e) {
        }
        return
      }

      let new_key = this.get_uuid()
      let new_item = {title: item['name'], url: url, key: new_key}
      this.panes.push(new_item)
      this.activeKey = new_key
      this.open_url = url
    },

    handleTouchStart(index) {
      let _this = this;
      _this.timer = setTimeout(() => {
        _this.delete_item_dialog(this.urls[index])
      }, 500);
    },

    handleTouchEnd(index) {
      let _this = this;
      if (_this.timer) {
        clearTimeout(_this.timer);
        _this.timer = null;
        _this.open_item(index)
      }
    },

    onEdit(removeTargetKey) {
      this.panes = this.panes.filter(function (item) {
        return item['key'] !== removeTargetKey;
      });
      this.activeKey = "1"
      this.open_url = this.get_url_by_key(this.panes, this.activeKey)
    },

    tab_change(cTargetKey) {
      this.open_url = this.get_url_by_key(this.panes, cTargetKey)
    },

    get_url_by_key(panes, key) {
      for (let i = 0; i < panes.length; i++) {
        if (key === panes[i]['key']) {
          return panes[i]['url']
        }
      }
      return ""
    },

    getIco(url) {
      const _url = new URL(url);
      return _url.protocol + "//www" + _url.hostname.substring(_url.hostname.indexOf("."), _url.length) + "/favicon.ico"
    },

    open_shell_open() {
      this.is_shell_open = !this.is_shell_open
    }

  }
};
</script>
<style lang="less" scoped>
#app-home {
  padding: 0;
  text-align: left;
  width: 100%;
  height: 100%;
  background-color: #fff;

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .iframe {
    width: 100%;
    height: 100%;
    border-width: 0;
  }

  .a-block-div {
    width: 80px;
    text-align: center;
    padding: 5px;
    user-select: none;
  }

  .a-block-1 {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .a-block-2 {
    width: 70px;
    white-space: nowrap; /* 确保文本在一行内显示 */
    overflow: hidden; /* 隐藏超出容器宽度的文本 */
    text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
    text-align: center;
  }

  .ant-tabs-tabpane {
    height: 100%;
  }
}
</style>
