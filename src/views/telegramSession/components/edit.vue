<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="账号类型" prop="type">
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
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Update} from '@/api/sessions'
import {List as GroupList} from "@/api/group";

export default {
  name: 'TableEdit',
  data() {
    return {
      sessionStatus: [
        {label: '正常', value: 1},
        {label: '封号', value: 2},
        {label: '双向', value: 3},
        {label: '未启用', value: 4},
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
      },

      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
      GroupForSessionList: [
      ],
    }
  },
  created() {
    this.getGroupForSessionList()
  },
  methods: {
    getGroupForSessionList() {
      GroupList({
        group_type: 1,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
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
          })
          this.$baseMessage(msg, 'success')
          this.$refs['form'].resetFields()
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
  },
}
</script>
