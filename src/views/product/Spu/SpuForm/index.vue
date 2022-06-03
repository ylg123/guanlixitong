<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tradeMark.tmName" :value="tradeMark.id" v-for="tradeMark in tradeMarkList" :key="tradeMark.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 照片墙 上传图片：action为图片上传的地址  list-type为文件列表的类型  
        :on-preview为图片预览时触发  :on-remove为图片删除时触发  :on-success为图片上传成功时触发
        :file-list为上传的文件列表 展示在照片墙上，绑定的数据为数组，且需要有name和url字段-->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="imageList"
          :on-preview="handlePictureCardPreview"
          :on-success="handleSuccess"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}项未选择`" v-model="unSelectAttrInfo">
          <el-option :label="unSelectSale.name" :value="`${unSelectSale.id}:${unSelectSale.name}`" v-for="unSelectSale in unSelectSaleAttr" :key="unSelectSale.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!unSelectAttrInfo" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的是当前spu属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <!-- 作用域插槽 -->
            <template slot-scope="{row}">
              <!-- tag用于展示已有的属性值列表 -->
              <!-- @close事件直接根据数组的index删除销售属性值列表中的元素 -->
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">{{tag.saleAttrValueName}}</el-tag>
              <!-- input和button是相互切换的 -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)" @keyup.enter.native="handleInputConfirm(row)"></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{$index}">
              <!-- @click事件直接根据数组的$index删除销售属性列表中的元素 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateOrAddSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'SpuForm',
  data() {
    return {
      // dialog对话框中图片地址数据
      dialogImageUrl: '',
      // 控制dialog对话框的显示与隐藏的标识数据
      dialogVisible: false,
      // spu数据初始化的时候时一个空对象，修改spu时，会向服务器发送请求，返回spu数据（对象）
      // 在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      // 但在添加spu时，并没有向服务器发请求，数据就不知道收集到哪里了，收集到的数据里面有哪些属性要看接口文档
      spu:{
        // 三级分类id信息
        "category3Id": 0,
        // 描述信息
        "description": "",
        // 新增图片信息
        "spuImageList": [
          /* {
            "id": 0,
            "imgName": "string",
            "imgUrl": "string",
            "spuId": 0
          } */
        ],
        // spu名称信息
        "spuName": "",
        // 品牌id信息
        "tmId":'',
        // 当前spu的销售属性信息
        "spuSaleAttrList": [
          /* {
            "baseSaleAttrId": 0,
            "id": 0,
            "saleAttrName": "string",
            "spuId": 0,
            "spuSaleAttrValueList": [
              {
                "baseSaleAttrId": 0,
                "id": 0,
                "isChecked": "string",
                "saleAttrName": "string",
                "saleAttrValueName": "string",
                "spuId": 0
              }
            ]
          } */
        ],
      },
      // 品牌数据
      tradeMarkList:[],
      // 图片数据
      imageList:[],
      // 所有的销售属性数据（总共三个）
      saleAttrList:[],
      // 未选择的销售属性的信息（包括id和name）
      unSelectAttrInfo:''
    }
  },
  methods: {
    // 照片墙图片删除的回调
    handleRemove(file, fileList) {
      // 注意删除图片时需要收集图片信息
      // file参数代表删除的那张图片,flieList代表剩下的图片数组
      // 收集照片墙删除后剩下图片的数据
      // 注意对于已有的图片（服务器返回），要展示需要有name与url字段
      // 对于将来带给服务器的数据，不要name与url字段，将来要处理
      this.imageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 注意预览图片时不需要收集图片信息
      // 将图片的地址赋值给dialogImageUrl
      this.dialogImageUrl = file.url;
      // 让dialog对话框显示
      this.dialogVisible = true;
    },
    // 照片墙图片上传成功的回调
    handleSuccess(response,file,fileList){
      // 收集照片墙新增后图片的数据
      this.imageList = fileList
    },
    // 添加属性按钮的回调
    addSaleAttr(){
      // 将收集好的未销售属性信息的数据整理放入spu.spuSaleAttrList中
      // 将字符串用:分割作为传给服务器参数的值
      let res = this.unSelectAttrInfo.split(':')
      // 解构出res数组中要传给服务器的值并赋值给baseSaleAttrId,saleAttrName属性，注意属性要参照接口文档写
      const [baseSaleAttrId,saleAttrName] = res
      // 向spu.spuSaleAttrList数组中的对象中添加新的销售属性
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      // 将上面整理的对象添加到spu.spuSaleAttrList数组中
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 将未选择的销售属性的信息栏置空
      this.unSelectAttrInfo = ''
    },
    // 点击修改SPU展示结构中需要发送请求初始化页面的回调 （要发四个请求）
    async initSpuData(row){
      // 获取spu数据
      let spuRes = await this.$API.spu.reqSpu(row.id)
      if(spuRes.code===200){
        this.spu = spuRes.data
      }
      // 获取品牌数据
      let tradeMarkRes = await this.$API.spu.reqTrademark()
      if(tradeMarkRes.code===200){
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取图片的数据
      let imageRes = await this.$API.spu.reqImage(row.id)
      if(imageRes.code===200){
        // 由于照片墙显示的数据需要数组，且数组中有name与url字段
        // 需要修改服务器返回的数据
        let imgArr = imageRes.data
        imgArr.forEach(item => {
          // 为服务器返回的图片数组中的每一个对象添加name和url属性
          item.name = item.imgName
          item.url = item.imgUrl
        });
        this.imageList = imgArr
      }
      // 获取销售属性的数据
      let saleAttrRes = await this.$API.spu.reqSaleAttr()
      if(saleAttrRes.code===200){
        this.saleAttrList = saleAttrRes.data
      }
    },
    // 销售属性值栏内添加按钮的回调
    addSaleAttrValue(row){
      // 将row.inputVisible变为真，能够实现button按钮到input的切换 注意要用$set方法响应式绑定
      this.$set(row,'inputVisible',true)
      // inputValue属性用于收集input框中的数据
      this.$set(row,'inputValue','')
    },
    // el-input失去焦点事件和点击enter键事件的回调
    handleInputConfirm(row){
      // 解构出当前点击销售属性中的属性值baseSaleAttrId和inputValue
      const {baseSaleAttrId,inputValue} = row
      // 如果收集到的inputValue为空，则提示并返回
      if(inputValue.trim()==''){
        this.$message('属性值不能为空！！')
        return
      }
      // 收集到的inputValue值不能重复，否则提示并返回
      let isRepeat = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
      if(!isRepeat){
        this.$message('属性值不能重复！！')
        return
      }
      // 整理要发送给服务器的参数，为一个对象，根据接口文档属性有baseSaleAttrId和saleAttrName
      let newAttr = {baseSaleAttrId,saleAttrValueName:inputValue}
      // 将上面的新属性对象添加到当前销售属性值的spuSaleAttrValueList数组中
      row.spuSaleAttrValueList.push(newAttr)
      // 让input框切换为button按钮
      row.inputVisible = false
    },
    // 修改|添加页面保存按钮的点击回调
    async updateOrAddSpu(){
      // 整理参数，需要整理照片墙的数据
      // 携带参数，对于图片需要新增imgUrl和imgName字段
      this.spu.spuImageList = this.imageList.map(item =>{
        return {
          imgName:item.name,
          imgUrl:(item.response&&item.response.data) || item.url
        }
      })
      // 发请求，获取spu数据
      let res = await this.$API.spu.reqUpdateOrAddSpu(this.spu)
      if(res.code===200){
        // 弹出保存成功的提示框
        this.$message({type:'success',message:'保存成功'})
        // 通知父组件Spu回到展示SPU列表的结构，即scene为0，注意区分是修改还是添加时点的保存
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
        // 清除数据  Object.assign合并对象的方法  this._data可以操作data中的响应式数据
        // this.$options为当前组件的配置对象，配置对象的data函数执行后返回的响应式数据为空
        Object.assign(this._data,this.$options.data())
      }
    },
    // 点击添加SPU展示结构中需要发请求的回调 （要发2个请求）
    async addSpuList(category3Id){
      // 收集三级分类的id
      this.spu.category3Id = category3Id
      // 获取品牌数据
      let tradeMarkRes = await this.$API.spu.reqTrademark()
      if(tradeMarkRes.code===200){
        this.tradeMarkList = tradeMarkRes.data
      }
      // 获取销售属性的数据
      let saleAttrRes = await this.$API.spu.reqSaleAttr()
      if(saleAttrRes.code===200){
        this.saleAttrList = saleAttrRes.data
      }
    },
    // 点击取消按钮的回调
    cancel(){
      // 通知父组件Spu切换场景
      this.$emit('changeScene',{scene:0,flag:'取消'})
      // 清除数据  Object.assign合并对象的方法  this._data可以操作data中的响应式数据
      // this.$options为当前组件的配置对象，配置对象的data函数执行后返回的响应式数据为空
      Object.assign(this._data,this.$options.data())
    }
  },
  computed: {
    // 计算出还未在spu中展示的销售属性
    unSelectSaleAttr(){
      // 使用数组的过滤方法filter，可以过滤出符合条件的元素，即函数体内返回真的元素被返回并生成一个新数组
      return this.saleAttrList.filter(item => {
        // 数组的every方法：返回布尔值 使用此方法的数组当每一个元素判断都为真时方法返回值才为真
        return this.spu.spuSaleAttrList.every(spuSaleAttr => {
          return item.name !== spuSaleAttr.saleAttrName
        })
      })
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
</style>