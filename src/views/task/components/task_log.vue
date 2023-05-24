<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="90%"
      @close="close"
  >
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          prop="发送结果"
          label="序号">
      </el-table-column>
      <el-table-column
          prop="发送结果"
          label="发送结果">
      </el-table-column>
      <el-table-column
          prop="session_phone"
          label="发送协议号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="task_account"
          label="接收飞机号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="协议号分组"
          label="发送消息">
      </el-table-column>
      <el-table-column
          prop="协议号分组"
          label="协议号分组">
      </el-table-column>
      <el-table-column
          prop="私发分组"
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
import {Update,Create} from '@/api/group'

export default {
  name: 'TableEdit',
  data() {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      task_type: [

      ],
      task_status: [
        {label: '已开始', value: 1},
      ],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
      },
      form: {
        account_type: "",
        status: "",
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
      if (!row) {
        this.title = '执行日志'
        this.actionType = 'create'
      } else {
        //select_item json to array
        this.title = '执行日志'
        this.actionType = 'update'
        this.form = Object.assign({}, row)
        console.log(this.form)

      }
      this.dialogFormVisible = true
    },
    async close() {
      this.dialogFormVisible = false

    },
    async save() {
      this.dialogFormVisible = false
    },
  },
}
</script>
