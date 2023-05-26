<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="550px" @close="close">
    <el-form ref="form" :model="form" label-width="125px">
   
      <el-form-item label="分组名称" prop="status">
        <el-select v-model="form.group_id">
          <el-option v-for="(item, index) in groupList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标域名" prop="domain">
        <el-input v-model="form.domain"></el-input>
      </el-form-item>
<!--    
      <el-form-item label="主域名" prop="brand_domain">
        <el-input v-model="form.brand_domain"></el-input>
      </el-form-item>
      <el-form-item label="品牌名称" prop="brand_name">
        <el-input v-model="form.brand_name"></el-input>
      </el-form-item>
      <el-form-item label="结果域名" prop="domain">
        <el-input v-model="form.domain"></el-input>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Update} from '@/api/domain'
import { type } from 'os'

export default {
  name: 'TableEdit',
  data() {
    return {
     
      groupList:[],
      sele:'',
      form: {
        // platform_type: "",
        group_id  : "",
target_domain: "",
brand_domain: "",
brand_name: "",
domain: "",
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
   
    // typeChange(e) {
    //   this.form.type = e
    //   if (e == 1) {
    //     // this.form.send_sleep = ""
    //     this.form.add_members_every_time = ""
    //     this.form.add_members_sleep = ""
    //     this.form.create_members_total = ""
    //     this.form.one_account_create_total = ""
    //     this.form.create_group_sleep = ""
    //   } else {
    //     this.form.send_sleep = ''
    //     this.form.one_account_send_total = ''
    //     this.form.error_sleep = ''
    //   }
    // },
    async showEdit(row, obj) {
      this.groupList = obj
      console.log(this.groupList)
      console.log(45645)
      if (!row) {
        this.title = '编辑'
        this.actionType = 'create'
      } else {
        //select_item json to array
        this.title = '编辑'
        this.actionType = 'update'
        this.form = Object.assign({}, row)
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
