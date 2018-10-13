import Login from '../component/login/login.vue';
import ImList from '../component/im/ImTest.vue';
import MobileImTest from '../component/im/MobileImTest.vue'
import mobilIMGroupNumberLIst from   '../component/im/MobileImGroupNumberList.vue'
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

export const pageMobileIm = {
    path: '/mobilim',
    name: 'MobileImTest',
    component: MobileImTest
};

export const pageMobilIMGroupNumberLIst = {
    path: '/mobilIMGroupNumberLIst',
    name: 'mobilIMGroupNumberLIst',
    component: mobilIMGroupNumberLIst
};

export const routers = [
    pageLogin,pageIm,pageMobileIm,pageMobilIMGroupNumberLIst
];
