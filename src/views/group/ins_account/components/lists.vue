<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="1500px" @close="close">
    <div class="">
   
   <el-button type="primary" @click="refresh">刷新</el-button>
 </div>
    <el-table :data="list" border style="width: 100%">
     
      <!-- <el-table-column type="selection" width="55">
      </el-table-column> -->
      <el-table-column align="left" fixed show-overflow-tooltip width="100" prop="id" label="序号"></el-table-column>
      <el-table-column align="left" fixed width="100" show-overflow-tooltip prop="group_name"
        label="分组名称"></el-table-column>

      <el-table-column align="left" fixed width="100" show-overflow-tooltip prop="status" label="账号状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="danger">封号</el-tag>
          <el-tag v-else-if="scope.row.status == 3" type="danger">待检测</el-tag>
          <el-tag v-else-if="scope.row.status == 4" type="primary">登录过期</el-tag>
          <el-tag v-else-if="scope.row.status == 5" type="warning">休眠</el-tag>
          <el-tag v-else-if="scope.row.status == 6" type="danger">其他</el-tag>
          <!-- <el-tag v-else-if="scope.row.status == 7" type="danger">被风控</el-tag> -->
          <el-tag v-else-if="scope.row.status == 10" type="warning">网络问题</el-tag>
          <el-tag v-else-if="scope.row.status == 9" type="danger">IP封禁</el-tag>
          <el-tag v-else-if="scope.row.status == 7" type="danger">账号锁定</el-tag>
          <el-tag v-else-if="scope.row.status == 11" type="warning">禁拉群</el-tag>
          <el-tag v-else-if="scope.row.status == 12" type="danger">禁群消息</el-tag>
<!--          <el-tag v-else-if="scope.row.status == 13" type="danger">禁群消息</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column align="left" fixed show-overflow-tooltip prop="username" label="账号" />
      <el-table-column align="left" fixed show-overflow-tooltip prop="password" label="密码" />
      <el-table-column align="left" fixed show-overflow-tooltip prop="account_type" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.account_type == 1" type="primary">采集</el-tag>
          <el-tag v-if="scope.row.account_type == 2" type="warning">私发</el-tag>
          <el-tag v-if="scope.row.account_type == 3" type="success">拉群</el-tag>
          <el-tag v-if="scope.row.account_type == 4" type="success">关注</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" fixed show-overflow-tooltip prop="import_type" label="来源">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.import_type == 4" type="warning">文件导入</el-tag>
          <el-tag v-if="scope.row.import_type == 5" type="success">邮箱注册</el-tag>
          <el-tag v-if="scope.row.import_type == 6" type="primary">手机文件</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" fixed show-overflow-tooltip prop="task_times" label="任务次数" />
      <el-table-column align="left" fixed show-overflow-tooltip prop="created_at" label="导入时间" />
      <el-table-column align="left" fixed show-overflow-tooltip prop="checked_at" label="检测时间">
        <template slot-scope="scope">
          <div v-if="scope.row.checked_at == ''">-</div>
          <div v-else>{{ scope.row.checked_at }}</div>
        </template>

      </el-table-column>


    
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
import { List } from '@/api/instagram/account'

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
