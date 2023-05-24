<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="账号类型" prop="type">
        <el-select v-model="form.account_type">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
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
import {Update} from '@/api/sessions'

export default {
  name: 'TableEdit',
  data() {
    return {
      sessionStatus: [
        {label: '正常', value: 1},
        {label: '封号', value: 2},
      ],
      options: [
        {
          value: 1,
          label: '默认类型'
        },
        {
          value: 2,
          label: '批量私发'
        },
        {
          value: 3,
          label: '批量群发'
        },
        {
          value: 4,
          label: '关键词监听'
        },
        {
          value: 5,
          label: '定时群发'
        },
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
    this.GroupForSessionList = this.$parent.GroupForSessionList
  },
  methods: {
    async showEdit(row) {
      if (!row) {

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
          const {msg} = await Update(this.form)
          this.$baseMessage(msg, 'success')
          this.$refs['form'].resetFields()
          this.dialogFormVisible = false
          await this.$parent.fetchData()
          this.form = this.$options.data().form

        } else {
          return false
        }
      })
    },
  },
}
</script>
