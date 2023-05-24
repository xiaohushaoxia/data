<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="协议号分组" prop="type">
        <el-select v-model="form.protocol_id" placeholder="分组" @click="getProtocol">
          <el-option v-for="(item, index) in Protocol" :key="index" :label="item.group_name" :value="item.id"></el-option>
        </el-select>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>

      <el-form-item label="博主分组" prop="type">
        <el-select v-model="form.group_id" placeholder="分组">
          <el-option v-for="(item, index) in GroupForSessionList" :key="index" :label="item.group_name"
            :value="item.id"></el-option>
        </el-select>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>
      <el-form-item label="最大关注数" prop="type">
        <el-input-number v-model="form.max_follow_total" placeholder="最大关注数"></el-input-number>
      </el-form-item>

      <!-- 间隔时间 -->
      <el-form-item label="间隔时间" prop="type">
        <el-input-number style="width: 100px;" v-model="form.sleep" placeholder="间隔时间"></el-input-number>    秒
      
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { List } from '@/api/group'
import { FollowTask } from '@/api/instagram/blogger'
export default {
  name: 'TableEdit',
  data() {
    return {
      GroupForSessionList: [],
      Protocol: [],
      form: {
        protocol_id: '',
        group_id: '',
        max_follow_total: '',

        sleep:'', //间隔时间
      },

      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
    }
  },
  created() {
    this.getGroup()
    this.getProtocol()
  },

  methods: {


    refresh() {
      this.getProtocol(this.form.protocol_id)
      this.getGroup(this.form.group_id)
    },
    async showEdit(row) {
      if (!row) {

      } else {
        //select_item json to array
        this.title = '关注任务'
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
    //获取关注任务协议号分组
    async getProtocol() {
      await List({
        group_type: 11,
      }).then(response => {
        console.log(response.data)
        this.Protocol = response.data
      })
    },
    //获取任务博主分组
    async getGroup() {
      await List({
        group_type: 12,
        // group_id: this.form.protocol_id,
      }).then(response => {
        console.log(response.data)
        this.GroupForSessionList = response.data
      })

    },
    async save() {
      await this.$refs['form'].validate(async (valid) => {
        // console.log(this.form)
        if (valid) {
          FollowTask({
            account_group_id: this.form.protocol_id,  //协议号分组
            blogger_group_id: this.form.group_id,       //博主分组
            max_follow_total: this.form.max_follow_total,     //最大关注数
            sleep: this.form.sleep, //间隔时间
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
