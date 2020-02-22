<template>
    <div class="edit">
        <div class="show_head">
            <h1 @click="showPage('show')">
                <fa-icon icon="chevron-left" class="right_icon"/>
                监测源信息修改
            </h1>
            <p>{{basic.tips}}</p>
        </div>
        <div class="about_content">
            <template v-if="!basic.lockContent">
                <div class="formItem">
                    <label>
                        <span>监测点名称</span>
                        <input type="text" placeholder="最长可输入5个汉字大小" v-model.trim="dataSource.name">
                    </label>
                </div>
                <div class="formItem">
                    <label>
                        <span>监测点描述</span>
                        <input type="text" placeholder="最长可输入20汉字大小" v-model.trim="dataSource.msg">
                    </label>
                </div>
                <div class="formItem">
                    <label>
                        <span>监测点编码</span>
                        <input type="text" placeholder="用于唯一标识监测点" v-model.trim="dataSource.devId">
                    </label>
                </div>
                <div class="dividerBar">
                    <span>扩展信息</span>
                </div>
                <div class="formItem bigSize">
                    <label>
                        <span>监测点删除密钥</span>
                        <input type="text" placeholder="请牢记密钥，丢失无法找回" v-model.trim="dataSource.delCode">
                    </label>
                </div>
                <div class="formItem bigSize">
                    <span>监测点可修改</span>
                    <radio :status="dataSource.edit" name="edit" @changeStatus="changeRadio" />
                </div>
                <template v-if="dataSource.edit">
                    <div class="formItem bigSize">
                        <label>
                            <span>修改密钥</span>
                            <input type="text" placeholder="留空则修改无需密钥" v-model.trim.lazy="dataSource.editCode">
                        </label>
                    </div>
                </template>
                <div class="formItem bigSize">
                    <span>监测点控制锁</span>
                    <radio :status="dataSource.control" name="control" @changeStatus="changeRadio" />
                </div>
                <template v-if="dataSource.control">
                    <div class="formItem bigSize">
                        <label>
                            <span>开启监测密钥</span>
                            <input type="text" placeholder="开启监测指令(默认为on)" v-model.trim.lazy="dataSource.codeOn">
                        </label>
                    </div>
                    <div class="formItem bigSize">
                        <label>
                            <span>关闭监测密钥</span>
                            <input type="text" placeholder="关闭监测指令(默认为off)" v-model.trim.lazy="dataSource.codeOff">
                        </label>
                    </div>
                </template>
                <div class="showSample">
                    <p>
                        监测点控制锁:当开启此选项后开启或者关闭检测点都需要输入对应密钥才可以开启或关闭监测点
                    </p>
                </div>

                <div class="subCode">
                    <button @click="saveChange">保存修改</button>
                </div>
            </template>
            <template v-else>
                <div class="subCode">
                    <h2 class="tipsMsg">此监测点信息不可修改<br />或需修改密钥</h2>
                    <div class="formItem">
                        <label>
                            <span>修改密钥</span>
                            <input type="text" placeholder="请输入密钥后继续" v-model.trim.lazy="checkMsg.saveChange">
                        </label>
                    </div>
                    <button @click="subEditCode">显示设备信息</button>
                </div>
            </template>
            <div class="delOption">
                <div class="formItem">
                    <label>
                        <span>删除密钥</span>
                        <input type="text" placeholder="请输入删除密钥" v-model.trim.lazy="checkMsg.delDev">
                    </label>
                </div>
                <button class="del_dev" @click="delDev">移除此监测点</button>
            </div>
            <div class="devMsg" v-if="basic.lockContent">
                <!--<p>监测点名称：{{name}}</p>-->
                <p>监测点编码：{{id}}</p>
            </div>
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
        props:["id","name"],
        data(){
            return {
                basic:{
                    tips:"返回上一页后未保存的操作将失效",
                    lockContent:true
                },
                dataSource:{
                    name:"",
                    msg:"",
                    devId:"",
                    edit:false,
                    control:false,
                    delCode:"",
                    editCode:"",
                    codeOn:"",
                    codeOff:""
                },
                checkMsg:{
                  saveChange:"",
                  delDev:""
                },
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
                        this.messageBox.show = false;
                        if(this.checkMsg.delDev === ""){
                            this.messageBox = {
                                show:true,
                                showOk:true,
                                showCancel:false,
                                okText:"好",
                                msg : "请输入删除密钥！",
                            }
                        }else{
                            this.axios
                                .post('/api/delDev',
                                    {
                                        "devId": this.id,
                                        "key": this.checkMsg.delDev
                                    }
                                )
                                .then((res)=>{
                                    if(res.data.code === 200){
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
                                        this.checkMsg.delDev = "";
                                    }
                                });
                        }
                    }else if(name === "sub"){
                        this.axios
                            .post('/api/saveData',
                                this.dataSource
                            )
                            .then((res)=>{
                                if(res.data.code === 200){
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
                            });
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
                    cancelText:"再看看",
                    name:"sub",
                    msg : "请确认所有信息填写正确，否则可能导致之后无法修改！",
                }
            },
            subEditCode(){
                this.axios
                    .post('/api/codeCheck',
                        {
                            "devId": this.id,
                            "name":"editCode",
                            "value": this.checkMsg.saveChange
                        })
                    .then((res)=>{
                        if(res.data.code === 200){
                            this.axios
                                .post('/api/getDevEditInfo',
                                    {
                                        "devId": this.id
                                    }
                                )
                                .then((r) => {
                                    let res = r.data;
                                    if (res.code === 200) {
                                        this.basic.lockContent = false;
                                        this.dataSource = res.data;
                                        if(!res.data.contol){
                                            this.dataSource.codeOn = "";
                                            this.dataSource.codeOff = "";
                                        }
                                        this.messageBox = {
                                            show:true,
                                            cancelText:"好",
                                            msg : "数据读取成功！",
                                        };
                                    }
                                })
                        }else{
                            this.messageBox = {
                                show:true,
                                cancelText:"好",
                                msg : "验证失败！",
                            };
                        }
                    });
            }
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

    .showSample{
        background:#ddd;
        border-radius:10px;
        margin-top:20px;
        padding:10px;
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

    .tipsMsg{
        margin:15px 0;
        text-align: center;
    }

    .devMsg{
        margin-top:100px;
        text-align: center;
        font-size:1.5rem;
        border:1px solid #c1c1c1;
        letter-spacing: 1px;
        padding:10px;
    }

    .devMsg p{
        margin:10px 0;
    }
</style>