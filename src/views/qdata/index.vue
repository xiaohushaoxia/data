<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>

        <el-form-item>
          <el-select v-model="queryForm.group_id" placeholder="分组名称">
            <el-option v-for="(item, index) in grouplists" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>

        </el-form-item>

        <el-date-picker
      v-model="timedata"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00', '23:59:59']" @change='timeDate'>
    </el-date-picker>
        <el-form-item style="margin-left: 5px;">
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
          <el-button icon="el-icon-search" type="danger" @click="downloadImpor">
           下载
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="danger" @click="handleImport">
           上传
          </el-button>
        </el-form-item>

      </el-form>

    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" width="100%">
      <el-table-column align="left" show-overflow-tooltip width="100" prop="id" label="序号"></el-table-column>
      
      <el-table-column align="left" show-overflow-tooltip prop="updated_at" label="上传时间" />
   

      <el-table-column align="left" show-overflow-tooltip prop="group_name" label="分组名称" />
      <el-table-column align="left" show-overflow-tooltip prop="target_domain" label="目标域名" />
      <el-table-column align="left" show-overflow-tooltip prop="brand_domain" label="主域名" />
      <el-table-column align="left" show-overflow-tooltip prop="brand_name" label="品牌名称" />
      <el-table-column align="left" show-overflow-tooltip prop="domain" label="结果域名" />
      <el-table-column align="left" show-overflow-tooltip prop="download_count" label="下载次数" />

     <!-- <el-table-column align="left" show-overflow-tooltip prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.group_status == 1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.group_status == 2" type="error">异常</el-tag>

        </template>

      </el-table-column> -->
<!--   
      <el-table-column align="left" show-overflow-tooltip prop="created_at" label="创建时间" />
      <el-table-column align="left" show-overflow-tooltip prop="updated_at" label="更新时间" /> -->

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
    <SessionUpload ref="sessionUpload" />
  </div>
</template>

<script>
// import {Delete, List} from '@/api/group'
import { Delete, List,Download } from '@/api/data'
import { List as groupId } from '@/api/group'
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
      grouplists: [],
      listLoading: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      elementLoadingText: '正在加载...',
      timedata:'',
      start_time:'',
      end_time:'',
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        group_id  : '',
        timedata: '',
        start_time:'',
        end_time:'',
      },

    }
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    this.GroupList()
  },
  beforeDestroy() {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    timeDate(){
         this.queryForm.start_time=this.timedata[0],
         this.queryForm.end_time=this.timedata[1] 
    },
    //Download
    downloadImpor(){
      if(this.queryForm.group_id==''){
          this.$message({
            message: '请选择分组',
            type: 'warning'
          })
          return false
        }
        // //获取当前时间并设置格式  
        if(this.timedata.length==0){
          this.$message({
            message: '请选择时间',
            type: 'warning'
          })
          return false
        }
       
      //把group_id start_time  end_time处理为json格式
        console.log(this.queryForm)
        delete this.queryForm.pageNo
        delete this.queryForm.pageSize
        delete this.queryForm.type
          //申明一个json对象
        let json = {}
        //遍历this.queryForm
        for (let key in this.queryForm) {
          //判断key是否有值
          if (this.queryForm[key]) {
            //把key和value添加到json对象中
            json[key] = this.queryForm[key]
          }
        }

        Download( json).then(res => {
          //打开下载链接
          window.open(process.env.VUE_APP_STATIC_URL + res.data)


          console.log(res)
        })
        },
   


    //获取分组
      GroupList(){
        groupId({
          pageNo: 1,
          pageSize: 1000,
        }).then(res => {
          //遍历res.data
          res.data.forEach(item => {
            this.grouplists.push({
              label: item.group_name,
              value: item.id
            })
          })
        })
      
      },
    parseRow(row) {
      console.log(row.field)
    },
    resetForm() {
      this.queryForm = {
        pageNo: 1,
        pageSize: 15,
        type: 1,//数据q 默认type=1
      
      }
      this.timedata= '',
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
      console.log(row)
      this.$refs['edit'].showEdit(row,this.grouplists)
    },
    handleDelete(row) {
      this.$baseConfirm('你确定要删除当前项吗', null, async () => {
        const { msg } = await Delete({ id: row.id })
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
      console.log(this.timedata)
      console.log(13213213123)
      console.log(this.queryForm)
      // this.fetchData()
    },
    async fetchData() {
      this.listLoading = true
      this.queryForm.type =1
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


  },
}
</script>
