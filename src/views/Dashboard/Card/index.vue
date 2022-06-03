<template>
  <div>
    <!-- el-row布局 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <!-- 第一个card -->
          <Detail title="总销售额" count="￥ 126560">
            <!-- 具名插槽 -->
            <template slot="charts">
              <span style="font-size:13px">周同比&nbsp;56.67% <svg t="1649996228679" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5048" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="5049" fill="#d81e06"></path></svg></span>&nbsp;&nbsp;
              <span style="font-size:13px">日同比&nbsp;19.16% <svg t="1649995928726" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4127" width="16" height="16"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="4128" fill="#1afa29"></path></svg></span>
            </template>
            <!-- 具名插槽 -->
            <template slot="footer">
              <span style="font-size:18px">日销售额￥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第二个card -->
          <Detail title="访问量" count="88460">
            <!-- 具名插槽 -->
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <!-- 具名插槽 -->
            <template slot="footer">
              <span style="font-size:18px">日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第三个card -->
          <Detail title="支付笔数" count="88460">
            <!-- 具名插槽 -->
            <template slot="charts">
              <BarChart></BarChart>
            </template>
            <!-- 具名插槽 -->
            <template slot="footer">
              <span style="font-size:16px">转化率 65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第四个card -->
          <Detail title="运营活动效果" count="78%">
            <!-- 具名插槽 -->
            <template slot="charts">
              <ProgressChart></ProgressChart>
            </template>
            <!-- 具名插槽 -->
            <template slot="footer">
              <span style="font-size:16px">周同比&nbsp;12% <svg t="1649996228679" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5048" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="5049" fill="#d81e06"></path></svg></span>&nbsp;&nbsp;
              <span style="font-size:16px">日同比&nbsp;11% <svg t="1649995928726" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4127" width="16" height="16"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="4128" fill="#1afa29"></path></svg></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入详情Detail组件
import Detail from './Detail'
// 引入折线图LineChart组件
import LineChart from './LineChart'
// 引入柱状图BarChart组件
import BarChart from './BarChart'
// 引入进度条ProgressChart组件
import ProgressChart from './ProgressChart'
export default {
  name:'Card',
  components:{
    Detail,
    LineChart,
    BarChart,
    ProgressChart
  }
}
</script>
