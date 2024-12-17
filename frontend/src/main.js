import * as AntIcon from '@ant-design/icons-vue';
import Antd from 'ant-design-vue';
import {createApp} from 'vue';
import App from './App.vue';
import './assets/global.less';
import './assets/theme.less';
import components from './components/global';
import Router from './router/index';
import store from './store';

const app = createApp(App)
app.config.productionTip = false

// components
for (const i in components) {
  app.component(i, components[i])
}

// icon
for (const i in AntIcon) {
  const whiteList = ['createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor', 'default']
  if (!whiteList.includes(i)) {
    app.component(i, AntIcon[i])
  }
}

const new_app = app.use(Antd).use(Router).use(store).mount('#app')

try {
  window.electronApi.openWebPage((data) => {
    new_app.$router.push({
      name: data.url,
      state: {name: data.name},
    });
  })
} catch (e) {
}
try {
  window.electronApi.onUpdateDownloadProgress((data) => {
    // console.log(data)
    if (data && data['percent'] === 100) {
      data['type'] = 3
    }
    new_app.$store.commit("updateDownloadProgressList", data)
  })
} catch (e) {
}
