<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="80%" height="70%" @close="close">
    <el-descriptions title="数据统计" direction="vertical" border>
      <template slot="extra">
        <el-button type="primary" @click="fetchData" style="margin-left: 10px">刷新数据
        </el-button>
      </template>

    </el-descriptions>
    <el-table :data="statistic" border style="width: 100%">


      <!-- <el-table-column prop="id" label="总数">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.total }}
        </template>
      </el-table-column> -->
      <el-table-column prop="id" label="总数量">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.total }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="成功数量">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.success }}
        </template>
      </el-table-column>

      <el-table-column prop="id" label="失败数量">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.failed }}
        </template>
      </el-table-column>


    </el-table>
    <br>
    <!-- <el-descriptions title="异常数据" direction="vertical" border>

    </el-descriptions>
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="task_log_content.blogger_name" label="博主">
      </el-table-column>
      <el-table-column prop="task_log_content.account_name" label="协议号">
      </el-table-column>
      <el-table-column prop="task_log_content.error" label="详情">
      </el-table-column>

    </el-table> -->
    <!-- <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination> -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>


<script>
import { List } from '@/api/taskLog'

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
        { label: '已开始', value: 1 },
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
      this.title = '执行日志-IG语言识别'
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
