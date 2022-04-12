<template>
<div>
    <hits></hits>
    <blob></blob>
    <space></space>
    <count></count>

</div>
</template>

<script>

    import Space from "@/views/charts/space";
import Count from "@/views/charts/count";
    import Blob from "@/views/charts/blob";
    import Hits from "@/views/charts/hits"

    export default {
        name: "Index",
        components: {Space,Count,Blob,Hits},
        data(){
            return{
            }
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>