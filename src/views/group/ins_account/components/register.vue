<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" @close="close">
    <el-form ref="form" :model="form" label-width="90px">
      <el-form-item label="协议分组" prop="group_id">
        <el-input v-model="group_name" placeholder="分组" disabled style="width: auto;"></el-input>
        <el-link style="margin-left: 10px" type="success" disabled >
          可用数：{{ total }} 个
        </el-link>
      </el-form-item>
        <el-form-item label="归集分组" prop="to_group_id">
          <el-select v-model="form.to_group_id" placeholder="分组" @change="getTogrouptotal">
          <el-option v-for="(item,index) in Togroup" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled v-if="Togrouptotal !== ''">
          可用数：{{ Togrouptotal }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
        </el-form-item>
      <el-form-item label="渠道" prop="type">
          <el-select v-model="form.type" placeholder="分组" >
              <el-option v-for="(item, index) in channellist" :key="index" :label="item.label"
                         :value="item.value"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item v-if="form.type!=3" label="注册数量" prop="registernum">
        <el-input-number v-model="form.registernum" placeholder="注册数量"></el-input-number>
      </el-form-item>
      <el-form-item label="注册后任务" prop="registerAfter">
        <el-select v-model="form.registerAfter"  multiple placeholder="注册后任务">
          <el-option v-for="(item, index) in registerAfterlist" :key="index" :label="item.label"
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
import { Check } from '@/api/instagram/account'
import { List as GroupList } from "@/api/group";
import { Total,SecondaryAccount } from "@/api/group";
export default {
  name: 'TableEdit',
  data() {
    return {

      channellist: [
        { label: '手机号', value: 1 },
        { label: '邮箱', value: 2 },
        { label: '分裂', value: 3 },
      ],
      group_for_session_count: '',
      group_name: '',
      Togroup: [],
      group_id: 0,
      total: 0,
      form: {
        registernum: 100, //默认注册数量
        type: "",      //默认渠道
        registerAfter: "",  //默认注册后任务
        to_group_id: "",  //默认归集分组

      },
      Togrouptotal: '',
      // Typelist: [
      // { label: '手机', value: 1 },
      //   { label: '邮箱', value: 2 },
      //   { label: '分裂', value: 3 },
      
      // ],
      title: '',
      dialogFormVisible: false,
      select_items: [],
      GroupForSessionList: [],
      registerAfterlist: [ 
        { label: '更新签名', value: 1 },
        { label: '关注', value: 2 },
        { label: '浏览帖子', value: 3 },
        { label: '喜欢帖子', value: 4 },
        { label: '更新资料', value: 5 },
      ],
    }
  },
  created() {
    this.getGroup()
  },
  methods: {
    //
    refresh(){
      this.getGroup()
      this.getTogrouptotal()
    },
    getGroup(){
      this.Togroup = []
      GroupList({
        group_type:13,
        // from: "select"
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          // console.log(res)
          this.Togroup.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
            total: res.data[i].total
          })
         
        }
      })
    },
    getTogrouptotal(){
      Total({
        id: this.form.to_group_id
      }).then(res => {
        this.Togrouptotal = res.data
      })
    },

    async showEdit(row) {
      console.log(row)
      this.title = 'INS注册'
      this.dialogFormVisible = true
      this.group_id = row.id
      this.group_name = row.group_name
      this.total = row.total
    },
    async close() {
      this.$refs['form'].resetFields()
      this.dialogFormVisible = false
    },
    async save() {
      console.log(this.form)
      if(this.form.type == 3){
       delete this.form.registernum
      }
      await this.$refs['form'].validate(async (valid) => {
        if (valid) {

          SecondaryAccount({
              group_id : this.group_id,   //分组id
              to_group_id: this.form.to_group_id,   //归集分组id
              after_task: this.form.registerAfter,  //注册后任务
              type: this.form.type,   //渠道
              register_num: this.form.registernum,  //注册数量

          }).then(res => {
            this.$baseNotify('任务已提交',)
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
