<template>
  <div id="add">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-form-item label="编号" prop="no">
        <el-input v-model="ruleForm.no"></el-input>
      </el-form-item>
      <el-form-item label="实验名称" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="开课学院" prop="college">
        <el-select v-model="ruleForm.college" placeholder="请选择院系">
          <el-option v-for='(item,index) in college' :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="实验时间">
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="开始时间" v-model="ruleForm.start" style="width: 100%;" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="结束时间" v-model="ruleForm.end" style="width: 100%;" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="实验地点" prop="place">
        <el-input v-model="ruleForm.place"></el-input>
      </el-form-item>
      <!--<el-form-item label="开课状态">
        <el-select v-model="ruleForm.status" placeholder="请选择开课状态">
          <el-option v-for='(item,index) in status' :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="指导说明" prop="guidBook">
        <el-upload class="upload-demo" :action="importFileUrl" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove"
          multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList" :on-success="fileSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传zip,word,pdf,excel文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="指导教师" prop="teaID">
        <el-select v-model="ruleForm.teaID" placeholder="请选择院系">
          <el-option v-for='(item,index) in teacherList' :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import  store from '@/store/admin/exp'
import college from "../../../college.js"
import status from "../../../status.js"
import  host  from '../../../../../config/localhost.js';
  export default {
    data() {
      return {
        header:{
          "Access-Control-Allow-Origin": "*"

        },
        importFileUrl:host.host+ "/api/admin/file",
        college:college,
        teacherList:"",
        status:status,
        fileList:[],
        ruleForm: {
          title: '',
          teaID: '',
          no:"",
          start:"",
          end:"",
          college:"",
          status: "",
          guidBook:'',
          place:"",
          originalname:""
        },
        rules: {
          title: [
            { required: true, message: '请输入实验名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          teaID: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          no: [
            { required: true, message: '请输入学号', trigger: 'change' }
          ],
          college: [
            { required: true, message: '请选择院系', trigger: 'change' }
          ],
          start: [
            { required: true, trigger: 'change' }
          ],
           end: [
            { required: true, trigger: 'change' }
          ]
        }
      }
    },
 methods: {
      submitForm(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            store.doAdd(that.ruleForm).then((r)=>
            {
                if(r.data.status == 1)
                {
                    this.$message(
                        {
                            type:"success",
                            message:"添加成功"
                        }
                    )
                    this.$router.push({
                        path:"/admin/exp"
                      })
                }else 
                {
                    this.$message(
                        {
                            type:"error",
                            message:r.data.message
                        }
                    )
                }
            })
          } else {
            this.$message(
                {
                    type:"error",
                    message:"请填写完整信息"
                }
            )
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      fileSuccess(res, file, fileList)
      {
        this.ruleForm.guidBook= res.message.path;
        this.ruleForm.originalname=res.message.originalname;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    },
    mounted:function()
    {
        store.getTeacherList().then((r)=>
        {
          console.log(r);
          this.teacherList = r.data;
        })
    }
  }
</script>
<style>
  #add {
    width: 80%;
    margin: 0 auto;
  }

</style>
