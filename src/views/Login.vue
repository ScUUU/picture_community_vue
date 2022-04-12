<template>
    <el-row type="flex" class="row-bg" justify="center">

        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
            <el-form-item label="用户名" prop="username" style="width: 380px;" class="formitem">
                <el-input v-model="loginForm.username" class="forminput" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password"  style="width: 380px;"lass="formitem">
                <el-input v-model="loginForm.password" type="password" class="forminput"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code"  style="width: 380px;"lass="formitem">
                <el-input v-model="loginForm.code"  style="width: 172px; float: left" maxlength="5" class="forminput"></el-input>
                <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('loginForm')" style="background-color: cadetblue; border-color: white">立即登录</el-button>
                <el-button @click="resetForm('loginForm')" style="background-color: lightcoral; border-color: white">重置</el-button>
            </el-form-item>
        </el-form>

    </el-row>

</template>

<script>
    import qs from 'qs'

    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '111111',
                    code: '',
                    token: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        { min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur' }
                    ],
                },
                captchaImg: null
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/login?'+ qs.stringify(this.loginForm)).then(res => {

                            console.log(res)

                            const jwt = res.headers['authorization']

                            this.$store.commit('SET_TOKEN', jwt)
                            this.$router.push("/index")
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getCaptcha() {
                this.$axios.get('/captcha').then(res => {

                    console.log("/captcha")
                    console.log(res)

                    this.loginForm.token = res.data.data.token
                    this.captchaImg = res.data.data.captchaImg
                    this.loginForm.code = ''
                })
            }
        },
        created() {
            this.getCaptcha()
        }
    }
</script>

<style>
    .forminput input.el-input__inner{
        background-color: transparent;
    }

    .forminput input{
        color: white;
    }

</style>

<style scoped>
    .el-form-item{
        margin-top: 30px;

    }

    .el-form{
        position: relative;
        width: 450px;
        height: 300px;
        border: 1px solid rgba(60, 60, 60, .4);
        border-top-color: rgba(255, 255, 255, .4);
        border-left-color: rgba(255, 255, 255, .4);
        background: rgba(130,130,130,.3);
    }

    .el-row {
        background-color: #baccd9;
        background-image: url("../assets/bkg.png");
        background-size: 100% 100%;
        height: 100%;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
    }


    .captchaImg {
        float: left;
        margin-left: 8px;
        border-radius: 4px;
    }
</style>