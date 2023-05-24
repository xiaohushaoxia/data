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
            <el-option v-for="(item,index) in sessionStatus" :key="index" :label="item.label"
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
          <el-input v-model="queryForm.phone" placeholder="飞机号"></el-input>
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
              type="success"
              native-type="submit"
              @click="handleCheckAll"
          >
            批量检测
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              icon="el-icon-search"
              type="danger"
              @click="handleImport"
          >
            批量导入
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              icon="el-icon-search"
              type="danger"
              @click="handleClear"
          >
            清理封号
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
          width="150"
          prop="group_name"
          label="分组名称"
      ></el-table-column>

      <el-table-column
          align="left"
          show-overflow-tooltip
          width="85"
          prop="status"
          label="账号状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="success">未检测</el-tag>
          <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="danger">封号</el-tag>
          <el-tag v-else-if="scope.row.status == 3" type="warning">双向</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          align="left"
          show-overflow-tooltip
          width="150"
          prop="phone"
          label="飞机号"
      />
      <el-table-column
          align="left"
          show-overflow-tooltip
          width="150"
          prop="phone"
          label="用户名"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.first_name != '' || scope.row.last_name != '' " >
            {{scope.row.first_name}}
            {{scope.row.last_name}}
            <br>
          </div>
          <div v-if="scope.row.user_name !=''" >
            @{{scope.row.user_name}}
          </div>

        </template>
      </el-table-column>

      <el-table-column
          align="left"
          show-overflow-tooltip
          prop="last_check_time"
          label="检测时间"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.last_check_time == ''" type="info">-</el-tag>
          {{scope.row.last_check_time}}
        </template>
      </el-table-column>
      <el-table-column
          align="left"
          show-overflow-tooltip
          width="180"
          prop="import_time"
          label="导入时间"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.import_time == ''" type="info">-</el-tag>
          {{scope.row.import_time}}
        </template>
      </el-table-column>

      <el-table-column
          align="left"
          show-overflow-tooltip
          width="100"
          prop="send_total"
          label="发送次数"
      />

      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button v-if="row.status==0" type="warning" size="mini" @click="handleCheckOne(row)">检测</el-button>
          <el-button disabled  v-if="row.status!=0" type="info" size="mini" >检测</el-button>
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
  <SessionUpload ref="sessionUpload"/>
  </div>
</template>

<script>
import {Delete, List, Check, Clear} from '@/api/sessions'
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
    this.getGroupForSessionList()
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
    handleImport() {
      this.$refs['sessionUpload'].showUpload()
    },
    handleClear() {
      this.$baseConfirm('你确定要清空当前项吗', null, async () => {
        const {msg} = await Clear()
        this.$baseMessage("清理成功", 'success')
        await this.fetchData()
      })
    },


  },
}
</script>
