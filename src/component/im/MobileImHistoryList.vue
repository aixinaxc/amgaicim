<template>
    <div>
        <Scroll :on-reach-top="handleReachTop">
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
        </Scroll>
    </div>

</template>

<script>
    export default {
        name: "MobileImHistoryList",
        data() {
            return {
                from_user: this.im_from_user,
                to_user:this.im_to_user,
                msg_type:this.im_msg_type,
                page_num:1,
                page_size:20,
                time:0
            }
        },
        methods: {
            handleReachTop: function () {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const first = this.list2[0];
                        for (let i = 1; i < 11; i++) {
                            this.list2.unshift(first - i);
                        }
                        resolve();
                    }, 2000);
                });
            }
        }
    }
</script>

<style scoped>

</style>