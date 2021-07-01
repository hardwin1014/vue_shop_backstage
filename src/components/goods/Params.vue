<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert show-icon title="注意：只允许第三级分类设置相关参数！" :closable="false" type="warning"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
           <el-cascader
              v-model="selectedCateKeys"
              :props="cateProps"
              :options="cateList"
              expand-trigger="hover"
              @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isBtnDisable" type="primary" size="mini" @click="addDialogFormVisible = true">添加参数</el-button>
          <el-table :data='manyTableData' border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isBtnDisable" type="primary" size="mini" @click="addDialogFormVisible = true">添加属性</el-button>
          <el-table :data='onlyTableData' border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 新增对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogFormVisible" width="50%">
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 定义属性
  data() {
    return {
      cateList:[],
      // 级联选择框的配置对象
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      }, 
      selectedCateKeys:[], // 级联选择框，双向绑定到的数组
      activeName: 'many', //被激活的页签名称
      manyTableData: [], // 动态参数
      onlyTableData: [],  // 静态参数
      addDialogFormVisible: false,
      addForm: {
        attr_name: ''
      }, // 添加参数的表单数据对象
      addFormRules:{
        attr_name:[{
          required:true,message:'请输入参数名称',trigger:'blur'
        }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const {data:res} = await this.$http('categories')
      console.log(res);
      if(res.meta.status !==200){
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data
    },
    // 级联选择项选择框变化，会触发
    async handleChange(){
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
      // console.log(this.activeName); 打印的是el-tab-pane的name属性
    },
    // 获取参数的列表数据
    async getParamsData(){
       // 判断是否是三级分类
      if(this.selectedCateKeys.length!==3){
        this.selectedCateKeys = []
        return
      }
      console.log(this.selectedCateKeys);
      // 根据所选分类的ID和当前所处的面板，获取对应的参数
      const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params: {sel:this.activeName}})
      if(res.meta.status !== 200){
        return this.$message.error('获取参数列表失败！')
      }
      // 进行判断到底是哪个表格中
      if(this.activeName === 'many'){
        this.manyTableData = res.data
      }else{
        this.onlyTableData = res.data
      }
    }
  },
  computed:{
    // 如果按钮需要被禁用，则返回true ，否则返回false
    isBtnDisable(){
      if(this.selectedCateKeys.length !== 3){
        return true
      }else{
        return false
      }
    },
    // 当前选中的三级分类的id
    cateId(){
      if(this.selectedCateKeys.length === 3){
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态属性计算标题文本
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }
      return '静态属性'
    }
  }
  
}
</script>

<style lang='less'>
.cat_opt {
  margin: 15px 0;
}
.el-cascader-panel{
  height: 50vh;
}
.el-cascader{
  margin-left: 10px;
}
</style>