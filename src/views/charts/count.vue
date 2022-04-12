<template>
    
</template>

<script>
    export default {
        name: "count"
    }
</script>

<style scoped>

</style><template>
    <div>
        <highcharts :options="chartOptions"></highcharts>
    </div>
</template>

<script>
    import Highcharts from 'highcharts'
    import exportingInit from 'highcharts/modules/exporting'

    exportingInit(Highcharts)
    export default {
        name: "count",

        data(){


            return{
                chartOptions: {
                    chart:{
                        type:'area'
                    },
                    title: {
                        text: '图片数量统计数据'
                    },
                    series: [],
                    xAxis: {//x轴显示的内容
                        categories:'',
                        plotbands:[{//可以显示一个方块，如果需要的话可以更改透明度和颜色
                            from:4.5,
                            to:6.5,
                            color:'rgba(68,170,213,0)'//透明度和颜色
                        }]
                    },
                    yAxis: {
                        title: {
                            text: '数量'
                        }

                    },
                    credits: {
                        enabled: false
                    },
                }
            }
        },
        created() {
            this.getData()
        },
        methods: {
            getData(){
                this.$axios.get('/sys/data/count').then(res=>{
                    console.log(res.data);
                    console.log(JSON.parse(res.data.data).times);
                    console.log(JSON.parse(res.data.data).datas);
                    let time = JSON.parse(res.data.data).times;

                    for (let i=0;i<time.length;i++){
                        time[i] = this.getTime(time[i]);

                    }
                    this.chartOptions.xAxis.categories = time;
                    this.chartdata = JSON.parse(res.data.data).datas;
                    console.log(this.chartdata);
                    let chart={
                        name:'图片数量',
                        data:JSON.parse(res.data.data).datas
                    }
                    this.chartOptions.series = chart;

                })
            },
            getTime(time) {
                var date=new Date(parseInt(time)* 1000);
                var year=date.getFullYear();
                var mon = date.getMonth()+1;
                var day = date.getDate();
                var hours = date.getHours();
                var minu = date.getMinutes();
                var sec = date.getSeconds();
                return year+'-'+this.getTimes(mon)+'-'+this.getTimes(day);
            },
            getTimes(times){
                return  times<10?'0'+times:times;
            },

        },


    }
</script>

<style scoped>

</style>