<template>
    <div class="aboutMe">
        <div class="about_head">
            <h1>关于</h1>
            <p>本页面所有修改仅为本地修改</p>
        </div>
        <div class="about_content">
            <div class="card_about">
                <div class="formItem">
                    <label>
                        <span style="width:60%;">本地数据刷新间隔时间</span>
                        <span class="partTime">{{getTime}} s</span>
                    </label>
                </div>
                <div class="selectTime">
                    <button @click="changeTime(1000)">1s</button>
                    <button @click="changeTime(2000)">2s</button>
                    <button @click="changeTime(5000)">5s</button>
                    <button @click="changeTime(10000)">10s</button>
                    <button @click="changeTime(20000)">20s</button>
                    <button @click="changeTime(30000)">30s</button>
                    <button @click="changeTime(60000)">60s</button>
                </div>
                <div class="formItem">
                    <span style="width:60%;">已运行监测点优先展示</span>
                    <radio :status="sort === 'runFirst'" @changeStatus="changeStatus" />
                </div>
            </div>
            <div class="author">
                <p>设计与制作 - 张小富</p>
                <p>前端基础框架 - Vue.js</p>
                <p>后端基础框架 - Node.js</p>
                <p>数据库平台 - MongoDB</p>
                <p>硬件基础平台 - A</p>
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
        props:["time","sort"],
        data(){
            return {
                messageBox:{
                    show:false
                }
            }
        },
        computed:{
            getTime(){
                return this.time/1000;
            }
        },
        methods:{
            changeTime(num){
                this.$emit('changeVal','dTime',num);
            },
            changeStatus(status){
                this.messageBox = {
                    show:true,
                    cancelText:"好",
                    msg:"数据列表展示顺序切换成功"
                }
                this.$emit('changeVal','dSort',status ? "runFirst":"default")
            }
        }
    }
</script>

<style scoped>
    .author{
        width:100%;
        position: absolute;
        bottom:30px;
    }
    .author p{
        color:#9c9c9c;
        font-weight:600;
        text-align: center;
        margin-bottom: 3px;
    }

    .author p:before{
        content:"--";
        margin-right:5px;
    }

    .author p:after{
        content:"--";
        margin-left:5px;
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

</style>