<template>
    <div class="changeBtn" @click="radioChange" :style="'background:#'+background+';'">
        <div class="changeMe" :style="'left:'+left+'px;'"></div>
    </div>
</template>

<script>
    export default {
        name: "radio",
        props:['status','name'],
        data(){
            return {
                left:2,
                background:"c1c1c1"
            }
        },
        methods:{
            radioChange(){
                if(!this.status){
                    this.$emit("changeStatus",true,this.name);

                }else{
                    this.$emit("changeStatus",false,this.name);
                }
            },
            statusWatch(status){
                if(status){
                    this.left = 23;
                    this.background = "1b82f1";

                }else{
                    this.left = 2;
                    this.background = "c1c1c1";
                }
            }
        },
        watch:{
            status(){
                this.statusWatch(this.status);
            }
        },
        mounted(){
            if(this.status){
                this.left = 23;
                this.background = "1b82f1";
            }
        }
    }
</script>

<style>
    .changeBtn{
        width:55px;
        height:34px;
        border-radius:50px;
        overflow: hidden;
        position: relative;
    }

    .changeMe{
        width:30px;
        height:30px;
        background:#fff;
        border-radius:50%;
        position: absolute;
        top:2px;
        transition:all .5s;
    }
</style>