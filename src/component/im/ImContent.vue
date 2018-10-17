<template>
    <div>
        <Modal v-model="im_modal" draggable scrollable title="聊天" >
            <p slot="header" style="text-align:center">
                <span>{{to_user.name}}</span>
            </p>
            <div ref="imContent" style="text-align:center;height: 270px;overflow-y: auto;margin: -16px;padding: 10px 5px" >
                <div v-for="(msg,index) in msg_list" >
                    <div  style="float: left;text-align: left" v-if="msg.msg_from_id !== from_user.id" >
                        <div style="display:inline-block;vertical-align:top;height: 100%;float: left">
                            <Avatar v-if="msg.msg_from_content.icon == '' || msg.msg_from_content.icon == undefined" icon="ios-person" />
                            <Avatar v-else :src="msg.msg_from_content.icon" />
                        </div>
                        <div style="display:inline-block;vertical-align:top;margin: 0 0 0 10px">
                            <div style="margin-left: 8px">
                                {{msg.msg_from_content.name}}
                            </div>
                            <div class="bubbleItem " v-if="msg.msg_content_type == 'im_text'" style="width: 280px">     <!--左侧的泡泡-->
                                <span class="bubble leftBubble" style="text-align: left">
                                    {{msg.msg_content.text}}
                                    <!--<span class="bottomLevel"></span>-->
                            <span class="topLevel" ></span>
                        </span>
                            </div>
                            <div v-else>
                                <img :src="imgUrl(msg.msg_content.file_name)" style="max-width: 200px;max-height: 150px"  :preview="index"/>
                            </div>
                        </div>
                    </div>
                    <!--右侧消息-->
                    <div  style="float: right;margin: 5px 0" v-else>
                        <div style="display:inline-block;vertical-align:top;height: 100%;float: right">
                            <Avatar v-if="msg.msg_to_content.icon == '' || msg.msg_to_content.icon == undefined" icon="ios-person" />
                            <Avatar v-else :src="msg.msg_to_content.icon" />
                        </div>
                        <div style="display:inline-block;vertical-align:top;margin: 0 10px 0 0">
                            <div style="text-align: right;margin-right: 8px">
                                {{msg.msg_to_content.name}}
                            </div>
                            <div class="bubbleItem " v-if="msg.msg_content_type == 'im_text'" style="width: 280px">     <!--右侧的泡泡-->
                                <span class="bubble rightBubble" style="background: #eeeeee;text-align: left">
                                    {{msg.msg_content.text}}
                                    <!--<span class=""></span>-->
                                    <span class="topLevel" style="border-top:10px solid #eeeeee;"></span>
                                </span>
                            </div>
                            <div v-else>
                                <img :src="imgUrl(msg.msg_content.file_name)" style="max-width: 200px;max-height: 150px"  :preview="index"/>
                            </div>
                        </div>
                    </div>
                    <div style="clear:both;"></div>
                </div>
            </div>
            <div slot="footer" style="margin: -5px -16px">
                <div class="wrapper" >
                    <!---->
                    <!--emoji-->
                    <EmojiPicker @emoji="insert" :search="search">
                        <div class="emoji-invoker" slot="emoji-invoker" slot-scope="{ events }" v-on="events" style="float: left">
                            <Icon type="ios-happy-outline" size="24" />
                        </div>
                        <div slot="emoji-picker" slot-scope="{ emojis, insert, display }" >
                            <div class="emoji-picker" >
                                <div>
                                    <div v-for="(emojiGroup, category) in emojis" :key="category">
                                        <h5>{{ category }}</h5>
                                        <div class="emojis">
                                            <span v-for="(emoji, emojiName) in emojiGroup" :key="emojiName" @click="insert(emoji)" :title="emojiName">{{ emoji }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </EmojiPicker>
                    <input type="file" ref="img_file" style="display:none;" @change="sendImg" >
                    <Icon type="ios-image-outline" size="24" @click="openImgFile" />
                    <div style="float: right;" @click="openDrawer">
                        历史消息
                    </div>
                </div>
                <div >
                    <textarea ref="InputText"  style="border: white 0 solid ;height: 80px;width: 100%;font-size: 16px"  v-focus v-model="im_text"></textarea>
                </div>
                <div style="margin-top: 5px">
                    <Button @click="closeMedal">关闭</Button>
                    <Button type="primary" @click="sendTxt" >发送</Button>
                </div>
            </div>
        </Modal>

        <Drawer width="300" title="历史消息" :closable="false" v-model="show_drawer">
            <div style="height: 95%;overflow-y: auto;margin-bottom: 10px">
                <!-- Left -->
                <div v-for="(msg,index) in history_msg_list">
                    <div style="padding: 5px 0">
                        <div>{{msg.msg_from_content.name == '' ? '未知': msg.msg_from_content.name}} - {{msg.created_at | formatDate}}</div>
                        <div>
                            <span style="font-size: 16px" v-if="msg.msg_content_type == 'im_text'">
                            {{msg.msg_content.text}}
                            </span>
                            <span v-else>
                            <img :src="imgUrl(msg.msg_content.file_name)" style="max-width: 200px;max-height: 150px" :preview="index"/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <Page :total="Total" :page-size="page_size"  :current="page_num" @on-change="historyMsgList"  />
        </Drawer>
    </div>
</template>

<script>

    import utils from "../../assets/js/utils";
    import ReconnectingWebSocket from 'reconnecting-websocket';
    const browserMD5File = require('browser-md5-file');
    import EmojiPicker from 'vue-emoji-picker';
    import im from '../../assets/js/im';
    export default {
        name: "list",
        inject:["reload"],
        props:['im_from_user','im_to_user','is_open','im_base_img_path','im_ws_url','im_msg_type','im_msg_list','im_history_msg_list','im_history_msg_total'],
        components:{
            EmojiPicker
        },
        data() {
            return {
                baseImgUrl: this.im_base_img_path,
                wsUrl: this.im_ws_url,
                msg_list:this.im_msg_list,
                history_msg_list:this.im_history_msg_list,
                Total:this.im_history_msg_total,
                from_user: this.im_from_user,
                to_user:this.im_to_user,
                msg_type:this.im_msg_type,
                im_text: '',
                im_modal:false,
                rws:'',
                show_drawer:false,
                search: '',
                page_num:1,
                page_size:20,
                time:0
            }
        },
        directives: {
            focus:function (el) {
                el.focus();
            }
        },
        filters: {
            formatDate(time) {
                return utils.formatDateTime(time);
            },
        },
        computed: {
            imgUrl(){
                return function(url){
                    console.log('url');
                    console.log(url);
                    if(url != undefined){
                        if(url.indexOf("blob") != -1){
                            return  url;
                        }else {
                            return (this.baseImgUrl + url);
                        }
                    }
                }
            }
        },
        mounted: function(){
            this.WS();
        },
        watch:{
            im_msg_list:function(val){
                this.msg_list = val;
            },
            im_history_msg_list: function(val){
                console.log('im_history_msg_list');
                console.log(val);
                this.history_msg_list = val;
            },
            im_history_msg_total: function(val){
                this.Total = val;
            },
            msg_list: function () {
                this.$nextTick(() => {
                    this.$refs.imContent.scrollTop = this.$refs.imContent.scrollHeight
                })
            },
            im_to_user: function (val) {
                console.log("im_to");
                this.to_user = val;
            },
            im_base_img_path:function(val){
                this.baseImgUrl = val;
            },
            im_ws_url:function(val){
                this.wsUrl = val;

            },
            im_msg_type:function (val) {
                this.msg_type = val;
            }
        },
        methods:{
            openImMedal: function(){
                this.im_modal = true;
            },
            closeMedal: function(){
                this.im_modal = false;
            },
            openDrawer: function(){
                this.show_drawer = true;
                this.$emit('historyMsgList',this.dataH());
            },
            dataH : function(){
                let data = {};
                data.msgType = this.msg_type;
                data.fromId = this.from_user.id;
                data.toId = this.to_user.id;
                data.pageNum = this.page_num;
                data.pageSize = this.page_size;
                return data;
            },
            historyMsgList: function(){
                this.$emit('historyMsgList',this.dataH());
            },
            insert: function(emoji) {
                console.log(emoji);
                this.im_text += emoji
            },
            WS:function(){
                this.rws = new ReconnectingWebSocket(this.wsUrl);
                this.rws.addEventListener('open', () => {
                    this.msgSend('client','im_text',im.msgTextContent('连接'),'');
                    console.log('连接')
                });
                this.rws.addEventListener('message', (msg) => {
                   console.log(msg.data);
                   let msgData = JSON.parse(msg.data);
                    console.log(msgData);
                   if(msgData.msg_type == 'client'){

                   }else if(msgData.msg_type == 'p2p'){
                       if((this.to_user.id == msgData.msg_to_id && this.from_user.id == msgData.msg_from_id) ||
                           (this.to_user.id == msgData.msg_from_id && this.from_user.id == msgData.msg_to_id) ){
                           this.msg_list.push(msgData);
                       }
                   }else if(msgData.msg_type == 'group'){
                        if(this.to_user.id == msgData.msg_to_id){
                            this.msg_list.push(msgData);
                        }
                   }
                });
            },
            sendTxt: function(){
                console.log('im_text');
                if(this.im_text.length <= 0){
                    this.$Message.error('内容不能为空');
                    return;
                }
                if(this.im_text.length >= 2000){
                    this.$Message.error('内容太长,请改为其他方式发送');
                    return;
                }
                if(this.msg_type == 'p2p'){
                    this.msgSend('p2p','im_text',im.msgTextContent(this.im_text),'');
                }else if(this.msg_type == 'group'){
                    this.msgSend('group','im_text',im.msgTextContent(this.im_text),'');
                }
                this.im_text = '';
            },
            openImgFile: function(){
                this.$refs.img_file.click();
            },
            sendImg: function(){
                let _this = this;
                let file = this.$refs.img_file.files[0];
                let filename = '';
                let imgUrl = utils.getObjectURL(file);
                if(file == undefined || file == null){
                    return;
                }
                let fileType = file.name.substring(file.name.lastIndexOf('.')+1,file.name.length);
                if(fileType == undefined || fileType == null || fileType == ""){
                    this.$Message.error('文件不能为空');
                    return;
                }else if(fileType.toLocaleLowerCase() != 'jpg' && fileType.toLocaleLowerCase() != 'jpeg' && fileType.toLocaleLowerCase() != 'png'){
                    this.$Message.error('文件格式不支持');
                    return;
                }
                browserMD5File(file, function (err, md5) {
                    filename = md5 + '.' + fileType;
                    console.log(md5); // 97027eb624f85892c69c4bcec8ab0f11
                });
                let reader = new FileReader();
                //以二进制形式读取文件
                reader.readAsArrayBuffer(file);
                //文件读取完毕后该函数响应
                reader.onload = function loaded(evt) {
                    console.log("file");
                    let binaryString = evt.target.result;
                    let x = new Uint8Array(binaryString);
                    console.log(binaryString);
                    let arr = [].slice.call(x);
                    console.log(arr);
                    if(_this.msg_type == 'p2p'){
                        _this.msgSend('p2p','im_img',im.msgImgContent(filename,file.length,arr),imgUrl);
                    }else if(_this.msg_type == 'group'){
                        _this.msgSend('group','im_img',im.msgImgContent(filename,file.length,arr),imgUrl);
                    }
                }
            },
            msgSend: function (msgType,msgContentType,msgContent,fileUrl) {
                let msg = im.msg(this.from_user,this.to_user,msgType,msgContentType,msgContent);
                this.rws.send(JSON.stringify(msg));
                if(msgType != 'client'){
                    if(msgContentType == 'im_img'){
                        msg.msg_content.file_name = fileUrl;
                    }
                    this.msg_list.push(msg);
                }
            }
        }
    }
</script>

<style scoped>
    @import '../../assets/css/im.css';
    /*emoji样式*/
    .wrapper {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 24px;
        text-align:left;
        margin-bottom: 5px;
        padding: 0 5px;
    }
    .emoji-invoker {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
    }
    .emoji-invoker:hover {
        transform: scale(1.1);
    }
    .emoji-picker {
        position: absolute;
        top: -10rem;
        z-index:2;
        font-size: 16px;
        border: 1px solid #ccc;
        width: 25rem;
        height: 10rem;
        overflow-y: auto;
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 0.5rem;
        background: #fff;
        box-shadow: 1px 1px 8px #c7dbe6;
    }
    .emoji-picker__search {
        display: flex;
    }
    .emoji-picker__search > input {
        flex: 1;
        border-radius: 10rem;
        border: 1px solid #ccc;
        padding: 0.5rem 1rem;
        outline: none;
    }
    .emoji-picker h5 {
        margin-bottom: 0;
        color: #b1b1b1;
        text-transform: uppercase;
        font-size: 0.8rem;
        cursor: default;
    }
    .emoji-picker .emojis {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .emoji-picker .emojis:after {
        content: "";
        flex: auto;
    }
    .emoji-picker .emojis span {
        padding: 0.2rem;
        cursor: pointer;
        border-radius: 5px;
    }
    .emoji-picker .emojis span:hover {
        background: #ececec;
        cursor: pointer;
    }
</style>