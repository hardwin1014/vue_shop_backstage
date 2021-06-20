<template>
  <div class="login_container">
    <!-- 登录盒子  -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/326.jpg" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        ref="LoginFormRef"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // 定义属性
  data() {
    return {
      // 表单数据
      loginForm: {
        username: '',
        password: ''
      },
      // 验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this); 可以访问到form表单实例 $refs
      this.$refs.LoginFormRef.resetFields()
    },
    // 登录
    login() {
      // 先获取表达的引用对象，调用validate()
      this.$refs.LoginFormRef.validate(async valid => {
        //该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
        // console.log(valid);
        //判断valid的值是否为true
        if (!valid) return
        // 将获取的表单数据传递给登录接口
        try {
          const { data: res } = await this.$http.post('login', this.loginForm)
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error('登录失败')
          this.$message.success('登录成功')
          // 1.将登录成功之后的token，保存到客户端的sessionStorage中
          //   1.1 项目中出了登录之外的其他api接口，必须在登录之后才能访问
          //   1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
          // 2.通过编程式导航跳转到后台主页，路由地址是/home

          // console.log(res); res的data下有生成的token令牌
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        } catch (error) {
          console.log(error)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.login_container {
  background-color: #2b5b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 超出了，设置box-sizing: border-box;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
