<template>
  <div>
    <el-card>
      <!-- 卡片头部 -->
      <div slot="header" class="header">
        <div class="search-header">
          <span style="font-size: 16px">线上热门搜索</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 卡片内容 -->
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <LineCharts></LineCharts>
          </el-col>
          <el-col :span="12">
            <LineCharts></LineCharts>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="date" label="排名" width="80" type="index">
          </el-table-column>
          <el-table-column prop="name" label="搜索关键字">
          </el-table-column>
          <el-table-column prop="address" label="用户数" sortable>
          </el-table-column>
          <el-table-column prop="address1" label="周涨幅" sortable>
          </el-table-column>
        </el-table>
        <!-- 分页器 --> 
        <el-pagination layout="prev, pager, next" :total="1000" class="pagination"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineCharts from "./LineCharts";
export default {
  name: "Search",
  data() {
    return {
      tableData:[{}]
    }
  },
  components: {
    LineCharts,
  },
};
</script>

<style scoped>
.header {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}
.search-header {
  display: flex;
  justify-content: space-between;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.pagination{
  float: right;
}
</style>