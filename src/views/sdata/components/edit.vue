<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="550px" @close="close">
    <el-form ref="form" :model="form" label-width="125px">
    
      <el-form-item label="邮箱" prop="field">
        <el-input v-model="form.field"></el-input>
      </el-form-item>
   

      <el-form-item label="密码" prop="desc">
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status">
          <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
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
import { Update, Create } from '@/api/config'
import { type } from 'os'

export default {
  name: 'TableEdit',
  data() {
    return {
      status: [
        { label: '正常', value: 1 },
        { label: '异常', value: 2 },
      ],

      sele:'',
      form: {
        // platform_type: "",
        field: "",
        type: "",
        value: "",
        desc: "",
        platform: "",
        sele:"",
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
    async showEdit(row) {
      if (!row) {
        this.title = '添加新增邮箱'
        this.actionType = 'create'
      } else {
        //select_item json to array
        this.title = '策略邮箱'
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
          //如果type的值为1则讲 send_sleep  one_account_send_total 转为json 传给后端
          let obj = { ...this.form, value: "" }
          // //如果sele的值为1 则one_account_create_total的值为99999999
          // if (this.form.sele === 1) {
          //   this.form.one_account_create_total = 99999999
          // }
          // delete obj.sele
          // if (this.form.type === 1) {
          //   obj.value = '{"send_sleep":' + this.form.send_sleep + ',"one_account_send_total":' + this.form.one_account_send_total + ',"error_sleep":' + this.form.error_sleep +'}'
          //   delete obj.send_sleep
          //   delete obj.one_account_send_total
          //   delete obj.error_sleep
          // }
          // //如果type的值为2 则将  add_members_every_time add_members_sleep create_members_total one_account_create_total  create_group_sleep转为json   
          // if (this.form.type === 2) {
          //   obj.value = '{"add_members_every_time":' + this.form.add_members_every_time + ',"add_members_sleep":' + this.form.add_members_sleep + ',"create_members_total":' + this.form.create_members_total + ',"one_account_create_total":' + this.form.one_account_create_total + ',"create_group_sleep":' + this.form.create_group_sleep + '}'
          // }
          // delete  obj.add_members_every_time
          // delete  obj.add_members_sleep
          // delete  obj.create_members_total
          // delete  obj.one_account_create_total
          // delete  obj.create_group_sleep


          // console.log(obj)
          if (this.actionType === 'create') {

            const { msg } = await Create(obj)
            delete obj.send_sleep
            delete obj.one_account_send_total
            delete obj.add_members_every_time
            delete obj.add_members_sleep
            delete obj.one_account_create_total
            delete obj.create_group_sleep
            delete obj.create_members_total
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            await this.$parent.fetchData()
            this.form = this.$options.data().form

          } else {

            const { msg } = await Update(obj)
            delete obj.send_sleep
            delete obj.one_account_send_total
            delete obj.add_members_every_time
            delete obj.add_members_sleep
            delete obj.one_account_create_total
            delete obj.create_members_total
            delete obj.create_group_sleep
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
