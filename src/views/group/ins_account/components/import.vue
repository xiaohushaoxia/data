<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" @close="close">

    <el-form ref="form" :model="form" label-width="80px">
    
      <el-form-item label="协议分组" prop="group_id">
        <el-input v-model="group_name" placeholder="分组" disabled style="width: auto;"></el-input>
        <el-link style="margin-left: 10px" type="success" disabled >
          可用数：{{ total }} 个
        </el-link>
      </el-form-item>

      <el-upload style="width: 100%;" drag action="#" ref="upload" :limit="1" :show-file-list="true"
        :http-request="Upload" :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传.txt文件</div>
      </el-upload>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Import } from '@/api/instagram/account'
import { List as GroupList } from "@/api/group";


export default {
  name: 'upload',
  data() {
    return {
      dialogFormVisible: false,
      GroupForSessionList: [
      ],
      accountType: [
        { label: '采集', value: 1 },
        { label: '私发', value: 2 },
        { label: '拉群', value: 3 },
        { label: '关注', value: 4 },
      ],
      action: '',
      group_name:'',
group_id:'',
total:'',
      // group_for_session_count: '',  //分组可用数
      form: {
        file: '',
        group_id: '',
        account_type: '',
      },
      title: '导入IG协议号',
    }
  },
  created() {

  },
  destroyed() {
    this.form = {}
  },
  methods: {
    async showUpload(row) {
      this.dialogFormVisible = true
      this.group_name = row.group_name
      this.group_id = row.id
      this.total = row.total
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      this.dialogFormVisible = false
      this.$refs.upload.submit();
    },
    Upload(fileObj) {
      // console.log(123)
      console.log(fileObj)
      let f = new FormData()
      f.append("file", fileObj.file)
      f.append("group_id", this.group_id)
      f.append("account_type", this.form.account_type)

      Import(f).then(res => {
        this.$baseNotify('IG协议号导入成功,任务后台执行中...', '任务执行中',)
        this.form = {}
      }).catch(err => {
        this.progressFlag = false
        // this.$message.error('上传失败')
      })
      return true
    },

  },
}
</script>
