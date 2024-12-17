<template>
  <div id="app-cross-go">
    <div id="list" style="overflow-y: scroll">
      <a-list-item class="item" v-for="(item, index) in list">
        <div style="display: flex;flex-direction: row;justify-content: space-between;width: 100%">
          <div>
            <div style="color: #29cf74;font-size: 11pt">{{ item.fileName }}</div>
            <div>{{ item.url }}</div>
          </div>
          <div style="align-items: center;display: flex">
            <a-button @click="deleteDownload(item)" size="small"
                      style="margin-left: 10px;margin-right: 10px;">
              删除
            </a-button>
            <a-button @click="startDownload(item)" type="primary" size="small">
              下载
            </a-button>
            <a-button @click="pauseDownload(item)" type="primary" danger size="small"
                      style="margin-left: 10px;margin-right: 10px">
              暂停
            </a-button>
            <a-button @click="playDownload(item)" type="primary" size="small">
              播放
            </a-button>
          </div>
        </div>
        <div v-if="item.percent!==100"
             style="display: flex;align-items: center;width: 100%">
          <a-progress :percent="item.percent" :show-info="false" style="margin-right: 5px"/>
          <div style="width: 60px;margin-right: 5px">
            {{ item.speed }}
          </div>
        </div>
      </a-list-item>
      <a-empty v-if="list.length===0" style="margin-top: 20%;color: #555555;user-select: none" description="暂无数据"/>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {message} from 'ant-design-vue';

export default {
  data() {
    return {
      base_url: '',
      videoUrl: '',
      list: [],
    };
  },
  created() {
    this.base_url = "http://127.0.0.1:3300"
    this.list = this.$store.state.downloadProgressList
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'addDownloadProgressList' ||
        mutation.type === 'deleteDownloadProgressList' ||
        mutation.type === 'updateDownloadProgressList') {
        this.list = this.$store.state.downloadProgressList
      }
    });
    try {
      window.electronApi.getPort().then(port => {
        this.base_url = "http://127.0.0.1" + ":" + port
      })
    } catch (e) {
    }
  },
  mounted() {
  },
  methods: {
    deleteDownload(item) {
      this.$store.commit("deleteDownloadProgressList", item)
    },
    startDownload(item) {
      try {
        let new_item = {
          name: item["fileName"],
          url: item["url"]
        }
        window.electronApi.addDownloadTask(new_item)
      } catch (e) {
        message.info("不支持下载...")
      }
    },
    pauseDownload(item) {
      try {
        let new_item = {
          name: item["fileName"],
          url: item["url"]
        }
        window.electronApi.pauseDownloadTask(new_item)
      } catch (e) {
        message.info("不支持暂停...")
      }
    },
    playDownload(item) {
      this.playDownloadNet(item)
    },

    playDownloadNet(item) {
      let _this = this;
      axios.get(this.base_url + "/api")
        .then(res => {
          const new_data = res.data
          for (let i = 0; i < new_data.length; i++) {
            if (item['fileName'] + ".mp4" === new_data[i]['title']) {
              _this.$router.push({
                name: "Video",
                state: {name: new_data[i]['title']},
              });
              return
            }
          }
          message.info("未下载完成...")
        })
        .catch(err => {
        })
    },
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
  background-color: #eeeeee;

  #list {
    background-color: white;
    width: 100%;
    margin: 10px;
    border-radius: 5px;
  }

  .item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    font-size: 9pt;
    display: flex;
    flex-direction: column;
  }
}
</style>
