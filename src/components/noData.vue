<template>
    <div class="noData">
        <fa-icon icon="sad-tear" class="noData_icon"/>
        <p class="showEnd">
            {{msg ? msg:'还没有数据呢，先添加一个吧！'}}
        </p>
    </div>
</template>

<script>
    export default {
        name: "noData",
        props:['msg']
    }
</script>

<style scoped>
    .noData{
        margin-top:5rem;
        text-align: center;
    }

    .noData_icon{
        font-size:8rem;
        color:#999;
        margin-bottom: 15px;
    }

    .showEnd{
        text-align: center;
        color:#c1c1c1;
        height:10px;
    }
</style>