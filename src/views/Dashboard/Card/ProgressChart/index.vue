<template>
  <div class="charts2" ref="charts2"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name:'ProgressChart',
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts2)
    // 配置数据
    lineCharts.setOption({
      // x坐标轴
      xAxis:{
        // 隐藏x轴
        show:false,
        // 设置最大值与最小值
        min:0,
        max:100
      },
      // y坐标轴
      yAxis:{
        // 隐藏y轴
        show:false,
        // y轴均分
        type:'category'
      },
      // 系列配置
      series:[
        {
          // 柱状图
          type:'bar',
          // 数据
          data:[78],
          // 颜色
          color:'yellowgreen',
          // 柱状图宽度
          barWidth:10,
          // 柱状图背景颜色
          showBackground:true,
          backgroundStyle:{
            color:'#eee'
          },
          // 文本的设置
          label:{
            // 展示
            show:true,
            // 文本标签内容
            formatter:'|',
            // 文本标签位置
            position:'right'
          }
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
  .charts2{
    width: 100%;
    height: 100%;
  }
</style>