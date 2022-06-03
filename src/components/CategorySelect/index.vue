<template>
  <div>
    <!-- inline代表行内表单，代表一行可以放置多个表单元素  :model代表表单数据收集到cForm对象中 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!-- v-model代表双向绑定将option中的value收集到cForm.category1Id中 -->
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="!isShowTable">
          <!-- 遍历一级分类数据list1获取下拉菜单 -->
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="!isShowTable">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="!isShowTable">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      // 一级分类的数据
      list1:[],
      // 二级分类的数据
      list2:[],
      // 三级分类的数据
      list3:[],
      // 一级分类、二级分类、三级分类的id
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:''
      }
    }
  },
  // 父组件Attr传来的数据isShowTable
  props:['isShowTable'],
  // 组件挂载完毕，获取一级分类的数据
  mounted() {
    // 获取一级分类数据
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据的回调
    async getCategory1List(){
      // 发请求获取一级分类数据
      let res = await this.$API.attr.reqCategory1List()
      if(res.code===200){
        this.list1 = res.data
      }
    },
    // 一级分类的select的事件回调（当option发生变化时获取相应二级分类的数据）
    async handler1(){
      // 先清除二三级分类数据和id
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 解构出一级id
      const {category1Id} = this.cForm
      // 给父组件Attr传递一级id
      this.$emit('getCategoryId',{categoryId:category1Id,level:1})
      // 发请求获取二级分类数据
      let res = await this.$API.attr.reqCategory2List(category1Id)
      if(res.code===200){
        this.list2 = res.data
      }
    },
    // 二级分类的select的事件回调（当option发生变化时获取相应三级分类的数据）
    async handler2(){
      // 先清除三级分类的数据和id
      this.list3 = []
      this.cForm.category3Id = ''
      // 解构出二级id
      const {category2Id} = this.cForm
      // 给父组件Attr传递二级id
      this.$emit('getCategoryId',{categoryId:category2Id,level:2})
      // 发请求获取三级分类数据
      let res = await this.$API.attr.reqCategory3List(category2Id)
      if(res.code===200){
        this.list3 = res.data
      }
    },
    // 三级分类的select的事件回调（当option发生变化时获取底部展示框需要的数据）
    handler3(){
      // 解构出三级id
      const {category3Id} = this.cForm
      // 给父组件Attr传递三级id
      this.$emit('getCategoryId',{categoryId:category3Id,level:3})
    }
  },
};
</script>

<style>
</style>