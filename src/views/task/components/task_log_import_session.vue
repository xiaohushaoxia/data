<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="90%"
      @close="close"
  >
    <el-table
        :data="list"
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          width="150"
          label="序号">
      </el-table-column>
      <el-table-column
          prop="task_log_content.session_phone"
          label="协议号">
      </el-table-column>
      <el-table-column
          prop="task_log_content.result"
          label="结果"
      >
      </el-table-column>
      <el-table-column
          prop="task_log_content.group_name"
          label="分组"
      >
      </el-table-column>
      <el-table-column
          width="180"
          prop="created_at"
          label="检测时间"
      >
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
      this.title = '执行日志-导入协议号文件'
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
