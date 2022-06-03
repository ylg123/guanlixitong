<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="width"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="{row}">
          <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale==0" @click="onSale(row)"></el-button>
          <el-button type="info" icon="el-icon-top" size="mini" v-else @click="cancelSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total">
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag type="success" v-for="skuAttr in skuInfo.skuAttrValueList" :key="skuAttr.id" style="margin-right:10px">{{skuAttr.attrId}}--{{skuAttr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name:'Sku',
  data() {
    return {
      // 代表当前第几页
      page:1,
      // 代表每一页展示几条数据
      limit:10,
      // 存储sku列表的数据
      records:[],
      // 总共多少条数据
      total:0,
      // 存储sku信息的数据
      skuInfo:{},
      // 控制抽屉效果显示与隐藏
      drawer:false
    }
  },
  mounted() {
    // 获取sku列表数据
    this.getSkuList()
  },
  methods: {
    // 获取sku列表数据的方法
    async getSkuList(pages=1){
      // 修改当前页码
      this.page = pages
      // 解构出默认参数
      const {page,limit} = this
      // 发请求获取sku列表数据
      let res = await this.$API.sku.reqSkuList(page,limit)
      if(res.code===200){
        this.records = res.data.records
        this.total = res.data.total
      }
    },
    // 每页展示数据条数发生改变的回调
    handleSizeChange(limit){
      // 修改每页展示数据条数
      this.limit = limit
      // 再次发送请求获取sku列表数据
      this.getSkuList()
    },
    // 上架按钮的回调
    async onSale(row){
      // 发送请求上架sku
      let res = await this.$API.sku.reqOnSale(row.id)
      if(res.code===200){
        // 提示信息
        this.$message({type:'success',message:'上架成功'})
        // 修改状态为下架
        row.isSale = '1'
      }
    },
    // 下架按钮的回调
    async cancelSale(row){
      // 发送请求上架sku
      let res = await this.$API.sku.reqCancelSale(row.id)
      if(res.code===200){
        // 提示信息
        this.$message({type:'success',message:'下架成功'})
        // 修改状态为上架
        row.isSale = '0'
      }
    },
    // 编辑按钮的回调
    edit(){
      this.$message('正在开发中')
    },
    // 获取sku详情按钮的回调
    async getSkuInfo(row){
      // 展示抽屉效果
      this.drawer = true
      // 发请求获取sku详情数据
      let res = await this.$API.sku.reqSkuById(row.id)
      if(res.code===200){
        this.skuInfo = res.data
      }
    }
  },
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
<style scoped>
  .el-row .el-col-5{
    font-size: 18px;
    text-align: right;
  }
  .el-col{
    margin: 20px 10px;
  }
  .el-row >>> .el-carousel__button{
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
  }
</style>