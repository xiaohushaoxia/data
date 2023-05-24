<template>
  <div class="table-container">
    <vab-query-form>
      <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
      >

        <el-form-item>
          <el-select v-model="queryForm.status" placeholder="账号状态">
            <el-option v-for="(item,index) in accountStatus" :key="index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.group_id" placeholder="分组">
            <el-option v-for="(item,index) in GroupForSessionList" :key="index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryForm.send_status" placeholder="发送状态">
            <el-option v-for="(item,index) in sendStatus" :key="index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
              v-model="queryForm.import_time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="导入时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="resetForm"
          >
            重置
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
          >
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              icon="el-icon-search"
              type="danger"
              @click="handleImport"
          >
            名单导入
          </el-button>
        </el-form-item>
      </el-form>

    </vab-query-form>

    <el-table
        ref="tableSort"
        v-loading="listLoading"
        :data="list"
        :element-loading-text="elementLoadingText"
        :height="height"
        @selection-change="setSelectRows"
        @sort-change="tableSortChange"
        width="100%"
    >
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="id"
          label="序号"
      ></el-table-column>

      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="group_name"
          label="分组"
      />
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="username"
          label="私发账号"
      />
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="status"
          label="账号状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">异常</el-tag>
        </template>

      </el-table-column>


      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="created_at"
          label="导入时间"
      />

      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :background="background"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    ></el-pagination>
    <Edit ref="edit"/>
    <SessionUpload ref="sessionUpload"/>
  </div>
</template>

<script>
import {Delete, List} from '@/api/taskAccount'

// import edit.vue
import Edit from './components/edit.vue'
import SessionUpload from './components/import.vue'
import {List as GroupList} from "@/api/group";

export default {
  name: 'ComprehensiveTable',
  components: {
    Edit,
    SessionUpload
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
      elementLoadingText: '正在加载...',
      accountStatus: [
        {label: '全部', value: 0},
        {label: '正常', value: 1},
        {label: '异常', value: 2},
      ],
      sendStatus: [
        {label: '全部', value: 0},
        {label: '已发送', value: 1},
        {label: '异常', value: 2},
        {label: '未发送', value: 3},
      ],
      GroupForSessionList: [
        {label: '全部', value: 0},
      ],

      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        session_phone: '',
        status: '',
        send_status: '',
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

  },
  beforeDestroy() {
  },
  mounted() {
    this.getGroupForSessionList()
    this.fetchData()
  },
  methods: {
    parseRow(row) {
      console.log(row.field)
    },
    getGroupForSessionList() {
      GroupList({
        group_type: 2,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
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
    handleEdit(row) {
      this.$refs['edit'].showEdit(row)
    },
    handleDelete(row) {
      this.$baseConfirm('你确定要删除当前项吗', null, async () => {
        const {msg} = await Delete({id: row.id})
        this.$baseMessage(msg, 'success')
        await this.fetchData()
      })
    },
    handleCheckOne(row) {
      this.$baseConfirm('你确定要检测当' + row.phone + '吗', null, async () => {
        this.$baseNotify('开始执行检测任务,请勿重复执行', row.phone + '：任务执行中')
      })
    },
    handleCheckAll() {
      this.$baseConfirm('手动批量检测开始,请勿重复执行', null, async () => {
        this.$baseNotify('开始执行检测任务,请勿重复执行', '任务执行中',)
      })
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
      const {data, count} = await List(this.queryForm)
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
