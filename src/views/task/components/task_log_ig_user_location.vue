<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="80%"
      height="70%"
      @close="close"
  >
    <el-descriptions title="数据统计" direction="vertical" border>
      <template slot="extra">
        <el-button
            type="primary"
            @click="fetchData"
            style="margin-left: 10px">刷新数据
        </el-button>
      </template>

    </el-descriptions>
    <el-table
        :data="statistic"
        border
        style="width: 100%">
      <!-- <el-table-column
          prop="id"
          label="任务进度">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.progress.rate*100 }}%
        </template>
      </el-table-column> -->
      <el-table-column
          prop="id"
          label="总数">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.total }}
        </template>
      </el-table-column>
      <el-table-column
          prop="id"
          label="成功">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.success }}
        </template>
      </el-table-column>
      <el-table-column
          prop="id"
          label="失败">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.failed }}
        </template>
      </el-table-column>

      <el-table-column
          prop="id"
          label="协议号数">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.account_total }}
        </template>
      </el-table-column>

      <el-table-column
          prop="id"
          label="协议号封号数">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.ban_account_total }}
        </template>
      </el-table-column>

      <el-table-column
          prop="id"
          label="隐私账户">
        <template slot-scope="scope">
          <el-tag v-if="form.task_data.Filter.filter_private == false">不过滤</el-tag>
          <el-tag type="danger" v-if="form.task_data.Filter.filter_private == true">过滤</el-tag>
          <br>

          {{ scope.row.task_log_content.private }}
        </template>
      </el-table-column>
      <el-table-column
          prop="id"
          label="无效用户名">
        <template slot-scope="scope">
          <el-tag v-if="form.task_data.Filter.filter_number == false">不过滤</el-tag>
          <el-tag type="danger" v-if="form.task_data.Filter.filter_number == true">过滤</el-tag>
          <br>

          {{ scope.row.task_log_content.invalid_name }}
        </template>
      </el-table-column>
      <el-table-column
          prop="id"
          label="默认头像">
        <template slot-scope="scope">
          <el-tag v-if="form.task_data.Filter.filter_face == false">不过滤</el-tag>
          <el-tag type="danger" v-if="form.task_data.Filter.filter_face == true">过滤</el-tag>
          <br>
          {{ scope.row.task_log_content.no_face }}
        </template>
      </el-table-column>
      <el-table-column
          prop="id"
          label="有效采集比">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.effective_ratio*100 }}%
        </template>
      </el-table-column>
      <el-table-column
          prop="id"
          label="重复数据">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.duplicate }}
        </template>
      </el-table-column>
      <!-- <el-table-column
          prop="id"
          label="有效采集比">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.effective_ratio*100 }}%
        </template>
      </el-table-column> -->
      <!-- <el-table-column
          prop="task_log_content.result"
          label="博主数量">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.blogger_total }}

        </template>
      </el-table-column>
      <el-table-column
          prop="task_log_content.session_phone"
          label="协议号数量"
          width="180">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.account_total }}

        </template>
      </el-table-column>
      <el-table-column
          prop="task_log_content.task_account_name"
          label="协议号封号数"
          width="180">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.account_baned_total }}

        </template>
      </el-table-column> -->

    </el-table>
    <br>
    <el-descriptions title="异常数据" direction="vertical" border>

    </el-descriptions>
    <el-table
        :data="list"
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          label="序号">
      </el-table-column>
      <el-table-column
          prop="task_log_content.account_name"
          label="协议号">
      </el-table-column>
      <el-table-column
          prop="task_log_content.user_name"
          label="国家-城市-地区">
      </el-table-column>
      <el-table-column
          prop="task_log_content.error"
          label="详情">
      </el-table-column>
      <el-table-column
          prop="created_at"
          label="发生时间">
      </el-table-column>
    </el-table>
    <el-pagination
        :background="background"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    ></el-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>


<script>
import {List} from '@/api/taskLog'

export default {
  name: 'TableEdit',
  data() {
    return {
      statistic: [],
      layout: 'total, sizes, prev, pager, next',
      total: 0,
      list: [],
      background: true,
      selectRows: '',
      task_type: [],
      task_status: [
        {label: '已开始', value: 1},
      ],
      queryForm: {
        id: "",
        pageNo: 1,
        pageSize: 10,
      },
      form: {
        id: "",
        task_data: "",
      },

      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
    }
  },
  created() {
  },
  methods: {
    async handle(row) {
      this.title =  '执行日志-IG-粉丝操控-地区'
      this.actionType = 'update'
      this.form = Object.assign({}, row)
      this.form.task_data = JSON.parse(this.form.task_data)
      console.log(this.form.task_data)
      this.queryForm.task_id = row.id

      this.fetchData()
      this.dialogFormVisible = true
    },
    async close() {
      this.dialogFormVisible = false

    },
    async save() {

      this.dialogFormVisible = false

    },
    fetchData() {
      List({
        task_id: this.queryForm.task_id,
        pageNo: this.queryForm.pageNo,
        task_log_type: 400,
        pageSize: this.queryForm.pageSize,
      }).then(response => {
        console.log(response)
        this.list = response.data
        this.total = response.total
        for (let i = 0; i < this.list.length; i++) {
         if(this.list[i].task_log_content){
           this.list[i].task_log_content = JSON.parse(this.list[i].task_log_content)}
          console.log(this.list[i].task_log_content)
        }
      })
      List({
        task_id: this.queryForm.task_id,
        task_log_type: 500,
        pageNo: 1,
        pageSize: 10,
      }).then(response => {
        console.log(response)
        this.statistic = response.data
        for (let i = 0; i < this.statistic.length; i++) {
          if(this.statistic[i].task_log_content){
            this.statistic[i].task_log_content = JSON.parse(this.statistic[i].task_log_content)}
          console.log(this.statistic[i].task_log_content)
        }
      })

    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
  },
}
</script>
