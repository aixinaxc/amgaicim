<template>
    <div style="height: 100vh">
        <MobileImContent :im_to_user="to_user" :im_from_user="from_user" :im_base_img_path="base_img_path" :im_ws_url="ws_url"
                         :im_msg_type="msg_type" :im_msg_list="msg_list" @mobilIMGroupNumberLIst="mobilIMGroupNumberLIst"></MobileImContent>
    </div>
</template>

<script>
    import MobileImContent from './MobileImContent.vue';
    export default {
        name: "MobileImTest",
        components:{
            MobileImContent
        },
        data() {
            return {
                user_list:[],
                group_list:[],
                msg_list:[],
                from_user: {id:111,name:111},
                to_user:{id:222,name:222},
                msg_type:'p2p',
                history_msg_list:[],
                base_img_path:'http://192.168.2.223:9001/img/',
                ws_url:'ws://192.168.2.223:9001/ws',
            }
        },
        methods:{
            mobilIMGroupNumberLIst: function (data) {
                this.$router.push({
                    path:'/mobilIMGroupNumberLIst',
                    query:data
                })
            }
        }
    }
</script>

<style scoped>

</style>