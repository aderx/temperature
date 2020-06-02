<template>
    <div class="aboutMe page_frame">
        <div class="page_head">
            <h1>监测场景设置</h1>
            <p>场景信息修改为本地修改，保存后将同步到远端。</p>
        </div>
        <div class="page_content">
            <template v-if="envInfo.envId && envInfo.uId === $store.login.uId">
                <div class="dividerBar">
                    <span>场景信息</span>
                </div>
                <div class="formItem">
                    <label>
                        <span>场景名称</span>
                        <input type="text" placeholder="请输入场景名称" v-model.trim="envInfo.info.name">
                    </label>
                </div>
                <div class="formItem">
                    <label>
                        <span>场景描述</span>
                        <input type="text" placeholder="请输入场景描述" v-model.trim="envInfo.info.desc">
                    </label>
                </div>
                <div class="moreBtn" v-show="!moreMsg" @click="()=>{this.moreMsg = true;}">更多信息</div>
                <div class="moreBtn" v-show="moreMsg" @click="()=>{this.moreMsg = false;}">更少信息</div>
                <div class="showMore" v-show="moreMsg">
                    <div class="formItem bigSize">
                        <label>
                            <span>温度阈值(℃)</span>
                            <input type="text" class="smallInput" placeholder="最小值" v-model.trim="envInfo.limit.min">
                            -
                            <input type="text" class="smallInput" placeholder="最大值" v-model.trim="envInfo.limit.max">
                        </label>
                    </div>
                    <div class="formItem bigSize">
                        <label>
                            <span>数据读取链接</span>
                            <input type="text" placeholder="无需添加http(s)://" v-model.trim="envInfo.info.link">
                        </label>
                    </div>
                    <div class="formItem">
                        <label>
                            <span>场景标识</span>
                            <input type="text" placeholder="请输入FontAwesome图标唯一编码" v-model.trim="envInfo.info.icon">
                        </label>
                    </div>
                    <iconSelect  @getIcon="getIcon"/>
                    <div class="formItem" style="position: relative;">
                        <label>
                            <span>图标颜色</span>
                            <input type="text"  placeholder="请输入或选择一个颜色" v-model.trim="envInfo.info.color">
                            <span class="showColorBox" :style="'background:'+envInfo.info.color">当前设置颜色</span>
                        </label>
                    </div>
                    <colorSelect @getColor="getColor"/>
                    <div class="formItem bigSize">
                        <span>公开场景</span>
                        <radio :status="envInfo.option.showAllUser" />
                    </div>
                    <div class="formItem">
                        <span>直线型场景</span>
                        <radio :status="envInfo.option.line" />
                    </div>
                    <div class="formItem bigSize">
                        <label>
                            <span>场景面积（m²）</span>
                            <input type="text" placeholder="请输入数字" v-model.trim="envInfo.option.area">
                        </label>
                    </div>
                    <div class="show_btn">
                        <button class="back_btn" @click="saveEnv">保存场景信息</button>
                    </div>
                    <div class="show_btn">
                        <button class="del_btn" @click="delEnv">删除此场景</button>
                    </div>
                </div>
            </template>
            <div class="dividerBar">
                <span>其他设置</span>
            </div>
            <div class="show_btn">
                <button class="back_btn" @click="backEnv">切换场景</button>
            </div>
            <template v-if="envInfo.envId">
                <div class="dividerBar">
                    <span>更多设置</span>
                </div>
                <div class="formItem">
                    <span style="width:60%;">已运行设备优先展示</span>
                    <radio :status="sort === 'runFirst'" name="first" @changeStatus="changeStatus" />
                </div>
                <div class="formItem">
                    <span style="width:60%;">展示场景内平均温度</span>
                    <radio :status="showAve" name="ave" @changeStatus="changeStatus" />
                </div>

                <div class="formItem">
                    <span style="width:60%;">接收新的监测数据</span>
                    <radio :status="reFresh" name="fresh" @changeStatus="changeStatus" />
                </div>
                <div class="formItem bigSize">
                    <span>温度预警弹窗</span>
                    <radio :status="tempAlert" name="alert" @changeStatus="changeStatus" />
                </div>
                <div class="formItem bigSize">
                    <span>收集预警日志</span>
                    <radio :status="tempLog" name="log" @changeStatus="changeStatus" />
                </div>
                <div class="show_btn">
                    <button class="back_btn" @click="openPage('log')">查看预警日志</button>
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
    import colorSelect from "../components/colorSelect";
    import iconSelect from "../components/iconSelect";
    export default {
        name: "about",
        props:["envInfo","sort","reFresh","tempLog","showAve","tempAlert"],
        data(){
            return {
                messageBox:{
                    show:false
                },
                moreMsg:false,
                loginInfo:false
            }
        },
        computed:{
            getTime(){
                return this.time/1000;
            }
        },
        methods:{
            changeStatus(status,name){
                let set = {
                    dSort:this.sort,
                    showAve:this.showAve,
                    reFresh:this.reFresh,
                    tempAlert:this.tempAlert,
                    tempLog:this.tempLog
                };

                this.messageBox = {
                    show:true,
                    cancelText:"好",
                    name:name,
                    msg:"操作设置成功！"
                };
                if(name === "fresh"){
                    set.reFresh = status;
                    this.$emit('changeVal','reFresh',status,false,true);
                }else if(name === "first"){
                    set.dSort = status ? "runFirst":"default";
                    this.$emit('changeVal','dSort',status ? "runFirst":"default");
                }else if(name === "ave"){
                    set.showAve = status;
                    this.$emit('changeVal','showAve',status,false,true);
                }else if(name === "alert"){
                    set.tempAlert = status;
                    this.$emit('changeVal','tempAlert',status,false,true);
                }else if(name === "log"){
                    set.tempLog = status;
                    this.$emit('changeVal','tempLog',status,false,true);
                }

                localStorage.setItem('SETTING',JSON.stringify(set));
            },
            backEnv(){
                this.$router.push('/')
            },
            getColor(color){
                this.envInfo.info.color = color;
            },
            getIcon(name){
                this.envInfo.info.icon = name;
            },
            openPage(name){
                this.$parent.showPage(name);
            },
            saveEnv(){
                this.$fetch(
                    'envEdit',
                    JSON.stringify(this.envInfo),
                    d=>{
                        if(d.code === 200){
                            this.messageBox = {
                                show:true,
                                cancelText:"好",
                                name:'okBox',
                                msg:"修改保存成功！"
                            };
                        }else{
                            this.messageBox = {
                                show:true,
                                cancelText:"好",
                                name:'errBox',
                                msg:"保存失败，请重试！"
                            };
                        }

                    }
                )
            },
            delEnv(){
                this.messageBox = {
                    show:true,
                    showOk:true,
                    okText:"删除",
                    times:1,
                    msg : "确定要删除此场景吗？"
                }
            },
            checkBox(val,name){
                if(val) {
                    if (this.messageBox.times === 2) {
                        this.messageBox = {
                            show: true,
                            showOk: true,
                            okText: "确认删除",
                            times: 2,
                            msg: "删除操作不可撤销，确定删除吗？",
                        }
                    } else if (this.messageBox.times === 3) {
                        this.messageBox.show = false;
                        this.$fetch(
                            'envDel',
                            JSON.stringify({
                                uId:this.$store.login.uId,
                                envId:this.envInfo.envId
                            }),
                            d => {
                                if (d.code === 200) {
                                    let that = this;
                                    this.messageBox = {
                                        show: true,
                                        cancelText: "好",
                                        name: "del",
                                        msg: "环境已成功删除，数据更新后将不可见！",
                                        func(){
                                            //回到首页
                                            that.$router.replace("/");
                                        }
                                    };
                                } else {
                                    this.messageBox = {
                                        show: true,
                                        cancelText: "好",
                                        name: "delFail",
                                        msg: "删除失败！",
                                    };
                                }
                            }
                        )
                    }
                }
            }
        },
        components:{
            colorSelect,
            iconSelect
        }
    }
</script>

<style scoped>

    .back_btn{
        width:100%;
        height:3rem;
    }

    .show_btn{
        margin-top:20px;
    }

    .showColorBox{
        width:10px;
        height:10px;
        background:#fff;
        position: absolute;
        left:25%;
        top:38%;
        overflow: hidden;
    }

    .moreBtn{
        width:100%;
        margin:10px 0;
        text-align: center;
        border:1px solid #c1c1c1;
        padding:5px;
        box-sizing: border-box;
        border-radius:10px;
    }

</style>