<template>
  <div class="home">
    <div class="temp_head">
      <div class="temp_title">
        <h1 @click="showPage('about')">
          <span>{{(envInfo.info&&envInfo.info.name) || '未知场景'}}</span>
          <fa-icon icon="chevron-right" class="right_icon" />
        </h1>
        <p>
          <span class="temp_online">{{onlineDev}}</span>
          个设备在线，共
          <span class="temp_devNum">{{showTempList.length}}</span>
          个设备
        </p>
      </div>
      <div class="temp_add" v-if="envInfo && loginInfo && envInfo.uId === loginInfo.uId">
        <fa-icon icon="plus" class="add_icon" @click="showPage('add')" />
      </div>
    </div>
    <div class="temp_card">
      <template v-if="tempList.length > 0">
        <div class="showAve" v-if="basic.showAve">
          <p class="min_title">场景内平均温度（{{envInfo.option.line ? '':'非'}}直线型）</p>
          <p class="min_Temp">{{aveTemp}}</p>
          <p class="no_imp">数据仅供参考</p>
        </div>
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
        <noData />
      </template>
    </div>
    <div class="temp_tip" @click="getData">
      <p v-if="basic.lastUpdate !== '00:00'">上次更新：{{basic.lastUpdate}}</p>
      <p v-else>数据未更新</p>
      <p v-if="basic.reFresh">
        <fa-icon icon="sync-alt" class="refresh_move"/>
        监测数据采集间隔时间为 {{basic.dTime/1000}} s
      </p>
      <p v-else>监测数据采集已关闭</p>
    </div>
    <div class="showPage" :style="'display:'+showModal.display+';'">
      <div class="pageBack" @click.self="hidePage">
        <div class="pageShow" :style="'top:'+showModal.top+'%;'">
          <template v-if="basic.page === 'about'">
            <aboutPage
                    :envInfo="envInfo"
                    :reFresh="basic.reFresh"
                    :sort="basic.dSort"
                    :showAve="basic.showAve"
                    :tempAlert="basic.tempAlert"
                    :tempLog="basic.tempLog"
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
          <template v-else-if="basic.page === 'log'">
            <logPage />
          </template>
        </div>
      </div>
    </div>
    <alertBox
            :log="basic.tempLog"
            :uShow="basic.tempAlert"
            :close="basic.showAlert"
            :hasClose="hasClose"
            :info="alertMsg"
            @action='alertFunc'
    />
  </div>
</template>

<script>
import tempCard from '@/components/card'
import aboutPage from '@/views/setting_list'
import addPage from '@/views/add'
import showPage from '@/views/show'
import editPage from '@/views/edit'
import noData from '@/components/noData'
import logPage from '@/views/showlog'
import alertBox from '@/components/alertBox'

