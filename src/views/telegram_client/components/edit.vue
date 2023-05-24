<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="APP_ID" prop="type" :label-width="60">
        <el-input v-model="form.app_id"></el-input>
      </el-form-item>
      <el-form-item label="APP_HASH" prop="type" :label-width="60">
        <el-input v-model="form.app_secret"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Update,Create} from '@/api/telegramClient'

export default {
  name: 'TableEdit',
  data() {
    return {

      form: {
        app_id: '',
        app_secret: '',
      },

      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
      GroupForSessionList: [
      ],
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
        this.title = '编辑'
        this.actionType = 'update'
        this.form = Object.assign({}, row)
        console.log(this.form)

      }
      this.dialogFormVisible = true
    },
    async close() {
      this.$refs['form'].resetFields()
      this.dialogFormVisible = false
    },
    async save() {
      await this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.actionType === 'create') {
            const {msg} = await Create({
              app_id: this.form.app_id,
              app_secret: this.form.app_secret,
            })
            this.$baseMessage(msg, 'success')

          }else{
            const {msg} = await Update({
              id: this.form.id,
              app_id: this.form.app_id,
              app_secret: this.form.app_secret,
            })
            this.$baseMessage(msg, 'success')

          }
          await this.$parent.fetchData()

          this.$refs['form'].resetFields()
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
  },
}
</script>
