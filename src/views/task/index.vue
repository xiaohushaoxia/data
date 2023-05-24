<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>

        <el-form-item>
          <el-select v-model="queryForm.task_type" placeholder="任务类型">
            <el-option v-for="(item, index) in task_type" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.group_name" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.task_status" placeholder="任务状态">
            <el-option v-for="(item, index) in task_status" :key="index" :label="item.label"
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

      </el-form>

    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" width="100%">
      <el-table-column align="left" show-overflow-tooltip width="100" prop="id" label="序号"></el-table-column>

      <el-table-column align="left" show-overflow-tooltip prop="task_name" width="150" label="任务名称" />
      <el-table-column align="left" show-overflow-tooltip width="120" prop="task_status" label="任务状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.task_status == 0" type="info">未开始</el-tag>
          <el-tag v-if="scope.row.task_status == 1" type="success">已开始</el-tag>
          <el-tag v-if="scope.row.task_status == 2" type="error">运行中</el-tag>
          <el-tag v-if="scope.row.task_status == 3" type="error">已结束</el-tag>

        </template>

      </el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="task_type" label="任务类型">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.task_type == 1">TG私发</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 2">群发</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 3">定时群发</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 4">TG导入协议号</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 5">TG协议号检测</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 6">二维码登陆</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 7">TG私发用户导入</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 8">TG私发群组导入</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 9">导入link号商</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 10">注册协议号</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 11">IG协议号检测</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 12">IG协议号导入</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 13">IG粉丝导入</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 14">IG博主导入</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 15">IG语言识别</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 16">IG-粉丝操控-地区</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 17">IG-粉丝采集-采集</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 18">IG-粉丝采集-粉丝</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 19">IG-导出excel-粉丝</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 20">IG-私发消息</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 21">IG-拉群任务</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 22">IG-关注博主</el-tag>
          <el-tag type="info" v-if="scope.row.task_type == 23">IG-注册协议号</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="task_remark" label="备注">
        <template slot-scope="scope">
          <div v-html="scope.row.task_remark"></div>
        </template>
      </el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="created_at" label="创建时间" />
      <el-table-column align="left" show-overflow-tooltip prop="updated_at" label="更新时间" />
      <el-table-column show-overflow-tooltip label="任务详情">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleTaskLog(scope.row)">执行日志</el-button>
          <el-button
            v-if="(scope.row.task_type === 20 || scope.row.task_type === 18 || scope.row.task_type === 11 || scope.row.task_type === 21) && scope.row.task_status === 1"
            type="warning" size="mini" @click="handleStopTask(scope.row)">
            终止任务
          </el-button>

          <!--          <el-button type="danger" size="mini" @click="handleErrorLog(row)">异常日志</el-button>-->
        </template>
      </el-table-column>

    </el-table>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
    <Edit ref="edit" />
    <TaskData ref="task_data" />
    <TaskErrLog ref="task_err_log" />
    <TaskLogCheckSession ref="task_log_check_session" />
    <TaskLogImportAccount ref="task_log_import_account" />
    <TaskLogImportSession ref="task_log_import_session" />
    <TaskLogSendToUser ref="task_log_send_to_user" />
    <TaskLogImportLinkSms ref="task_log_import_link_sms" />
    <TaskLogRegisterSession ref="task_log_register_session" />
    <TaskLogExportExcel ref="task_log_export" />
    <TaskLogFollower ref="task_log_follower" />
    <TaskLogFollowing ref="task_log_following" />
    <TaskLogFollowing ref="task_log_following" />
    <TaskLogImportBlogger ref="task_log_import_blogger" />
    <TaskLogIGSendMessage ref="task_log_ig_send_message" />
    <TaskLogIGPullGroup ref="task_log_ig_pull_group" />
    <TaskLogIGFollowBlogger ref="task_log_ig_follow_blogger" />
    <TaskLogIGUserLanguage ref="task_log_ig_user_language" />
    <TaskLogIGUserLocation  ref="task_log_ig_user_location" /> 
    <TaskLogIGRegister ref="task_log_ig_register" />
    <TaskLogIGRegister ref="task_log_ig_gender" />
  </div>
</template>

<script>
import { List, Stop } from '@/api/task'
// import edit.vue
import Edit from './components/edit.vue'
import TaskData from './components/task_data.vue'
import TaskErrLog from './components/task_err_log.vue'
import TaskLogCheckSession from './components/task_log_check_session.vue'
import TaskLogImportAccount from './components/task_log_import_account.vue'
import TaskLogImportSession from './components/task_log_import_session.vue'
import TaskLogSendToUser from './components/task_log_send_to_user.vue'
import TaskLogImportLinkSms from './components/task_log_import_link_sms.vue'
import TaskLogRegisterSession from './components/task_log_register_session.vue'
import TaskLogExportExcel from './components/task_log_export.vue'
import TaskLogFollower from './components/task_log_follower.vue'
import TaskLogFollowing from './components/task_log_following.vue'
import TaskLogImportBlogger from './components/task_log_import_blogger.vue'
import TaskLogIGSendMessage from './components/task_log_ig_send_message.vue'
import TaskLogIGPullGroup from './components/task_log_ig_pull_group.vue'
import TaskLogIGFollowBlogger from './components/task_log_ig_follow_blogger.vue'
import TaskLogIGRegister from './components/task_log_ig_register.vue'
import TaskLogIGGender from './components/task_log_ig_gender.vue'

