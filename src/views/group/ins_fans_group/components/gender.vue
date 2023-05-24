<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" @close="close">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="协议分组" prop="group_id">
        <el-input v-model="group_name" placeholder="分组" disabled style="width: auto;"></el-input>
        <el-link style="margin-left: 10px" type="success" disabled >
          可用数：{{ total }} 个
        </el-link>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Clear } from '@/api/instagram/account'
import { List as GroupList } from "@/api/group";

export default {
  name: 'TableEdit',
  data() {
    return {
      actionType: [
        { label: '全部', value: 1 },
        { label: '指定分组', value: 2 },
      ],
      group_name:'',
group_id:'',
total:'',
      group_for_session_count: '',

      form: {
        group_id: '',
      },
      // group_for_session_count: '',
      title: '',
      dialogFormVisible: false,
      select_items: [],
      GroupForSessionList: [],
     
    }
  },
  created() {
 
  },
  methods: {
 
    
    async showEdit(row) {
      this.title = '性别识别'
      this.dialogFormVisible = true
      this.group_name = row.group_name
      this.group_id = row.id
      this.total = row.total
    },
    async close() {
      this.$refs['form'].resetFields()
      this.dialogFormVisible = false
    },
    async save() {
      // console.log(this.form)
      await this.$refs['form'].validate(async (valid) => {
        if (valid) {
          // console.log(this.form)
          Clear({
            group_id: this.group_id,
          }).then(res => {
            this.$baseNotify('开始执行任务,请勿重复执行', '任务执行中',)
          })
          this.dialogFormVisible = false

        } else {
          return false
        }
      })
    },
 
  },
}
</script>
