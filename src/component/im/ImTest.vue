<template>
    <div>
        <ImList :im_user_list="user_list" :im_from_user="user" :im_group_list="group_list" :im_base_img_path="base_img_path"
                :im_ws_url="ws_url" :im_msg_list="msg_list" :im_history_msg_list="history_msg_list" :im_history_msg_total="Total"
                @msgList="msgList" @historyMsgList="historyMsgList"></ImList>
    </div>
</template>

<script>
    import ImList from './ImList.vue'
    export default {
        name: "ImTest",
        components:{
            ImList,
        },
        data() {
            return {
                user_list:[],
                group_list:[],
                msg_list:[],
                user: {},
                history_msg_list:[],
                Total:0,
                base_img_path:'http://192.168.2.223:9001/img/',
                ws_url:'ws://192.168.2.223:9001/ws',
            }
        },
        mounted: function(){
            let usernew = JSON.parse(localStorage.getItem("user"));
            this.user.id = usernew.UserId;
            this.user.name = usernew.UserUsername;
            this.userList();
            this.groupList();
        },
        methods:{
            userList: function(){
                this.$http.get("/user/list",{
                    params: {
                        page_num: this.pageNum,
                        page_size: this.pageSize
                    }
                    })
                    .then(res=>{
                        let list = [];
                        for(let i=0;i<res.data.length;i++){
                            let d = {};
                            d.id = res.data[i].user_id;
                            d.name = res.data[i].user_username;
                            d.icon = res.data[i].user_icon;
                            list.push(d);
                        }
                        this.user_list = list;
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            groupList: function () {
                this.$http.get("/group/list",{
                    params: {
                        page_num: this.pageNum,
                        page_size: this.pageSize
                    }
                     })
                    .then(res=>{
                        let list = [];
                        for(let i=0;i<res.data.length;i++){
                            let d = {};
                            d.id = res.data[i].group_id;
                            d.name = res.data[i].group_name;
                            d.icon = res.data[i].group_icon;
                            list.push(d);
                        }
                        this.group_list = list;
                    })
                    .catch(err=>{
                        console.log(err)
                    });
            },
            msgList: function(data){
                this.$http.get("/msg_list",{
                    params: {
                        msg_from_id:  data.fromId,
                        msg_to_id: data.toId,
                        start_time:0,
                        end_time:0,
                        page_num:data.pageNum,
                        page_size:data.pageSize,
                        msg_type:data.msgType
                    }
                     })
                    .then(res=>{
                        console.log(res.data);
                        this.msg_list = res.data;
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            },
            historyMsgList: function(data){
                this.$http.get("/msg_list",{
                    params: {
                        msg_from_id:  data.fromId,
                        msg_to_id: data.toId,
                        start_time:0,
                        end_time:0,
                        page_num:data.pageNum,
                        page_size:data.pageSize,
                        msg_type:data.msgType
                    }
                })
                    .then(res=>{
                        console.log(res.data);
                        this.Total = res.total;
                        this.history_msg_list = res.data;
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            }
        }
    }
</script>

<style scoped>

</style>