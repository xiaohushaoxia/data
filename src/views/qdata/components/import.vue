<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
     

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="分组名称" prop="group_name">
        <el-input v-model="form.group_name"  style="width: 360px;"></el-input>
      </el-form-item>
 
      <el-form-item label="文    件" prop="group_name">
      <el-upload
        style="width: 350px;"
        drag
        action="#"
        :limit="1"
        :show-file-list="false"
        :http-request="Upload"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">请上传scv格式文件</div>
    </el-upload>
      </el-form-item>
  </el-form>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Import} from '@/api/data'
// import {Import} from '@/api/sessions'

export default {
  name: 'upload',
  data() {
    return {
      dialogFormVisible: false,
      action: '',
      form: {
        file: '',
        group_name: '',
        type: 1,  //数据q 默认type=1

      },
      title: '上传数据',
    }
  },
  created() {
  },
  methods: {
    async showUpload() {
      this.dialogFormVisible = true
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      console.log(this.form)
      Import(this.form).then(res => {
        this.$message.success('导入成功')
        // console.log(res)
           this.dialogFormVisible = false
      }).catch(err => {
        this.progressFlag = false
        // this.$message.error('上传失败')
      })
      return true
      this.$baseNotify('数据上传中', '任务执行中',)
   
    },
    Upload(fileObj) {
      // console.log(fileObj)
      // console.log(23213213)
      this.form.file=fileObj.file
      let f = new FormData()
      f.append("file", fileObj.file)

      Import(f).then(res => {
        // this.$message.success('导入成功')
        // console.log(res)
      }).catch(err => {
        this.progressFlag = false
        // this.$message.error('上传失败')
      })
      return true
    },

  },
}
</script>
