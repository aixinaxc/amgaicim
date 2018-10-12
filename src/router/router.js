import Login from '../component/login/login.vue';
import ImList from '../component/im/ImTest.vue';

export const pageLogin = {
    path: '/',
    name: 'Login',
    component: Login
};

export const pageIm = {
    path: '/im',
    name: 'im',
    component: ImList
};

export const routers = [
    pageLogin,pageIm
];
