<template>
    <div class="addDataSource page_frame">
        <div class="page_head">
            <h1>新增场景</h1>
            <p>请填写所有信息</p>
        </div>
        <div class="page_content">
            <div class="dividerBar">
                <span>基础信息</span>
            </div>
            <div class="formItem">
                <label>
                    <span>场景名称</span>
                    <input type="text" placeholder="最长可输入16个字符" v-model.trim="dataSource.info.name">
                </label>
            </div>
            <div class="formItem">
                <label>
                    <span>场景描述</span>
                    <input type="text" placeholder="简单介绍下这个场景吧" v-model.trim="dataSource.info.desc">
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
            <div class="formItem bigSize">
                <label>
                    <span>数据读取地址</span>
                    <input type="text" placeholder="无需添加http(s)://" v-model.trim="dataSource.info.link">
                </label>
            </div>
            <div class="showSample">
                <p>
                    当前场景内的所有监测点均会通过此链接获取数据。<br/>可以留空，留空后将使用系统默认地址。
                </p>
            </div>
            <div class="dividerBar">
                <span>扩展信息</span>
            </div>
            <div class="formItem">
                <label>
                    <span>场景标识</span>
                    <input type="text" placeholder="请输入或选择标识代码" v-model.trim="dataSource.info.icon">
                </label>
            </div>
            <iconSelect @getIcon="getIcon" />
            <div class="showSample">
                <p>
                    图标ICON用于标识不同监测点，可以从 《 <a href="https://fontawesome.com/icons?d=gallery&s=solid" target="_blank">这里</a> 》 查找需要的图标，复制图标名字后，粘贴到输入框内。
                </p>
            </div>
            <div class="formItem" style="position: relative;">
                <label>
                    <span>图标颜色</span>
                    <input type="text"  placeholder="请输入或选择一个颜色" v-model.trim="dataSource.info.color">
                    <span class="showColorBox" :style="'background:'+dataSource.info.color">当前设置颜色</span>
                </label>
            </div>
            <colorSelect @getColor="getColor"/>
            <div class="dividerBar">
                <span>其他操作</span>
            </div>
            <div class="formItem bigSize">
                <span>公开此场景</span>
                <radio :status="dataSource.option.showAllUser" name="showAllUser" @changeStatus="changeRadio"/>
            </div>
            <div class="showSample">
                <p>
                    <b style="color:#f10214;">提交后不支持修改此属性。</b><br>
                    公开场景后无论用户是否登录均可以查看。<br>
                    场景不公开时只有当前用户登录后可以查看。
                </p>
            </div>
            <div class="formItem bigSize">
                <span style="width:65%;">直线型场景</span>
                <radio :status="dataSource.option.line" name="line" @changeStatus="changeRadio"/>
            </div>
            <div class="formItem bigSize">
                <label>
                    <span>场景面积（m²）</span>
                    <input type="text" placeholder="可填写估算值" v-model.trim="dataSource.option.area">
                </label>
            </div>
            <div class="showSample">
                <p>
                    <b style="color:#f10214;">提交后不支持修改此属性。</b><br>
                    用于计算场景内平均温度。<br />
                    直线型：场景形状类似于长方形。<br>
                    非直线型：场景形状类似于正方形。<br>
                    场景面积用于计算场景平均温度。
                </p>
            </div>
            <div class="subCode">
                <button @click="submitData">确定新增</button>
            </div>
        </div>
        <msg
            :config="messageBox"
        />
    </div>
</template>

<script>
    import colorSelect from "../components/colorSelect";
    import iconSelect from "../components/iconSelect";

    export default {
        name: "add",
        data() {
            return {
                basic:{
                    moreColor:false
                },
                dataSource: {
                    info:{
                        name:"",
                        desc:"",
                        link:"",
                        icon:"",
                        color:"#1890ff"
                    },
                    limit:{
                        min:'',
                        max:''
                    },
                    option:{
                        showAllUser:true,
                        line:true,
                        area:''
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
            submitData(){
                let d= this.dataSource;
                if(!d.info.name || !d.info.desc){
                    this.messageBox = {
                        show:true,
                        cancelText:"好",
                        name:"basicBox",
                        msg:"场景基础信息不能为空！"
                    }
                }else if(!d.info.icon || !d.info.color){
                    this.messageBox = {
                        show:true,
                        cancelText:"好",
                        name:"ExpandBox",
                        msg:"请选择或者输入场景的扩展信息！"
                    }
                } else{
                    if(!d.option.area){
                        this.messageBox = {
                            show:true,
                            cancelText:"好",
                            name:"areaBox",
                            msg:"场景面积不能为空！"
                        }
                    }else{
                        d.uId = this.$store.login.uId;
                        if(isNaN(Number(d.limit.min)) || d.limit.min === '' || d.limit.min<-999)d.limit.min = -Infinity;
                        if(isNaN(Number(d.limit.max)) || d.limit.max === '' || d.limit.max>-999)d.limit.max = Infinity;
                        this.$fetch(
                            'envAdd',
                            JSON.stringify(d),
                            d=>{
                                if(d.code === 200){
                                    this.messageBox = {
                                        show:true,
                                        cancelText:"好",
                                        name:"okBox",
                                        msg:"场景新增成功，数据刷新后可见！"
                                    };
                                    this.dataSource = {
                                        info:{
                                            name:"",
                                            desc:"",
                                            link:"",
                                            icon:"",
                                            color:"#1890ff"
                                        },
                                        limit:{
                                            min:'',
                                            max:''
                                        },
                                        option:{
                                            showAllUser:true,
                                            line:true,
                                            area:''
                                        }
                                    }
                                }else{
                                    this.messageBox = {
                                        show:true,
                                        cancelText:"好",
                                        name:"errBox",
                                        msg:"场景新增失败，请重试！"
                                    }
                                }
                            }
                        )
                        .catch(e=>{
                            this.messageBox = {
                                show:true,
                                cancelText:"好",
                                name:"errBox",
                                msg:"场景新增失败！"
                            };
                            console.log(e);
                        })
                    }
                }

            },
            getColor(color){
                this.dataSource.info.color = color;
            },
            getIcon(name){
                this.dataSource.info.icon = name;
            }
        },
        components:{
            colorSelect,
            iconSelect
        }
    }
</script>

<style scoped>
    .showColorBox{
        width:10px;
        height:10px;
        background:#fff;
        position: absolute;
        left:25%;
        top:38%;
        overflow: hidden;
    }

</style>