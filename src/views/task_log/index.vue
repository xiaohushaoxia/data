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
          <el-select v-model="queryForm.task_type" placeholder="任务类型">
            <el-option v-for="(item,index) in task_type" :key="index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>

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
          prop="task_name"
          width="150"
          label="任务名称"
      />
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="task_status"
          label="任务内容"
      >
        <template slot-scope="scope">
          <el-table
              :data="tableData"
              border
              style="width: 100%">
            <el-table-column
                prop="date"
                label="协议号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="发送账号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="发送结果">
            </el-table-column>
          </el-table>

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
import {Delete, List} from '@/api/task'
// import edit.vue
import Edit from './components/edit.vue'

export default {
  name: 'ComprehensiveTable',
  components: {
    Edit
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
      task_type: [
        {label: '全部', value: 0},
        {label: '私发', value: 1},
        {label: '群发', value: 2},
        {label: '定时群发', value: 3},
        {label: '导入协议号', value: 4},
        {label: '协议号检测', value: 5},
        {label: '扫码登录', value: 6},
        {label: '导入发送群名单', value: 7},
        {label: '导入发送名单', value: 8},
        {label: '导入link号商', value: 9},
        {label: '注册协议号', value: 10},
      ],
      task_status: [
        {label: '全部', value: -1},
        {label: '未开始', value: 1},
        {label: '已开始', value: 1},
        {label: '运行中', value: 2},
        {label: '已结束', value: 2},
      ],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        session_phone: '',
        status: '',
        group_name:'',
        task_type: '',
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
