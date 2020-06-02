<template>
    <div class="loginPage page_frame">
        <div class="page_head">
            <h1 v-if="isLogin">用户登录</h1>
            <h1 v-else>用户注册</h1>
            <p>若您有账号可以直接登录，否则点击注册按钮注册后再登录！</p>
        </div>
        <div class="page_content">
            <template v-if="isLogin">
                <div class="formItem">
                    <label>
                        <span>用户名</span>
                        <input type="text" placeholder="请输入用户名或邮箱" v-model.trim="login.name">
                    </label>
                </div>
                <div class="formItem">
                    <label>
                        <span>密码</span>
                        <input type="password" placeholder="请输入密码" v-model.trim="login.key">
                    </label>
                </div>
                <div class="subCode">
                    <button @click="loginToSys">登录</button>
                </div>
                <div class="askToReg">
                    <span>还没有账号？</span>
                    <a href="javascript:void(0)" @click="changeType('sign')">注册一个！</a>
                </div>
                <div class="showSample">
                    <p>
                        您可使用测试账号进行访问，账号：fu ，密码：123456 <br/>
                        若您忘记了账号密码，请使用您的注册邮箱，<b>发送用户名与新密码到：</b> <a href="mailto://aderx@qq.com">aderx@qq.com</a>（点击邮箱地址快速发送邮件）找回。
                    </p>
                </div>
            </template>
            <template v-else>
                <div class="formItem">
                    <label>
                        <span>用户名</span>
                        <input type="text" placeholder="最长可输入20个字符" v-model.trim="register.name">
                    </label>
                </div>
                <div class="formItem">
                    <label>
                        <span>密码</span>
                        <input type="text" placeholder="请输入数字、字母、下划线，6-10字符" v-model.trim="register.key">
                    </label>
                </div>
                <div class="formItem">
                    <label>
                        <span>邮箱</span>
                        <input type="text" placeholder="请完整添加邮箱名称" v-model.trim="register.email">
                    </label>
                </div>
                <div class="subCode">
                    <button @click="signToSys">注册</button>
                </div>
                <div class="askToReg">
                    <span>已有账号？</span>
                    <a href="javascript:void(0)" @click="changeType('log')">立刻登录！</a>
                </div>
            </template>
        </div>
        <msg
                :config="messageBox"
        />
    </div>
</template>

<script>
    export default {
        name: "login",
        data: function () {
            return {
                isLogin: true,
                login:{
                    name:"",
                    key:""
                },
                register:{
                    name:"",
                    key:"",
                    email:""
                },
                messageBox:{
                    show:false
                }
            }
        },
        methods: {
            changeType(t) {
                this.isLogin = (t === "log");
            },
            loginToSys(){
                //信息不能为空
                if(this.login.name === "" || this.login.key === ""){
                    this.messageBox = {
                        show:true,
                        msg:"请确认您已填写所有信息！",
                        cancelText:"好",
                        name:"errBox"
                    };
                    return false;
                }else{
                    let that = this;
                    this.$fetch(
                        'login',
                        JSON.stringify(this.login),
                        (d)=>{
                        if(d.code === 200){
                            //设置登录信息
                            this.$store.login = {name:d.data.name,uId:d.data.id};
                            d.data.dTime ? this.$store.dTime = d.data.dTime:'';
                            this.messageBox = {
                                show:true,
                                msg:"您已成功登录！",
                                cancelText:"好",
                                name:"okBox",
                                func(){
                                    //清空填写的信息
                                    that.login.name = "";
                                    that.login.key = "";
                                    setTimeout(()=>{
                                        //收缩显示面板
                                        that.$parent.hidePage(function(){
                                            //设置首页登录状态
                                            this.loginInfo = this.$store.login;
                                        });
                                    },500);
                                }
                            };

                        }else{
                            this.messageBox = {
                                show:true,
                                msg:"登录失败，请检查您的输入！",
                                cancelText:"好",
                                name:"errBox",
                            };
                        }
                    }
                    )
                    .catch((e)=>{
                        console.error(e);
                        this.messageBox = {
                            show:true,
                            msg:"登录失败！",
                            cancelText:"好",
                            name:"errBox",
                        };
                    })
                }
            },
            signToSys(){
                if(this.register.name === "" || this.register.key === "" || this.register.email === ""){
                    this.messageBox = {
                        show:true,
                        msg:"请确认您已填写所有信息！",
                        cancelText:"好",
                        name:"errBox"
                    };
                    return false;
                }else if(!/^([a-zA-Z0-9]|[_]){6,10}$/.test(this.register.key)){
                    this.messageBox = {
                        show:true,
                        msg:"密码只能包含6到10个，数字、字母、下划线！",
                        cancelText:"好",
                        name:"errBox"
                    };
                    return false;
                }else{
                    let that = this;
                    this.$fetch(
                        'sign',
                        JSON.stringify(this.register),
                        (data)=>{
                            if(data.code === 200){
                                this.messageBox = {
                                    show:true,
                                    msg:"注册成功，请登录！",
                                    cancelText:"好",
                                    name:"okBox",
                                    func(){
                                        //清空填写的信息
                                        that.register.name = "";
                                        that.register.key = "";
                                        that.register.email = "";
                                        setTimeout(()=>{
                                            //切换到登录界面
                                            that.isLogin = true;
                                        },500);
                                    }
                                };
                            }else{
                                this.messageBox = {
                                    show:true,
                                    msg:data.msg,
                                    cancelText:"好",
                                    name:"errBox",
                                };
                            }
                        }
                    )
                        .catch((e)=>{
                            console.error(e);
                            this.messageBox = {
                                show:true,
                                msg:"注册失败！",
                                cancelText:"好",
                                name:"errBox",
                            };
                        })
                }
            }
        }
    }
</script>

<style scoped>
    .log_content {
        margin-top: 30px;
    }

    .subCode button {
        width: 100%;
        height: 40px;
        margin-top: 20px;
    }

    .askToReg {
        margin-top: 30px;
        text-align: center;
    }
</style>