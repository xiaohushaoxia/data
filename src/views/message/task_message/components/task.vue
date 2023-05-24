<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="600px" height="400px" @close="close">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="业务平台" prop="platform_type">
        <el-select v-model="form.platform_type" @change="getGroupList">
          <el-option v-for="item in platform_type" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
     <div >
      <el-form-item label="话术类型" prop="message_type" v-if="message_listtype===2">
        <el-select v-model="form.message_type" disabled>
          <el-option v-for="item in message_type" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
     </div>

      <el-form-item label="发送分组" prop="session_id">
        <el-select v-model="form.session_id" @change="getSessionTotal">
          <el-option v-for="item in task_session_list" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled v-if="task_session_count != ''">
          可用数：{{ task_session_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>


      </el-form-item>
      <el-form-item label="接收分组" prop="account_id">
        <el-select v-model="form.account_id" @change="getTaskAccountTotal">
          <el-option v-for="item in task_account_list" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled v-if="task_account_count != ''">
          可用数：{{ task_account_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>

      </el-form-item>

      <el-form-item label="发送策略" prop="send_strategy_id">
        <el-select v-model="form.send_strategy_id" @change="tttt">
          <el-option v-for="item in send_strategy_list" :key="item.field" :label="item.field" :value="item.id">
          </el-option>
        </el-select>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>

      </el-form-item>

      <el-form-item label="话术分组" prop="message_group_id" v-if="message_listtype===1">
        <el-select v-model="form.message_group_id" @change="getMessageGroupTotal">
          <el-option v-for="item in message_group_list" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled v-if="message_group_count != ''">
          可用数：{{ message_group_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>
    <div  v-if="message_listtype===2">
      <el-form-item label="发送内容" v-if="form.message_type != 4">
        <el-input type="textarea" readonly :rows="15" v-model="form.message_content"></el-input>
      </el-form-item>
      <el-form-item label="图片" v-if="form.message_type == 3 || form.message_type == 4">
        <el-image :src="form.message_url" />
        {{ form.message_url }}
      </el-form-item>
    </div>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { SendTask } from '@/api/taskMessage'
import { Total as SessionTotal } from '@/api/sessions'
import { Total as TaskAccountTotal } from '@/api/taskAccount'
import { Total as IGSessionTotal } from '@/api/instagram/account'
import { Total as IGUserTotal } from '@/api/instagram/users'
import { List as GroupList } from '@/api/group'
import Upload from './upload'
import { UploadImage } from "@/api/fileUplode";
import { List as SendStrategyList } from '@/api/config'

export default {
  name: 'TableEdit',
  components: {
    Upload,
  },
  data() {
    return {
      message_group_count: '',   //话术分组可用数
      session_list_id: '',      //
      task_account_list_id: '',  
      message_listtype: '',       //发送状态 1=单独2=分组
      task_message_id: '',
      task_account_count: '',
      task_session_count: '',
      message_group_list: [],
      pull_group_list: [],
      send_strategy_list: [],
      pull_strategy_list: [],
      platform_type: [
        { label: 'telegram', value: 1 },
        { label: 'instagram', value: 2 },
      ],
      message_type: [
        { label: '文字', value: 1 },
        { label: '话术转发连接', value: 2 },
        { label: '图文', value: 3 },
        { label: '图片', value: 4 },
      ],
      message_status: [
        { label: '可用', value: 1 },
        { label: '不可用', value: 2 },
      ],
      task_session_list: [],
      task_account_list: [],
      send_strategy_list: [],
      message_group_list: [],
      form: {
        message_content: '',
        message_type: '',
        platform_type: '',
        id: '',
        account_id: '',
        send_strategy_id: '',
        session_id: '',
      },
      message_group_id: '',
      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
    }
  },
  created() {
    this.getSendStrategyList()

    // this.getGroupList()
  },
  methods: {
    tttt(e) {
      // console.log(this.form)
    },



    UploadImage(fileObj) {
      // this.progressPercent = 0
      // this.progressFlag = true
      let f = new FormData()
      f.append("file", fileObj.file)

      UploadImage(f).then(res => {
        this.$message.success('上传成功')
        this.form.message_url = process.env.VUE_APP_STATIC_URL + '/' + res.url
      }).catch(err => {
        this.progressFlag = false
        this.$message.error(err)
      })
      return true
    },
    getImgUrl(imageFileId) {
      return process.env.VUE_APP_STATIC_URL + imageFileId
    },
    async showEdit(row) {
      if (row.id !== undefined) {
        this.message_listtype=2
      } else {
        this.message_listtype=1
      }
      this.message_group_count = ''   //话术分组可用数
      this.message_group_list=[]
      this.form = {};
      this.session_list_id = ''
      this.task_account_list_id = ''
      this.task_message_id = ''
      this.task_account_count = ''
      this.task_session_count = ''
      //select_item json to array
      this.title = '创建私发任务'
      this.actionType = 'update'
      this.form = Object.assign({}, row)
      // console.log(this.form)
      this.dialogFormVisible = true
    },
    async close() {
      // this.$refs['form'].resetFields()
      this.dialogFormVisible = false
    },
    refresh() {
      this.getGroupList()
      this.getTaskAccountTotal(this.form.account_id)
      this.getSendStrategyList(this.form.send_strategy_id)
      this.getSessionTotal(this.form.session_id)
      this.getMessageGroupTotal(this.form.message_group_id)   //话术分组可用数
    },

    //获取群组列表
    getGroupList(val) {
      if (val === undefined) {
        val = this.form.platform_type
      }
      let sessionGroupType = 1
      let accountGroupType = 2
      if (val === 1) {
        sessionGroupType = 1
        accountGroupType = 2
      }
      if (val === 2) {
        sessionGroupType = 8
        accountGroupType = 5
      }
      this.task_session_list = []
      this.task_account_list = []
      this.message_group_list = []
      GroupList({
        group_type: sessionGroupType
      }).then(res => {
        // console.log('task_session_list', res)
        for (let i = 0; i < res.data.length; i++) {
          this.task_session_list.push({
            label: res.data[i].group_name,
            value: res.data[i].id
          })
        }
      })
      GroupList({
        group_type: accountGroupType
      }).then(res => {
        // console.log('task_account_list', res)
        for (let i = 0; i < res.data.length; i++) {
          this.task_account_list.push({
            label: res.data[i].group_name,
            value: res.data[i].id
          })
        }

      })

      GroupList({
        group_type: 3
      }).then(res => {
        // this.message_group_count = res.data.total
        this.message_group_list = res.data

        for (let i = 0; i < this.message_group_list.length; i++) {
          this.message_group_list[i].label = this.message_group_list[i].group_name
          this.message_group_list[i].value = this.message_group_list[i].id
        }

      })
    },
    //计数
    getTaskAccountTotal(id) {
      if (this.form.platform_type === 1) {
        TaskAccountTotal({ id: id }).then(res => {
          this.task_account_count = res.data
        })
      }

      if (this.form.platform_type === 2) {
        IGUserTotal({ id: id }).then(res => {
          this.task_account_count = res.data
        })
      }

    },
    //计数
    getSessionTotal(id) {

      if (this.form.platform_type === 1) {
        SessionTotal({ id: id }).then(res => {
          this.task_session_count = res.data
        })
      }
      if (this.form.platform_type === 2) {
        IGSessionTotal({ id: id }).then(res => {
          this.task_session_count = res.data
        })
      }

    },
    //获取策略列表
    getSendStrategyList(id) {
      this.send_strategy_list = []
      SendStrategyList({ type: 1 }).then(res => {
        this.send_strategy_list = res.data
        // console.log('send_strategy_list', res)
        for (let i = 0; i < this.send_strategy_list.length; i++) {
          this.send_strategy_list[i].value = JSON.parse(this.send_strategy_list[i].value)
          // //组装数据
          // this.list[i].add_members_every_time = this.list[i].value.add_members_every_time       //每次拉多少人
          // this.list[i].add_members_sleep = this.list[i].value.add_members_sleep       //每次拉人的间隔
          // this.list[i].create_members_total = this.list[i].value.create_members_total       //群总人数
          // this.list[i].one_account_create_total = this.list[i].value.one_account_create_total       //一个协议号建群数
          // this.list[i].send_sleep = this.list[i].value.send_sleep     //每次发送的间隔
          // this.list[i].one_account_send_total = this.list[i].value.one_account_send_total   //一个协议号发几个
        }
      })
    },
    //话术分组
    getMessageGroupTotal(id) {
      //找到当前id对应的total
      for (let i = 0; i < this.message_group_list.length; i++) {
        if (this.message_group_list[i].id === id) {
          this.message_group_count = this.message_group_list[i].total
        }
      }

    },
    async save() {
      await this.$refs['form'].validate(async (valid) => {
        // console.log(this.form)
        if (valid) {
          // console.log({   
          //   session_group_id: this.form.session_id,
          //   account_group_id: this.form.account_id,
          //   // task_message_id: this.form.id,
          //   message_group_id: this.form.message_group_id,
          //   platform: this.form.platform_type,
          //   send_strategy_id: this.form.send_strategy_id,
          // })
          
          SendTask({
            session_group_id: this.form.session_id,
            account_group_id: this.form.account_id,
            // task_message_id: this.form.id,
            message_group_id: this.form.message_group_id,
            platform: this.form.platform_type,
            send_strategy_id: this.form.send_strategy_id,
          }).then(res => {
            this.$message.success('发送成功')
            this.close()
            this.$emit('refresh')
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.el-textarea__inner {
  background-color: #1b2735;
  color: #66ccaa;
  height: 100px;
}
</style>
