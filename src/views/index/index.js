import Vue from 'vue';
import iView from 'iview';
import index from './index.vue';
import { router } from '../../router/index';
import store from '../../store/store';
import 'iview/dist/styles/iview.css';
import axios from '../../axios/axiosIndex';

import preview from 'vue-photo-preview';
import 'vue-photo-preview/dist/skin.css';
Vue.use(preview);
Vue.use(iView);

Vue.prototype.$http = axios;

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach(route => {
    iView.LoadingBar.finish();
});

new Vue({ // 创建 vue 实例
  // 提供一个在页面上已经存在的 DOM 元素作为 Vue 实例挂载目标
  el: '#index',
  // 创建和挂载根实例
  router: router,
  // 
  store: store,
  // 声明了 html 中的内容
  render: h => h(index),
})