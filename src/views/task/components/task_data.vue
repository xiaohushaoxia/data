<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="50%"
      @close="close"
  >
      <el-marker>
        sass
      </el-marker>
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
        this.title = '任务数据'
        this.actionType = 'create'
      } else {
        //select_item json to array
        this.title = '任务数据'
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
