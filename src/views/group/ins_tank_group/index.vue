<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>


        <el-form-item>
          <el-input v-model="queryForm.group_name" placeholder="分组名称"></el-input>
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
            创建分组
          </el-button>
        </el-form-item>

      </el-form>

    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" width="100%">
      <el-table-column align="left" show-overflow-tooltip width="100" prop="id" label="序号"></el-table-column>

      <el-table-column align="left" show-overflow-tooltip prop="session_phone" label="分组类型">
        <template slot-scope="scope">

          <el-tag v-if="scope.row.group_type == 3">接粉号与话术</el-tag>
    
        </template>
      </el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="group_name" label="分组名称" />
      <el-table-column align="left" show-overflow-tooltip prop="total" label="统计" />

      <el-table-column align="left" show-overflow-tooltip prop="created_at" label="创建时间" />
      <el-table-column align="left" show-overflow-tooltip prop="updated_at" label="更新时间" />

      <el-table-column label="操作"  width="400px">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
        <el-button type="primary" @click="handlejfh(row)"> 接粉号</el-button>
          <el-button type="danger" @click="handleshgl(row)">话术管理</el-button>
          <el-button type="dangdangerer" size="mini" @click="handleDelete(row)">删除</el-button>

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
import { Delete, Lists } from '@/api/group'
import { Total as AccountTotal } from '@/api/instagram/account'
import { Total as BloggerTotal } from '@/api/instagram/blogger'
import { Total as UserTotal } from '@/api/instagram/users'
import Edit from './components/edit.vue'

import { List } from '@/api/taskMessage'
export default {
  name: 'ComprehensiveTable',
  components: {
    Edit,
   
 
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
      group_types: [
        { label: '接粉号与话术', value:[3] },
      ],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        session_phone: '',
        status: '',
        group_name: '',
        group_types: [],
        // group_type: [6,7,8,9,10,11],
        group_status: [
          { label: '全部', value: -1 },
          { label: '激活', value: 1 },
          { label: '禁用', value: 2 },
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
        group_types: [],
        // group_type: [6,7,8,9,10,11],
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
    handlejfh(row){
      // List({message_type:10,
      //   group_id:row.id
      //   })  .then(res => {
      //     console.log(res)
      //     if(res.data.length>0){
      //       this.$refs['jfhedit'].showEdit(res.data[0])
      //     }else{
      //       //显示弹窗没有数据
      //       this.$message({
      //     message: '没有接粉号数据',
      //     type: 'warning'
      //   });
      //     }
      // })
      // const { data, count } = await List(this.queryForm)
      // row.message_url = this.getImgUrl(row.message_url)
      // this.$refs['jfhedit'].showEdit(row)
      const { href }=this.$router.resolve({name:'receive_fans',query: {id:row.id}}) // 只能用 name
      // console.log(href)
      window.open(href, '_blank');
    },
    handleshgl(row){
      const { href }=this.$router.resolve({name:'task_message',query: {id:row.id}}) // 只能用 name
      // console.log(href)
      window.open(href, '_blank');
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

      if (this.queryForm.group_types.length > 0) {
        this.queryForm.group_type = this.queryForm.group_types
        // delete this.queryForm.group_types
      }
      if (this.queryForm.group_types.length == 0) {
        this.queryForm.group_type = [3]
      }
      Lists(this.queryForm).then(res => {
        this.total = res.count
        this.list = res.data
        this.listLoading = false
      })
      //range data and then if group_tpye is 1 then request api to get it data of by groupId




    },



  },
}
</script>
  