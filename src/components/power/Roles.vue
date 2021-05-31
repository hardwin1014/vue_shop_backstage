<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleslist" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <!-- 所有slot-scope='scope'拿到作用域的值 -->
            <template slot-scope="scope">
              <el-row
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']"
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
              >
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag closable
                        @close="removeTag(scope.row,item1.id)"	>{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                  <!-- 通过遍历给二级权限渲染 -->
                  <el-row
                    :class="[i2 === 0 ? '' : 'bdtop','vcenter']"
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                  >
                    <el-col :span="6">
                      <el-tag type="success" closable
                        @close="removeTag(scope.row,item2.id)"	>{{ item2.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        @close="removeTag(scope.row,item3.id)"	
                        >{{ item2.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button size="mini" type="danger" icon="el-icon-delete"
                >删除</el-button
              >
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose">
      <!-- 树形控件 -->
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 定义属性
  data() {
    return {
      roleslist: [], //所有角色列表
      setRightDialogVisible:false,//控制权限分配的对话框
      rightList:[],//所有权限的数据
      //树形控件的数据
      treeProps:{
        label:'authName',//看到的哪个属性
        children:'children'// 父子间使用哪个属性嵌套的
      },
      // 已经选中的节点
      defKeys:[]
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleslist = res.data
    },
    // 移除标签权限
    async removeTag(role,rightId){
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err) 
        if(confirmResult!=='confirm'){
          return this.$message.info('您取消了删除')
        }
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
          return this.$message.error('删除权限失败！！')
        }
        // 删除成功刷新一下获取列表角色的列表的函数
        // this.getRolesList()  不建议，因为这样会刷新页面
        
        // 因为返回的值中的权限已经是最新的了，所以重新赋值一下就行了
        role.children = res.data
        this.$message.info('删除权限成功')
    },
    // 展示分配权限对话框函数
    async showSetRightDialog(role){
      // 获取所有权限的数据
      const { data:res } = await this.$http.get('rights/tree')
      // console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('获取权限数据失败')
      }
      this.rightList = res.data

     // 获取三级递归节点
     this.getLeafKeys(role,this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的函数，获取角色下所有的三级权限的id，并保存到defKeys数组中
    getLeafKeys(node,arr){
      // 如果node节点不包含children，则为三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item =>this.getLeafKeys(item,arr));
    },
    // 监听关闭分配权限对话框，清除数组中的三级权限
    setRightDialogClose(){
      this.defKeys = []
    }
  }
}
</script>

<style lang="less" socped>
.el-tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.bdtop {
  border-top: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
