<template>
    <div style="height: 100%;">
        <div class="topTitle" >
            <span  style="float: left;" @click="back"><Icon type="ios-arrow-back" size="24"/></span>
            <span style="font-size: 20px;vertical-align:middle">群组成员</span>
        </div>
        <div   class="show" v-for="(h,index) in group_number_list"  @click="openImContent(h,h.type)"
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
        props:['im_group_number_list'],
        data() {
            return {
                group_number_list:[{id:111,name:111},{id:222,name:222}],
                from_user: {},
                to_user:{},
            }
        },
        watch:{
            im_group_number_list: function (val) {
                this.group_number_list = val;
            }
        },
        methods: {
            back: function(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped>
    .topTitle{
        width:100vw;
        height: 36px;
        text-align: center;
        padding: 0 5px;
        line-height: 36px;
        background: white;
        border-bottom: #dddddd 1px solid;
        z-index: 100
    }
    .show{
        padding: 5px 10px;
        display: block;
    }

    .showBackground{
        padding: 5px 10px;
        display: block;
        background:#DEDEDE;
    }
</style>