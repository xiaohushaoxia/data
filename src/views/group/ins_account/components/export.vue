<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" @close="close">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="当前分组" prop="status_id">
        <el-input v-model="group_name" placeholder="分组" disabled></el-input>
        <el-link style="margin-left: 10px" type="success" disabled >
          可用数：{{ total }} 个
        </el-link>
      </el-form-item>
      <el-form-item label="状态" prop="status_id">
        <el-select v-model="form.status_id" placeholder="状态">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">导出任务</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Export} from '@/api/instagram/account'
import {List as GroupList} from "@/api/group";


export default {
  name: 'upload',
  data() {
    return {
      dialogFormVisible: false,
  
      statusList: [
        {label: '全部', value: 0},
        {label: '正常', value: 1},
        {label: '封号', value: 2},
        {label: '待检测', value: 3},
        {label: '登陆过期', value: 4},
        {label: '休眠', value: 5},
        {label: '其他', value: 6},
        {label: '网络问题', value: 10},
        {label: 'IP封禁', value: 9},
        {label: '账号锁定', value: 7},
        {label: '禁拉群', value: 11},
        {label: '禁群消息', value: 12},

      ],
      group_name: '',
      total: '',
      form: {
        export_type: '',
        group_id: '',
        status_id: '',
        language_id: '',
        country_id_name: '',
      },
      title: '导出IG协议号',
    }
  },
  // created() {
  //   this.typegroup()
  // },
  mounted() {
    // this.GroupForSessionList = this.$parent.GroupForSessionList

  },
  destroyed() {
    this.form = {}
  },
  methods: {

    async showEdit(row) {
      this.dialogFormVisible = true
      this.group_name = row.group_name
      this.group_id = row.id
      this.total = row.total
      console.log(row)
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      this.dialogFormVisible = false
      // console.log(this.form)
      Export({
        group_id: this.group_id,
        status_id: this.form.status_id,
      }).then(res => {
        this.$baseNotify('粉丝数据导出中,请勿重复执行', '任务执行中',)
      })
    },


  },
}
</script>
