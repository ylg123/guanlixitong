<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name:'LineChart',
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts)
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
          // 折线图
          type:'line',
          // 平滑曲线
          smooth: true,
          // 数据
          data:[3,5,7,10,2,32,12,6,23,5,17],
          // 拐点的样式设置
          itemStyle:{
            opacity:0
          },
          // 折线的样式设置
          lineStyle:{
            color:'purple',
          },
          // 折线填充颜色设置
          areaStyle:{
            color:{
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'purple' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ],
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
  .charts{
    width: 100%;
    height: 100%;
  }
</style>