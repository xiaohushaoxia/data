<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="迁移数量" prop="type">
        {{select_items.length}}
      </el-form-item>
      <el-form-item label="目标分组" prop="type">
        <el-select v-model="form.group_id" placeholder="分组">
          <el-option v-for="(item,index) in GroupForSessionList" :key="index" :label="item.label"
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
// import {BatchUpdateGroup} from '@/api/instagram/blogger'
import {Move} from '@/api/instagram/blogger'
export default {
  name: 'TableEdit',
  data() {
    return {
      GroupForSessionList: [],
      form: {
        account_type: "",
        status: "",
      },

      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
      // move_items: [],
    }
  },
  created() {
    this.move_items = this.$parent.move_items
    this.GroupForSessionList = this.$parent.GroupForSessionList
  },
  methods: {
    async showEdit(row) {
      if (!row) {

      } else {
        //select_item json to array
        this.title = '迁移分组'
        this.actionType = 'update'
        row.forEach((item, index) => {
          this.select_items[index] = item.id
        })
      }
      this.dialogFormVisible = true
    },
    async close() {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.dialogFormVisible = false
      this.select_items = []
      await this.$parent.fetchData()
    },
    async save() {
      await this.$refs['form'].validate(async (valid) => {
        // console.log(this.form.group_id)
        // console.log(this.select_items)
    // console.log(this.move_items)

        if (valid) {
          Move({
            group_id: this.form.group_id,
            ids: this.move_items,
          }).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.close()
          }).catch(error => {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          })

        } else {
          return false
        }
      })
    },
  },
}
</script>
