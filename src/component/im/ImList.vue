<template>
    <div>
        <div class="imbutton" @click="listShow">
            IM界面
        </div>
        <Card class="listStyle"  :style="list_show">
            <div class="userHead">
                <Avatar v-if="from_user.icon == '' || from_user.icon == undefined" icon="ios-person" />
                <Avatar v-else :src="from_user.icon" />
                <span >{{from_user.name}}</span>
                <Icon type="ios-close" size="36" style="float: right;" @click="listShow"/>
            </div>
            <div class="userBody">
                <Tabs style="height: 400px">
                    <TabPane label="好友" style="height: 330px">
                        <div style="height:100%;overflow-y: auto">
                            <div>
                                <div class="userList" @click="isShow">
                                    <Icon :type="user_style == false ? 'ios-arrow-forward': 'ios-arrow-down' " />
                                    我的好友
                                </div>
                                <div  v-for="(touser,index) in user_list"  class="show" v-show="user_style == true" @click="openImContent(touser,'p2p')"
                                     onmouseover="this.className='showBackground'" onmouseout="this.className='show'">
                                    <Avatar v-if="touser.icon == '' || touser.icon == undefined" icon="ios-person" />
                                    <Avatar v-else :src="touser.icon" />
                                    <span >{{touser.name}}</span>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane label="群组" style="height: 330px">
                        <div style="height:100%;overflow-y: auto">
                            <div>
                                <div class="userList" @click="isGroupShow">
                                    <Icon :type="group_style == false ? 'ios-arrow-forward': 'ios-arrow-down' " />
                                    我的群组
                                </div>
                                <div v-for="(group,index) in group_list" class="show" v-show="group_style == true"  @click="openImContent(group,'group')"
                                     onmouseover="this.className='showBackground'" onmouseout="this.className='show'">
                                    <Avatar v-if="group.icon == '' || group.icon == undefined" icon="ios-person" />
                                    <Avatar v-else :src="group.icon" />
                                    <span >{{group.name}}</span>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane label="记录" style="height: 330px">
                        <div class="show" v-for="(h,index) in history_list"  @click="openImContent(h,h.type)"
                             onmouseover="this.className='showBackground'" onmouseout="this.className='show'">
                            <Avatar v-if="h.icon == '' || h.icon == undefined" icon="ios-person" />
                            <Avatar v-else :src="h.icon" />
                            <span >{{h.name}}</span>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
            <ImContent ref="ImContent" :im_to_user="to_user" :im_from_user="from_user" :im_base_img_path="base_img_path" :im_ws_url="ws_url"
                       :im_msg_type="msg_type" :im_msg_list="msg_list" :im_history_msg_list="history_msg_list" :im_history_msg_total="Total"
                       @historyMsgList="historyMsgList"></ImContent>
        </Card>
    </div>

</template>

<script>
    import ImContent from './ImContent.vue';
    export default {
        name: "ImList",
        props:['im_user_list','im_from_user','im_group_list','im_base_img_path','im_ws_url','im_msg_list','im_history_msg_list','im_history_msg_total'],
        components:{
            ImContent
        },
        data() {
            return {
                from_user: this.im_from_user,
                to_user:{},
                base_img_path: this.im_base_img_path,
                ws_url: this.im_ws_url,
                user_style:false,
                group_style:false,
                user_list:this.im_user_list,
                group_list: this.im_group_list,
                msg_list:this.im_msg_list,
                history_msg_list:this.im_history_msg_list,
                Total:this.im_history_msg_total,
                list_show:'display:none',
                msg_type:'p2p',
                history_list: []
            }
        },
        mounted: function(){
            let hm =  localStorage.getItem('history_msg');
            if(hm != undefined){
                this.history_list = JSON.parse(hm);
                console.log('history_list');
                console.log(hm)
            }
        },
        watch:{
            im_user_list:function (val) {
                this.user_list = val;
            },
            im_group_list:function (val) {
                this.group_list = val;
            },
            im_msg_list:function(val){
                this.msg_list = val;
            },
            im_history_msg_list: function(val){
                this.history_msg_list = val;
            },
            im_history_msg_total: function(val){
                this.Total = val;
            },
        },
        methods:{
            isShow:function () {
                if(this.user_style == false){
                    this.user_style = true;
                }else{
                    this.user_style = false;
                }
            },
            isGroupShow:function(){
                if(this.group_style == false){
                    this.group_style = true;
                }else{
                    this.group_style = false;
                }
            },
            listShow:function(){
                if(this.list_show == 'display:none'){
                    this.list_show = 'display:block';
                }else{
                    this.list_show = 'display:none';
                }
            },
            openImContent: function (toUser,msgType) {
                this.msg_type = msgType;
                if(msgType == 'p2p'){
                    toUser.type = 'p2p';
                }else if(msgType == 'group'){
                    toUser.type = 'group';
                }
                this.to_user = toUser;
                this.msg_list = [];
                this.$emit('msgList', this.dataH());
                this.historyMsg();
                this.$refs.ImContent.im_modal = true;
            },
            historyMsgList: function(data){
                this.$emit('historyMsgList', data);
            },
            historyMsg: function(){
                let hm = localStorage.getItem('history_msg');
                let nhm = new Array();
                if(hm != undefined || hm != null){
                    nhm = JSON.parse(hm);
                    console.log(nhm);
                    for(let i=0;i<nhm.length;i++){
                        if(nhm[i].id == this.to_user.id){
                            nhm.splice(i,1)
                        }
                    }
                }
                nhm.unshift(this.to_user);
                this.history_list = nhm;
                localStorage.setItem('history_msg',JSON.stringify(nhm))
            },
            dataH : function(){
                let data = {};
                data.msgType = this.msg_type;
                data.fromId = this.from_user.id;
                data.toId = this.to_user.id;
                data.pageNum = 1;
                data.pageSize = 10;
                return data;
            },
        }
    }
</script>

<style scoped>
    .userHead{
        width: 100%;
        height: 48px;
    }
    .userBody{
        width: 100%;
        height: 100%;
        background: white;
    }
    .listStyle{
        width: 270px;
        height: 450px;
        z-index: 1000;
        position: fixed ! important;
        right: 0;
        bottom: 0;
    }

    .userList {
        height: 24px;
    }

    .show{
        padding: 5px;
        display: block;
    }

    .showBackground{
        padding: 5px;
        display: block;
        background:#DEDEDE;
    }

    .display{
        padding: 5px;
        display: none;
    }

    .imbutton{
        width: 150px;
        height: 48px;
        border: mediumslateblue 1px solid;
        background: lightseagreen;
        text-align: center;
        font-size: 18px;
        line-height:48px;
        z-index: 1000;
        position: fixed ! important;
        right: 20px;
        bottom: 15px;
    }
</style>