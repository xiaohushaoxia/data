<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>

        <el-form-item>
          <el-select v-model="queryForm.message_type" placeholder="话术类型">
            <el-option v-for="(item, index) in message_type" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.message_status" placeholder="话术状态">
            <el-option v-for="(item, index) in message_status" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryForm.group_id" placeholder="所属分组">
            <el-option v-for="(item, index) in group_list" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" native-type="submit" @click="resetForm">
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleQuery">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleAdd">
            创建话术
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" native-type="submit" @click="IgPullGroup">
            IG拉群
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleExecTask">
            私发任务
          </el-button>
        </el-form-item>
      </el-form>

    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" width="100%">
      <el-table-column align="left" show-overflow-tooltip width="100" prop="id" label="序号"></el-table-column>

      <el-table-column align="left" width="200" show-overflow-tooltip prop="message_name" label="话术名称" />
      <el-table-column align="left" show-overflow-tooltip prop="message_content" label="话术内容" />

      <el-table-column align="left" show-overflow-tooltip prop="group_name"  label="所属分组" />

      <el-table-column align="left" width="100" show-overflow-tooltip prop="message_status" label="话术状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.message_status == 1" type="success">可用</el-tag>
          <el-tag v-if="scope.row.message_status == 2" type="danger">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" width="100" show-overflow-tooltip prop="message_type" label="话术类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.message_type == 1">纯文字</el-tag>
          <el-tag v-if="scope.row.message_type == 2">话术转发连接</el-tag>
          <el-tag v-if="scope.row.message_type == 3">图片+文字</el-tag>
          <el-tag v-if="scope.row.message_type == 4">图片</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" width="200" show-overflow-tooltip prop="created_at" label="创建时间" />
      <el-table-column align="left" width="200" show-overflow-tooltip prop="created_at" label="更新时间" />

      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <!-- <el-button type="success" size="mini" @click="handleExecTask(row)">发送单独任务</el-button> -->
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
    <Edit ref="edit" />
    <Task ref="task" />
    <Pull ref="pull" />
  </div>
</template>

<script>
import { Delete, List, SendTask } from '@/api/taskMessage'
import { List as GroupList } from '@/api/group'
// import edit.vue
import Edit from './components/edit.vue'
import Task from './components/task.vue'
import Pull from './components/pull.vue'
export default {
  name: 'ComprehensiveTable',
  components: {
    Edit,
    Task,
    Pull
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      import_time: '',
      task_run_time: '',
      imgShow: true,
      list: [],
      imageList: [],
      listLoading: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      message_group_list: [],
      // pull_group_list: [],
      send_strategy_list: [],
      pull_strategy_list: [],
      elementLoadingText: '正在加载...',
      message_type: [
        { label: '全部', value: 0 },
        { label: '文字', value: 1 },
        { label: '话术转发连接', value: 2 },
        { label: '图文', value: 3 },
        { label: '图片', value: 4 },
      ],
      message_status: [
        { label: '全部', value: -1 },
        { label: '可用', value: 1 },
        { label: '不可用', value: 2 },
      ],
      group_list: [
       
      ],
      id:0,
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        session_phone: '',
        status: '',
        group_name: '',
        message_type: '',
        task_status: '',
        create_time: '',
        last_run_time: '',
      },

    }
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    this.id = this.$route.query.id
    // this.type = this.$route.query.type
    if(this.id){
      // this.queryForm.group_id = this.id;
      this.queryForm.group_id = parseInt(this.id);
      // this.typegroups(this.type);
    }
    if(this.queryForm. account_type ===''){
      this.GroupForSessionList=[]
    }
    this.getGroupList()
  },
  beforeDestroy() {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
     //获取分组列表
     async getGroupList() {
      const { data } = await GroupList(
        {
          group_type: 3   //群发话术 话术分组 
        }
      )
      data.forEach(item => {
        this.group_list.push({
          label: item.group_name,
          value: item.id
        })
      })
    },



    parseRow(row) {
      // console.log(row.field)
    },
    resetForm() {
      this.queryForm = {
        pageNo: 1,
        pageSize: 15,
      }
      this.fetchData()
    },
    getImgUrl(imageFileId) {
      return process.env.VUE_APP_STATIC_URL + imageFileId
    },
    tableSortChange() {

    },
    setSelectRows(val) {
      this.selectRows = val
    },
    handleAdd() {
      this.$refs['edit'].showEdit()
    },
    IgPullGroup() {
      this.$refs['pull'].showEdit()
    },
    handleEdit(row) {
      row.message_url = this.getImgUrl(row.message_url)
      this.$refs['edit'].showEdit(row)
    },
    handleDelete(row) {
      this.$baseConfirm('你确定要删除当前项吗', null, async () => {
        const { msg } = await Delete({ id: row.id })
        this.$baseMessage(msg, 'success')
        await this.fetchData()
      })
    },
    handleExecTask(row) {

      this.$refs['task'].showEdit(row)

    },

    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    handleQuery() {
      this.queryForm.pageNo = 1
      console.log(this.queryForm.query)
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      const { data, count } = await List(this.queryForm)
      this.total = count

      this.list = data
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    handleImport() {
      this.$refs['sessionUpload'].showUpload()
    },


  },
}
</script>
