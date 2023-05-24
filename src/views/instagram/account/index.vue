<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>

        <el-form-item>
          <el-select v-model="queryForm.status" placeholder="账号状态">
            <el-option v-for="(item, index) in sessionStatus" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      
        <el-form-item>
          <el-select v-model="queryForm.import_type" placeholder="来源">
            <el-option v-for="(item, index) in importType" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.account_type" placeholder="类型" @change="typegroup">
            <el-option v-for="(item, index) in accountType" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select v-model="queryForm.group_id" placeholder="分组">
            <el-option v-for="(item, index) in GroupForSessionList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-date-picker-->
        <!--              v-model="queryForm.import_time"-->
        <!--              type="date"-->
        <!--              value-format="yyyy-MM-dd"-->
        <!--              placeholder="导入时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
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
          <el-button icon="el-icon-search" type="primary" native-type="submit" @click="handleExport">
            导出
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="warning" native-type="submit" @click="handleCheckAll">
            批量检测
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="danger" @click="handleImport">
            导入账号文件
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="danger" @click="handleClear">
            清理封号
          </el-button>
        </el-form-item>


      </el-form>

    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" width="100%">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column align="left" fixed show-overflow-tooltip width="100" prop="id" label="序号"></el-table-column>
      <el-table-column align="left" fixed width="100" show-overflow-tooltip prop="group_name"
        label="分组名称"></el-table-column>

      <el-table-column align="left" fixed width="100" show-overflow-tooltip prop="status" label="账号状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="danger">封号</el-tag>
          <el-tag v-else-if="scope.row.status == 3" type="danger">待检测</el-tag>
          <el-tag v-else-if="scope.row.status == 4" type="primary">登录过期</el-tag>
          <el-tag v-else-if="scope.row.status == 5" type="warning">休眠</el-tag>
          <el-tag v-else-if="scope.row.status == 6" type="danger">其他</el-tag>
          <!-- <el-tag v-else-if="scope.row.status == 7" type="danger">被风控</el-tag> -->
          <el-tag v-else-if="scope.row.status == 10" type="warning">网络问题</el-tag>
          <el-tag v-else-if="scope.row.status == 9" type="danger">IP封禁</el-tag>
          <el-tag v-else-if="scope.row.status == 7" type="danger">账号锁定</el-tag>
          <el-tag v-else-if="scope.row.status == 11" type="warning">禁拉群</el-tag>
          <el-tag v-else-if="scope.row.status == 12" type="danger">禁群消息</el-tag>
<!--          <el-tag v-else-if="scope.row.status == 13" type="danger">禁群消息</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column align="left" fixed show-overflow-tooltip prop="username" label="账号" />
      <el-table-column align="left" fixed show-overflow-tooltip prop="password" label="密码" />
      <!-- <el-table-column align="left" fixed show-overflow-tooltip prop="account_type" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.account_type == 1" type="primary">采集</el-tag>
          <el-tag v-if="scope.row.account_type == 2" type="warning">私发</el-tag>
          <el-tag v-if="scope.row.account_type == 3" type="success">拉群</el-tag>
          <el-tag v-if="scope.row.account_type == 4" type="success">关注</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="left" fixed show-overflow-tooltip prop="import_type" label="来源">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.import_type == 1" type="primary">关注</el-tag>
            <el-tag v-if="scope.row.import_type == 2" type="primary">博主</el-tag>
            <el-tag v-if="scope.row.import_type == 3" type="primary">地区采集</el-tag>
          <el-tag v-if="scope.row.import_type == 4" type="warning">文件导入</el-tag>
          <el-tag v-if="scope.row.import_type == 5" type="success">邮箱注册</el-tag>
          <el-tag v-if="scope.row.import_type == 6" type="primary">手机文件</el-tag>
            <el-tag v-if="scope.row.import_type == 7" type="primary">帐号分裂</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" fixed show-overflow-tooltip prop="task_times" label="任务次数" />
      <el-table-column align="left" fixed show-overflow-tooltip prop="created_at" label="导入时间" />
      <el-table-column align="left" fixed show-overflow-tooltip prop="checked_at" label="检测时间">
        <template slot-scope="scope">
          <div v-if="scope.row.checked_at == ''">-</div>
          <div v-else>{{ scope.row.checked_at }}</div>
        </template>

      </el-table-column>


      <el-table-column show-overflow-tooltip label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <!-- <el-button type="warning" size="mini" v-if="row.status !== 2" @click="handleCheckOne(row)">检测</el-button>
          <el-button type="warning" size="mini" v-else-if="row.status == 2" disabled>检测</el-button> -->
        <el-button type="warning" size="mini"  @click="handleCheckOne(row)">检测</el-button>

          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px" v-if="showGroupButton === true && selectRows.length > 0">
      <el-button @click="handleBatchDelete">删除</el-button>
      <el-button @click="handleBatchmove">迁移分组</el-button>
    </div>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
    <Edit ref="edit" />
    <SessionUpload ref="sessionUpload" />
    <CheckALl ref="checkAll" />
    <ExportExcel ref="exportExcel" />
    <Move ref="move" />
    <Clears ref="clears" />
  </div>
