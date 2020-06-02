<template>
    <div class="card cardShow">
        <div class="card_Msg">
            <div class="card_sMsg">
                <h2>{{item.info.name}}</h2>
                <p>{{item.info.msg}}</p>
            </div>
            <div class="card_status">
                <template v-if="item.option.run">
                    <span class="card_st card_statusOn">运行中</span>
                </template>
                <template v-else>
                    <span class="card_st card_statusOff">未运行</span>
                </template>
                <p>运行：{{runTime}}小时</p>
            </div>
        </div>
        <div class="card_temp">
            <div class="card_showTemp">
                <span :style="'color:#'+showColor+';'">{{item.show.temp}}</span>
            </div>
            <p class="card_tempTips">{{showTips}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "card",
        props:["item","tips"],
        data(){
            return {
                showColor:"c1c1c1"
            }
        },
        methods:{
            changeColor(){
                if (this.item.option.run) {
                    let temp = this.item.show.temp;
                    if (temp <= 0) {
                        this.showColor = "1890FF";
                    } else if(temp <= 20){
                        this.showColor = "096";
                    } else if (temp <= 30) {
                        this.showColor = "ff9933";
                    } else if (temp <= 40) {
                        this.showColor = "cc0033";
                    } else if (temp <= 50) {
                        this.showColor = "660099";
                    } else {
                        this.showColor= "7e0023";
                    }
                } else {
                    this.showColor = "999";
                }
            }
        },
        computed:{
            showTips(){
                this.changeColor();
                if(this.item.option.run){
                    let temp = this.item.show.temp;
                    //展示TIPS内容
                    if (temp <= 0) {
                        return this.tips[1];
                    } else if(temp <= 20){
                        return this.tips[2];
                    } else if (temp <= 30) {
                        return this.tips[3];
                    } else if (temp <= 40) {
                        return this.tips[4];
                    } else if (temp <= 50) {
                        return this.tips[5];
                    } else {
                        return this.tips[6];
                    }
                }else{
                    return this.tips[0];
                }
            },
            runTime(){
                if(this.item.show.beginTime){
                    let rightTime = new Date();
                    let oldTime = new Date(this.item.show.beginTime);
                    return ((((rightTime - oldTime)/1000)/60)/60).toFixed(2);
                }else{
                    return '0.00';
                }

            }
        }
    }
</script>

<style scoped>
    .cardShow{
        height:14rem;
    }

    .card_Msg{
        width:40%;
        height:100%;
        padding-right:10px;
        float:left;
        position: relative;
    }

    .card_Msg:after{
        content:"";
        height:90%;
        width:1px;
        background:#cccccc;
        position: absolute;
        top:5%;
        right:0;
    }

    .card_Msg h2{
        width:100%;
        overflow: hidden;
        font-size:2rem;
        letter-spacing: 1px;
    }

    .card_Msg p{
        width:100%;
        color:#9c9c9c;
        font-size:1.1rem;
    }

    .card_sMsg{
        height:75%;
    }

    .card_status{
        width:100%;
        height:25%;
    }

    .card_temp{
        width:55%;
        height:100%;
        float:left;
        padding-left:5px;
        text-align: center;
    }

    .card_showTemp{
        height:70%;
        font-weight:400;
        font-size:2rem;
        padding-bottom:5px;
        line-height: 0.95;
    }

    .card_showTemp:after{
        content:"℃"
    }

    .card_showTemp span{
        font-size:10rem;
    }

    .card_tempTips{
        width:100%;
        height:30%;
        line-height:1.5;
        display: block;
        font-size:1.3rem;
        letter-spacing: 2px;
        color: #858585;
        text-align: center;
    }

    .card_st{
        padding-left:2.7rem;
        font-size:1.5rem;
        font-weight: 600;
        letter-spacing: 3px;
        position: relative;
    }

    .card_statusOn:before{
        content:"";
        width:25px;
        height:25px;
        position: absolute;
        border-radius: 50%;
        left:0;
        top:5px;
        background: #42b983;
        background:radial-gradient(circle,#fff,#42b983);
    }

    .card_statusOff:before{
        content:"";
        width:25px;
        height:25px;
        position: absolute;
        border-radius: 50%;
        left:0;
        top:5px;
        background: #ff314c;
        background:radial-gradient(circle,#fff, #ff314c);
    }

    .card_status>p{
        padding-left:2.7rem;
        font-size:0.9rem;
    }
</style>