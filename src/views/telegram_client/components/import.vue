<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="分组" prop="group_id">
        <el-select v-model="form.group_id" placeholder="分组">
          <el-option v-for="(item,index) in GroupForSessionList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-upload
          style="width: 100%;"
          drag
          action="#"
          ref="upload"
          :limit="1"
          :show-file-list="true"
          :http-request="Upload"
          :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传zip文件</div>
      </el-upload>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Import} from '@/api/sessions'
import {List as GroupList} from "@/api/group";


export default {
  name: 'upload',
  data() {
    return {
      dialogFormVisible: false,
      GroupForSessionList: [
      ],
      action: '',
      form: {
        file: '',
        group_id: '',
      },
      title: '导入协议号',
    }
  },
  created() {
    this.getGroupForSessionList()
  },
  destroyed() {
    this.form= {}
  },
  methods: {
    getGroupForSessionList() {
      GroupList({
        group_type: 1,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
    },

    async showUpload() {
      this.dialogFormVisible = true
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      this.dialogFormVisible = false
      this.$refs.upload.submit();
    },
    Upload(fileObj) {
      console.log(fileObj)
      let f = new FormData()
      f.append("file", fileObj.file)
      f.append("group_id", this.form.group_id)

      Import(f).then(res => {
        this.$baseNotify('协议号导入成功,任务后台执行中...', '任务执行中',)
        this.form= {}
      }).catch(err => {
        this.progressFlag = false
        // this.$message.error('上传失败')
      })
      return true
    },

  },
}
</script>