</template>

<script>
import { Check, Clear, Delete, List } from '@/api/instagram/account'
import { List as GroupList } from '@/api/group'
// import edit.vue
import Edit from './components/edit.vue'
import SessionUpload from './components/import.vue'
import CheckALl from './components/check.vue'
import ExportExcel from './components/export.vue';
import { BatchDelete } from "@/api/instagram/account";
import Move from './components/move.vue'
import Clears from './components/clears.vue'
import { log } from 'util';
export default {
  name: 'ComprehensiveTable',
  components: {
    Edit,
    SessionUpload,
    CheckALl,
    ExportExcel,
    Move,
    Clears
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
      showGroupButton: false,

      import_time: '',
      task_run_time: '',
      imgShow: true,
      list: [],
      imageList: [],
      listLoading: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: [],
      select_items: [],
      move_items: [],
      elementLoadingText: '正在加载...',
      sessionStatus: [
        { label: '正常', value: 1 },
        { label: '封号', value: 2 },
        { label: '待检测', value: 3 },
        { label: '登录过期', value: 4 },
        { label: '休眠', value: 5 },
        { label: '其他', value: 6 },
        { label: '网络问题', value: 10 },
        { label: 'IP封禁', value: 9 },
        { label: '账号锁定', value: 7 },
        { label: '禁拉群', value: 11 },
        { label: '禁群消息', value: 12 },
      ],
      accountType: [
        { label: '采集', value: 1 },
        { label: '私发', value: 2 },
        { label: '拉群', value: 3 },
        { label: '关注', value: 4 },
      ],
      importType: [
        { label: '文件导入', value: 4 },
        { label: '邮箱注册', value: 5 },
        { label: '手机文件', value: 6 },
      ],
      GroupForSessionList: [],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        username: '',
        status: '',
        group_id: '',
        import_time: '',
        account_type: '',
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
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    if(this.id){
      this.queryForm.group_id = parseInt(this.id);
      this.typegroup(this.type);
    }
    if(this.queryForm. account_type ===''){
      this.GroupForSessionList=[]
    }
           // this.typegroup()
    // this.getGroupForSessionList()
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
        account_type: '',
        pageNo: 1,
        pageSize: 15,
      

      }
      this.GroupForSessionList=[]
      this.fetchData()
    },
    getImgUrl(imageFileId) {
      return process.env.VUE_APP_STATIC_URL + imageFileId
    },
    //获取分类下的分组数
    typegroup(val) {
      // console.log(val)
      // console.log(13)

      if (val === undefined) {
        // val = this.form.GroupForSessionList
      }
      let sessionGroupType = ''
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
        form: "select"

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
    tableSortChange() {

    },
    setSelectRows(val) {
      this.selectRows = val
      this.showGroupButton = true
    },
    //迁移分组
    handleBatchmove(row) {
      this.selectRows.forEach((item, index) => {
        this.move_items[index] = item.id
      })
      // console.log(this.move_items)
      this.$refs['move'].showEdit(this.move_items)
    },

    handleBatchDelete(row) {

      this.selectRows.forEach((item, index) => {
        this.select_items[index] = item.id
      })
      BatchDelete({ ids: this.select_items }).then(res => {
        this.$baseMessage(res.msg, 'success')
        this.fetchData()
      })
    },
    handleAdd() {
      this.$refs['edit'].showEdit()
    },
    handleEdit(row) {
      this.$refs['edit'].showEdit(row)
    },
    handleDelete(row) {
      this.$baseConfirm('你确定要删除当前项吗', null, async () => {
        const { msg } = await Delete({ id: row.id })
        this.$baseMessage(msg, 'success')
        await this.fetchData()
      })
    },
    handleExport(row) {
      this.$refs['exportExcel'].showEdit(row)
    },
    handleCheckOne(row) {
      Check({
        id: row.id,
      }).then(res => {
        this.$baseNotify('开始执行检测任务,请勿重复执行', '任务执行中',)
      })

    },
    handleCheckAll() {
      this.$refs['checkAll'].showEdit()


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
      delete this.queryForm.account_type
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
    handleClear() {
      this.$refs['clears'].showEdit()
    },


  },
}
</script>
