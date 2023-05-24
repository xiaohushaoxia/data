<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="1500px" @close="close">
    <div class="">
   
   <el-button type="primary" @click="refresh">刷新</el-button>
 </div>
    <el-table :data="list" border style="width: 100%">
     
      <el-table-column align="left" show-overflow-tooltip prop="id" label="序号" min-width="100"
        width="70"></el-table-column>

      <el-table-column align="left" show-overflow-tooltip prop="group_name" min-width="100" label="分组" />
      <el-table-column align="left" prop="username" min-width="120" label="账号">
        <template #default="{ row }">
          <el-icon></el-icon>
          <el-link type="success" :href="'https://www.instagram.com/' + row.username" target="_blank"
            class="el-icon-link">{{ row.username }}
          </el-link>
        </template>
      </el-table-column>
      <!-- <el-table-column align="left" width="100" show-overflow-tooltip prop="message_status" label="帐号状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.execution_status == 1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.execution_status == 2" type="danger">异常</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="left" show-overflow-tooltip prop="task_times" min-width="70" label="被采集次数" />
      <el-table-column align="left" show-overflow-tooltip prop="follower" min-width="100" label="粉丝数" />
      <el-table-column align="left" show-overflow-tooltip prop="following" min-width="100" label="关注数" />
      <el-table-column align="left" show-overflow-tooltip prop="imported_at" default="-" min-width="100" label="导入时间" />


      <el-table-column align="left" show-overflow-tooltip prop="updated_at" default="-" label="最后采集时间" />



    
    </el-table>
    <el-pagination  :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
    <div slot="footer" class="dialog-footer">
   
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {List } from '@/api/instagram/blogger'

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
      total: 0,
      list: [],
      group_id: '',
      form: {
        export_type: '',
        group_id: '',
        status_id: '',
        language_id: '',
        country_id_name: '',
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        username: '',
        status: '',
        group_id: '',
        import_time: '',
        account_type: '',
      },
      title: '详情列表',
    }
  },

  mounted() {


  },
  destroyed() {
    this.form = {}
  },
  methods: {
    refresh() {
      this.queryForm = {
        
        account_type: '',
        pageNo: 1,
        pageSize: 10,
        group_id: this.group_id

      }
      this.fetchData()
    },
    async showEdit(row) {
      // this.listLoading = true
      this.group_id = row.id
      this.queryForm.group_id= this.group_id
      this.dialogFormVisible = true
      const { data, count } = await List(this.queryForm)
      this.total = count
      this.list = data
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      this.dialogFormVisible = false

    },

    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      const { data, count } = await List(this.queryForm)
      this.total = count

      this.list = data
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
  },
}
</script>
