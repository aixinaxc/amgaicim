import utils from './utils.js'

export default {
    msg : function(fromUser,toUser,msgType,msgContentType,msgContent){
        let msg = {};
        msg.msg_id = utils.uuid();
        msg.msg_type = msgType;
        msg.msg_from_id = fromUser.id;
        msg.msg_from_content = this.userContent(fromUser.id,fromUser.name,fromUser.icon);
        msg.created_at = utils.time10();
        msg.msg_to_id = toUser.id;
        msg.msg_to_content = this.userContent(toUser.id,toUser.name,toUser.icon);
        msg.msg_content_type = msgContentType;
        msg.msg_content = msgContent;
        return msg;
    },
    userContent : function (id,name,icon) {
        let userContent = {};
        userContent.id = id;
        userContent.name = name;
        userContent.icon = icon;
        return userContent;
    },
    msgTextContent : function (text) {
        let msgContent = {};
        msgContent.text = text;
        return msgContent;
    },
    msgImgContent : function (fileName,fileSize,file) {
        let msgContent = {};
        msgContent.file_name = fileName;
        msgContent.file_size = fileSize;
        msgContent.file = file;
        return msgContent;
    },
}