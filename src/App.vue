<template>
  <div id="app">
    <transition name="fade">
      <router-view class="temp_border"/>
    </transition>

  </div>
</template>

<style>
  html,body{
    height:100%;
    background: #f0f0f0;
    font-size:12px;
  }

  *{margin:0;padding:0}

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height:100%;
    overflow: hidden;
  }

  .temp_border{
    width:100%;
    height:100vh;
    max-width:768px;
    min-width:375px;
    margin:0 auto;
    position: relative;
  }

  .card{
    width:100%;
    background:#fff;
    border-radius:10px;
    box-sizing: border-box;
    padding:10px;
    margin-bottom:20px;
    cursor:pointer;
    box-shadow: 0 0 10px 0 #c1c1c1;
  }

  .card:hover{
    box-shadow: 0 0 20px 1px #c1c1c1;
  }

  .page_frame{
    height:100%;
    overflow: auto;
  }

  .page_head{
    height:10%;
  }

  .page_content{
    height:90%;
    padding:10px;
  }

  .formItem{
    height:40px;
    line-height: 40px;
    margin-top:10px;
    border-bottom:1px solid #ddd;
  }

  .formItem span{
    width:30%;
    font-size:1.4rem;
    letter-spacing: 1px;
    display: inline-block;
    margin-top:-2px;
  }

  .formItem input{
    width:70%;
    padding-left:10px;
    border:0;
    height:40px;
    box-sizing: border-box;
    outline: 0;
  }

  .formItem input:hover{
    outline: 0;
  }

  .formItem .changeBtn{
    float:right;
    margin-right:10px;
  }

  button{
    background: #1890ff;
    border-radius:10px;
    color:#fff;
    font-size:1.4rem;
    outline: 0;
    border:0;
    letter-spacing: 3px;
  }

  button:hover{
    opacity: 0.8;
  }

  .bigSize span{
    width:40%;
  }

  .bigSize input{
    width:60%;
  }

  .nor_btn{
    width: 100%;
    height: 40px;
  }

  .del_btn {
    width: 100%;
    height: 40px;
    background: #ff1100;
  }

  .de_btn{
    background:#9c9c9c;
  }

  .dividerBar {
    height: 10px;
    text-align: center;
    width: 100%;
    border-bottom: 1px dotted #ddd;
    margin: 20px 0;
  }

  .dividerBar span {
    background: #fff;
    padding: 0 10px;
    letter-spacing: 1px;
  }

  .subCode button {
    width: 100%;
    height: 40px;
    margin-top: 20px;
  }

  .showSample {
    background: #ddd;
    border-radius: 10px;
    margin-top: 20px;
    padding: 10px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .smallInput{
    width:25%!important;
    text-align: center;
    font-size:1.5rem;
    position: relative;
  }

  .refresh_move{
    animation: fresh 20s linear infinite;
    -webkit-animation-fill-mode:both;
  }

  @keyframes fresh {
    from{
      transform: rotateZ(0deg);
    }
    to{
      transform: rotateZ(3600deg);
    }
  }
</style>
