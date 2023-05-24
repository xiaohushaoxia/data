<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="业务类型" prop="account_type">
        <el-select v-model="form.account_type" placeholder="类型" @change="typegroup">
          <el-option v-for="(item,index) in accountType" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>
      <el-form-item label="状态" prop="type">
        <el-select v-model="form.status">
          <el-option v-for="(item,index) in sessionStatus" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分组" prop="type">
        <el-select v-model="form.group_id" placeholder="分组">
          <el-option v-for="(item,index) in GroupForSessionList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
                     
        </el-select>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>
     
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Update} from '@/api/instagram/account'
import {List as GroupList} from "@/api/group";

export default {
  name: 'TableEdit',
  data() {
    return {
      sessionStatus: [
        {label: '正常', value: 1},
        {label: '封号', value: 2},
        {label: '待检测', value: 3},
        {label: '登录过期', value: 4},
        {label: '休眠', value: 5},
        {label: '其他', value: 6},
        {label: '网络问题', value: 10},
        {label: 'IP封禁', value: 9},
        {label: '账号锁定', value: 7},
        {label: '禁拉群', value: 11},
        {label: '禁群消息', value: 12},
      ],
      accountType: [
        {label: '采集', value: 1},
        {label: '私发', value: 2},
        {label: '拉群', value: 3},
        {label: '关注', value: 4},
      ],
      options: [
        {
          value: 1,
          label: '默认类型'
        },
        {
          value: 2,
          label: '批量私发'
        },
        {
          value: 3,
          label: '批量群发'
        },
        {
          value: 4,
          label: '关键词监听'
        },
        {
          value: 5,
          label: '定时群发'
        },
      ],
      form: {
        account_type: "",
        status: "",
        group_id: "",
      },

      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
      GroupForSessionList: [],
    }
  },
  created() {
    // this.getGroupForSessionList()
    this.group_id=''
    this.typegroup()
  },




  methods: {
    // getGroupForSessionList() {
    //   GroupList({
    //     group_type: 6,
    //   }).then(res => {
    //     for (let i = 0; i < res.data.length; i++) {
    //       this.GroupForSessionList.push({
    //         label: res.data[i].group_name,
    //         value: res.data[i].id,
    //       })
    //     }
    //   })
    // },
    refresh() {
      this.typegroup(this.form.account_type)
      this.group_id=''
  
    },


  //获取分类下的分组数
  typegroup(val) {
      console.log(val)
      // console.log(13)
      if (val === undefined) {
        val = this.form.GroupForSessionList
      }
      let sessionGroupType = ''
      this.group_id=''
      this.GroupForSessionList = []
      if (val === 1) {
        sessionGroupType = 6   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      }
      if (val === 2) {
        sessionGroupType = 8  //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      }
      if (val === 3) {
        sessionGroupType = 7   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      }
      if (val === 4) {
        sessionGroupType = 11   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6  IG协议号-关注
      }
      GroupList({
        group_type: sessionGroupType,
        from: "select"

      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          // console.log(res)
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id
          })
        }
      })

    },

    async showEdit(row) {
      if (!row) {
        this.title = '添加'
        this.actionType = 'create'
      } else {
        this.title = '编辑'
        this.actionType = 'update'
        this.form = Object.assign({}, row)
        console.log(this.form)

      }
      this.dialogFormVisible = true
    },
    async close() {
      this.$refs['form'].resetFields()
      this.dialogFormVisible = false
    },
    async save() {
      await this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const {msg} = await Update({
            id: this.form.id,
            status: this.form.status,
            group_id: this.form.group_id,
            account_type: this.form.account_type,
          })
          this.$baseMessage(msg, 'success')
          this.$refs['form'].resetFields()
          await this.$parent.fetchData()
          this.form = this.$options.data().form
          this.dialogFormVisible = false

        } else {
          return false
        }
      })
    },
  },
}
</script>
