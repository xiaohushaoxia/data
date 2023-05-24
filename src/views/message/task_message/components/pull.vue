<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="800px" height="400px" @close="close">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="业务平台" prop="platform_type">
        <el-select v-model="form.platform_type" @change="getGroupList">
          <el-option v-for="item in platform_type" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

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


      <el-form-item label="话术分组" prop="message_group_id">
        <el-select v-model="form.message_group_id" @change="getMessageGroupTotal">
          <el-option v-for="item in message_group_list" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled v-if="message_group_count != ''">
          可用数：{{ message_group_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>

      <el-form-item label="发送策略分组" prop="send_strategy_id">
        <el-select v-model="form.send_strategy_id" @change="getSendStrategyTotal">
          <el-option v-for="item in send_strategy_list" :key="item.id" :label="item.field" :value="item.id">
          </el-option>
        </el-select>
        <!-- <el-link style="margin-left: 10px" type="success" disabled v-if="send_strategy_count != ''">
          可用数：{{ send_strategy_count }} 个
        </el-link> -->
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>

      <el-form-item label="拉群策略分组" prop="pull_strategy_id">
        <el-select v-model="form.pull_strategy_id" @change="getPullStrategyTotal">
          <el-option v-for="item in pull_strategy_list" :key="item.id" :label="item.field" :value="item.id">
          </el-option>
        </el-select>
        <!-- <el-link style="margin-left: 10px" type="success" disabled v-if="pull_strategy_count != ''">
          可用数：{{ pull_strategy_count }} 个
        </el-link> -->
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>




      <el-form-item v-for="(domain, index) in dynamicValidateForm.group_name" :label="'群名' +( index+1)" :key="domain.key"
        :prop="domain.value">
        
        <el-input v-model="domain.value" style="width: auto;margin-right: 2.5vh;"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain">新增群名</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { AddTask } from '@/api/taskMessage'
import { Total as SessionTotal } from '@/api/sessions'
import { Total as TaskAccountTotal } from '@/api/taskAccount'
import { Total as IGSessionTotal } from '@/api/instagram/account'
import { Total as IGUserTotal } from '@/api/instagram/users'
import { List as GroupList } from '@/api/group'
import Upload from './upload'
//引入@/api/config.js     
import { List } from '@/api/config'

export default {
  name: 'TableEdit',
  components: {
    Upload,
  },
  data() {
    return {
      // session_list_id: '',
      // task_account_list_id: '',
      // task_message_id: '',
      message_group_count: '',   //话术分组可用数
      send_strategy_count: '',  //发送策略分组可用数
      pull_strategy_count: '',   //拉群策略分组可用数
      task_account_count: '',
      task_session_count: '',
      message_group_id: '', //话术分组id
      remark: '',

      platform_type: [
        // {label: 'telegram', value: 1},
        { label: 'instagram', value: 2 },
      ],
      message_group_list: [],
      pull_group_list: [],
      send_strategy_list: [],
      task_session_list: [],
      task_account_list: [],
      pull_strategy_list: [],
      dynamicValidateForm: {
        group_name: [{
          key:0,
          value: ''
        }],
      },
      form: {
        // message_content: '',
        // message_type: '',

        platform_type: '',  //平台类型
        id: '',
        account_id: '',   //接收分组id
        session_id: '',   //发送分组id
        remark: '',       //备注
        send_strategy_id: '', //发送策略分组id
        pull_strategy_id: '',   //拉群策略分组id
        message_group_id: '',   //话术分组id
      },
      link: '',
      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
    }
  },

  created() {
    this.getGroupList()
    this.getSendStrategyTotal()
    this.getPullStrategyTotal()
    // this.getMessageGroupTotal()
    this.getSendStrategyTotal()
    this.getPullStrategyTotal()
    this.getSessionTotal()
  },
  methods: {
  
    removeDomain(item) {
      var index = this.dynamicValidateForm.group_name.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.group_name.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.group_name.push({
        value: '',
        key: this.dynamicValidateForm.group_name.length
      });
      // console.log(this.dynamicValidateForm)
    },


    async showEdit(row) {
      this.form = {};
      this.session_list_id = ''  //发送分组id
      this.task_account_list_id = ''    //接收分组id
      this.task_message_group_id = ''   //话术分组id
      this.task_account_count = ''    //接收分组可用数
      this.task_session_count = ''    //发送分组可用数
      this.message_group_count = ''   //话术分组可用数
      this.send_strategy_count = ''   //发送策略分组可用数
      this.pull_strategy_count = ''   //拉群策略分组可用数
      //select_item json to array
      this.title = 'IG拉群'
      this.actionType = 'update'
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    async close() {
      this.dialogFormVisible = false
    },
    refresh() {
      this.getGroupList()
      this.getTaskAccountTotal(this.form.account_id)
      this.getSessionTotal(this.form.session_id)
      // this.getSendStrategyTotal(this.form.send_strategy_id)  //发送策略分组
      // this.getPullStrategyTotal(this.form.pull_strategy_id)   //拉群策略分组
      // this.getMessageGroupTotal(this.form.message_group_id)   //话术分组
    },

    //获取发送分组可用数
    getGroupList(val) {
      if (val === undefined) {
        val = this.form.platform_type
      }
      let sessionGroupType = 1
      let accountGroupType = 2
      // if (val === 1) {
      //   sessionGroupType = 2   //关闭tg相关信息
      //   accountGroupType = 1
      // }
      if (val === 2) {
        sessionGroupType = 7   //IG拉群协议：7  IG私发协议：8

        accountGroupType = 5
      }
      this.task_session_list = []
      this.task_account_list = []
      // this.send_strategy_list = []
      // this.pull_strategy_list = []
      // this.message_group_list = []
      GroupList({
        group_type: sessionGroupType
      }).then(res => {
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
    //获取接收用户总数
    getTaskAccountTotal(id) {
      //TG
      // if (this.form.platform_type === 1) {
      //   TaskAccountTotal({id: id}).then(res => {
      //     this.task_account_count = res.data
      //   })
      // }
      //IG
      if (this.form.platform_type === 2) {
        IGUserTotal({ id: id }).then(res => {
          this.task_account_count = res.data
        })
      }

    },
    //获取发送帐号总数
    getSessionTotal(id) {
      //TG
      // if (this.form.platform_type === 1) {
      //   SessionTotal({id: id}).then(res => {
      //     this.task_session_count = res.data
      //   })
      // }
      //IG
      if (this.form.platform_type === 2) {
        IGSessionTotal({ id: id }).then(res => {
          this.task_session_count = res.data
        })
      }

    },
    //发送策略 1
    getSendStrategyTotal(id) {
      List({
        type: 1,  // { label: 'IG发送策略', value: 1 },  { label: 'IG拉群策略', value: 2 },
        platform: 2     //   { label: 'telegram', value: 1 },{ label: 'instagram', value: 2 },
      }).then(res => {
        this.send_strategy_count = res.data.length
        this.send_strategy_list = res.data
        //循环遍历
        for (let i = 0; i < this.send_strategy_list.length; i++) {
          this.send_strategy_list[i].label = this.send_strategy_list[i].field
          this.send_strategy_list[i].value = this.send_strategy_list[i].id
          //如果type不为1则从数组中删除
          if (this.send_strategy_list[i].type !== 1) {
            this.send_strategy_list.splice(i, 1)
            i--
          }
        }
      })
    },
    //拉群策略 2
    getPullStrategyTotal(id) {
      List({
        type: 2,
        platform: 2     //   { label: 'telegram', value: 1 },{ label: 'instagram', value: 2 },
      }).then(res => {
        this.pull_strategy_count = res.data.length
        this.pull_strategy_list = res.data
        //循环遍历
        for (let i = 0; i < this.pull_strategy_list.length; i++) {
          this.pull_strategy_list[i].label = this.pull_strategy_list[i].field
          this.pull_strategy_list[i].value = this.pull_strategy_list[i].id
          //如果type不为2则从数组中删除
          if (this.pull_strategy_list[i].type !== 2) {
            this.pull_strategy_list.splice(i, 1)
            i--
          }
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
        let group_name = []
        for (let i = 0; i < this.dynamicValidateForm.group_name.length; i++) {
          group_name.push(this.dynamicValidateForm.group_name[i].value)
        }
        // console.log(group_name)
        this.form.group_name = group_name
        console.log(this.form)

        // platform_type: '',  //平台类型
        // id: '',
        // account_id: '',   //接收分组id
        // session_id: '',   //发送分组id
        // remark: '',       //备注
        // send_strategy_id: '', //发送策略分组id
        // pull_strategy_id: '',   //拉群策略分组id
        // message_group_id: '',   //话术分组id
        if (valid) {
          AddTask({
            platform: this.form.platform_type, //2是ig
            account_group_id: this.form.session_id, //发送账号分组
            message_group_id: this.form.message_group_id, //话术分组
            user_group_id: this.form.account_id, //接收用户分组
            send_strategy_id: this.form.send_strategy_id, //发送策略分组
            pull_strategy_id: this.form.pull_strategy_id,//拉群策略分组
            remark: this.form.remark,
            group_name: this.form.group_name
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
