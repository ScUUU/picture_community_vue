<template>
    <div>
        <highcharts :options="chartOptions"></highcharts>
    </div>
</template>

<script>
    import Highcharts from 'highcharts'
    import exportingInit from 'highcharts/modules/exporting'
    import theme1 from './theme1'
    Highcharts.setOptions(theme1)
    exportingInit(Highcharts)
    export default {
        name: "hits",

        data(){


            return{
                chartdata:'',
                chartOptions: {
                    chart:{
                        type:'area'
                    },
                    title: {
                        text: 'GET请求次数数据'
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
                            text: '次数'
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
                this.$axios.get('/sys/data/hits').then(res=>{
                    console.log(JSON.parse(res.data.data));
                    let datas = JSON.parse(res.data.data);
                    let time = [];
                    let cdata = [];

                    for (let i=0;i<datas.length;i++){
                        let date = new Date(datas[i].time);
                        let month = date.getMonth()+1;
                        time[i] = date.getFullYear()+"-"+month+"-"+date.getDate();
                        cdata[i] = datas[i].values.hits;
                    }
                    console.log(time);
                    console.log(cdata);
                    this.chartOptions.xAxis.categories = time;
                    this.chartOptions.series = cdata;

                    let chartdata={
                        name:'次数',
                        data: cdata
                    }
                    this.chartOptions.series = chartdata

                    // this.chartOptions.xAxis.categories = time;
                    // this.chartOp = JSON.parse(res.data.data);
                    // console.log(this.chartdata);
                    // let chart={
                    //     name:'流量',
                    //     data:JSON.parse(res.data.data)
                    // }
                    // this.chartOptions.series = chart;

                })
            }

        },


    }
</script>

<style scoped>

</style>