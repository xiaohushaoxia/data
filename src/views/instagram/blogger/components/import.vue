<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="600px"
      @close="close"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="类型"  @change="typegroup">
          <el-option v-for="(item,index) in typeList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分组" prop="type">
        <el-select v-model="form.group_id" placeholder="分组" @change="getGroupForSessionTotal">
          <el-option v-for="(item,index) in GroupForSessionList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled v-if="group_for_session_count !== ''">
          可用数：{{ group_for_session_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
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
        <div class="el-upload__tip" slot="tip">只能上传txt文件</div>
      </el-upload>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Import} from '@/api/instagram/blogger'
import {List as GroupList} from "@/api/group";


export default {
  name: 'upload',
  data() {
    return {
      dialogFormVisible: false,
      GroupForSessionList: [],
      action: '',
      group_for_session_count: '',
      form: {
        file: '',
        type: '',
      },
      typeList: [{
          label: '采集任务', value: 1,
        },
        {
          label: '关注任务', value: 2,
        },
      ],
      title: '类型',
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
    //     group_type: 4,
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
      this.typegroup( this.form.type)
      this.getGroupForSessionTotal(this.form.group_id)
    },

    //获取分组下的协议号数
    getGroupForSessionTotal(id) {
      //找到当前id对应的total
      for (let i = 0; i < this.GroupForSessionList.length; i++) {
        if (this.GroupForSessionList[i].value === id) {
          this.group_for_session_count = this.GroupForSessionList[i].total
          console.log(this.GroupForSessionList[i])
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
        sessionGroupType = 4   //IG博主-关注 :12 IG博主—采集:4
      }
      if (val === 2) {
        sessionGroupType = 12 //IG博主-关注 :12 IG博主—采集:4
      }
  
      GroupList({
        group_type: sessionGroupType
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
      // console.log(this.form)
      this.dialogFormVisible = false
      this.$refs.upload.submit();
    },
    Upload(fileObj) {
      console.log(fileObj)
      let f = new FormData()
      f.append("file", fileObj.file)
      f.append("group_id", this.form.group_id)

      Import(f).then(res => {
        this.$baseNotify('导入博主名单,任务后台执行中...', '任务执行中',)
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
