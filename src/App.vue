<template>
  <div id="app">
    <router-view class="temp_border"/>
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
    border-bottom:1px solid #ddd;
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
</style>
