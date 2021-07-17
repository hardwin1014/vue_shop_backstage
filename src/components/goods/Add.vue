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
      <el-alert
        title="添加商品相信"
        center
        show-icon
        type="info"
        :closable="false"
      >
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
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏区域 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
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
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addForm.goods_cate"
                :options="cateList"
                expand-trigger="hover"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的后台API地址 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4"></el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
      :before-close="handleClose">
      <img :src="previewPath" alt="" class="previewPic">
    </el-dialog>
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
        goods_cate: [], // 商品所属的数组
        pics: [] //图片的数组
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
        ],
        goods_cate:[{
          required: true,message:'请选择商品分类',trigger: 'blur'
        }]
      },
      cateProps: {
        label: 'cat_name',// 看到的值
        value: 'cat_id', // 选中的值
        children: 'children'
      },
      //动态参数列表
      manyTableData: [],
      // 静态属性参数列表
      onlyTableData: [],
      // 上传图片的url地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '', // 图片路径
      previewVisible: false // 控制图片预览对话框
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
    // 级联选择器变化,会触发函数
    handleChange(){
      if(this.addForm.goods_cate.length !== 3){
        this.addForm.goods_cate = []
      }
    },
    // 监听标签页,即将离开标签页
    beforeTabLeave(activeName, oldActiveName){
      if(oldActiveName === '0' && this.addForm.goods_cate.length !== 3){
        this.$message.info('请先选择商品分类')
        return false
      }
    },
    // 点击tags触发
    async tabClicked(){
      // console.log(this.activeIndex);
      // 证明访问的是动态面板
      if(this.activeIndex === '1'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'many'}
        })
        if(res.meta.status !== 200){
          return this.$message.error('获取动态参数列表失败!')
        }
        console.log(res.data);
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')||item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if(this.activeIndex === '2') {
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('获取静态属性失败！')
        }
        console.log(res.data);
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览
    handlePreview(file){
      console.log(file);
      // 1.获取将要删除的图片的临时路径
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 关闭图片预览
    handleClose(){
      this.previewVisible = false
    },
    // 处理移除图片的操作
    handleRemove(file){
      console.log(file);
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i,1)
      console.log(this.addForm);
    }, 
    // 图片上传成功
    handleSuccess(response){
      console.log(response);
      // 先拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      console.log(picInfo);
      // 将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm);
    }
  },
  computed: {
    cateId() {
      if(this.addForm.goods_cate.length === 3){
        return this.addForm.goods_cate[2] // 返回三级id
      }
      return null
    }
  }
}
</script>

<style lang="less">
.el-popper {
  height: 50vh;
  overflow: hidden;
}
.el-checkbox{
  margin: 0 5px 0 0 !important;
}
.previewPic{
  width: 100%;
}
</style>
