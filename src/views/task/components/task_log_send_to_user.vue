<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="98%"
      @close="close"
  >
    <el-descriptions title="数据统计" direction="vertical" border>

    </el-descriptions>
    <el-table
        :data="statistic"
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          label="私发总数">
        <template slot-scope="scope">
          {{scope.row.task_log_content.total.account}}
        </template>
      </el-table-column>
      <el-table-column
          prop="task_log_content.result"
          label="协议号数量">
        <template slot-scope="scope">
          {{scope.row.task_log_content.total.session}}
        </template>
      </el-table-column>
      <el-table-column
          prop="task_log_content.session_phone"
          label="发送成功次数"
          width="180">
        <template slot-scope="scope">
          {{scope.row.task_log_content.sendSuccess.account}}
        </template>
      </el-table-column>
      <el-table-column
          prop="task_log_content.task_account_name"
          label="协议号封号"
          width="180">
        <template slot-scope="scope">
          {{scope.row.task_log_content.die.session}}
        </template>
      </el-table-column>
      <el-table-column
          prop="task_log_content.task_message_name"
          label="私发无效">
        <template slot-scope="scope">
          {{scope.row.task_log_content.die.account}}
        </template>
      </el-table-column>
      <el-table-column
          prop="task_log_content.account_group_name"
          label="平均发送数">
        <template slot-scope="scope">
          {{scope.row.task_log_content.count.average}}
        </template>
      </el-table-column>
      <el-table-column
          prop="task_log_content.account_group_name"
          label="最大发送数">
        <template slot-scope="scope">
          {{scope.row.task_log_content.count.max}}
        </template>
      </el-table-column>
      <el-table-column
          prop="task_log_content.account_group_name"
          label="最小发送数">
        <template slot-scope="scope">
          {{scope.row.task_log_content.count.min}}
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-descriptions title="数据日志" direction="vertical"  border>

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
          prop="task_log_content.result"
          label="发送结果">
      </el-table-column>
      <el-table-column
          prop="task_log_content.session_phone"
          label="发送协议号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="task_log_content.task_account_name"
          label="接收飞机号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="task_log_content.task_message_name"
          label="发送消息">
      </el-table-column>
      <el-table-column
          prop="task_log_content.session_group"
          label="协议号分组">
      </el-table-column>
      <el-table-column
          prop="task_log_content.account_group_name"
          label="私发分组">
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
      this.title = '执行日志-私发消息'
      this.actionType = 'update'
      this.form = Object.assign({}, row)
      console.log(this.form)
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
        task_log_type: 1,
        pageSize: this.queryForm.pageSize,
      }).then(response => {
        console.log(response)
        this.list = response.data
        this.total = response.total
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].task_log_content = JSON.parse(this.list[i].task_log_content)

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
          this.statistic[i].task_log_content = JSON.parse(this.statistic[i].task_log_content)
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
