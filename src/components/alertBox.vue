<template>
    <div class="showBox" v-if="uShow && !close && nowUse" :style="'opacity:'+basic.opacity ">
        <fa-icon icon="exclamation-triangle" class="warm_icon" />
        <p class="showTitle">< {{nowUse.title}} ></p>
        <p class="showBig">温度超过阈值</p>
        <div class="showContent">
            <p class="temp_title">当前温度为：</p>
            <p class="temp_show">{{nowUse.temp}}℃</p>
            <p class="showMsg" v-if="nowUse.min!==null && nowUse.min>=nowUse.temp">
                比最小值小了 <span>{{nowUse.min-nowUse.temp}}</span>℃
            </p>
            <p class="showMsg" v-if="nowUse.max!==null && nowUse.max<=nowUse.temp">
                比最大值大了 <span>{{nowUse.temp-nowUse.max}}</span>℃
            </p>
        </div>
        <div class="showControll">
            <div class="closeBox" @click="subClose">我知道了</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "alertBox",
        props:['log','uShow','close','info','hasClose'],
        data(){
          return {
              nowUse:false,
              timer:'',
              basic:{
                  round:0,
                  opacity:1,
              }
          }
        },
        methods:{
            subClose(){
                this.basic.opacity = 0;
                //记录日志
                if(this.log){
                    let getLog = JSON.parse(localStorage.getItem('warmLog')) || [];
                    getLog.push({
                        time:new Date().toLocaleString(),
                        name:this.nowUse.title,
                        id:this.nowUse.id,
                        onTime:this.nowUse.temp,
                        over:this.nowUse.temp - (this.nowUse.min || this.nowUse.max)
                    });
                    localStorage.setItem('warmLog',JSON.stringify(getLog));
                }
                //切换下一个弹窗或者结束
                if(this.info.length > 0 && this.hasClose.indexOf(this.info[0].id) === -1){
                    setTimeout(()=>{
                        this.basic.opacity = 1;
                        this.nowUse = this.info.shift();
                        if(this.hasClose.length===0 || this.hasClose[this.hasClose.length-1] !==this.nowUse.id){
                            this.hasClose.push(this.nowUse.id);
                        }

                    },500)
                }else{
                    this.basic.round++;
                    this.$emit('action','close');
                }
            },
            init(){
                this.basic.opacity = 1;
                //初始时，持续循环，直到读取到一个值，读取后不再循环
                this.timer = setInterval(()=>{
                    if(this.info.length>0 && this.hasClose.indexOf(this.info[0].id) === -1){
                        this.nowUse = this.info.shift();
                        this.hasClose.push(this.nowUse.id);
                        clearInterval(this.timer);
                    }
                },500);
            }
        },
        mounted() {
            this.init();
            //每隔一段时间释放一个ID，使其可以再次检测到温度变化
            let time = this.$store.dTime;
            setInterval(()=>{
                if(this.hasClose.length>0){
                    this.hasClose.shift();
                }
            },time);
        },
        watch:{
          'info':function (val) {
              //只有当非第一轮展示时（避免重复赋值），并且有数据时才调取这一组数据的第一个
              if(this.basic.round > 0){
                  this.init();
                  this.basic.round++;
              }
          }
        }
    }
</script>

<style scoped>
    .showBox{
        background:rgba(0,0,0,0.8);
        position: absolute;
        top:0;
        right:0;
        bottom:0;
        left:0;
        animation: warmThis 2.5s infinite;
        color:#fff;
        text-align: center;
        transition: all 1s;
        z-index:999;
    }

    .warm_icon{
        display: block;
        margin:10rem auto 0;
        text-align: center;
        font-size:10rem;
        color:#ff1100
    }

    .showTitle{
        font-size:3rem;
        margin:10px 0;
    }

    .showBig{
        font-size:3.5rem;
        font-weight: 600;
        letter-spacing: 3px;
        margin:10px 0;
    }

    .closeBox{
        width:120px;
        margin:15px auto;
        padding:10px 5px;
        letter-spacing: 3px;
        border:1px solid #c1c1c1;
        border-radius: 50px;
        font-size:1.3rem;
        text-align: center;
    }

    .closeBox:hover{
        opacity: 0.8;
    }

    .temp_title{
        font-size:1.5rem;
    }

    .temp_show{
        font-weight:600;
        font-size:5rem;
        color:#ff1100;
    }

    .showMsg{
        font-size:2rem;
        letter-spacing: 2px;
    }

    .showMsg span{
        font-size:2.5rem;
        color:#42b983;
    }

    .showContent{
        margin-top:20px;
    }

    .showControll{
        margin-top:50px;
    }

    @keyframes warmThis {
        0%,100%{
            box-shadow: 0 0 20px 0 #f10214 inset;
        }
        50%{
            box-shadow: 0 0 20px 2rem #f10214 inset;
        }
    }



</style>