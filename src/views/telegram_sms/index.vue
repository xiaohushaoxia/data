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
          <el-select v-model="queryForm.type" placeholder="渠道">
            <el-option v-for="(item,index) in smsChannel" :key="index" :label="item.label"
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
        <el-form-item>
          <el-button

              icon="el-icon-search"
              type="success"
              native-type="submit"
              @click="handleLinkSms"
          >
            linkSms 协议号
          </el-button>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button-->
<!--              icon="el-icon-search"-->
<!--              type="danger"-->
<!--              @click="handleSmsActivate"-->
<!--          >-->
<!--            sms-activate 协议号-->
<!--          </el-button>-->
<!--        </el-form-item>-->
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
          width="150"
          prop="phone"
          label="手机号"
      ></el-table-column>

      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="sms_code"
          label="验证码"
      />
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="type"
          label="渠道"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.type == 1" type="success">sms-activate</div>
          <div v-if="scope.row.type == 2" type="success">link号商</div>
        </template>
      </el-table-column>
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="created_at"
          label="创建时间"
      />
      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="updated_at"
          label="更新时间"
      />


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
  <smsLinkImport ref="smsLinkImport"/>
  <smsActivate ref="smsActivate"/>
  </div>
</template>

<script>
import { List} from '@/api/sms'
// import edit.vue
import Edit from './components/edit.vue'
import smsLinkImport from './components/smsLinkImport.vue'
import smsActivate from './components/smsActivate.vue'

export default {
  name: 'ComprehensiveTable',
  components: {
    Edit,
    smsLinkImport,
    smsActivate
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
      smsStatus: [
        {label: '未发送', value: 1},
        {label: '接收成功', value: 2},
        {label: '接收超时', value: 3},
      ],
      smsChannel: [
        {label: 'link号商', value: 2},
        // {label: 'sms-activate', value: 1},
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
    handleCheckOne(row) {
      this.$baseConfirm('你确定要检测当'+row.phone+'吗', null, async () => {
        Check({
          id: row.id,
        }).then(res => {
          this.$baseNotify('开始执行检测任务,请勿重复执行', '任务执行中',)
        })
      })

    },
    handleCheckAll() {
      this.$baseConfirm('手动批量检测开始,请勿重复执行', null, async () => {
        Check({
          group_id: 0,
        }).then(res => {
          this.$baseNotify('开始执行检测任务,请勿重复执行', '任务执行中',)
        })
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
    handleLinkSms() {
      this.$refs['smsLinkImport'].handle()
    },
    handleSmsActivate() {
      this.$refs['smsActivate'].handle()
    },


  },
}
</script>
