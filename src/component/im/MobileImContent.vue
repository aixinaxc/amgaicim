<template>
    <div style="box-sizing: border-box ;position: relative;height: 100%">
        <div class="topTitle" @click="displayMore">
            <span  style="float: left;" @click="back"><Icon type="ios-arrow-back" size="24"/></span>
            <span style="font-size: 20px;vertical-align:middle">{{to_user.name}}</span>
            <span  style="float: right;" @click="gourpNumber" v-show="show_group == true"><Icon type="ios-people-outline" size="24" /></span>
        </div>
        <div ref="imContent" class="im_content" @click="displayMore">
            <div v-for="(msg,index) in msg_list">
                <!--左侧消息-->
                <div  style="float: left;;max-width: 65vw;clear:both;" v-if="msg.msg_from_id !== from_user.id">
                    <div style="display:inline-block;vertical-align:top;height: 100%;float: left">
                        <Avatar v-if="msg.msg_from_content.icon == '' || msg.msg_from_content.icon == undefined" icon="ios-person" />
                        <Avatar v-else :src="msg.msg_from_content.icon" />
                    </div>
                    <div style="display:inline-block;vertical-align:top;max-width: 50vw;margin: 0 0 0 2vw">
                        <div style="margin-left: 8px">
                            {{msg.msg_from_content.name}}
                        </div>
                        <div class="bubbleItem " v-if="msg.msg_content_type == 'im_text'">     <!--左侧的泡泡-->
                            <span class="bubble leftBubble">
                            {{msg.msg_content.text}}
                            <!--<span class="bottomLevel"></span>-->
                            <span class="topLevel"></span>
                        </span>
                        </div>
                        <div v-else>
                            <img :src="imgUrl(msg.msg_content.file_name)" style="max-width: 50vw;max-height: 40vw"  :preview="index"/>
                        </div>
                    </div>
                </div>
                <!--右侧消息-->
                <div  style="float: right;;max-width: 65vw;clear:both;margin: 5px 0" v-else>
                    <div style="display:inline-block;vertical-align:top;height: 100%;float: right">
                        <Avatar v-if="msg.msg_to_content.icon == '' || msg.msg_to_content.icon == undefined" icon="ios-person" />
                        <Avatar v-else :src="msg.msg_to_content.icon" />
                    </div>
                    <div style="display:inline-block;vertical-align:top;max-width: 50vw;margin: 0 2vw 0 0">
                        <div style="text-align: right;margin-right: 8px">
                            {{msg.msg_to_content.name}}
                        </div>
                        <div class="bubbleItem clearfix" v-if="msg.msg_content_type == 'im_text'">     <!--左侧的泡泡-->
                            <span class="bubble rightBubble">
                            {{msg.msg_content.text}}
                            <!--<span class=""></span>-->
                            <span class="topLevel"></span>
                        </span>
                        </div>
                        <div v-else>
                            <img :src="imgUrl(msg.msg_content.file_name)" style="max-width: 50vw;max-height: 40vw"  :preview="index"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="im_menu">
            <div style="width: 100%;height: 80px;" >
                <input  type="text" style="outline:none;border:none;width: 85vw;height:40px;background: white;float: left;font-size: 16px;padding: 0 6px" v-model="im_text" @click="displayMore"></input>
                <div style="width: 15vw;background: white;height:40px;color: cornflowerblue;float: right;line-height:40px;text-align: center;font-size: 16px" @click="displayMore">
                    <span style="margin-right: 5%" @click="sendTxt">发送</span>
                </div>
                <div style="border-top: 1px #dddddd solid;width: 96vw;float: left;margin: 0 2vw"></div>
                <div class="wrapper" >
                    <EmojiPicker @emoji="insert" :search="search">
                        <div class="emoji-invoker" slot="emoji-invoker" slot-scope="{ events }" v-on="events" style="float: left">
                            <Icon type="ios-happy-outline" size="30"  @click="shoeMore"/>
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
                </div>
                <div style="width: 16vw;background: white;height:36px;float: left;line-height:36px;;text-align: center" @click="displayMore">
                    <input type="file" ref="img_file" style="display:none;" @change="sendImg" >
                    <Icon type="ios-image-outline" size="30" @click="openImgFile" />
                </div>
                <div style="height: 36px;width: 68vw;float: left" @click="displayMore"></div>
            </div>
            <div style="height:200px;" v-show="more_style == true" tabindex = "0"  >

            </div>
        </div>
    </div>
</template>

