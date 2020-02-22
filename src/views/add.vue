<template>
    <div class="addDataSource">
        <div class="about_head">
            <h1>新增数据源</h1>
            <p>请填写所有信息</p>
        </div>
        <div class="about_content">
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
                <radio :status="dataSource.edit" name="edit" @changeStatus="changeRadio"/>
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
                <radio :status="dataSource.control" name="control" @changeStatus="changeRadio"/>
            </div>
            <template v-if="dataSource.control">
                <div class="formItem bigSize">
                    <label>
                        <span>开启监测密钥</span>
                        <input type="text" placeholder="开启监测指令(默认为on)"
                               v-model.trim.lazy="dataSource.codeOn">
                    </label>
                </div>
                <div class="formItem bigSize">
                    <label>
                        <span>关闭监测密钥</span>
                        <input type="text" placeholder="关闭监测指令(默认为off)"
                               v-model.trim.lazy="dataSource.codeOff">
                    </label>
                </div>
            </template>
            <div class="showSample">
                <p>
                    监测点控制锁:当开启此选项后开启或者关闭检测点都需要输入对应密钥才可以开启或关闭监测点
                </p>
            </div>
            <div class="subCode">
                <button @click="submitData">添加数据源</button>
            </div>
        </div>
        <msg
            :config="messageBox"
            @action="checkBox"
        />
    </div>
</template>

<script>
    import radio from '@/components/radio'

    export default {
        name: "add",
        data() {
            return {
                dataSource: {
                    name: "",
                    msg: "",
                    devId: "",
                    edit: false,
                    control: false,
                    delCode: "",
                    editCode: "",
                    codeOn: "",
                    codeOff: ""
                },
                messageBox:{
                    show:false
                }
            }
        },
        methods: {
            changeRadio(val, name) {
                this.dataSource[name] = val;
            },
            checkBox(status,name){
                if(status){
                    this.subTo();
                }else if(name === "subOk"){
                    this.$parent.hidePage();
                }
            },
            submitData(){
                let d=this.dataSource;
                if(!d.name || !d.msg || !d.devId || !d.delCode){
                    this.messageBox = {
                        show:true,
                        cancelText:"好",
                        msg:"请完整填写信息！"
                    }
                }else{
                    if(!d.edit || !d.control){
                        this.messageBox = {
                            show:true,
                            showOk:true,
                            cancelText:"再看看",
                            name:"confirmMsg",
                            msg:"请注意，由于您未对数据加锁，将导致所有人可以修改，确定吗！"
                        }
                    }else{
                        this.subTo();
                    }
                }

            },
            subTo(){
                this.axios
                    .post('/api/addDev',
                        this.dataSource
                    )
                    .then((res)=>{
                        if(res.code === 200){
                            this.list = res.data;
                        }
                    });
                this.messageBox = {
                    show:true,
                    cancelText:"好",
                    name:"subOk",
                    msg:"数据已提交，服务器与监测点连接成功后将在数据采集后更新在主页！"
                };
                this.dataSource = {name: "", msg: "", devId: "", edit: false, control: false, delCode: "", editCode: "", codeOn: "", codeOff: ""};
            }
        },
        components: {
            radio
        }
    }
</script>

<style scoped>
    .about_content {
        height: 90%;
        overflow-y: auto;
        padding: 20px 10px;
        box-sizing: border-box;
    }

    .addDataSource {
        height: 100%;
    }

    .about_head {
        height: 10%;
    }

    .showSample {
        background: #ddd;
        border-radius: 10px;
        margin-top: 20px;
        padding: 10px;
    }

    .subCode button {
        width: 100%;
        height: 40px;
        margin-top: 20px;
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
</style>