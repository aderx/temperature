<template>
    <div class="logPage page_frame">
        <div class="page_head">
            <h1>监测点预警日志</h1>
            <p>只有当开启预警日志功能后才会记录新的值，日志不上传远端。</p>
        </div>
        <div class="page_content">
            <div class="showLog">
                <ul v-if="logList.length>0">
                    <li v-for="(item,index) in logList">
                        <span>{{index+1}}：</span>
                        <span>[{{item.time}}]</span>
                        <span>{{item.name}}（{{item.id}}）</span>
                        <span>实时达到：{{item.onTime}}℃</span>
                        <span>超出阈值：{{item.over}}℃</span>
                    </li>
                </ul>
                <template v-else>
                    <h3>暂无日志信息。</h3>
                </template>
            </div>
            <div class="showOption">
                <div class="show_btn">
                    <button class="del_btn" @click="moveItem($event)">清空所有日志</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "showlog",
        data(){
            return {
                logList:[]
            }
        },
        methods:{
            moveItem(e){
                if(e.target.className === 'del_btn'){
                    e.target.className = 'nor_btn';
                    e.target.innerText = '再次点击以确认操作！';
                }else if(e.target.className === 'nor_btn'){
                    localStorage.removeItem('warmLog');
                    this.logList = [];
                    e.target.innerText = '所有日志已清空';
                }
                setTimeout(()=>{
                    e.target.className = 'del_btn';
                    e.target.innerText = '清空所有日志';
                },2500);
            }
        },
        mounted() {
            let log = JSON.parse(localStorage.getItem('warmLog'));
            if(log){
                this.logList = log;
            }
        }
    }
</script>

<style scoped>
    .showLog{
        height:90%;
        overflow: auto;
    }
    .showOption{
        border-top:1px solid #c1c1c1;
        padding-top:5px;
        height:10%;
    }

    .showLog li{
        word-break:keep-all;
        white-space:nowrap;
    }

    .showLog li span{
        margin-right:10px;
    }
</style>