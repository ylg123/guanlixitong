<template>
  <div>
    <el-card>
      <!-- 卡片头部 -->
      <div slot="header" class="header">
        <div class="category-header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="value">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 卡片中部 -->
      <div>
        <!-- 图表 -->
        <div class="charts" ref="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    // 初始化echarts实例
    let myCharts = echarts.init(this.$refs.charts);
    myCharts.setOption({
      title:{
        text:'视频',
        subtext:1048,
        left:'center',
        top:'center'
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    // 图表鼠标事件
    myCharts.on('mouseover', (params)=>{
      // 获取图表鼠标移入的元素的名称和值
      const {name,value} = params.data
      // 重新设置饼图中间的标题
      myCharts.setOption({
        title:{
          text:name,
          subtext:value,
          left:'center',
          top:'center'
        },
      })
    })
  },
};
</script>

<style scoped>
.header {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts{
  width: 100%;
  height: 300px;
}
</style>