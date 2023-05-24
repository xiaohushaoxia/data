<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="close"
  >
    <el-form ref="form" :model="form">
   
      <el-form-item label="粉丝分组" prop="type">
        <el-input v-model="group_name" placeholder="分组" disabled style="width: auto;"></el-input>
        <el-link style="margin-left: 10px" type="success" disabled>
          可用数：{{ total }} 个
        </el-link>
      </el-form-item>
     
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">开始任务</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Language} from '@/api/instagram/users'
import {List as GroupList} from "@/api/group";


export default {
  name: 'upload2',
  data() {
    return {
      dialogFormVisible: false,
      group_name: '',
total: '',
      GroupForUserList: [],
      action: '',
      form: {
        users_group_id: '',
      },
      title: '语言识别',
    }
  },
  mounted() {
    this.GroupForUserList= this.$parent.GroupForSessionList

  },
  destroyed() {
    this.form = {}
  },
  methods: {
    async handle(row) {
      this.dialogFormVisible = true
      this.group_name = row.group_name
      this.total = row.total
      this. form.group_id = row.id
    },
    getGroupForSessionList() {
      GroupList({
        group_type: 5,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForUserList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
   
    },

 
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      this.dialogFormVisible = false
      
      Language(this.form).then(res => {
        this.$message({
          message: '任务已经开始',
          type: 'success'
        });
      })
    },

  },
}
</script>
