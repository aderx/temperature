<template>
    <div class="iconSelect">
        <div class="moreIcon" :style="'height:'+height+'px;'">
            <button v-for="item in iconList" class="ico_btn" @click="sendIcon(item)">
                <fa-icon :icon="item"/>
            </button>
        </div>
        <div class="showMore" @click="showMore($event)">更多图标</div>
    </div>
</template>

<script>
    export default {
        name: "iconSelect",
        data(){
            return {
                height:40,
                iconList:
                    [
                        "laugh-wink",
                        "award",
                        "atom",
                        "bath",
                        "bed",
                        "beer",
                        "bell",
                        "bong",
                        "business-time",
                        "boxes",
                        "burn",
                        "car",
                        "cash-register",
                        "city",
                        "couch",
                        "crow",
                        "feather",
                        "globe-asia",
                        "guitar",
                        "gas-pump",
                        "user-friends",
                        "mountain",
                        "seedling",
                        "fish",
                        "tshirt",
                        "warehouse",
                        "mug-hot",
                        "skiing-nordic",
                        "heart",
                        "praying-hands"
                    ]
            }
        },
        methods:{
            sendIcon(name){
                this.$emit('getIcon',name);
            },
            showMore(e){
                if(this.height === 40){
                    this.height = 220;
                    e.target.innerText = '更少标识';
                }else{
                    this.height = 40;
                    e.target.innerText = '更多标识';
                }
            }
        }
    }
</script>

<style scoped>
    .moreIcon{
        padding-top:10px;
        overflow: hidden;
    }

    .ico_btn{
        width:40px;
        height:40px;
        line-height:43px;
        text-align: center;
        margin:0 10px 5px 0;
        font-size:2.5rem;
    }

    .showMore{
        width:100%;
        height:25px;
        line-height:27px;
        border:1px solid #c1c1c1;
        margin:10px 0;
        border-radius:10px;
        text-align: center;
    }
</style>