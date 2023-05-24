<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="550px" @close="close">
    <el-form ref="form" :model="form" label-width="125px">
      <el-form-item label="业务平台" prop="platform">
        <el-select v-model="form.platform" >
          <el-option v-for="item in platform" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="键名" prop="field">
        <el-input v-model="form.field"></el-input>
      </el-form-item>
      <el-form-item label="配置类型" prop="type">
        <el-select v-model="form.type" @change="typeChange">
          <el-option v-for="(item, index) in type" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 如果type的值为1则显示 -->
      <template v-if="form.type === 1">
        <el-form-item label="每次发送的间隔" prop="send_sleep">
          <el-input-number v-model="form.send_sleep"></el-input-number>
        </el-form-item>
        <el-form-item label="一个协议号发几个" prop="one_account_send_total">
          <el-input-number v-model="form.one_account_send_total"></el-input-number>
        </el-form-item>
        <el-form-item label="异常休眠间隔" prop="error_sleep">
          <el-input-number v-model="form.error_sleep"></el-input-number>
        </el-form-item>
      </template>

      <!-- 如果type的值为2则显示 -->
      <template v-if="form.type === 2">
        <el-form-item label="每次拉多少人" prop="add_members_every_time">
          <el-input-number v-model="form.add_members_every_time"></el-input-number>
        </el-form-item>
        <el-form-item label="每次拉人的间隔" prop="add_members_sleep">
          <el-input-number v-model="form.add_members_sleep"></el-input-number>
        </el-form-item>
        <el-form-item label="群总人数" prop="create_members_total">
          <el-input-number v-model="form.create_members_total"></el-input-number>
        </el-form-item>
        <el-form-item label="一个协议号建群数" prop="sele" >
          <el-select v-model="form.sele" >
            <el-option v-for="(item, index) in selelist" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
    
        <el-form-item label="请输入指定数字"  v-if="form.sele === 2" prop="one_account_create_total">
          <el-input-number v-model="form.one_account_create_total"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="无限大"  v-if="form.sele === 1" prop="value">
          <el-input-number v-model="form.one_account_create_total" value="99999999"></el-input-number>
        </el-form-item> -->
        <el-form-item label="拉群间隔" prop="create_group_sleep">
          <el-input-number v-model="form.create_group_sleep"></el-input-number>
        </el-form-item>
      </template>


      <el-form-item label="配置描述" prop="desc">
        <el-input v-model="form.desc"></el-input>
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
      //平台类型
      platform: [
        { label: 'telegram', value: 1 },
        { label: 'instagram', value: 2 },
      ],
      // type: [
      //   { label: '发送策略', value: 1 },
      //   { label: '拉群策略', value: 2 },
      // ],
      type: [
        { label: '发送策略', value: 1 },
        { label: '拉群策略', value: 2 },
        { label: '其他', value:9 },
   
      ],
      selelist:[
        {label:'无限大',value:1},
        {label:'指定数字',value:2},
      ],
      value: [
        { label: '发送策略', value: 1 },
        { label: '拉群策略', value: 2 },
        { label: '其他', value:9 },
     
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
      value: [],
    }
  },
  created() {
  },
  methods: {
   
    typeChange(e) {
      this.form.type = e
      if (e == 1) {
        // this.form.send_sleep = ""
        this.form.add_members_every_time = ""
        this.form.add_members_sleep = ""
        this.form.create_members_total = ""
        this.form.one_account_create_total = ""
        this.form.create_group_sleep = ""
      } else {
        this.form.send_sleep = ''
        this.form.one_account_send_total = ''
        this.form.error_sleep = ''
      }
    },
    async showEdit(row) {
      if (!row) {
        this.title = '添加新增配置策略'
        this.actionType = 'create'
      } else {
        //select_item json to array
        this.title = '策略编辑'
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
          //如果sele的值为1 则one_account_create_total的值为99999999
          if (this.form.sele === 1) {
            this.form.one_account_create_total = 99999999
          }
          delete obj.sele
          if (this.form.type === 1) {
            obj.value = '{"send_sleep":' + this.form.send_sleep + ',"one_account_send_total":' + this.form.one_account_send_total + ',"error_sleep":' + this.form.error_sleep +'}'
            delete obj.send_sleep
            delete obj.one_account_send_total
            delete obj.error_sleep
          }
          //如果type的值为2 则将  add_members_every_time add_members_sleep create_members_total one_account_create_total  create_group_sleep转为json   
          if (this.form.type === 2) {
            obj.value = '{"add_members_every_time":' + this.form.add_members_every_time + ',"add_members_sleep":' + this.form.add_members_sleep + ',"create_members_total":' + this.form.create_members_total + ',"one_account_create_total":' + this.form.one_account_create_total + ',"create_group_sleep":' + this.form.create_group_sleep + '}'
          }
          delete  obj.add_members_every_time
          delete  obj.add_members_sleep
          delete  obj.create_members_total
          delete  obj.one_account_create_total
          delete  obj.create_group_sleep


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
