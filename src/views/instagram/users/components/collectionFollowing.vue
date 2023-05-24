<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-form ref="form" :model="form">
      <el-form-item label="协议分组" prop="type">
        <el-select v-model="form.account_group_id" placeholder="协议分组">
          <el-option v-for="(item,index) in GroupForAccountList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="博主分组" prop="type">
        <el-select v-model="form.blogger_group_id" placeholder="博主分组">
          <el-option v-for="(item,index) in GroupForBloggerList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="粉丝分组" prop="type">
        <el-select v-model="form.users_group_id" placeholder="粉丝分组">
          <el-option v-for="(item,index) in GroupForUserList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="过滤条件">
        <el-form-item label="默认头像" prop="filter_face" style="margin-left: 75px">
          <el-switch v-model="form.filter.filter_face"></el-switch>
        </el-form-item>
        <el-form-item label="私密账号" prop="filter_private" style="margin-left: 75px">
          <el-switch v-model="form.filter.filter_private"></el-switch>
        </el-form-item>
        <el-form-item label="数值用户" prop="filter_number" style="margin-left: 75px">
          <el-switch v-model="form.filter.filter_number"></el-switch>
        </el-form-item>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">开始任务</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Following} from '@/api/instagram/users'
import {List as GroupList} from "@/api/group";


export default {
  name: 'upload2',
  data() {
    return {
      dialogFormVisible: false,
      GroupForAccountList: [],
      GroupForBloggerList: [],
      GroupForUserList: [],
      action: '',
      form: {
        account_group_id: '',
        blogger_group_id: '',
        users_group_id: '',
        filter: {
          filter_face:true,
          filter_private: true,
          filter_number: true,
        },
      },
      title: 'IG博主关注采集',
    }
  },
  mounted() {
    this.GroupForUserList= this.$parent.GroupForSessionList

  },
  destroyed() {
    this.form = {}
  },
  methods: {
    getGroupForSessionList() {
      GroupList({
        group_type: 5,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForUserList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
      GroupList({
        group_type: 4,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForBloggerList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
      GroupList({
        group_type: 6,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForAccountList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
    },

    async handle() {
      this.dialogFormVisible = true
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      this.dialogFormVisible = false
      Following(this.form).then(res => {
        this.$message({
          message: '任务已经开始',
          type: 'success'
        });
      })
    },

  },
}
</script>
