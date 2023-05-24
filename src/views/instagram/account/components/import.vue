<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" @close="close">

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="业务类型" prop="account_type">
        <el-select v-model="form.account_type" placeholder="类型" @change="typegroup">
          <el-option v-for="(item, index) in accountType" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协议分组" prop="group_id">
        <el-select v-model="form.group_id" placeholder="分组" @change="getGroupForSessionTotal">
          <el-option v-for="(item, index) in GroupForSessionList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>

        <el-link style="margin-left: 10px" type="success" disabled v-if="group_for_session_count  !== ''">
          可用数：{{ group_for_session_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>

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
      group_for_session_count: '',  //分组可用数
      form: {
        file: '',
        group_id: '',
        account_type: '',
      },
      title: '导入IG协议号',
    }
  },
  created() {
    // this.getGroupForSessionList()
    this.typegroup()
  },
  destroyed() {
    this.form = {}
  },
  methods: {
    // getGroupForSessionList() {
    //   GroupList({
    //     group_type: 6,
    //   }).then(res => {
    //     for (let i = 0; i < res.data.length; i++) {
    //       this.GroupForSessionList.push({
    //         label: res.data[i].group_name,
    //         value: res.data[i].id,
    //       })
    //     }
    //   })
    // },
    refresh() {
      this.typegroup( this.form.account_type)
      this.getGroupForSessionTotal(this.form.group_id)
    },
    //获取分组下的协议号数
    getGroupForSessionTotal(id) {
      //找到当前id对应的total
      for (let i = 0; i < this.GroupForSessionList.length; i++) {
        if (this.GroupForSessionList[i].value === id) {
          this.group_for_session_count = this.GroupForSessionList[i].total
          // console.log(this.GroupForSessionList[i])
          break
        }
      }
    },
    //获取分类下的分组数


    typegroup(val) {
      // console.log(val)
      // console.log(13)
      if (val === undefined) {
        val = this.form.GroupForSessionList
      }
      let sessionGroupType = ''
      this.GroupForSessionList = []
      if (val === 1) {
        sessionGroupType = 6   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      }
      if (val === 2) {
        sessionGroupType = 8  //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      }
      if (val === 3) {
        sessionGroupType = 7   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      }
      if (val === 4) {
        sessionGroupType = 11   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6  IG协议号-关注
      }
      GroupList({
        group_type: sessionGroupType,
        // from: "select"
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          // console.log(res)
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
            total: res.data[i].total
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
      // console.log(123)
      console.log(fileObj)
      let f = new FormData()
      f.append("file", fileObj.file)
      f.append("group_id", this.form.group_id)
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
