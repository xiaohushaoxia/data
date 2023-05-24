<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" @close="close">
    <el-form ref="form" :model="form" label-width="80px">
     
      <el-form-item label="协议分组" prop="group_id">
        <el-input v-model="group_name" placeholder="分组" disabled style="width: 215px;"></el-input>
        <el-link style="margin-left: 10px" type="success" disabled>
          可用数：{{ total }} 个
        </el-link>
      </el-form-item>
      <el-form-item label="状态" prop="group_id">
        <el-select v-model="form.status" placeholder="状态">
          <el-option v-for="(item, index) in sessionStatus" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务" prop="after_task" >
        <el-select v-model="form.after_task" multiple  placeholder="任务" style="overflow: hidden;" @change="after">
          <el-option v-for="(item, index) in  after_tasklist" :key="index" :label="item.label"
            :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="after_tasks==2" label="关注博主" prop="group_id" >
        <el-select v-model="form.blogger_group_id" placeholder="关注博主">
          <el-option v-for="(item, index) in GroupForBlogger" :key="index" :label="item.label"
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

export default {
  name: 'TableEdit',
  data() {
    return {

      sessionStatus: [
        { label: '全部', value: 0 },
        { label: '正常', value: 1 },
        { label: '封号', value: 2 },
        { label: '待检测', value: 3 },
        { label: '登录过期', value: 4 },
        { label: '休眠', value: 5 },
        { label: '其他', value: 6 },
        { label: '网络问题', value: 10 },
        { label: 'IP封禁', value: 9 },
        { label: '账号锁定', value: 7 },
        { label: '禁拉群', value: 11 },
        { label: '禁群消息', value: 12 },
      ],
      after_tasklist:[  
        { label: '修改头像', value: 1 },
        { label: '签名', value: 2 },
        { label: '昵称', value: 3 },
        { label: '关注博主', value: 4 }
      ],
      group_for_session_count: '',
      group_name: '',
      group_id: 0,
      total: 0,
      after_tasks:1,
      form: {
        account_type: "",
        action_type: "",
        group_id: '',
        status: 0,
        blogger_group_id: 0,
        after_task: [],
      },

      title: '',
      dialogFormVisible: false,
      select_items: [],
      GroupForSessionList: [],
      GroupForBlogger: [ 
        { label: '不关注', value: 0 },
      ],
    }
  },
  created() {
    this.typegroup()
    this.after_tasks=1
  },
  methods: {
    after(){
      if(this.form.after_task.includes(4)){
        this.after_tasks=2
      }else{
        this.after_tasks=1
      }
      console.log(this.form.after_task)
    },
    async showEdit(row) {
      console.log(row)
      this.title = '批量检测IG协议号'
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
      // console.log(this.form)
      await this.$refs['form'].validate(async (valid) => {
        if (valid) {

          Check({
            group_id: this.group_id,
            status: this.form.status,
            after_task: this.form.after_task,
            blogger_group_id: this.form.blogger_group_id,
          }).then(res => {
            this.$baseNotify('开始执行检测任务,请勿重复执行', '任务执行中',)
            this.after_tasks=1
          })
          this.dialogFormVisible = false

        } else {
          return false
        }
      })
    },
    refresh() {
      this.typegroup( this.form.account_type)
      this.getGroupForSessionTotal(this.form.group_id)
    },
    //获取分组下的协议号数
    getGroupForSessionTotal(id) {
      //找到当前id对应的total
      for (let i = 0; i < this.GroupForSessionList.length; i++) {
        if (this.GroupForSessionList[i].value === id) {
          this.group_for_session_count = this.GroupForSessionList[i].total
          // console.log(this.GroupForSessionList[i])
          break
        }
      }
    },
    typegroup(val) {
      // // console.log(val)
      // // console.log(13)
      // if (val === undefined) {
      //   val = this.form.GroupForSessionList
      // }
      // let sessionGroupType = ''
      // this.GroupForSessionList = []
      // if (val === 1) {
      //   sessionGroupType = 6   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      // }
      // if (val === 2) {
      //   sessionGroupType = 8  //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      // }
      // if (val === 3) {
      //   sessionGroupType = 7   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      // }
      // if (val === 4) {
      //   sessionGroupType = 11   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6  IG协议号-关注
      // }
      // GroupList({
      //   group_type: sessionGroupType,
      //   // from: "select"
      // }).then(res => {
      //   for (let i = 0; i < res.data.length; i++) {
      //     // console.log(res)
      //     this.GroupForSessionList.push({
      //       label: res.data[i].group_name,
      //       value: res.data[i].id,
      //       total: res.data[i].total
      //     })
      //   }
      // })

      GroupList({
        group_type: 12,
        // form: "select"
      }).then(res => {
        console.log(res)
        console.log(23132132132)

        for (let i = 0; i < res.data.length; i++) {
          // console.log(res)
          this.GroupForBlogger.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
            total: res.data[i].total
          })
        }
      })

    },
  
  },
}
</script>
