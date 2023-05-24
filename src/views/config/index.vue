<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>

        <el-form-item>
          <el-select v-model="queryForm.type" placeholder="配置类型">
            <el-option v-for="(item, index) in type" :key="index" :label="item.label" :value="item.value"></el-option>
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
          <el-button icon="el-icon-add" type="success" native-type="submit" @click="handleAdd">
            新增配置策略
          </el-button>
        </el-form-item>

      </el-form>

    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" width="100%">
      <el-table-column align="left" show-overflow-tooltip width="100" prop="id" label="序号"></el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="type" label="平台类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.platform == 1">telegram</el-tag>
          <el-tag v-if="scope.row.platform == 2" type="danger">instagram</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="field" label="键名" />
      <el-table-column align="left" show-overflow-tooltip prop="type" label="配置类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1">IG发送策略</el-tag>
          <el-tag v-if="scope.row.type == 2" type="danger">IG拉群策略</el-tag>
          <el-tag v-if="scope.row.type == 9" type="danger">其他</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="left" show-overflow-tooltip prop="type" label="值">
        <template slot-scope="scope">
          -
          <!-- <el-tag v-if="scope.row.send_sleep !==null">IG发送策略</el-tag>
          <el-tag
            v-if="scope.row.value.one_account_create_total !==null">IG拉群策略</el-tag> -->
        </template>
      </el-table-column>

      <el-table-column align="left" show-overflow-tooltip prop="desc" label="配置描述" />

      <!-- <el-table-column align="left" show-overflow-tooltip prop="status" label="分组状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.group_status == 1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.group_status == 2" type="error">异常</el-tag>

        </template>

      </el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="session_phone" label="分组类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.group_type == 1">协议号</el-tag>
          <el-tag v-if="scope.row.group_type == 2">私发用户</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="left" show-overflow-tooltip prop="created_at" label="创建时间" />
      <el-table-column align="left" show-overflow-tooltip prop="updated_at" label="更新时间" />

      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
    <Edit ref="edit" />
  </div>
</template>

<script>
// import {Delete, List} from '@/api/group'
import { Delete, List } from '@/api/config'

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

      type: [
        { label: 'IG发送策略', value: 1 },
        { label: 'IG拉群策略', value: 2 },
        { label: '消息分组', value: 9 },
      ],
      value: [
        { label: 'IG发送策略', value: 1 },
        { label: 'IG拉群策略', value: 2 },
        // {label: '群发群组', value: 2},
        // {label: '定时发群组', value: 3},
      ],
      // group_type: [

      //   { label: '协议号', value: 1 },
      //   { label: '私发用户', value: 2 },
      //   { label: '群发群组', value: 3 },
      // ],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        session_phone: '',
        status: '',
        group_name: '',
        type: [
          // { label: '全部', value: -1 },
          { label: 'IG发送策略', value: 1 },
          { label: 'IG拉群策略', value: 2 },
          // { label: '消息分组', value: 3 },
          // { label: '定时发群组', value: 3 },
        ],

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

    handleDelete(row) {
      this.$baseConfirm('你确定要删除当前项吗', null, async () => {
        const { msg } = await Delete({ id: row.id })
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
      // console.log(this.queryForm.query)
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      const { data, count } = await List(this.queryForm)
      this.total = count

      this.list = data
      // for (let i = 0; i < this.list.length; i++) {
      //     if( this.list[i].type==1 || this.list[i].type==2){
      //       this.list[i].value = JSON.parse(this.list[i].value)
      //     //组装数据
      //     this.list[i].add_members_every_time = this.list[i].value.add_members_every_time       //每次拉多少人
      //     this.list[i].add_members_sleep = this.list[i].value.add_members_sleep       //每次拉人的间隔
      //     this.list[i].create_members_total = this.list[i].value.create_members_total       //群总人数
      //     this.list[i].one_account_create_total = this.list[i].value.one_account_create_total       //一个协议号建群数
      //     this.list[i].create_group_sleep = this.list[i].value.create_group_sleep     //拉群间隔
      //     if(  this.list[i].one_account_create_total===99999999){
      //       this.list[i].sele=1
      //     }else{
      //       this.list[i].sele=2
      //     }
      //     this.list[i].error_sleep = this.list[i].value.error_sleep  //异常休眠间隔
      //     this.list[i].send_sleep = this.list[i].value.send_sleep     //每次发送的间隔
      //     this.list[i].one_account_send_total = this.list[i].value.one_account_send_total   //一个协议号发几个
      //     }
      //   }
        console.log(this.list)
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    handleAdd() {
      this.$refs['edit'].showEdit()
    },
    handleEdit(row) {
      console.log(row)
      console.log(12123312)
      if( row.type==1 || row.type==2){
            row.value = JSON.parse(row.value)
          //组装数据
          row.add_members_every_time = row.value.add_members_every_time       //每次拉多少人
          row.add_members_sleep = row.value.add_members_sleep       //每次拉人的间隔
          row.create_members_total = row.value.create_members_total       //群总人数
          row.one_account_create_total = row.value.one_account_create_total       //一个协议号建群数
          row.create_group_sleep = row.value.create_group_sleep     //拉群间隔
          if(  row.one_account_create_total===99999999){
            row.sele=1
          }else{
            row.sele=2
          }
          row.error_sleep = row.value.error_sleep  //异常休眠间隔
          row.send_sleep = row.value.send_sleep     //每次发送的间隔
          row.one_account_send_total = row.value.one_account_send_total   //一个协议号发几个
          }
      console.log(row)
      this.$refs['edit'].showEdit(row)
    },
    handleImport() {
      this.$refs['sessionUpload'].showUpload()
    },


  },
}
</script>
