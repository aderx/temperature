<template>
  <div class="home">
    <div class="temp_head">
      <div class="temp_title">
        <h1 @click="showPage('about')">
          <span>多点温度监测系统</span>
          <fa-icon icon="chevron-right" class="right_icon" />
        </h1>
      </div>
      <div class="temp_add" :style="'transform: scale('+showModal.scale+');transform-origin: center center;'">
          <template v-if="loginInfo">
            <fa-icon icon="plus" class="add_icon"  @click="showPage('add_env')"/>
          </template>
          <template v-else>
            <fa-icon icon="laugh-wink" class="login_icon"  @click="showPage('login')"/>
          </template>
        </div>
    </div>
    <p class="watch_env" @click="loadData">
      <fa-icon icon="sync-alt" class="refresh_move"/>
      场景数据刷新间隔：{{basic.dTime/1000}}s
    </p>
    <template v-if="loginInfo && showTempList.length > 0">
    <div class="temp_card">
        <div class="temp_env">
          <ul>
            <li v-for="(item,index) in showTempList" :v-key="index" @click="fireToPage(item.envId)">
              <div class="showIcon" :style="'color:'+item.info.color +';'" >
                <fa-icon :icon="item.info.icon" class="big_icon" />
              </div>
              <div class="showTitle">
                <p class="showNum">{{index+1}}</p>
                <p class="big_title">{{item.info.name}}</p>
                <p class="show_tips">
                  <span class="m_tips">{{item.info.desc}}</span>
                </p>
              </div>
              <p class="envType">{{item.option.showAllUser ? '开放':'私有'}}</p>
            </li>
          </ul>
          <p v-if="showTempList.length>5" class="watch_env">没有更多数据啦~</p>
        </div>
    </div>
    </template>
    <template v-else>
      <noData :msg="loginInfo ? null:'登录后才可以选择场景哦！'"/>
    </template>
    <div class="showPage" :style="'display:'+showModal.display+';'">
      <div class="pageBack" @click.self="hidePage">
        <div class="pageShow" :style="'top:'+showModal.top+'%;'">
          <template v-if="basic.page === 'about'">
            <aboutPage
                    :own="basic.ownEnv"
                    @changeVal="changeVal"
            />
          </template>
          <template v-if="basic.page === 'login'">
            <loginPage />
          </template>
          <template v-if="basic.page === 'add_env'">
            <envAddPage />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import aboutPage from '@/views/about'
import loginPage from '@/views/login'
import envAddPage from '@/views/add_env'
import noData from '@/components/noData'

export default {
  name: 'home',
  data(){
    return {
      basic:{
        page:'about',
        dTime:60000,
        timer:'',
        ownEnv:false//只显示‘我’创建的环境
      },
      loginInfo:false,
      showModal:{
        top:100,
        display:'none',
        scale:1,
      },
      tempList:[]
    }
  },
  computed:{
    showTempList(){
      let arr = this.tempList;
      if(this.basic.ownEnv){
        return arr.filter((item)=>{
          return (item.uId === this.loginInfo.uId)
        });
      }else{
        return arr;
      }
    }
  },
  methods:{
    showPage(pageName,devId){
      this.basic.page = pageName;
      this.basic.devId = '#default';
      this.basic.devId = devId;
      this.showModal.display = 'block';
      this.showModal.scale = 0;
      setTimeout(()=>{
        this.showModal.top = '10';
      },100);
    },
    hidePage(func){
      this.showModal.top = '100';
      this.showModal.scale = 1;
      (func && typeof func === 'function') ? func.call(this):null;
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
    fireToPage(id){
      this.$router.push('/env/'+id);
    },
    loadData(){
      if(this.loginInfo.uId){
        this.$fetch(
                'envList',
                JSON.stringify({uId:this.loginInfo.uId}),
                d=>{
                  if(d.code === 200){
                    this.tempList = d.data;
                  }
                }
        )
      }
    }
},
  components: {
    aboutPage,
    loginPage,
    envAddPage,
    noData
  },
  mounted(){
    this.loginInfo = this.$store.login;
    this.$fetch(
            'envList',
            JSON.stringify({uId:this.loginInfo.uId}),
            d=>{
              if(d.code === 200){
                this.tempList = d.data;
              }
            }
    );
    setInterval(()=>{
      this.loadData();
    },this.basic.dTime)
  }
}
</script>

<style scoped>
  .temp_head{
    width:100%;
    height:7%;
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
    height:89%;
    padding:0 15px;
    overflow-y: auto;
  }

  .showPage{
    z-index:999;
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

  .login_icon{
    font-size:3rem;
  }

  .temp_env{
    overflow: auto;
    height:100%;
  }

  .temp_env li{
    height:8rem;
    padding:10px;
    margin:0 auto 20px;
    list-style: none;
    background:#fff;
    border-radius:10px;
    overflow: hidden;
    position: relative;
  }

  .showIcon{
    width:30%;
    height:100%;
    position: relative;
    float:left;
  }

  .big_icon{
    font-size:6rem;
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:auto;
  }

  .showTitle{
    width:70%;
    height:100%;
    float:left;
  }

  .showNum{
    position: absolute;
    top:13px;
    right:16px;
    width:30px;
    height:30px;
    z-index:5;
    color:#1890ff;
    border:5px solid ;
    border-radius: 50%;
    opacity:0.5;
    text-align: center;
    line-height: 30px;
    font-size:2.5rem;
    transform:scale(3);
  }

  .big_title{
    font-size:2.5rem;
    font-weight:600;
    /*text-align: center;*/
    letter-spacing: 2px;
    height:45px;
    overflow: hidden;
    padding-left:15px;
  }

  .show_tips{
    position: relative;
    background:#fff;
    z-index:0;
    margin-left:10px;
  }

  .m_tips{
    height:4rem;
    font-size:1rem;
    color:#2f2f2f;
    padding:5px 10px;
    background:#fff;
    display: block;
    box-sizing: border-box;
    overflow: hidden;
    border-radius:10px;
    /*text-align: center;*/
  }

  .show_tips::before{
    content:"";
    width:5%;
    height:4.1rem;
    display: block;
    position: absolute;
    z-index:-1;
    /*background:#1890ff;*/
    top:-1px;
    left:-3px;
    border-radius:10px 0 0 10px;
    opacity: 0.5;
  }

  .show_tips::after{
    content:"";
    width:5%;
    height:4.1rem;
    display: block;
    position: absolute;
    z-index:-1;
    /*background:#1890ff;*/
    top:-1px;
    right:-3px;
    border-radius:0 10px 10px 0;
    opacity:0.5;
  }

  .watch_env{
    height:4%;
    line-height: 200%;
    text-align: center;
    color:#999;
  }

  .watch_env:before{
    content:"-- "
  }

  .watch_env:after{
    content:" --"
  }

  .envType{
    color:#999;
    letter-spacing: 1px;
    font-weight:600;
    position: absolute;
    right:25px;
    bottom:0;
  }

  .refresh_move{
    margin:0 5px;
  }
</style>
