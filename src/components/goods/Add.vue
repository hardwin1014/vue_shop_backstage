<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品相信" center show-icon type="info" :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
      <!-- tab栏区域 -->
        <el-tabs v-model="activeIndex" :tab-position="'left'">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="">
              <el-cascader
                v-model="addForm.goods_cate"
                :options="cateList"
                expand-trigger="hover"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1"></el-tab-pane>
          <el-tab-pane label="商品属性" name="2"></el-tab-pane>
          <el-tab-pane label="商品图片" name="3"></el-tab-pane>
          <el-tab-pane label="商品内容" name="4"></el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  // 定义属性
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cate: [] // 商品所属的数组
      },
      cateList: [], // 商品分类列表
      addFormRules: {
        goods_name:[
          {
            required: true,message:'请输入商品名称',trigger: 'blur'
          }
        ],
        goods_price:[
          {
            required: true,message:'请输入商品价格',trigger: 'blur'
          }
        ],
        goods_number:[
          {
            required: true,message:'请输入商品数量',trigger: 'blur'
          }
        ],
        goods_weight:[
          {
            required: true,message:'请输入商品重量',trigger: 'blur'
          }
        ]
      },
      cateProps: {
        label: 'cat_name',// 看到的值
        value: 'cat_id', // 选中的值
        children: 'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods:{
    // 获取分类数据
    async getCateList(){
      const {data:res} = await this.$http.get(`categories`)
      if(res.meta.status !== 200){
        return this.$message.error('获取商品列表失败！')
      }
      this.cateList = res.data
    },

  }
}
</script>

<style lang='less'>
  
</style>