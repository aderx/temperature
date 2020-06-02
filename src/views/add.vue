<template>
    <div class="addDataSource">
        <div class="about_head">
            <h1>新增监测点</h1>
            <p>请填写所有信息</p>
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
                <span>监测点运行中</span>
                <radio :status="dataSource.option.run" name="run" @changeStatus="changeRadio"/>
            </div>
            <div class="formItem bigSize">
                <span>公开监测点</span>
                <radio :status="dataSource.option.showAllUser" name="showAllUser" @changeStatus="changeRadio"/>
            </div>
            <div class="formItem">
                <span style="width:60%;">公开监测点历史数据</span>
                <radio :status="dataSource.option.openChart" name="openChart" @changeStatus="changeRadio"/>
            </div>
            <div class="showSample">
                <p>
                    私有环境内的监测点公开后仍只有创建者可见，因此此选项只适用于公开环境。
                </p>
            </div>
            <div class="subCode">
                <button @click="submitData">添加监测点</button>
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
                        run: true,
                        showAllUser:true,
                        openChart: true,
                    }
                },
                messageBox:{
                    show:false
                }
            }
        },
        methods: {
            changeRadio(val, name) {
                this.dataSource.option[name] = val;
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
                if(!d.info.name || !d.info.msg || !d.info.hCode){
                    this.messageBox = {
                        show:true,
                        cancelText:"好",
                        msg:"请完整填写信息！"
                    }
                }else{
                    this.subTo(d);
                }

            },
            subTo(d){
                d.uId = this.$store.login.uId;
                d.envId = this.$route.params.eId;
                this.$fetch(
                    'devAdd',
                    JSON.stringify(d),
                    res =>{
                        if(res.code === 200){
                            this.messageBox = {
                                show:true,
                                cancelText:"好",
                                name:"subOk",
                                msg:"监测点已添加，数据更新后可见！"
                            };
                            this.dataSource = {
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
                                    run: true,
                                    showAllUser:true,
                                    openChart: true,
                                }
                            };
                        }else{
                            this.messageBox = {
                                show:true,
                                cancelText:"好",
                                name:"subERR",
                                msg:"监测点添加失败，请重试！"
                            };
                        }
                    }
                ).catch(e=>{
                    this.messageBox = {
                        show:true,
                        cancelText:"好",
                        name:"subERR",
                        msg:"监测点添加失败！"
                    };
                    cosole.log(e);
                })
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

    .subCode button {
        width: 100%;
        height: 40px;
        margin-top: 20px;
    }

</style>