<template>
    <div class="messageBox" v-if="config.show">
        <div class="message">
            <div class="showMessage">
                <p>{{config.msg}}</p>
            </div>
            <div class="inputMsg" v-if="config.input && config.input.show">
                <input type="text" :placeholder="config.input.placeholder ||'请输入...'" v-model.trim.lazy="getInput">
            </div>
            <div class="showcontrol">
                <button v-if="config.showOk" @click="btnClick(true)">{{config.okText || "确定"}}</button>
                <button v-if="config.showCancel !== false" @click="btnClick(false)">{{config.cancelText || "取消"}}</button>
                <p v-if="!config.showOk && config.showCancel === false">请稍等...</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "messageBox",
        props:["config"],
        data(){
            return {
                getInput:"",
                name:""
            }
        },
        methods:{
            btnClick(val){
                if(val && this.config.times){
                    this.config.times ++;
                }else{
                    this.name = this.config.name;
                    //延时为了显示效果
                    setTimeout(()=>{
                        //为了避免延时后message切换了，然后在关闭
                        if(this.name === this.config.name){
                            this.config.show = false;
                        }
                    },100);
                }
                this.$emit('action',val,this.config.name,this.getInput);
                this.getInput = "";
            }
        },
        created(){
            if(!this.config.showOk && this.config.showCancel === false){
                setTimeout(()=>{
                    this.config.show = false;
                },1500);
            }
        }
    }
</script>

<style scoped>
    .messageBox{
        position: absolute;
        top:0;
        left:0;
        bottom: 0;
        right:0;
        background:rgba(0,0,0,0.1);
        transition: all 1s;
    }

    .message{
        width:60%;
        top:40%;
        margin:0 auto;
        position: relative;
        min-height:50px;
        border-radius:10px;
        overflow: hidden;
        background:#fff;
    }

    .showMessage{
        min-height:50px;
        padding:15px;
        box-sizing: border-box;
    }

    .showMessage p{
        font-size:1.5rem;
        text-align: center;
        letter-spacing: 1px;
    }


    .showcontrol button{
        width:100%;
        height:40px;
        line-height: 40px;
        background:#fff;
        color:#1890ff;
        text-align: center;
        border-top:1px solid #ddd;
        border-radius:0;
    }

    .showcontrol button:active{
        background:#c1c1c1;
    }

    .showcontrol p{
        color:#1890ff;
        text-align: center;
        padding:10px 0;
        border-top:1px solid #ddd;
    }

    .inputMsg{
        height:30px;
        border-top:1px solid #ddd;
    }

    .inputMsg input{
        width:100%;
        height:30px;
        border:0;
        padding:0 10px;
        box-sizing: border-box;
    }
</style>