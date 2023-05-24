<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-upload
        style="width: 100%;"
        drag
        action="#"
        :limit="1"
        :show-file-list="false"
        :http-request="Upload"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传zip文件，且不超过5M</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Import} from '@/api/sessions'


export default {
  name: 'upload',
  data() {
    return {
      dialogFormVisible: false,
      action: '',
      form: {
        file: '',
      },
      title: '导入协议号',
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
      this.$baseNotify('协议号导入成功,任务后台执行中...', '任务执行中',)
      this.dialogFormVisible = false
    },
    Upload(fileObj) {
      console.log(fileObj.file)
      let f = new FormData()
      f.append("file", fileObj.file)

      Import(f).then(res => {
        this.$message.success('导入成功')
      }).catch(err => {
        this.progressFlag = false
        // this.$message.error('上传失败')
      })
      return true
    },

  },
}
</script>