export default {
  name: 'home',
  data(){
    return {
      basic:{
        lastUpdate:"00:00",
        page:'about',
        dTime:30000,
        dSort:"default",
        devId:"#default",
        timer:"",
        showAlert:false,
        reFresh:true,//true//定时刷新数据
        tempAlert:true,//预警信息展示
        showAve:true,//展示平均温度
        tempLog:true//收集预警日志
      },
      envInfo:{option:{}},
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
      ],
      loginInfo:false,
      alertMsg:[],
      hasClose:[]
    }
  },
  computed:{
    onlineDev(){
      let num = 0;
      this.tempList.forEach((item)=>{
        if(item.option.run === true){
          num++;
        }
      });
      return num;
    },
    showTempList(){
      let backArr = this.tempList;
      if(this.basic.dSort === 'runFirst'){
        let runList = [],nRunList = [];
        backArr.forEach(item => {
          if(item.option.run === true){
            runList.push(item);
          }else if(item.option.run === false){
            nRunList.push(item);
          }
        });
        backArr =  [...runList,...nRunList];
      }
      if(this.basic.showOwn){
        return backArr.map((item)=>{
          if(item.uId === this.loginInfo.uId){
            return item;
          }
        })
      }else{
        return backArr;
      }
    },
    canAdd(){
      return (this.envInfo.openAdd || (this.loginInfo && this.loginInfo.uId === this.envInfo.uId));
    },
    aveTemp(){
      let count = 0,i = 0,ave = 0;
      let a = Number(this.envInfo.option.ave);
      this.showTempList.forEach(item=>{
        if(item.option.run){
          i++;
          count += item.show.temp;
        }
      });
      ave = Math.round(count/i);
      if(!this.envInfo.option.line && count!==0 && a<30){
        ave -= Math.round(Math.random()*10);
      }
      return ave;
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
      },700);
    },
    changeVal(name,value,stop,has){
      if(this.basic[name] || has){
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
      if(this.basic.reFresh){
        this.basic.timer = setInterval(() => {
          this.getData();
        },time);
      }else{
        clearInterval(this.basic.timer);
      }
    },
    getData(){
      if(this.loginInfo.uId && this.$route.params.eId){
        this.$fetch(
          'devList',
          JSON.stringify({uId:this.loginInfo.uId,envId:this.$route.params.eId}),
          res=>{
            if(res.code === 200){
              if(res.data.length > 0){
                this.tempList = res.data;
                let date = new Date(),h=date.getHours(),m = date.getMinutes(),s = date.getSeconds();
                this.basic.lastUpdate = (h<10?('0'+h):h) + ":" + (m<10?('0'+m):m) + ":" + (s<10?('0'+s):s);
                //获取需要预警的信息
                res.data.forEach(item=>{
                  let min = item.limit.min !== null ? item.limit.min: -Infinity,
                          max = item.limit.max!==null? item.limit.max: Infinity;
                  let msg = this.alertMsg;
                  if(this.basic.tempAlert && (msg.length === 0 || this.hasClose.indexOf(item.devId) === -1)){
                    this.basic.showAlert = false;
                    if(item.show.temp < min){
                      this.alertMsg.push({
                        id:item.devId,
                        title:item.info.name,
                        temp:item.show.temp,
                        min
                      })
                    }else if(item.show.temp > max){
                      this.alertMsg.push({
                        id:item.devId,
                        title:item.info.name,
                        temp:item.show.temp,
                        max
                      })
                    }
                  }
                })
              }
            }
          }
        );
      }
    },
    alertFunc(val){
      if(val === 'close'){
        this.basic.showAlert = true;
      }
    },
    getSet(){
      let set = JSON.parse(localStorage.getItem('SETTING')) || {};
      if(set.dSort !== undefined){
        this.basic.dSort = set.dSort;
      }
      if(set.showAve !== undefined){
        this.basic.showAve = set.showAve;
      }
      if(set.reFresh !== undefined){
        this.basic.reFresh = set.reFresh;
      }
      if(set.tempAlert !== undefined){
        this.basic.tempAlert = set.tempAlert;
      }
      if(set.tempLog !== undefined){
        this.basic.tempLog = set.tempLog;
      }
    }
},
  components: {
    tempCard,
    aboutPage,
    addPage,
    showPage,
    editPage,
    noData,
    logPage,
    alertBox
  },
  beforeMount() {
    this.basic.dTime = this.$store.dTime;
    this.loginInfo = this.$store.login;
  },
  mounted() {
    this.$fetch(
            'envInfo',
            JSON.stringify({envId:this.$route.params.eId,uId:this.loginInfo.uId}),
            d=>{
              if(d.code === 200){
                this.envInfo = d.data;
              }
            }
    )
    .catch(e=>{
      this.$router.replace('/');
    })
    ;
    if(this.basic.reFresh){
      this.getData();
      this.loadData(this.basic.dTime)
    }
    this.getSet();

  },
  watch:{
    'basic.dTime':function (val){
      //间隔时间改变后重新开始
      clearInterval(this.basic.timer);
      this.loadData(val);
    },
    'basic.reFresh':function(val){
      //改变刷新状态后判断
      if(!val){
        clearInterval(this.basic.timer);
      }else{
        clearInterval(this.basic.timer);
        this.loadData(this.basic.dTime);
      }
    },
    'aveTemp':{
      handler:function(val){
        setTimeout(()=>{
          let min = this.envInfo?.limit?.min || -Infinity;
          let max = this.envInfo?.limit?.max || Infinity;
          if(val <= min){
            this.alertMsg.push({
              id:this.envInfo.envId,
              title:this.envInfo.info.name,
              temp:val,
              min
            });
          }else if(val >= max){
            this.alertMsg.push({
              id:this.envInfo.envId,
              title:this.envInfo.info.name,
              temp:val,
              max
            });
          }
        },500)

      },
      immediate:true
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
    transition: all 1s;
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
    transition: top 0.7s ease-out;
  }

  .temp_add:hover{
    transform: scale(0);
    transform-origin: center center;
  }

  .showAve{
    width:100%;
    height:8rem;
    background:#fff;
    border-radius:10px;
    margin-bottom:20px;
    padding:10px 10px 3px;
    box-sizing: border-box;
    position: relative;
  }

  .min_title{
    height:20%;
    font-weight:600;
    color:#999;
  }

  .min_Temp{
    height:80%;
    font-size:5rem;
    font-weight: 900;
    text-align: center;
    line-height:120%;
    color: #ff9d0c;
  }

  .min_Temp::after{
    content:"℃";
    font-size:2rem;
  }

  .no_imp{
    display: block;
    color:#999;
    border:1px solid ;
    padding:0 5px;
    position: absolute;
    right:4px;
    bottom:5px;
    opacity:0.6;
    border-radius: 10px;
  }

</style>