<script>
    import utils from "../../assets/js/utils";
    import ReconnectingWebSocket from 'reconnecting-websocket';
    const browserMD5File = require('browser-md5-file');
    import EmojiPicker from 'vue-emoji-picker';
    export default {
        name: "MobileImContent",
        components:{
            EmojiPicker
        },
        props:['im_from_user','im_to_user','is_open','im_base_img_path','im_ws_url','im_msg_type','im_msg_list'],
        data() {
            return {
                baseImgUrl: this.im_base_img_path,
                wsUrl: this.im_ws_url,
                msg_list:this.im_msg_list,
                from_user: this.im_from_user,
                to_user:this.im_to_user,
                msg_type:this.msg_type,
                im_text: '',
                rws:'',
                more_style:false,
                show_group:true,
                search:''
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
                    if(url.indexOf("blob") != -1){
                        return  url;
                    }else {
                        return (this.baseImgUrl + url);
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
                if(val == 'p2p'){
                    this.show_group = false;
                }else if(val == 'group'){
                    this.show_group = true;
                }
            }
        },
        methods:{
            back: function(){
                this.$router.go(-1);
            },
            gourpNumber: function(){
                /*this.$router.push({
                    path:'/mobilIMGroupNumberLIst',
                    query:this.dataH()
                })*/
                this.$emit('mobilIMGroupNumberLIst',this.dataH());
            },
            dataH : function(){
                let data = {};
                data.msgType = this.msg_type;
                data.fromId = this.from_user.id;
                data.toId = this.to_user.id;
                return data;
            },
            shoeMore: function(){
                console.log('==============');
                if(this.more_style == false){
                    this.more_style = true;
                }else{
                    this.more_style = false;
                }
            },
            displayMore: function(){
                console.log('==============');
                if(this.more_style == true){
                    this.more_style = false;
                }
            },
            insert: function(emoji) {
                console.log(emoji);
                this.im_text += emoji
            },
            WS:function(){
                this.rws = new ReconnectingWebSocket(this.wsUrl);
                this.rws.addEventListener('open', () => {
                    this.msgSend('client','','im_text',this.msgTextContent('连接'));
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
                console.log(this.msg_type);
                if(this.im_text.length >= 2000){
                    this.$Message.error('内容太长,请改为其他方式发送');
                    return;
                }
                this.msg_type = 'p2p';
                if(this.msg_type == 'p2p'){
                    this.msgSend('p2p',this.to_user.id,'im_text',this.msgTextContent(this.im_text));
                }else if(this.msg_type == 'group'){
                    this.msgSend('group',this.to_user.id,'im_text',this.msgTextContent(this.im_text));
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
                        _this.msgSend('p2p',_this.to_user.id,'im_img',_this.msgImgContent(filename,file.length,arr),imgUrl);
                    }else if(_this.msg_type == 'group'){
                        _this.msgSend('group',_this.to_user.id,'im_img',_this.msgImgContent(filename,file.length,arr),imgUrl);
                    }
                }
            },
            msgSend: function (msgType,toUserId,msgContentType,msgContent,fileUrl) {
                let msg = {};
                msg.msg_id = utils.uuid();
                msg.msg_type = msgType;
                msg.msg_from_id = this.from_user.id;
                msg.msg_from_content = this.userContent(this.from_user.id,this.from_user.name,this.from_user.icon);
                msg.created_at = utils.time10();
                msg.msg_to_id = toUserId;
                msg.msg_to_content = this.userContent(this.to_user.id,this.to_user.name,this.to_user.icon);
                msg.msg_content_type = msgContentType;
                msg.msg_content = msgContent;
                //this.rws.send(JSON.stringify(msg));
                if(msgType != 'client'){
                    msg.msg_content.file_name = fileUrl;
                    this.msg_list.push(msg);
                }
            },
            userContent:function (id,name,icon) {
                let userContent = {};
                userContent.id = id;
                userContent.name = name;
                userContent.icon = icon;
                return userContent;
            },
            msgTextContent:function (text) {
                let msgContent = {};
                msgContent.text = text;
                return msgContent;
            },
            msgImgContent:function (fileName,fileSize,file) {
                let msgContent = {};
                msgContent.file_name = fileName;
                msgContent.file_size = fileSize;
                msgContent.file = file;
                return msgContent;
            }
        }
    }
</script>

<style scoped>
    @import '../../assets/css/im.css';
    .topTitle{
        width:100vw;
        height: 36px;
        text-align: center;
        padding: 0 5px;
        line-height: 36px;
        background: white;
        position: absolute;
        border-bottom: #dddddd 1px solid;
        z-index: 100
    }
    .im_content {
        width: 100%;
        height: 100%;
        max-height: 100%;
        padding: 45px 1% 80px 1%;
        background: #eeeeee;
        word-break: break-all;
        display: block; /** 将对象作为伸缩盒子模型显示 **/
        overflow: auto; /** 隐藏超出的内容 **/
    }
    .im_menu {
        position: fixed;
        bottom: 0;
        width: 100%;
        min-height: 76px;
        color: #474747;
        background: white;
        align-content: center;
        max-height: 272px;
        z-index: 100;
    }



    /*emoji样式*/
    .wrapper {
        position: relative;
        display: inline-block;
        width: 16vw;
        background: white;
        height:36px;
        float: left;
        line-height:36px;
        text-align: center
    }
    .emoji-invoker {
        width: 16vw;
        height: 16vw;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
    }
    .emoji-invoker:hover {
        transform: scale(1.1);
    }
    .emoji-picker {
        position: absolute;
        top: 40px;
        z-index:2;
        font-size: 16px;
        border-top: 1px solid #ccc;
        width: 100vw;
        height: 200px;
        overflow-y: auto;
        padding: 1px;
        box-sizing: border-box;
        background: #fff;
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