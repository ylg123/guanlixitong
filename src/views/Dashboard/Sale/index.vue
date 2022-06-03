<template>
  <el-card class="box-card" style="margin:10px 0">
    <!-- 头部区域 -->
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs class="tab1" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="date1">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker v-model="date" value-format="yyyy-MM-dd" size="mini" class="date2" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>
    </div>
    <!-- 内容区域 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器 -->
          <div class="charts1" ref="charts1"></div>
        </el-col>
        <el-col :span="6" class="title2">
            <h3 style="font-size:14px;">门店{{title}}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span class="rtext1">肯德基</span>
                <span class="rnumber1">323234</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span class="rtext1">麦当劳</span>
                <span class="rnumber1">299132</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span class="rtext1">肯德基</span>
                <span class="rnumber1">283998</span>
              </li>
              <li>
                <span class="rindex1">4</span>
                <span class="rtext1">海底捞</span>
                <span class="rnumber1">266233</span>
              </li>
              <li>
                <span class="rindex1">5</span>
                <span class="rtext1">西贝莜面村</span>
                <span class="rnumber1">223445</span>
              </li>
              <li>
                <span class="rindex1">6</span>
                <span class="rtext1">汉堡王</span>
                <span class="rnumber1">219663</span>
              </li>
              <li>
                <span class="rindex1">7</span>
                <span class="rtext1">真功夫</span>
                <span class="rnumber1">200997</span>
              </li>
            </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
// 引入dayjs
import dayjs from 'dayjs'
// 引入vuex中的mapState
import {mapState} from 'vuex'
export default {
  name: "Sale",
  data() {
    return {
      // 标题名称
      activeName:'sale',
      // 图表组件实例
      mycharts:null,
      // 日历数据
      date:[]
    }
  },
  mounted() {
    // 初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts1)
    this.mycharts.setOption({
      // 标题
      title:{
        text:`${this.title}趋势`,
        textStyle:{
          fontSize:15
        }
      },
      // 提示框
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      // 坐标位置
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      // x坐标轴
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      // y坐标轴
      yAxis: [
        {
          type: 'value'
        }
      ],
      // 系列设置
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: []
        }
      ]
    })
  },
  computed:{
    // 计算属性-标题
    title(){
      return this.activeName=='sale'?'销售额':'访问量'
    },
    // 图表数据
    ...mapState({
      listState: state => state.home.list
    })
  },
  watch:{
    // 监听表格标题变化
    title(){
      // 重新设置表格标题
      // 图表配置数据可以修改，有新的就替换，没有则用之前的
      this.mycharts.setOption({
        // 标题
        title:{
          text:`${this.title}趋势`,
          textStyle:{
            fontSize:15
          }
        },
        // x轴设置
        xAxis: [
          {
            data: this.title=='销售额'?this.listState.orderFullYearAxis:this.listState.userFullYearAxis,
          },
        ],
        // 系列设置
        series: [
          {
            data: this.title=='销售额'?this.listState.orderFullYear:this.listState.userFullYear,
          },
        ],
      })
    },
    // 监听表格数据变化
    listState(){
      this.mycharts.setOption({
        // x坐标轴
        xAxis: [
          {
            data: this.listState.orderFullYearAxis,
          }
        ],
        // 系列设置
        series: [
          {
            data: this.listState.orderFullYear
          }
        ]
      })
    }
  },
  methods: {
    // 今日的回调
    setDay(){
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day,day]
    },
    // 本周的回调
    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start,end]
    },
    // 本月的回调
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start,end]
    },
    // 本年的回调
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start,end]
    }
  },
};
</script>

<style scoped>
  .clearfix{
    display: flex;
    position: relative;
    justify-content: space-between;
  }
  .tab1{
    width: 100%;
  }
  .date1{
    position: absolute;
    right: 0;
  }
  .date2{
    width: 250px;
    margin: 0 20px;
  }
  .date1 span{
    margin: 0 8px;
  }
  .charts1{
    width: 100%;
    height: 300px;
  }
  .title2{
    padding: 0;
  }
  ul{
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0;
  }
  ul li{
    height: 12%;
    padding: 10px 0;
    display: flex;
    position: relative;
  }
  .rindex{
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: black;
    color: white;
    text-align: center;
  }
  .rindex1{
    position: absolute;
    left: 5px;
  }
  .rtext1{
    position: absolute;
    left:50px
  }
  .rnumber1{
    position: absolute;
    right:0px;
  }
</style>