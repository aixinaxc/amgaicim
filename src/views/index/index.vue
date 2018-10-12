<template>
    <div class="main">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script>
export default {
    provide (){
        return{
            reload : this.reload
        }
    },
    data() {
        return {
            isRouterAlive : true
        }
    },
    methods:{
        reload : function () {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            })
        }
    }
}
</script>

<style lang=less>
    html,body {
        * {
            margin: 0;
            padding: 0;
        }
        width: 100%;
        height: 100%;
        .main {
            width: 100%;
            height: 100%;
        }
    }
</style>
