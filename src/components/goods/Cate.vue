<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table 
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        >
        
      </tree-table>
      <!-- 分页 -->
    </el-card>
  </div>
</template>

<script>
export default {
  // 定义属性
  data() {
    return {
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 总数据条数
      total:0,
      // 未table指定列的定义
      columns:[{
        label:'分类名称',
        prop:'cat_name'
      }],
      // 查询条件
      queryInfo:{
        query: 3,
        pagenum: 1,
        pagesize: 5 
      }
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    // 获取商品数据
    async getCateList(){
      const {data:res} = await this.$http.get(`categories`,{params:this.queryInfo})
      if(res.meta.status!==200)return this.$message.error('获取商品数据失败！')
      // 把数据列表赋值给cateList
      this.cateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less"></style>
