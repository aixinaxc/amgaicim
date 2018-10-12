<template>
    <div class="loginbackground">
        <Card class="login">
            <p slot="title">
                欢迎登录
            </p>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" >
                <FormItem prop="user" style="width: 100%">
                    <Input type="text" v-model="formInline.user" placeholder="Username" style="width: 100%">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password" style="width: 100%">
                    <Input type="password" v-model="formInline.password" placeholder="Password" style="width: 100%">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem style="width: 100%">
                    <Button type="primary" @click="login('formInline')" style="width: 100%">登录</Button>
                </FormItem>
            </Form>

        </Card>
    </div>
</template>

<script>
    import md5 from 'js-md5';
    export default {
        data() {
            return {
                imgSrc: require("../../assets/img/loginbackground.jpeg"),
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码必须大于6位', trigger: 'blur' }
                    ]
                },
            }
        },
        mounted: function(){
            const user = localStorage.getItem("user");
            if (user !== undefined && user !== null && user !== "") {
                this.$router.push({path: '/im'});
            }
        },
        methods: {
            login: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        console.log(md5('123456'));
                        this.formInline.password = md5(this.formInline.password);
                        console.log('new');
                        console.log(this.formInline);
                        this.$http.post("/login",{
                            username: this.formInline.user,
                            password: this.formInline.password
                        })
                            .then(res=>{
                                console.log("res:");
                                console.log(res.data);
                                localStorage.setItem("user",JSON.stringify(res.data));
                                this.$router.push({path: '/im'})
                            })
                            .catch(err=>{
                                console.log(err)
                            });
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        }
    }
</script>

<style  scoped>


    .loginbackground {
        height: 100%;
        background: url("../../assets/img/loginbackground.jpeg") no-repeat;
        background-size: 100% 100%;
    }
    .login {
        width: 300px;
        height: 250px;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

</style>