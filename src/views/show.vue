<template>
    <div class="show">
        <div class="show_head">
            <div class="headMsg">
                <h1 @click="showPage('edit')">
                    {{list.info.name}}（{{list.option.showAllUser ? '公开':'私有'}}）
                    <fa-icon icon="chevron-right" class="right_icon"/>
                </h1>
                <p>{{basic.tips}}</p>
            </div>
            <div class="headFresh">
                <div class="ro" @click.stop="reLoadPage($event)">
                    <fa-icon icon="sync-alt" class=""/>
                </div>
            </div>
        </div>
        <div class="show_content">
            <div class="show_msg">
                <b>温度阈值：{{getMin}}℃ ~ {{getMax}}℃</b><br>
                {{list.info.msg}}
            </div>
            <div class="show_temp">
                <div class="nowTemp">
                    <div class="show_tempBack">
                        <p>当前温度</p>
                        <p class="show_now">
                        <span
                                class="show_big show_nowTemp"
                                :style="'color:#'+basic.tempColor+';'"
                        >{{showTemp}}</span>
                        </p>
                    </div>
                </div>
                <div class="hisTemp">
                    <div class="show_tempBack ">
                        <p>历史最高温度</p>
                        <p class="show_high">
                        <span
                                class="show_big show_highTemp"
                                :style="'color:#'+basic.tempHighColor+';'"
                        >{{showHighTemp}}</span>
                        </p>
                    </div>
                    <div class="show_tempBack ">
                        <p>历史最低温度</p>
                        <p class="show_high">
                        <span
                                class="show_big show_lowerTemp"
                                :style="'color:#'+basic.tempLowerColor+';'"
                        >{{showLowerTemp}}</span>
                        </p>
                    </div>
                </div>

            </div>
            <div class="formItem bigSize">
                <span>启用监测点</span>
                <radio
                        :status="list.option.run"
                        @changeStatus="runDev"
                />
            </div>
        </div>
        <div class="show_chart" v-if="list.option.openChart || list.uId === loginInfo.uId">
            <v-chart
                    :options="chart"
                    :autoresize="true"
            />
        </div>
        <msg
                :config="messageBox"
        />
    </div>
</template>

