<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-form ref="form" :model="form" label-width="80px">

      <el-form-item label="任务名称" prop="type">
        <el-input v-model="form.group_name"></el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-select v-model="form.group_type">
          <el-option
              v-for="item in task_type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="type">
        <el-select v-model="form.group_status">
          <el-option v-for="(item,index) in task_status" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
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

      task_type: [
        // {label: '全部', value: 0},
        {label: '私发', value: 1},
        // {label: '群发', value: 2},
        // {label: '定时群发', value: 3},
        // {label: '导入协议号', value: 4},
        // {label: '协议号检测', value: 5},
        // {label: '扫码登录', value: 6},
        // {label: '导入发送群名单', value: 7},
        // {label: '导入发送名单', value: 8},
      ],
      task_status: [
        {label: '已开始', value: 1},
      ],
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
    async showEdit(row) {
      if (!row) {
        this.title = '添加'
        this.actionType = 'create'
      } else {
        //select_item json to array
        this.title = '编辑'
        this.actionType = 'update'
        this.form = Object.assign({}, row)
        console.log(this.form)

      }
      this.dialogFormVisible = true
    },
    async close() {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.dialogFormVisible = false
      await this.$parent.fetchData()
    },
    async save() {
      await this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.actionType === 'create') {
            const {msg} = await Create(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            await this.$parent.fetchData()
            this.form = this.$options.data().form

          } else {
            const {msg} = await Update(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            await this.$parent.fetchData()
            this.form = this.$options.data().form
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>
