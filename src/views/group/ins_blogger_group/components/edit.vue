<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" label-width="80px">

      <el-form-item label="分组名称" prop="type">
        <el-input v-model="form.group_name"></el-input>
      </el-form-item>
      <el-form-item label="分组类型" prop="type">
        <el-select v-model="form.group_type">
          <el-option v-for="item in group_type" :key="item.value" :label="item.label" :value="item.value">
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
import { Create, Update } from '@/api/group'

export default {
  name: 'TableEdit',
  data() {
    return {

      group_type: [
  
        { label: 'INS-博主—采集', value: 4 },
        { label: 'INS-博主-关注', value: 12 },


      ],
      group_status: [
        { label: '激活', value: 1 },
        { label: '禁用', value: 2 },
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
    },
    async save() {
      await this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.actionType === 'create') {
            const { msg } = await Create(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            await this.$parent.fetchData()
            this.form = this.$options.data().form

          } else {
            const { msg } = await Update(this.form)
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