import TaskLogIGUserLanguage from './components/task_log_ig_user_language.vue'
import TaskLogIGUserLocation from './components/task_log_ig_user_location.vue'

export default {
  name: 'ComprehensiveTable',
  components: {
    Edit,
    TaskData,
    TaskErrLog,
    TaskLogCheckSession,
    TaskLogImportAccount,
    TaskLogImportSession,
    TaskLogSendToUser,
    TaskLogImportLinkSms,
    TaskLogRegisterSession,
    TaskLogExportExcel,
    TaskLogFollower,
    TaskLogFollowing,
    TaskLogImportBlogger,
    TaskLogIGSendMessage,
    TaskLogIGPullGroup,
    TaskLogIGFollowBlogger,
    TaskLogIGUserLanguage,
    TaskLogIGUserLocation,
    TaskLogIGRegister,
    TaskLogIGGender

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
        { label: '全部', value: 0 },
        { label: 'TG私发', value: 1 },
        { label: 'TG导入协议号', value: 4 },
        { label: 'TG协议号检测', value: 5 },
        { label: '二维码登陆', value: 6 },
        { label: 'TG私发用户导入', value: 7 },
        { label: 'TG私发群组导入', value: 8 },
        { label: 'TG注册协议号', value: 10 },
        { label: 'IG协议号检测', value: 11 },
        { label: 'IG协议号导入', value: 12 },
        { label: 'IG粉丝导入', value: 13 },
        { label: 'IG博主导入', value: 14 },
        { label: 'IG语言识别', value: 15 },
        { label: 'IG-粉丝操控-地区', value: 16 },
        { label: 'IG-粉丝采集-关注', value: 17 },
        { label: 'IG-粉丝采集-粉丝', value: 18 },
        { label: 'IG-导出excel-粉丝', value: 19 },
        { label: 'IG-私发消息', value: 20 },
        { label: 'IG-拉群任务', value: 21 },
        { label: 'IG-关注博主', value: 22 },
        { label: 'IG-注册协议号', value: 23 },
        { label: 'IG-协议号性别识别', value: 24 },
      ],
      task_status: [
        { label: '全部', value: 0 },
        { label: '已开始', value: 1 },
        { label: '运行中', value: 2 },
        { label: '已结束', value: 3 },
      ],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        session_phone: '',
        status: '',
        group_name: '',
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
      const { data, total } = await List(this.queryForm)
      this.total = total

      this.list = data
      //循环遍历  
      for (var i = 0; i < this.list.length; i++) {
        //如果list下面的task_name字段等于私发消息则替换为TG私发
        if (this.list[i].task_name == '私发消息') {
          this.list[i].task_name = 'TG私发'
        }
        //如果list下面的task_name字段等于私发消息则替换为TG私发
        if (this.list[i].task_name == '导入私发名单') {
          this.list[i].task_name = 'TG私发名单'
        }
        //如果list下面的task_name字段等于私发消息则替换为TG私发
        if (this.list[i].task_name == '协议号检测') {
          this.list[i].task_name = 'TG协议号检测'
        }
      }
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },

    handleTaskData(row) {
      this.$refs['task_data'].handle(row)
    },
    handleStopTask(row) {
      this.$confirm('此操作将停止任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        Stop({
          id: row.id
        }).then(() => {
          this.$message({
            message: '停止成功',
            type: 'success',
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停止',
        })
      })
    },
    handleTaskLog(row) {
      switch (row.task_type) {
        case 5:
        case 11:
          this.$refs['task_log_check_session'].handle(row)
          break
        case 7:
          this.$refs['task_log_import_account'].handle(row)
          break
        case 4:
          this.$refs['task_log_import_session'].handle(row)
          break
        case 1:
          this.$refs['task_log_send_to_user'].handle(row)
          break
        case 9:
          this.$refs['task_log_import_link_sms'].handle(row)
          break
        case 10:
          this.$refs['task_log_register_session'].handle(row)
          break
        case 14:
          this.$refs['task_log_import_blogger'].handle(row)
          break
        case 15:   //语言识别
          this.$refs['task_log_ig_user_language'].handle(row)
          break
        case 16:  //地区采集  '执行日志-IG-粉丝操控-地区'
          this.$refs['task_log_ig_user_location'].handle(row)
          break
        case 17:
          this.$refs['task_log_following'].handle(row)
          break
        case 18:
          this.$refs['task_log_follower'].handle(row)
          break
        case 19:
          this.$refs['task_log_export'].handle(row)
          break
        case 20:
          this.$refs['task_log_ig_send_message'].handle(row)
          // this.$refs['task_log_ig_pull_group'].handle(row)
          break
        case 21:
          this.$refs['task_log_ig_pull_group'].handle(row)
          break
        case 22:
          this.$refs['task_log_ig_follow_blogger'].handle(row)
          break
        case 23:    //注册协议号
          this.$refs['task_log_ig_register'].handle(row)
          break
        case 23:    //ig协议号性别识别
          this.$refs['task_log_ig_gender'].handle(row)
          break
        default:
          this.$refs['task_data'].handle(row)
      }
    },
    handleErrorLog(row) {
      this.$refs['task_err_log'].handle(row)
    },

  },
}
</script>
