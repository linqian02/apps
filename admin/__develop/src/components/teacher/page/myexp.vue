<template>
  <div class="myexp">
    <el-container>
      <el-table :data="tableData" border>
        <el-table-column prop="no" label="编号" width="">
        </el-table-column>
        <el-table-column prop="title" label="实验名称" width="">
        </el-table-column>
        <el-table-column prop="college" label="开课学院" width="">
        </el-table-column>
        <el-table-column prop="start" label="实验时间" width="">
          <template slot-scope="scope">
            {{scope.row.start}} <br>{{scope.row.end}}
          </template>
        </el-table-column>
        <el-table-column label="指导说明" width="">
          <template slot-scope="scope">
            <a type="text" :href="host.host+scope.row.guidBook" download="true">{{scope.row.originalname}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="place" label="实验地点" width="">
        </el-table-column>
        <el-table-column label="操作" width="">
          <template slot-scope="scope">
            <el-button type="text" @click="addDesc(scope.row)" size="small">添加实验说明</el-button>
               <el-button type="text" @click="goWork(scope.row)" size="small">查看学生作业</el-button>
        
          </template>
        </el-table-column>
      </el-table>
    </el-container>
    <el-dialog title="修改实验说明" :visible.sync="dialogTableVisible">
      <el-form ref="form" :model="form" label-position="top" label-width="80px" center="center">
        <el-form-item>
          <el-input type="textarea"  v-model="form.instru" :rows="6" placeholder="暂无实验说明"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="dialogTableVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import store from '../../../store/teacher/teacher.js'
  import  host  from '../../../../config/localhost.js';
    export default {
    name:"myexp",
    props:["tableData"],
    data() {
      return {
          login_info:JSON.parse(this.$route.query.login_info),
          host:host,
          dialogTableVisible:false,
          form:
          {
              instru:"",
              _id:""
          }
      }
    },
    mounted:function()
    {
        
    
    },
    methods:{
        addDesc(d){
            this.form.instru = d.instru;
            this.form._id = d._id;
            this.dialogTableVisible = true;
        },
        goWork(d){
          var info = JSON.parse(sessionStorage.getItem('tea_info'));
          this.$emit("workInfo",d._id);
          // this.$router.push({
          //   path:"/teacher/index",
          //   query:{
          //     login_info:this.$route.query.login_info,
          //     status:"3",
          //     expID:d._id}
          //   });



            //window.open(`http://localhost:8080/#/teacher/index?
            //login_info=${this.$route.query.login_info}&status=3&expID=${d._id}
            // `);
        }
        ,
        onSubmit(){
            store.edit_exp(this.form).then((r)=>{
                if(r.data.status == 1)
                {
                    this.$message({
                        type:"success",
                        message:"修改成功"
                    });
                    this.dialogTableVisible = false;
                    store.getList(this.login_info.recodeset.username).then((r)=>{
                                // Object.assign(this.tableData,r.data);
                            this.tableData = r.data
                  })
                }else{
                    this.$message({
                        type:"error",
                        message:"修改失败"
                    })
                }
            })
        }
    }
  }
</script>
<style scoped>
  .title-ban {
    width: 100%;
  }
  textarea{
     white-space: pre-wrap !important;
  }

</style>
