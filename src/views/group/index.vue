<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>


        <!-- <el-form-item>
          <el-input v-model="queryForm.group_name" placeholder="分组名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.group_type" placeholder="分组类型">
            <el-option v-for="(item, index) in group_type" :key="index" :label="item.label"
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
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button icon="el-icon-add" type="success" native-type="submit" @click="handleAdd">
            创建分组
          </el-button>
        </el-form-item> -->

      </el-form>

    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" width="100%">
      <el-table-column align="left" show-overflow-tooltip prop="id" label="序号" ></el-table-column>

      <!-- <el-table-column align="left" show-overflow-tooltip prop="session_phone" label="分组类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.group_type == 1">TG协议号</el-tag>
          <el-tag v-if="scope.row.group_type == 2">TG私发用户</el-tag>
          <el-tag v-if="scope.row.group_type == 3">群发消息</el-tag>
          <el-tag v-if="scope.row.group_type == 4">INS-博主-采集</el-tag>
          <el-tag v-if="scope.row.group_type == 5">INS-粉丝</el-tag>
          <el-tag v-if="scope.row.group_type == 6">INS-协议号-采集</el-tag>
          <el-tag v-if="scope.row.group_type == 8">INS-协议号-私发</el-tag>
          <el-tag v-if="scope.row.group_type == 7">INS-协议号-拉群</el-tag>
          <el-tag v-if="scope.row.group_type == 9">INS-协议号-评论</el-tag>
          <el-tag v-if="scope.row.group_type == 10">INS-协议号-点赞</el-tag>
          <el-tag v-if="scope.row.group_type == 11">INS-协议号-关注</el-tag>
          <el-tag v-if="scope.row.group_type == 12">INS-博主-关注</el-tag>
            <el-tag v-if="scope.row.group_type == 13">INS-协议号-分裂</el-tag>

        </template>
      </el-table-column> -->
      <el-table-column align="left" show-overflow-tooltip prop="group_name" label="分组名称" />
      <el-table-column align="left" show-overflow-tooltip prop="total" label="统计" />

      <!-- <el-table-column align="left" show-overflow-tooltip prop="created_at" label="创建时间" />
      <el-table-column align="left" show-overflow-tooltip prop="updated_at" label="更新时间" /> -->

      <el-table-column show-overflow-tooltip label="操作" >
        <template #default="{ row }" >
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
import { Delete, List } from '@/api/group'
import { Total as AccountTotal } from '@/api/instagram/account'
import { Total as BloggerTotal } from '@/api/instagram/blogger'
import { Total as UserTotal } from '@/api/instagram/users'
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

      group_status: [
        { label: '正常', value: 1 },
        { label: '异常', value: 2 },
      ],
      group_type: [
        { label: '目标域名', value: 1 },
        { label: 'q数据', value: 2 },
      ],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        session_phone: '',
        status: '',
        group_name: '',
        group_type: '',
        // group_status: [
        //   { label: '全部', value: -1 },
        //   { label: '激活', value: 1 },
        //   { label: '禁用', value: 2 },
        // ],
        create_time: '',
        last_run_time: '',
      },
      type:'',
    }
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    let href = window.location.href; 
    let path = href.split('//')[1].split('#')[1]  
    console.log(path)   //wayne.com 
    if(path=="/index"){
      this.type=q
    }
    if(path=="/bdata/bdata/group"){
      this.type=b
    }
    if(path=="/sdata/sdata/group"){
      this.type=s
    }
    if(path=="/sixdata/bdata/group"){
      this.type=6
    }
    if(path=="/cdata/bdata/group"){
      this.type=c
    }
  console.log( this.type)

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
      console.log(this.queryForm.query)
      this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      List(this.queryForm).then(res => {
        this.total = res.count
        this.list = res.data
        this.listLoading = false
      })
      //range data and then if group_tpye is 1 then request api to get it data of by groupId




    },
    handleImport() {
      this.$refs['sessionUpload'].showUpload()
    },


  },
}
</script>
