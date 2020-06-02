<template>
    <div class="selectColor" @click="putColor($event)">
        <button>默认</button>
        <button style="background:#f10214">红色</button>
        <button style="background:#009814">绿色</button>
        <button style="background:#e8c517">黄色</button>
        <div class="showMore" v-show="!moreColor" @click="colorSet(1)">更多颜色</div>
        <div class="showMore" v-show="moreColor" @click="colorSet(0)">更少颜色</div>
        <div class="moreColor" v-show="moreColor">
            <button v-for="item in colorList" :style="'background:'+item">{{item}}</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "colorSelect",
        data(){
            return {
                moreColor:false,
                colorList:[
                "#5fdaff",
                "#6587ff",
                "#4e31ff",
                "#2894ff",
                "#ff314c",
                "#ff6040",
                "#ff4b5c",
                "#ff827d",
                "#55bb22",
                "#40ffd6",
                "#51ff7c",
                "#a4ffba",
                "#c82bff",
                "#9c35ff",
                "#ff8bdf",
                "#eb5bff",
                "#f1ee28",
                "#999999",
                "#442c2f",
                "#000000"
                ]
            }
        },
        methods:{
            putColor(e){
                if(e.target.tagName === "BUTTON"){
                    this.$emit("getColor",e.target.style.backgroundColor || '#1890ff')
                }
            },
            colorSet(num) {
                this.moreColor = (num === 1);
            }
        }
    }
</script>

<style scoped>
    .selectColor{
        margin-top:20px;
    }

    .selectColor button{
        width:5rem;
        height:3rem;
        margin:0 15px 10px 0;
        text-align: center;
    }

    .moreColor button{
        width:5.5rem;
        font-size:0.8rem;
        letter-spacing: 1px;
        margin-right:12px;
    }

    .showMore{
        width:100%;
        height:25px;
        line-height:27px;
        border:1px solid #c1c1c1;
        margin-bottom:10px;
        border-radius:10px;
        text-align: center;
    }
</style>