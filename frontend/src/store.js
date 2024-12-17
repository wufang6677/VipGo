import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate"

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    globalVideoList: [],
    lastPlayVideoInfo: {},
    homePageUrls: [],
    downloadProgressList: []
  },
  mutations: {
    setGlobalVideoList(state, value) {
      state.globalVideoList = value
    },
    setLastPlayVideoInfo(state, value) {
      state.lastPlayVideoInfo = value
    },
    addHomePageUrls(state, value) {
      state.homePageUrls.push(value)
    },
    deleteHomePageUrls(state, value) {
      state.homePageUrls = state.homePageUrls.filter(item => value['url'] !== item['url'])
    },
    addDownloadProgressList(state, value) {
      let isExist = false
      for (let i = 0; i < state.downloadProgressList.length; i++) {
        if (state.downloadProgressList[i]['fileName'] === value['fileName']) {
          isExist = true
        }
      }
      if (!isExist) {
        state.downloadProgressList.push(value)
      }
    },
    deleteDownloadProgressList(state, value) {
      state.downloadProgressList = state.downloadProgressList.filter(item => value['url'] !== item['url'])
    },
    updateDownloadProgressList(state, value) {
      for (let i = 0; i < state.downloadProgressList.length; i++) {
        if (state.downloadProgressList[i]['url'] === value['url']) {
          state.downloadProgressList[i] = value
          return
        }
      }
    }
  },
  actions: {},
});
