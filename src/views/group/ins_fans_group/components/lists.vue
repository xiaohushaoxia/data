<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="1800px" @close="close">
    <div class="">
   
   <el-button type="primary" @click="refresh">刷新</el-button>
 </div>
    <el-table :data="list" border style="width: 100%">
      <el-table-column align="left" show-overflow-tooltip prop="id"  label="序号"></el-table-column>

<el-table-column align="left" show-overflow-tooltip prop="pk"  label="PK" />
<el-table-column align="left" min-width="80" prop="username" label="账号">
  <template #default="{ row }">
    <el-icon></el-icon>
    <el-link type="success" :href="'https://www.instagram.com/' + row.username" target="_blank"
      class="el-icon-link">{{ row.username }}
    </el-link>
  </template>
</el-table-column>

<el-table-column align="left" show-overflow-tooltip prop="full_name" label="名称">
  <template #default="{ row }">
    <div v-if="row.full_name == ''">-</div>
    <div v-else>{{ row.full_name }}</div>
  </template>
</el-table-column>
<el-table-column align="left" show-overflow-tooltip  prop="blogger_name" label="所属博主" />

<el-table-column align="left" show-overflow-tooltip min-width="32" prop="import_type" label="数据来源">
  <template slot-scope="scope">
    <el-tag v-if="scope.row.import_type == 1" type="success">采集关注</el-tag>
    <el-tag v-if="scope.row.import_type == 2" type="primary">采集粉丝</el-tag>
    <el-tag v-if="scope.row.import_type == 3" type="info">国家地区</el-tag>
    <el-tag v-if="scope.row.import_type == 4" type="warning">文件导入</el-tag>
  </template>
</el-table-column>
<el-table-column align="left" show-overflow-tooltip min-width="20" prop="task_times" label="任务次数" />

<el-table-column align="left" show-overflow-tooltip min-width="30" prop="country_id_name" label="国家">
  <template slot-scope="scope">
    <div v-if="scope.row.country_id_name == ''" type="success">-</div>
    <div v-if="scope.row.country_id_name !== ''" type="success">{{ scope.row.country_id_name }}</div>
  </template>
</el-table-column>
<el-table-column align="left" show-overflow-tooltip prop="language_id" label="语言" style="display: flex;">
  <template slot-scope="scope" >
    <div class="flexs"  v-for="(item, index) in scope.row.language_id" :key="index" >
   
    <el-tag v-if="scope.row.language_id !== ''" type="success">{{ item }}</el-tag>
    </div>
  </template>

</el-table-column>

<el-table-column align="left" show-overflow-tooltip min-width="70" prop="created_at" label="导入时间" />

    
    </el-table>
    <el-pagination  :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
    <div slot="footer" class="dialog-footer">
   
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {LanguageMap, List } from '@/api/instagram/users'
// import CollectionLanguage from './components/collectionLanguage.vue'
export default {
  name: 'upload',
  data() {
    return {
      dialogFormVisible: false,
  
      statusList: [
        {label: '全部', value: 0},
        {label: '正常', value: 1},
        {label: '封号', value: 2},
        {label: '待检测', value: 3},
        {label: '登陆过期', value: 4},
        {label: '休眠', value: 5},
        {label: '其他', value: 6},
        {label: '网络问题', value: 10},
        {label: 'IP封禁', value: 9},
        {label: '账号锁定', value: 7},
        {label: '禁拉群', value: 11},
        {label: '禁群消息', value: 12},

      ],
      group_name: '',
      total: 0,
      list: [],
      group_id: '',
      language_id:",zh-Hant,zh,en,tw",
      form: {
        export_type: '',
        group_id: '',
        status_id: '',
        language_id: '',
        country_id_name: '',
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        username: '',
        status: '',
        group_id: '',
        import_time: '',
        account_type: '',
      },
      title: '详情列表',
      LanguageList: [],
    }
  },

  mounted() {


  },
  destroyed() {
    this.form = {}
  },
  methods: {
    refresh() {
      this.queryForm = {
        
        account_type: '',
        pageNo: 1,
        pageSize: 10,
        group_id: this.group_id

      }
      this.fetchData()
    },
    getLanguageList() {
      LanguageMap({}).then(res => {
        for (const resKey in res.data) {
          this.LanguageList.push({
            label: res.data[resKey],
            value: resKey,
          })
        }
      })
    },
    async showEdit(row) {
      this.getLanguageList()
      // this.listLoading = true
      this.group_id = row.id
      this.queryForm.group_id= this.group_id
      this.dialogFormVisible = true
      const { data, count } = await List(this.queryForm)
      this.total = count
      this.list = data
        //删除language_id中的第一个逗号
        for (let i = 0; i < this.list.length; i++) {
        this.list[i].language_id = this.list[i].language_id.substring(1)
      }
      //将language_id按照逗号分隔成数组
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].language_id = this.list[i].language_id.split(',')
      }
      this.handleLanguageId()
    },
    handleLanguageId() {
      for (let i = 0; i < this.list.length; i++) {
        let arr = []
        for (let j = 0; j < this.list[i].language_id.length; j++) {
          for (let k = 0; k < this.LanguageList.length; k++) {
            if (this.list[i].language_id[j] == this.LanguageList[k].value) {
              arr.push(this.LanguageList[k].label)
            }
          }
        }
        this.list[i].language_id = arr
      }
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      this.dialogFormVisible = false

    },

    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      const { data, count } = await List(this.queryForm)
      this.total = count

      this.list = data
          //删除language_id中的第一个逗号
          for (let i = 0; i < this.list.length; i++) {
        this.list[i].language_id = this.list[i].language_id.substring(1)
      }
      //将language_id按照逗号分隔成数组
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].language_id = this.list[i].language_id.split(',')
      }
      this.handleLanguageId()
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
  },
}
</script>
