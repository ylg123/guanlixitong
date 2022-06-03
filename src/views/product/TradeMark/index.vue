<template>
  <div>
    <!-- 顶部按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >

    <!-- 表格组件  
      data:表格组件将来需要展示的数据----数组类型  
      border：表格的边框
      label：表格的头部标题名称
      width：对应表格列的宽度
      align：标题的对齐方式
      prop：对应列内容的字段名
      注意：table组件，数据是一列一列进行展示的
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <!-- 作用域插槽 -->
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <!-- 作用域插槽 -->
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 
      current-page：当前第几页
      page-size：每页展示几条数据
      total：总共多少条数据
      page-sizes：每页可以设置展示多少条数据（3/5/10）
      layout：可以实现分页器的布局（上一页、下一页、总页数、每页多少条的位置布局）
      pager-count：按钮的数量（如果是9，代表中间页码为7页）
      @current-change：分页器的当前页码发生改变时调用的事件
      @size-change：分页器的每页展示条数发生改变时调用的事件
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 弹出的对话框  
      :visible.sync：控制对话框显示与隐藏用的 
      Form提供了表单验证的功能，只需通过rules属性传入约定的验证规则，并将Form-Item的prop属性设置为需要校验的字段名即可
    -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单 :model属性：这个属性作用是，把表单的数据收集到哪个对象的身上，将来表单验证，也需要这个属性-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 上传图片收集数据不能用v-model，因为不是表单元素 
            action：设置图片上传的接口地址
            :on-success="handleAvatarSuccess"：可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload="beforeAvatarUpload"：可以在上传图片之前，执行一次
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      // 代表分页器当前第几页
      page: 1,
      // 代表分页器每页展示几条数据
      limit: 3,
      // 代表起始时总共的数据条数
      total: 0,
      // 代表列表每一页要展示的数据
      list: [],
      // 对话框显示与隐藏的属性
      dialogFormVisible: false,
      // 收集品牌的信息：对象身上的属性，不能乱写，需要看文档，看服务器需要带的参数的属性名
      tmForm:{
        // 品牌名字
        tmName:'',
        // 品牌logo
        logoUrl:''
      },
      // 表单验证的规则
      rules:{
        // 品牌名称的验证规则
        // required：必须校验的字段，显示前面的红*
        // message：提示信息
        // trigger：元素事件如聚焦、失焦
        tmName:[
          {required: true, message:'请输入品牌名称', trigger: 'blur'},
          {min: 2,max:10, message:'长度在2到10个字符', trigger: 'change'},
        ],
        // 品牌logo的验证规则
        logoUrl:[
          {required: true, message:'请上传品牌logo'}
        ]
      }
    };
  },
  mounted() {
    // 获取列表数据
    this.getPageList();
  },
  methods: {
    // 获取列表数据的函数
    async getPageList(pager = 1) {
      // pager为分页器点击事件传入的页码值，当pager改变时，修改page的值
      this.page = pager;
      // 解构出参数
      const { page, limit } = this;
      // 获取品牌管理列表数据的接口
      // 当你向服务器发送请求前，请求要带参数，所有先在data中初始化两个参数，然后传参给服务器
      let res = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (res.code === 200) {
        // 代表服务器返回数据的条数
        this.total = res.data.total;
        // 代表服务器返回的数据列表
        this.list = res.data.records;
      }
    },
    // 分页器的每页展示条数改变的回调
    handleSizeChange(limit) {
      // 修改每页展示的数据条数
      this.limit = limit;
      // 重新发送请求获取列表数据
      this.getPageList();
    },
    // 添加按钮显示对话框的回调
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      // 清空品牌信息
      this.tmForm = {
        tmName:'',
        logoUrl:''
      }
    },
    // 修改按钮显示对话框的回调
    updateTradeMark(row) {
      // 显示对话框
      this.dialogFormVisible = true;
      // row 修改按钮行相应的品牌信息
      // 将已有的信息直接赋值给tmForm进行展示
      // 也就是toForm存储即为服务器返回品牌信息
      this.tmForm = {...row}
    },
    // 删除按钮的回调
    deleteTradeMark(row){
      // 弹框功能
      this.$confirm(`你确定删除${row.tmName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 当用户点击确定按钮触发
        // 向服务器发请求
        let res = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if(res.code===200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 删除成功，再次获取品牌列表数据展示
          this.getPageList(this.list.length>1?this.page:this.page-1)
        }
      }).catch(() => {
        // 当用户点击取消按钮触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 上传图片成功的回调
    handleAvatarSuccess(res) {
      // res：上传成功后，接口返回前端的数据
      // file：上传成功后，服务器返回前端的数据
      // 收集品牌图片的数据
      this.tmForm.logoUrl = res.data
    },
    // 上传图片之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 对话框内确定按钮的点击回调
    addOrUpdateTradeMark(){
      // 进行表单验证，验证成功才能进行业务逻辑
      this.$refs.ruleForm.validate(async (success)=>{
        // 如果校验通过
        if(success){
          // 关闭对话框
          this.dialogFormVisible = false
          // 发请求，添加或者修改品牌
          let res = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if(res.code===200){
            // 弹出信息：添加品牌成功或者修改品牌成功
            this.$message({
              type:'success',
              message:this.tmForm.id?'修改品牌成功':'添加品牌成功'
            })
            // 添加或者修改品牌成功后，需要再次获取品牌列表进行展示
            // 判断是添加还是修改，添加在第一页，修改留在当前页
            this.getPageList(this.tmForm.id?this.page:1)
          }
        }else{
          // 如果校验失败
          console.log('error Submit!!')
          return false
        }
      })
    }
  },
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>