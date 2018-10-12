import Vue from 'vue';
import VueRouter from 'vue-router';
import { routers } from './router';

// 全局注册
Vue.use(VueRouter);

// 路由配置
const routerConfig = {
    // mode: history,
    routes: routers
};

// 创建 router 实例，然后传 `routes` 配置
export const router = new VueRouter(routerConfig);
