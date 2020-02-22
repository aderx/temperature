<template>
  <div class="home">
    <div class="temp_head">
      <div class="temp_title">
        <h1 @click="showPage('about')">
          <span>多点温度监测系统</span>
          <fa-icon icon="chevron-right" class="right_icon" />
        </h1>
        <p>
          <span class="temp_online">{{onlineDev}}</span>
          个设备在线，共
          <span class="temp_devNum">{{showTempList.length}}</span>
          个设备
        </p>
      </div>
      <div class="temp_add" @click="showPage('add')">
        <fa-icon icon="plus" class="add_icon" />
      </div>
    </div>
    <div class="temp_card">
      <template v-if="tempList.length > 0">
        <tempCard
                v-for="(list,index) in showTempList"
                :key="index"
                :item="list"
                :tips="showTips"
                @click.native="showPage('show',list.devId)"
        />
        <p v-if="showTempList.length >=4" class="showEnd">没有数据啦~</p>
      </template>
      <template v-else>
        <p class="showEnd">还没有数据源，点击右上角添加一个吧！</p>
      </template>
    </div>
    <div class="temp_tip">
      <p>上次更新：{{basic.lastUpdate}}</p>
      <p>监测数据采集间隔时间为 {{basic.dTime/1000}} s</p>
    </div>
    <div class="showPage" :style="'display:'+showModal.display+';'">
      <div class="pageBack" @click.self="hidePage">
        <div class="pageShow" :style="'top:'+showModal.top+'%;'">
          <template v-if="basic.page === 'about'">
            <aboutPage
                    :time="basic.dTime"
                    :sort="basic.dSort"
                    @changeVal="changeVal"
            />
          </template>
          <template v-else-if="basic.page === 'add'">
            <addPage/>
          </template>
          <template v-else-if="basic.page === 'show'">
            <showPage
                    :id="basic.devId"
                    @changeVal="changeVal"
            />
          </template>
          <template v-else-if="basic.page === 'edit'">
            <editPage
                    :id="basic.devId"
                    @changeVal="changeVal"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tempCard from '@/components/card'
import aboutPage from '@/views/about'
import addPage from '@/views/add'
import showPage from '@/views/show'
import editPage from '@/views/edit'

export default {
  name: 'home',
  data(){
    return {
      basic:{
        lastUpdate:"00:00",
        page:'about',
        dTime:10000,
        dSort:"default",
        devId:"#default",
        timer:""
      },
      showModal:{
        top:100,
        display:'none',
      },
      tempList:[],
      showTips:[
        "监测点已关闭，暂无建议。",
        "此监测点温度过低，请小心！",
        "此监测点温度适中。",
        "此监测点温度略高，请注意！",
        "此监测点温度偏高，请注意！",
        "此监测点温度过高，请注意！",
        "此监测点温度超高，请注意！"
      ]
    }
  },
  computed:{
    onlineDev(){
      let num = 0;
      this.tempList.forEach((item)=>{
        if(item.run === true){
          num++;
        }
      });
      return num;
    },
    showTempList(){
      if(this.basic.dSort === 'runFirst'){
        let runList = [],nRunList = [];
        this.tempList.forEach(item => {
          if(item.run === true){
            runList.push(item);
          }else if(item.run === false){
            nRunList.push(item);
          }
        });
        return [...runList,...nRunList];
      }else{
        return this.tempList;
      }
    }
  },
  methods:{
    showPage(pageName,devId){
      this.basic.page = pageName;
      this.basic.devId = '#default';
      this.basic.devId = devId;
      this.showModal.display = 'block';
      setTimeout(()=>{
        this.showModal.top = '10';
      },100);
    },
    hidePage(){
      this.showModal.top = '100';
      setTimeout(()=>{
        this.showModal.display = 'none';
      },1000);
    },
    changeVal(name,value,stop){
      if(this.basic[name]){
        if(stop){
          this.hidePage();
          setTimeout(()=>{
            this.showPage(value,this.basic.devId);
          },1000);
        }else{
          this.basic[name] = value;
        }
      }
    },
    loadData(time){
      this.timer = setInterval(() => {
        this.axios
            .post('/api/getDevList')
            .then((res)=>{
              if(res.data.code === 200){
                this.tempList = res.data.data;
                let date = new Date();
                this.basic.lastUpdate = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
              }
            })
      },time);
    }
},
  components: {
    tempCard,
    aboutPage,
    addPage,
    showPage,
    editPage
  },
  mounted() {
    this.axios
        .post('/api/getDevList')
        .then((res)=>{
          if(res.data.code === 200){
            this.tempList = res.data.data;
            let date = new Date();
            this.basic.lastUpdate = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
          }
        });
    this.loadData(this.basic.dTime)
  },
  watch:{
    'basic.dTime':function (val,oVal){
      clearInterval(this.timer);
      this.loadData(val);
    }
  }
}
</script>

<style scoped>
  .temp_head{
    width:100%;
    height:10%;
    overflow: hidden;
  }

  .temp_title{
    width:85%;
    float:left;
    padding:10px 15px;
    box-sizing: border-box;
  }

  .temp_title>h1{
    font-size:2.2rem;
    width:100%;
    letter-spacing: 1px;
    cursor: default;
  }

  .temp_title>h1>span{
    margin-right:5px;
  }

  .temp_title>p{
    color:#9c9c9c;
    font-size:1.3rem;
    letter-spacing: 2px;
    margin-top:2px;
  }

  .temp_title>p>span{
    font-weight:600;
    padding:0 5px;
    font-size:1.4rem;
  }

  .temp_online{
    color: #ff1100;
  }

  .temp_devNum{
    color: #5882ff;
  }

  .temp_add{
    width:15%;
    height:60px;
    float:left;
    text-align: center;
    line-height:70px;
  }

  .add_icon{
    font-size:2.5rem;
  }

  .right_icon{
    margin-bottom:-1px;
  }

  .temp_card{
    height:80%;
    padding:15px;
    overflow-y: auto;
  }

  .temp_tip{
    height:10%;
    font-size:1rem;
    color:#9c9c9c;
    text-align: center;
    letter-spacing: 1px;
    padding-top:5px;
  }

  .temp_tip p:before{
    content:"--";
    padding:0 5px;
  }

  .temp_tip p:after{
    content:"--";
    padding:0 5px;
  }

  .showEnd{
    text-align: center;
    color:#c1c1c1;
    height:10px;
  }

  .showPage{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:rgba(0,0,0,0.2);
    transition: all .5s ease;
  }

  .pageBack{
    max-width:768px;
    min-width:375px;
    height:100%;
    margin:0 auto;
    position: relative;
  }

  .pageShow{
    background:#fff;
    width:96%;
    margin-left:2%;
    height:90%;
    padding:10px;
    box-sizing: border-box;
    border-radius: 20px 20px 0 0;
    position: absolute;
    transition: top 1s ease-out;
  }

  .temp_add:hover{
    animation: ro 2s linear;
    -webkit-animation-fill-mode:both;
  }

  @keyframes ro {
    0%,100%{
      transform: rotateZ(0deg);
    }
    50%{
      transform: rotateZ(45deg);
    }
  }

</style>
