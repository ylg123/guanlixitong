<template>
  <div>
    <el-card style="margin:20px 0px">
      <!-- 三级联动全局组件可以直接使用 -->
      <CategorySelect @getCategoryId="getCategoryId" :isShowTable="scene==0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底下这部分有三种结构进行切换 -->
      <!-- 展示SPU列表的结构 -->
      <div v-show="scene===0">
        <el-button type="primary" icon="el-icon-plus" @click="showSpu" :disabled="!category3Id">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <!-- 作用域插槽 -->
            <template slot-scope="{row}">
              <!-- 这里的按钮要用hintButton替换，让它们带有提示字段功能 -->
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="watchSku(row)"></HintButton>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="3"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          style="text-align:center"  
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 添加|修改SPU的结构 -->
      <SpuForm v-show="scene===1" @changeScene="changeScene" ref="spu"></SpuForm>
      <!-- 展示|添加SKU的结构 -->
      <SkuForm v-show="scene===2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
  name:'Spu',
  components:{
    SkuForm,
    SpuForm
  },
  data() {
    return {
      // 一级分类id
      category1Id:'',
      // 二级分类id
      category2Id:'',
      // 三级分类id
      category3Id:'',
      // Spu的列表数据
      records:[],
      // 分页器一共需要展示的数据条数
      total:0,
      // 分页器当前页数初始值默认为1
      page:1,
      // 每页展示几条数据
      limit:3,
      // 显示哪种结构的标识，0代表展示SPU列表结构，1代表添加|修改SPU结构，2代表展示|添加SKU结构
      // 控制三级联动选择框能否使用的标记，由父组件Spu传给子组件CategorySelect，0可以使用，1和2不能使用
      scene:0,
      // 控制sku列表对话框的显示与隐藏
      dialogTableVisible:false,
      // 用于保存spu行对象的信息
      spu:{},
      // 存储sku列表的数据
      skuList:[],
      // 在表格中展示loading效果
      loading:true
    }
  },
  methods: {
    // 三级联动的自定义事件回调，可以把子组件CategorySelect相应的id传给父组件Spu
    getCategoryId({categoryId,level}){
      // categoryId为获取到的一、二、三级分类的id，level为一、二、三级的标记
      if(level===1){
        this.category1Id = categoryId
        // 重新获取一级id时清空二、三级id
        this.category2Id = ''
        this.category3Id = ''
      }else if(level===2){
        this.category2Id = categoryId
        // 重新获取二级id时清空三级id
        this.category3Id = ''
      }else{
        this.category3Id = categoryId
        // 获取Spu的列表数据
        this.getSpuList()
      }
    },
    // 获取Spu列表数据的回调,不传参时默认分页器pages当前页为第一页，这么写可以省掉一个回调函数
    async getSpuList(pages = 1){
      // 传参时将data中的page修改掉
      this.page = pages
      // 解构data中的数据
      const {page,limit,category3Id} = this
      // 发请求获取Spu列表数据
      let res = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(res.code===200){
        this.records = res.data.records
        this.total = res.data.total
      }
    },
    // #region
    /* 点击分页器当前页码按钮触发的回调
    handleCurrentChange(page){
      // 修改数据中的页码
      this.page = page
      // 再次发送请求获取spu列表数据
      this.getSpuList()
    } */
    // #endregion
    // 当分页器的每一页展示数据的条数limit变化的回调
    handleSizeChange(limit){
      // 修改数据中的每页展示数据条数 
      this.limit = limit
      // 再次发送请求获取spu列表数据
      this.getSpuList()
    },
    // 点击添加SPU展示结构的回调
    showSpu(){
      // 场景切换为1：添加|修改SPU结构
      this.scene = 1
      // 通知子组件SpuForm发请求，并将三级分类id传给子组件
      this.$refs.spu.addSpuList(this.category3Id)
    },
    // 点击修改某一个SPU展示结构的回调
    updateSpu(row){
      this.scene = 1
      // 获取子组件SpuForm并发请求
      this.$refs.spu.initSpuData(row)
    },
    // 给子组件SpuForm传递的自定义回调
    changeScene({scene,flag}){
      // 子组件SpuForm通知父组件Spu修改场景
      this.scene = scene
      // 再次发送请求获取spu数据展示，点击修改按钮的停留在当前页，点击添加按钮的前往第一页
      this.getSpuList(flag=='修改'?this.page:1)
    },
    // 删除spu按钮的回调
    async deleteSpu(row){
      // 发请求通知服务器删除对应id的spu
      let res = await this.$API.spu.reqDeleteSpu(row.id)
      if(res.code===200){
        // 提示信息
        this.$message({type:'success',message:'删除成功'})
        // 再次发送请求获取spu列表展示，注意当前页spu属性列表的长度大于1时，删除后停留在当前页，否则回到上一页
        this.getSpuList(this.records.length>1?this.page:this.page-1)
      }
    },
    // 添加sku按钮的回调
    addSku(row){
      // 切换场景为2 展示|添加SKU结构
      this.scene = 2
      // 父组件Spu调用子组件SkuForm的方法
      this.$refs.sku.getSkuList(this.category1Id,this.category2Id,row)
    },
    // 给子组件SkuForm传递的自定义回调
    changeScenes(data){
      // 切换场景
      this.scene = data
    },
    // 查看sku列表按钮的回调
    async watchSku(row){
      // 保存点击查看sku列表按钮的行对象
      this.spu = row
      // 让sku列表对话框显示
      this.dialogTableVisible = true
      // 发送请求获取sku列表数据
      let res = await this.$API.spu.reqSkuList(row.id)
      if(res.code===200){
        this.skuList = res.data
        // 让loading效果隐藏
        this.loading = false
      }
    },
    // 关闭sku列表对话框的回调
    close(done){
      // 将loading效果改为true可触发
      this.loading = true
      // 清除sku列表数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  },
}
</script>

<style>

</style>