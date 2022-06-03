<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称" >{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格（元）">
        <el-input placeholder="价格（元）" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量（千克）">
        <el-input placeholder="重量（千克）" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <!-- 将平台属性的id和属性值的id收集到数组中的平台属性对象中 -->
            <el-select placeholder="请选择" v-model="attr.attrIdAndAttrValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.saleAttrIdAndSaleAttrValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" prop="prop" width="80"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <!-- 作用域插槽 -->
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <!-- 作用域插槽 -->
            <template slot-scope="{row}">
              <!-- 两按钮属于切换性质 -->
              <el-button type="primary" v-if="row.isDefault=='0'" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'SkuForm',
  data() {
    return {
      // 收集spu图片数据
      spuImageList:[],
      // 收集spu销售属性数据
      spuSaleAttrList:[],
      // 收集平台属性数据
      attrInfoList:[],
      // 收集sku信息数据
      skuInfo:{
        // 第一类收集的数据，父组件给的数据
        "category3Id": 0,
        "spuId": 0,
        "tmId": 0,
        // 第二类需要通过v-model双向绑定的
        "skuName": "",
        "price": 0,
        "weight": "",
        "skuDesc": "",
        // 第三类需要自己书写代码的
        // 平台属性
        "skuAttrValueList": [
          /* {
            "attrId": 0,
            "valueId": 0,
          } */
        ],
        // 默认图片
        "skuDefaultImg": "",
        // 收集图片的字段
        "skuImageList": [
          /* {
            "imgName": "string",
            "imgUrl": "string",
            "isDefault": "string",
            "spuImgId": 0
          } */
        ],
        // 销售属性
        "skuSaleAttrValueList": [
          /* {
            "saleAttrId": 0,
            "saleAttrValueId": 0,
          } */
        ],
      },
      // 收集父组件spu传来的数据
      spu:{},
      // 用于收集用户选中的图片数据，将来提交前需要添加isDefault字段
      imageList:[]
    }
  },
  methods: {
    // 获取SPU数据的方法
    async getSkuList(category1Id,category2Id,row){
      // 收集父组件Spu给的数据
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.spuId
      this.skuInfo.tmId = row.tmId
      this.spu = row
      // 获取spu图片的数据
      let res = await this.$API.spu.reqSpuImageList(row.id)
      if(res.code===200){
        let list = res.data
        list.forEach(item => {
          item.isDefault = '0'
        })
        this.spuImageList = list
      }
      // 获取销售属性的数据
      let res1 = await this.$API.spu.reqSpuSaleAttrList(row.id)
      if(res1.code===200){
        this.spuSaleAttrList = res1.data
      }
      // 获取属性信息的数据
      let res2 = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,row.category3Id)
      if(res2.code===200){
        this.attrInfoList = res2.data
      }
    },
    // table复选框勾选与否的事件回调
    handleSelectionChange(selection){
      // 参数为用户选中的信息行对象组成的数组，注意当前收集的数据中缺少isDefault字段
      this.imageList = selection
    },
    // 设置默认按钮的回调
    changeDefault(row){
      // 排他操作
      this.spuImageList.forEach(item => {
        item.isDefault = '0'
      })
      row.isDefault = '1'
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮的回调
    cancel(){
      // 自定义事件，通知父组件Spu切换场景
      this.$emit('changeScenes',0)
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    // 保存按钮的回调
    async save(){
      // 整理参数
      const {attrInfoList,skuInfo,spuSaleAttrList,spuImageList} = this
      // 整理平台属性
      // 使用reduce方法整理数组  并将整理好的数组赋值给skuInfo.skuAttrValueList
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndAttrValueId){
          const [attrId,valueId] = item.attrIdAndAttrValueId.split(':')
          prev.push({attrId,valueId})
        }
        return prev
      },[])
      // 整理销售属性
      // 使用reduce方法整理数组  并将整理好的数组赋值给skuInfo.skuSaleAttrValueList
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item) => {
        if(item.saleAttrIdAndSaleAttrValueId){
          const [saleAttrId,saleAttrValueId] = item.saleAttrIdAndSaleAttrValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])
      // 整理图片数据
      // 使用map方法整理数组  并将整理好的数组赋值给skuInfo.skuImageList
      skuInfo.skuImageList = spuImageList.map(item => {
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
      // 发请求给添加sku的接口
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if(result.code===200){
        // 保存成功弹出提示
        this.$message({type:'success',message:'添加SKU成功'})
        // 通知父组件Spu切换场景
        this.$emit('changeScenes',0)
        // 清除数据
        Object.assign(this._data,this.$options.data())
      }
    }
  },
}
</script>

<style>

</style>