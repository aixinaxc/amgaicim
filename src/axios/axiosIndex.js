import axios from 'axios'
import qs from 'qs'
import { Message } from 'iview'
import { router } from '../router/index';
axios.defaults.baseURL = 'http://192.168.2.223:9001';
axios.defaults.withCredentials = false;
axios.defaults.timeout = 100000;

// // axios拦截器
axios.interceptors.request.use(config => {
    let user = localStorage.getItem("user");
    console.log("user:");
    console.log(user);
    if (user != undefined && user != "undefined" && user != null && user != "null" && user != "") {
        let juser = JSON.parse(user);
        if(config.method === "get"){
            if(config.params === undefined){
                config.params = {};
            }
            config.params.user_id = juser.UserId;
            if(config.params.project_id == undefined || config.params.project_id == null || config.params.project_id == ""){
                config.params.project_id = juser.project_id;
            }
            config.params.token = juser.Token;
            console.log("config.params:");
            console.log(config.params);
        }else if(config.method === "post"){
            if(config.data === undefined){
                config.data = {};
            }
            config.data.user_id = juser.UserId;
            config.data.token = juser.Token;
            console.log("config.data:");
            console.log(config.data);
        }
    }
    config.data = qs.stringify(config.data);
    return config
});

axios.interceptors.response.use(response => {
    console.log("response:");
    console.log(response.data);
    // 在这里你可以判断后台返回数据携带的请求码
    if (response.data.code === 200 || response.data.code === '200') {
        return response.data
    } else if(response.data.code === 402 || response.data.code === '402'){
        router.push({path: '/'});
        localStorage.removeItem('user');
        return Promise.reject(response.data.msg);
    }else {
        let msg = response.data.code + " " + response.data.msg;
        Message.warning(msg);
        return Promise.reject(response.data.msg);
    }
});


export default axios