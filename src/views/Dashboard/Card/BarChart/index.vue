<template>
  <div class="charts1" ref="charts1"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name:'BarChart',
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts1)
    // 配置数据
    lineCharts.setOption({
      // x坐标轴
      xAxis:{
        // 隐藏x轴
        show:false,
        // 均分
        type:'category'
      },
      // y坐标轴
      yAxis:{
        // 隐藏y轴
        show:false,
        
      },
      // 系列配置
      series:[
        {
          // 柱状图
          type:'bar',
          // 数据
          data:[7,14,11,10,21,32,12,23,5,17,20,18],
          // 颜色
          color:'pink'
        }
      ],
      // 提示信息
      tooltip:{},
      // 坐标布局
      grid:{
        left:0,
        right:0,
        top:0,
        bottom:0,
      }
    })
  },
}
</script>

<style scoped>
  .charts1{
    width: 100%;
    height: 100%;
  }
</style>