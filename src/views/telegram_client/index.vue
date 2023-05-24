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
          <el-button
              icon="el-icon-search"
              type="danger"
              @click="handleQuery"
          >
            刷新
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
              icon="el-icon-search"
              type="danger"
              @click="handleAdd"
          >
            添加客户端
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
          width="100"
          prop="id"
          label="序号"
      ></el-table-column>
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="app_id"
          label="APP_ID"
      />
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="app_secret"
          label="APP_HASH"
      />
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="created_at"
          label="添加时间"
      />
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="updated_at"
          label="更新时间"
      />

      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(row)">删除</el-button>
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
  </div>
</template>

<script>
import {Delete, List} from '@/api/telegramClient'
import {List as GroupList} from '@/api/group'
// import edit.vue
import Edit from './components/edit.vue'
import SessionUpload from './components/import.vue'

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
      sessionStatus: [
        {label: '正常', value: 1},
        {label: '封号', value: 2},
        {label: '双向', value: 3},
        {label: '未检测', value: 4},
      ],
      GroupForSessionList: [
      ],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        phone: '',
        status: '',
        group_id: '',
        import_time: '',
        last_run_time: '',
      },
      formConfig: [],


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
    this.fetchData()
  },
  methods: {
    parseRow(row) {
      console.log(row.field)
    },
    resetForm() {
      this.queryForm = {
        pageNo: 1,
        pageSize: 15,
      }
      this.fetchData()
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


  },
}
</script>