<script>
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/toolbox'
    import 'echarts/lib/component/dataZoom'
    import 'echarts/lib/component/visualMap'

    export default {
        name: "show",
        props: ["id"],
        data() {
            return {
                basic: {
                    tips: "数据非实时刷新，更新数据请点击右侧按钮。",
                    tempColor: "c1c1c1",
                    tempHighColor: "c1c1c1",
                    tempLowerColor: "c1c1c1"
                },
                list: {
                    uId:'',
                    info:{
                        name: "",
                        msg: "",
                        hCode:'',
                    },
                    limit:{
                        min:'',
                        max:''
                    },
                    show:{
                      temp:0
                    },
                    option:{
                        showAllUser:true,
                        openChart: true,
                    }
                },
                loginInfo:false,
                chart: {
                    title: {
                        text: '历史温度变化曲线'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b}<br />{a}:{c}℃'
                    },
                    xAxis: {
                        data:[]
                         ,
                        position: 'bottom'
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        }
                    },
                    grid: {
                        bottom: 80
                    },
                    toolbox: {
                        top: 0,
                        right: 0,
                        orient: "horizontal",
                        feature: {
                            dataZoom: {
                                xAxisIndex: true
                            },
                            saveAsImage: {},
                            restore: {}
                        }
                    },
                    dataZoom: [
                        {
                            type: 'slider'
                        }
                    ],
                    visualMap: {
                        top: 30,
                        right: 0,
                        pieces: [
                            {
                                max: 0,
                                symbol: 'circle',
                                color: '#1890FF'
                            },
                            {
                                min: 0,
                                max: 20,
                                symbol: 'circle',
                                color: '#096'
                            },
                            {
                                min: 20,
                                max: 30,
                                symbol: 'circle',
                                color: '#ff9933'
                            },
                            {
                                min: 30,
                                max: 40,
                                symbol: 'circle',
                                color: '#cc0033'
                            },
                            {
                                min: 40,
                                max: 50,
                                symbol: 'circle',
                                color: '#660099'
                            },
                            {
                                min: 50,
                                symbol: 'circle',
                                color: '#7e0023'
                            }
                        ],
                        outOfRange: {
                            color: '#999',
                            symbol: 'circle'
                        },
                        textStyle:{
                            fontSize:10
                        }
                    },
                    series: {
                        name: '温度',
                        type: 'line',
                        data:[]
                    }
                },
                messageBox: {
                    show: false
                }
            }
        },
        computed: {
            showTemp() {
                this.changeColor('tempColor', this.list.show.temp);
                return this.list.show.temp;
            },
            showHighTemp() {
                this.changeColor('tempHighColor', this.list.show.highestTemp);
                return this.list.show.highestTemp ? this.list.show.highestTemp :'-';
            },
            showLowerTemp() {
                this.changeColor('tempLowerColor', this.list.show.lowestTemp);
                return this.list.show.lowestTemp ? this.list.show.lowestTemp :'-';
            },
            getMin(){
                return this.list.limit.min===null ? '-∞': this.list.limit.min;
            },
            getMax(){
                return this.list.limit.max===null ? '∞': this.list.limit.max;
            }
        },
        methods: {
            changeColor(val, temp) {
                if (this.list.option.run) {
                    if (temp <= 0) {
                        this.basic[val] = "1890FF";
                    } else if (temp <= 20) {
                        this.basic[val] = "096";
                    } else if (temp <= 30) {
                        this.basic[val] = "ff9933";
                    } else if (temp <= 40) {
                        this.basic[val] = "cc0033";
                    } else if (temp <= 50) {
                        this.basic[val] = "660099";
                    } else {
                        this.basic[val] = "7e0023";
                    }
                } else {
                    this.basic[val] = "999";
                }
            },
            runDev(status) {
                this.list.option.run = status;
                this.subStatus();

            },
            showPage(val) {
                this.$emit("changeVal", 'page', val, true);
            },
            subStatus() {
                this.$fetch(
                    'devStatus',
                    JSON.stringify({uId:this.loginInfo.uId,devId:this.list.devId,run:this.list.option.run}),
                    res=>{
                        if (res.code !== 200) {
                            this.list.option.run = !this.list.option.run;
                        }
                    }
                );
            },
            formatTime(t) {
                const time = new Date(t);
                let y = time.getFullYear();
                let m = time.getMonth() + 1;
                let d = time.getDate();
                let h = time.getHours();
                let mi = time.getMinutes();
                let s = time.getSeconds();
                m = m < 10 ? `0${m}` : m;
                d = d < 10 ? `0${d}` : d;
                h = h < 10 ? `0${h}` : h;
                mi = mi < 10 ? `0${mi}` : mi;
                s = s < 10 ? `0${s}` : s;
                return `${y}-${m}-${d}\n${h}:${mi}:${s}`;
            },
            chartUpdate() {
                this.$fetch(
                    'getChart',
                    JSON.stringify({uId:this.loginInfo.uId,devId:this.id}),
                    res=>{
                        this.chart.xAxis.data = res.data.map(item => this.formatTime(item['time']));
                        this.chart.series.data = res.data.map(item => item['temp']);
                    }
                );
            },
            infoUpdate(callback) {
                this.$fetch(
                    'devInfo',
                    JSON.stringify({uId:this.loginInfo.uId,devId:this.id}),
                    res=>{
                        if (res.code === 200) {
                            this.list = res.data;
                        } else {
                            this.messageBox = {
                                show: true,
                                cancelText: "好",
                                name: "noDev",
                                msg: "监测点数据加载失败或已删除！",
                            };
                        }
                        callback ? callback(res) : "";
                        if(this.list.option.openChart || this.list.uId === this.loginInfo.uId){
                            this.chartUpdate();
                        }
                    }
                );
            },
            reLoadPage(e){
                let t = e.currentTarget;
                t.className = "refresh_move";
                this.infoUpdate((res) => {
                    setTimeout(() => {
                        t.className = "";
                    },2000);
                })

            }
        },
        watch: {
            id: function (val) {
                if (val === "#default") {
                    return;
                }

                this.infoUpdate();
            }
        },
        mounted() {
            this.loginInfo = this.$store.login;
            this.infoUpdate();
        }
    }
</script>

<style scoped>
    .show {
        overflow-y: auto;
        height: 100%;
    }

    .show_head p {
        font-size: 1.2rem;
        color: #c1c1c1;
    }

    .show_temp {
        margin: 10px 0;
        overflow: hidden;
    }

    .show_now, .show_high {
        text-align: center;
        font-weight: 600;
        font-size: 2rem;
    }

    .show_big {
        font-weight: 400;
        font-size: 8rem;
    }

    .show_tempBack {
        width: 50%;
        height: 150px;
        padding: 10px;
        box-sizing: border-box;
        float: left;
        position: relative;
    }

    .show_tempBack p:last-child:after {
        content: "℃"
    }

    .hisTemp > .show_tempBack:last-child::before {
        content: "";
        width: 1px;
        height: 100px;
        position: absolute;
        left: 0;
        bottom: 20px;
        background: #c1c1c1;
    }

    .formItem {
        border-top: 1px solid #c1c1c1;
        padding: 7px 10px 0;
    }

    .show_chart {
        margin-top: 30px;
    }

    .show_chart > p {
        padding-left: 10px;
    }

    .show_msg {
        width: 100%;
        height: 60px;
        overflow: hidden;
        background: #ccc;
        border-radius: 10px;
        margin-top: 10px;
        padding: 10px;
        box-sizing: border-box;
        letter-spacing: 1px;
    }

    .echarts {
        width: 100%;
        height: 400px;
    }

    .right_icon {
        margin-bottom: -1px;
    }

    .nowTemp {
        width: 100%;
        overflow: hidden;
        border-bottom: 1px solid #ccc;
    }

    .nowTemp > .show_tempBack {
        width: 100%;
        height: 140px;
    }

    .nowTemp .show_big {
        font-size: 10rem;
        line-height: 9rem;
    }

    .show_head{
        width:100%;
        height:50px;
    }

    .headMsg{
        width:85%;
        float:left;
    }

    .headFresh{
        width:15%;
        height:100%;
        line-height: 50px;
        float:left;
        font-size:2rem;
        text-align: center;
    }
</style>