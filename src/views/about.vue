<template>
    <div class="aboutMe">
        <div class="about_head">
            <h1>关于</h1>
            <p>感谢使用多点温度监测系统！</p>
        </div>
        <div class="about_content">
            <div class="card_about">
                <template v-if="loginInfo">
                    <div class="dividerBar">
                        <span>您已登录！</span>
                    </div>

                    <div class="formItem">
                        <label>
                            <span>用户名</span>
                            <input type="text" placeholder="用户名非法" v-model="loginInfo.name" readonly>
                        </label>
                    </div>
                    <div class="formItem">
                        <label>
                            <span>用户ID</span>
                            <input type="text" placeholder="ID非法" v-model="loginInfo.uId" readonly>
                        </label>
                    </div>
                    <div class="formItem">
                        <label>
                            <span style="width:60%;">数据刷新间隔时间</span>
                            <span class="partTime">{{getTime}} s</span>
                        </label>
                        <span class="min_tips">数据刷新间隔时间将与服务器同步</span>
                    </div>
                    <div class="selectTime">
                        <button @click="changeTime(1000)">1s</button>
                        <button @click="changeTime(2000)">2s</button>
                        <button @click="changeTime(5000)">5s</button>
                        <button @click="changeTime(10000)">10s</button>
                        <button @click="changeTime(30000)">30s</button>
                        <button @click="changeTime(60000)">60s</button>
                        <button @click="changeTime(90000)">90s</button>
                        <button @click="changeTime(120000)">120s</button>
                    </div>
                    <div class="formItem bigSize">
                        <span style="width:65%;">只显示我创建的环境</span>
                        <radio :status="own" name="ownEnv" @changeStatus="changeRadio"/>
                    </div>
                    <div class="log_btn">
                        <button class="del_btn" @click="deLogin">注销登录</button>
                    </div>
                </template>
                <template v-else>
                    <div class="dividerBar">
                        <span>请登录后查看更多信息！</span>
                    </div>
                </template>
            </div>
            <div class="dividerBar">
                <span>其他信息</span>
            </div>
            <div style="text-align: center;border:1px solid #c1c1c1;padding:10px 0;">
                <b>在系统中您可以点击任何 <fa-icon icon="sync-alt"/> 图标，以立即获取最新数据！</b>
            </div>
            <div class="author">
                <p>系统制作信息：</p>
                <p v-for="(item,index) in author" :key="index">
                    <span class="author_title">{{item.title}}</span>
                    <span class="author_value">{{item.value}}</span>
                </p>
            </div>
        </div>
        <msg
            :config="messageBox"
        />
    </div>
</template>

<script>
    export default {
        name: "about",
        props:["own"],
        data(){
            return {
                messageBox:{
                    show:false
                },
                time:0,
                loginInfo:false,
                author:[
                    {
                        title:"设计与制作",
                        value:"张小富"
                    },
                    {
                        title:"前端基础框架",
                        value:"Vue.js"
                    },
                    {
                        title:"后端基础框架",
                        value:"Node.js"
                    },
                    {
                        title:"数据库平台",
                        value:"MongoDB"
                    },
                    {
                        title:"硬件基础平台",
                        value:"Arduino"
                    },
                ]
            }
        },
        computed:{
            getTime(){
                return this.time/1000;
            }
        },
        methods:{
            changeTime(num){
                if(num<30000){
                    this.messageBox = {
                        show:true,
                        showOk:true,
                        okText:"继续修改",
                        cancelText:"取消修改",
                        name:"alertTime",
                        msg:"由于过快的刷新数据，可能会导致您的设备性能下降，因此不建议您选择！",
                        func:(val,name)=>{
                            if(val && name === 'alertTime'){
                                if(num !== this.time){
                                    this.$fetch(
                                        'setTime',
                                        JSON.stringify({
                                            uId:this.loginInfo.uId,
                                            time:num
                                        })
                                    );
                                    //存入本地，供所有页面使用
                                    this.$store.dTime = num;
                                    this.time = num;
                                }
                            }
                        }
                    }
                }else{
                    if(num !== this.time){
                        this.$fetch(
                            'setTime',
                            JSON.stringify({
                                uId:this.loginInfo.uId,
                                time:num
                            })
                        );
                        //存入本地，供所有页面使用
                        this.$store.dTime = num;
                        this.time = num;
                    }
                }

            },
            deLogin(){
                let that = this;
                this.messageBox = {
                    show:true,
                    msg:"请确认是否注销登录？",
                    cancelText:"取消",
                    showOk:true,
                    name:"askBox",
                    func(status){
                        if(status){
                            setTimeout(()=>{
                                that.loginInfo = false;
                                //解除首页登录状态
                                that.$store.login = '';
                                that.$parent.hidePage(function(){
                                    this.loginInfo = false;
                                })
                            },500);
                        }

                    }
                };
            },
            changeRadio(status){
                this.messageBox = {
                    show:true,
                    msg:"环境列表已切换！",
                    cancelText:"好",
                    name:"norBox"
                };
                this.$emit('changeVal','ownEnv',status,false,true);
            }
        },
        mounted(){
            this.loginInfo = this.$store.login;
            this.time = this.$store.dTime;
        }
    }
</script>

<style scoped>
    .aboutMe{
        height:100%;
        overflow: auto;
    }

    .author{
        width:95%;
        margin-top:40px;
    }
    .author p{
        width:70%;
        color:#9c9c9c;
        font-weight:600;
        margin:0 auto 10px;
    }

    .author_title{
        width:45%;
        font-size:1.4rem;
        display: inline-block;
    }

    .author_value{
        width:55%;
        font-size:1.2rem;
        margin-left:10px;
    }

    .card_about{
        padding:10px;
        margin-top:30px;
    }

    .partTime{
        font-size:1.5rem;
        font-weight:600;
        text-decoration: underline;
        padding:0 5px;
    }

    .selectTime{
        margin:20px 0;
    }

    .selectTime button{
        width:18vw;
        height:45px;
        margin-top:10px;
        margin-right:10px;
    }

    .min_tips{
        width:100%;
        font-size:0.5rem;
        color:#999;
        position: relative;
        top:-5px;
    }

    .min_tips:before{
        content:"* "
    }

    .log_btn{
        margin-top:20px;
    }

</style>