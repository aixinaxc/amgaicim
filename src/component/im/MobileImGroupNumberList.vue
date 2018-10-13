<template>
    <div style="height: 100%;">
        <div  class="show" v-for="(h,index) in group_number_list"  @click="openImContent(h,h.type)"
             onmouseover="this.className='showBackground'" onmouseout="this.className='show'">
            <Avatar v-if="h.icon == '' || h.icon == undefined" icon="ios-person" />
            <Avatar v-else :src="h.icon" />
            <span style="margin-left: 10px">{{h.name}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MobileImGroupNumberList",
        data() {
            return {
                group_number_list:[{id:111,name:111},{id:222,name:222}],
                from_user: {id:'2',name:'bbb'},
                to_user:{id:'1',name:'aaa'},
                msg_type:this.im_msg_type,
            }
        },
        methods: {
            clickGroupUser: function () {

            }
        }
    }
</script>

<style scoped>

    .show{
        padding: 5px;
        display: block;
    }

    .showBackground{
        padding: 5px;
        display: block;
        background:#DEDEDE;
    }
</style>