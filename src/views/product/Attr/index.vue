<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :isShowTable="isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示商品属性的结构 -->
      <div v-show="isShowTable">
        <!-- 添加属性按钮 :disabled：但三级分类id为空时不能使用添加属性按钮-->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 商品属性表格 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="120"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- 使用作用域插槽 -->
            <template slot-scope="{ row }">
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin: 0px 10px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="120">
            <!-- 使用作用域插槽 -->
            <template slot-scope="{row,$index}">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
                </el-col>
                <el-col :span="12">
                  <!-- 气泡确认框 -->
                  <el-popconfirm :title="`确定删除${row.attrName}吗？`" @onConfirm="deleteAttrList($index)">
                    <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                  </el-popconfirm>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或者修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <!-- 使用作用域插槽 -->
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里的结构需要用input和span来回切换 -->
              <!-- input动态绑定$index,可以让span点击时告知回调点击的是哪一个input对应的span -->
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row,$index)">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <!-- 使用作用域插槽 -->
          <el-table-column label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 注意版本问题：点击确定触发的事件要加on变成@onconfirm-->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      // 一级分类id
      category1Id: "",
      // 二级分类id
      category2Id: "",
      // 三级分类id
      category3Id: "",
      // 展示商品属性的table数据
      attrList: [],
      // 展示商品属性表格的显示与隐藏
      isShowTable: true,
      // 收集新增或修改属性的值的table数据
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [  //属性名中的属性值，因为属性值可以多个，每一个属性值都是一个对象，所以写成数组
          /* {
            attrId: 0, //某个属性值中的属性id
            valueName: "", //某个属性值中的属性值
          }, */
        ],
        categoryId: 0, //三级分类的id：注意不要再data中用this
        categoryLevel: 3, //三级分类，因为服务器需要区分是几级分类的id
      },
    };
  },
  methods: {
    // 自定义事件getCategoryId的回调
    getCategoryId({ categoryId, level }) {
      // 区分哪一级分类相应的id，然后存入相应父组件data中
      if (level === 1) {
        this.category1Id = categoryId;
        // 修改时清空二级和三级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        // 修改时清空三级分类的id
        this.category3Id = "";
      } else {
        // 代表三级分类已经选择了
        this.category3Id = categoryId;
        // 发请求获取商品属性的数据
        this.getAttrList();
      }
    },
    // 获取商品属性的请求回调
    async getAttrList() {
      // 解构出一、二、三级分类的id
      const { category1Id, category2Id, category3Id } = this;
      // 发请求获取商品属性的数据
      let res = await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id)
      if (res.code === 200) {
        this.attrList = res.data;
      }
    },
    // 添加属性值按钮的点击回调
    addAttrValue(){
      // 向属性值的数组中添加元素
      // 目前某个属性值的属性id还没从服务器返回，先给undefined
      // 目前某个属性值的属性值还没从服务器返回，先给''
      this.attrInfo.attrValueList.push({
        // 对于修改某一个属性的时候，可以在已有的属性值的基础上新增新的属性值（新增新的属性的时候，需要把已有属性的id带上）
        attrId:this.attrInfo.id,
        valueName:'',
        // 控制属性值行显示input还是span
        flag:true
      })
      // 新增的input框需要自动聚焦
      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    // 添加属性按钮的点击回调
    addAttr(){
      // 隐藏展示商品属性表格
      this.isShowTable = false
      // 收集三级分类的id
      const {category3Id} = this
      // 清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [],  //属性名中的属性值，因为属性值可以多个，每一个属性值都是一个对象，所以写成数组
        categoryId: category3Id, //三级分类的id：注意不要再data中用this
        categoryLevel: 3,
      }
    },
    // 修改属性按钮的点击回调
    updateAttr(row){
      // 隐藏展示商品属性表格
      this.isShowTable = false 
      // 由于数据结构当中存在对象里面套数组，数组里面又套对象，因此需要使用深拷贝解决这类问题
      this.attrInfo = cloneDeep(row)
      // 在修改某一行属性时，将此行的对象添加上标识flag,用来切换查看与编辑状态
      this.attrInfo.attrValueList.forEach(item => {
        // 因为vue无法探测到普通属性值的变化，所以正常书写添加的属性不是响应式的，要用$set方法才能添加响应式属性
        // 参数：第一个为要添加属性的对象，第二个为要添加的属性名，第三个为要添加的属性值
        this.$set(item,'flag',false)
      })
    },
    // 第二个el-table中由input框切换到span元素的失焦与键盘事件回调
    toLook(row){
      // row：当前用户添加的最新属性值：即数组的最后一个元素
      // 如果新增的属性值名称为空或空格时，不能作为新的属性值，需要弹出提示框，并返回
      if(row.valueName.trim()===''){
        this.$message('请输入正常的属性值')
        return
      }
      // 如果新增的属性值名称与前面相同，不能作为新的属性值，需要弹出提示框，并返回
      let isRepeat = this.attrInfo.attrValueList.some(item => {
        if(item!==row){
          return item.valueName === row.valueName
        }
      })
      if(isRepeat){
        this.$message('请不要输入重复的属性值')
        return
      }
      // 让input消失，显示span（编辑模式切换显示模式）
      row.flag = false

    },
    // 第二个el-table中由span框切换到input元素的点击回调
    toEdit(row,index){
      // 让span消失，显示input（编辑模式切换显示模式）
      row.flag = true
      // 点击span的时候，切换input模式，但是需要注意input渲染是要时间的，所以要用$nextTick
      // $nextTick：当页面渲染完毕后，执行一次参数回调
      this.$nextTick(()=>{
        // 获取input节点，让其自动聚焦
        this.$refs[index].focus()
      })
    },
    // 第一个气泡确认框点击确定删除属性值的回调
    deleteAttrList(index){
      // 删除对应index的属性列表，不需要发请求
      this.attrList.splice(index,1)
    },
    // 第二个气泡确认框点击确定删除属性值的回调
    deleteAttrValue(index){
      // 删除对应index的属性值，不需要发请求
      this.attrInfo.attrValueList.splice(index,1)
    },
    // 保存按钮的点击回调
    async addOrUpdateAttr(){
      // 整理参数 1：如果用户添加很多行属性值，且属性值名称为空，则不应该带给服务器
      // 2：提交给服务器的参数对象中不应该包含flag属性
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter( item => {
        // 过滤出属性值不为空的对象
        if(item.valueName !== ''){
          // 删除掉flag属性
          delete item.flag
          return true
        }
      })
      try {
        // 发请求给服务器通知保存属性
        await this.$API.attr.reqAddOrUpdateSaveAttr(this.attrInfo)
        // 由添加修改结构转换为展示属性结构
        this.isShowTable = true
        // 发请求成功弹出提示信息框
        this.$message({type:'success',message:'保存成功'})
        // 再次获取服务器商品属性进行展示
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败！！')
      }
    }
  },
};
</script>

<style>
</style>