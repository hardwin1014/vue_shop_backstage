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
          <el-button :disabled="isBtnDisable" type="primary" size="mini">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isBtnDisable" type="primary" size="mini">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
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
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('获取参数列表失败！')
      }
      this.$message.success('获取参数列表成功！')
      //  this. = res.data
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
    cateId(){
      if(this.selectedCateKeys.length === 3){
        return this.selectedCateKeys[2]
      }
      return null
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