<template>
    <div class="edit">
        <div class="show_head">
            <h1 @click="showPage('show')">
                <fa-icon icon="chevron-left" class="right_icon"/>
                监测点信息修改
            </h1>
            <p>{{basic.tips}}</p>
        </div>
        <div class="about_content">
            <div class="dividerBar">
                <span>基础信息</span>
            </div>
            <div class="formItem">
                <label>
                    <span>监测点名称</span>
                    <input type="text" placeholder="最长可输入5个汉字大小" v-model.trim="dataSource.info.name">
                </label>
            </div>
            <div class="formItem">
                <label>
                    <span>监测点描述</span>
                    <input type="text" placeholder="最长可输入20汉字大小" v-model.trim="dataSource.info.msg">
                </label>
            </div>
            <div class="formItem bigSize">
                <label>
                    <span>监测点硬件编码</span>
                    <input type="text" placeholder="用于唯一标识监测点" v-model.trim="dataSource.info.hCode">
                </label>
            </div>
            <div class="formItem bigSize">
                <label>
                    <span>温度阈值(℃)</span>
                    <input type="text" class="smallInput" placeholder="最小值" v-model.trim="dataSource.limit.min">
                    -
                    <input type="text" class="smallInput" placeholder="最大值" v-model.trim="dataSource.limit.max">
                </label>
            </div>
            <div class="dividerBar">
                <span>扩展信息</span>
            </div>
            <div class="formItem bigSize">
                <span>公开监测点</span>
                <radio :status="dataSource.option.showAllUser" name="edit" @changeStatus="changeRadio"/>
            </div>
            <div class="formItem">
                <span style="width:60%;">公开监测点历史数据</span>
                <radio :status="dataSource.option.openChart" name="control" @changeStatus="changeRadio"/>
            </div>

            <template v-if="loginInfo && loginInfo.uId === dataSource.uId">
                <div class="subCode">
                    <button @click="saveChange">保存修改</button>
                </div>
                <div class="delOption">
                    <button class="del_dev" @click="delDev">移除此监测点</button>
                </div>
            </template>
            <template v-else>
                <div class="subCode">
                    <button class="de_btn">保存修改</button>
                </div>
            </template>
        </div>
        <msg
                :config="messageBox"
                @action="checkBox"
        />
    </div>
</template>

<script>
    export default {
        name: "edit",
        props:["id",'name'],
        data(){
            return {
                basic:{
                    tips:"仅允许监测点创建者修改监测点信息！",
                    lockContent:true
                },
                dataSource:{
                    info:{
                        name: "",
                        msg: "",
                        hCode:'',
                    },
                    limit:{
                        min:'',
                        max:''
                    },
                    option:{
                        showAllUser:true,
                        openChart: true,
                    }
                },
                loginInfo:false,
                messageBox:{
                    show:false
                }
            }
        },
        methods:{
            showPage(page){
                this.$emit("changeVal",'page',page,true)
            },
            changeRadio(val,name){
                this.dataSource[name] = val;
            },
            delDev() {
                this.messageBox = {
                    show:true,
                    showOk:true,
                    okText:"删除",
                    times:1,
                    msg : "确定要删除此监测点吗？"
                }
            },
            checkBox(val,name){
                if(val){
                    if(this.messageBox.times === 2){
                        this.messageBox = {
                            show:true,
                            showOk:true,
                            okText:"确认删除",
                            times:2,
                            msg : "删除操作不可撤销，确定删除吗？",
                        }
                    }else if(this.messageBox.times === 3){
                        this.$fetch(
                            'devDel',
                            JSON.stringify({uId:this.$store.login.uId,devId:this.dataSource.devId}),
                            res =>{
                                if(res.code === 200){
                                    this.messageBox = {
                                        show:true,
                                        cancelText:"好",
                                        name:"del",
                                        msg : "监测点已成功删除，数据更新后将不可见！",
                                    };
                                }else{
                                    this.messageBox = {
                                        show:true,
                                        cancelText:"好",
                                        name:"delFail",
                                        msg : "删除失败！",
                                    };
                                }
                            }
                        );
                    }else if(name === "sub"){
                        this.dataSource.uId = this.$store.login.uId;
                        this.$fetch(
                            'devEdit',
                            JSON.stringify(this.dataSource),
                            res => {
                                if(res.code === 200){
                                    this.messageBox = {
                                        show:true,
                                        cancelText:"好",
                                        name:"okSub",
                                        msg : "监测点信息已成功修改！",
                                    };
                                }else{
                                    this.messageBox = {
                                        show:true,
                                        cancelText:"好",
                                        msg : "数据提交失败！",
                                    };
                                }
                            }
                        );
                    }
                }else if(name === "del" || name === "okSub"){
                    this.$parent.hidePage();
                }
            },
            saveChange(){
                this.messageBox = {
                    show:true,
                    showOk:true,
                    okText:"确认",
                    cancelText:"取消",
                    name:"sub",
                    msg : "是否保存已修改的数据?",
                }
            }
        },
        mounted() {
            this.loginInfo = this.$store.login;
            this.$fetch(
                'devInfo',
                JSON.stringify({uId:this.loginInfo.uId,devId:this.id}),
                res=>{
                    if (res.code === 200) {
                        this.dataSource = res.data;
                    } else {
                        this.messageBox = {
                            show: true,
                            cancelText: "好",
                            name: "noDev",
                            msg: "监测点数据加载失败或已删除！",
                        };
                    }
                }
            );
        }
    }
</script>

<style scoped>
    .edit{
        height:100%;
    }
    .about_content{
        height:90%;
        overflow-y: auto;
        padding:20px 10px;
        box-sizing: border-box;
    }


    .show_head{
        height:10%;
    }

    .subCode button{
        width:100%;
        height:40px;
        margin-top:20px;
    }
    .dividerBar{
        height:10px;
        text-align: center;
        width:100%;
        border-bottom:1px dotted #ddd;
        margin:20px 0;
    }

    .dividerBar span{
        background:#fff;
        padding:0 10px;
        letter-spacing: 1px;
    }

    .delOption {
        margin: 20px 0;
    }

    .delOption button {
        width: 100%;
        height: 40px;
        background: #ff1100;
    }

</style>