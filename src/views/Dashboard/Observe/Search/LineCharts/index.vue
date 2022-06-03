<template>
  <div>
      <!-- 折线图组件头部 -->
      <div class="header">
        <span class="search-header">搜索用户数</span>
        <svg t="1649994206233" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1251" width="14" height="14"><path d="M512 0a512 512 0 1 0 0 1024A512 512 0 0 0 512 0z m0 896A384 384 0 0 1 512 128a384 384 0 0 1 0 768z m29.696-194.88c-11.136 10.112-24.96 17.344-31.488 15.36-6.08-1.792-9.536-7.424-8.384-13.056l89.344-248c7.424-31.488-12.736-60.16-55.424-63.872-44.8 0-110.976 40.128-151.232 90.944 0 6.08-1.344 21.12 0.128 30.208l53.632-54.208c11.008-10.176 23.808-17.344 30.336-15.424 6.592 1.92 10.112 8.384 8 14.464l-88.704 246.848c-10.176 28.864 9.152 57.152 56.192 63.616 68.928 0 109.888-39.168 150.208-89.984 0-6.08 2.368-22.08 0.96-31.104l-53.568 54.208zM575.744 192c-35.584 0-64.448 25.728-64.448 63.808 0 37.952 28.864 63.744 64.448 63.744 35.648 0 64.448-25.728 64.448-63.744 0-38.08-28.8-63.808-64.448-63.808z" p-id="1252" fill="#8a8a8a"></path></svg>
      </div>
      <!-- 折线图组件中部 -->
      <div class="main">
        <span class="span1">12312</span>
        <span class="span2">17.1</span>
        <svg t="1649996228679" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5048" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="5049" fill="#d81e06"></path></svg>
        <svg t="1649995928726" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4127" width="16" height="16"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="4128" fill="#1afa29"></path></svg>
      </div>
      <!-- 折线图组件底部 -->
      <div class="footer">
        <!-- 折线图容器 -->
        <div class="charts" ref="charts"></div>
      </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name:'LineCharts',
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
          data:[3,15,27,13,29,32,22,6,33,5,17],
          // 拐点的样式设置
          itemStyle:{
            opacity:0
          },
          // 折线的样式设置
          lineStyle:{
            color:'green',
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
                offset: 0, color: 'green' // 0% 处的颜色
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
  .header{
    display: flex;
    align-items: center;
    color: gray;
  }
  .search-header{
    margin-right: 20px;
    font-size: 16px;
  }
  .main{
    margin: 10px 0;
    align-items: center;
  }
  .span1{
    margin-right: 25px;
    font-size: 20px;
  }
  .span2{
    margin-right: 5px;
    font-size: 12px;
  }
  .charts{
    width: 100%;
    height: 50px;
  }
</style>