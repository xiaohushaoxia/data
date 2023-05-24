<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>

        <el-form-item>
          <el-select v-model="queryForm.execution_status" placeholder="账号状态">
            <el-option v-for="(item, index) in accountStatus" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.type" placeholder="类型" @change="typegroup">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.group_id" placeholder="分组">
            <el-option v-for="(item, index) in GroupForSessionList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
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
          <el-button icon="el-icon-search" type="danger" @click="handleImport">
            批量导入
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" native-type="submit" @click="showFocus">
           关注任务
          </el-button>
        </el-form-item>
      </el-form>
     
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @toggle-row-selection="toggleRowSelection"
      @sort-change="tableSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="id" label="序号" min-width="100"
        width="70"></el-table-column>

      <el-table-column align="left" show-overflow-tooltip prop="group_name" min-width="100" label="分组" />
      <el-table-column align="left" prop="username" min-width="120" label="账号">
        <template #default="{ row }">
          <el-icon></el-icon>
          <el-link type="success" :href="'https://www.instagram.com/' + row.username" target="_blank"
            class="el-icon-link">{{ row.username }}
          </el-link>
        </template>
      </el-table-column>
      <!-- <el-table-column align="left" width="100" show-overflow-tooltip prop="message_status" label="帐号状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.execution_status == 1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.execution_status == 2" type="danger">异常</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="left" show-overflow-tooltip prop="task_times" min-width="70" label="被采集次数" />
      <el-table-column align="left" show-overflow-tooltip prop="follower" min-width="100" label="粉丝数" />
      <el-table-column align="left" show-overflow-tooltip prop="following" min-width="100" label="关注数" />
      <el-table-column align="left" show-overflow-tooltip prop="imported_at" default="-" min-width="100" label="导入时间" />


      <el-table-column align="left" show-overflow-tooltip prop="updated_at" default="-" label="最后采集时间" />

      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
                   <!-- <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button> -->
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px" v-if="showGroupButton === true && selectRows.length > 0">
      <el-button @click="handleEdit" type="danger">删除</el-button>
      <el-button @click="handleBatchmove" type="success">迁移分组</el-button>
    </div>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
    <Edit ref="edit" />
    <SessionUpload ref="sessionUpload" />
    <Focustasks ref="focus" />
    <Move ref="move" />
  </div>
</template>

<script>
import { Delete, List } from '@/api/instagram/blogger'

// import edit.vue
import Edit from './components/edit.vue'
import Move from './components/move.vue'
import SessionUpload from './components/import.vue'
import { List as GroupList } from "@/api/group";
import Focustasks from './components/focus.vue'
export default {
  name: 'ComprehensiveTable',
  components: {
    Edit,
    SessionUpload,
    Focustasks,
    Move,
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
      move_items: [], // 迁移分组
      listLoading: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      showGroupButton: false,
      elementLoadingText: '正在加载...',
      accountStatus: [
        { label: '全部', value: 0 },
        { label: '正常', value: 1 },
        { label: '异常', value: 2 },
      ],
      sendStatus: [
        { label: '全部', value: 0 },
        { label: '已发送', value: 1 },
        { label: '异常', value: 2 },
        { label: '未发送', value: 3 },
      ],
      typeList: [{
        label: '采集任务', value: 1,
      },
        {
          label: '关注任务', value: 2,
        },
      ],
      GroupForSessionList: [

      ],

      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        session_phone: '',
        status: '',
        send_status: '',
        create_time: '',
        last_run_time: '',
        type: '',
      },

    }
  },
  computed: {
    height() {
      return this.$baseTableHeight()
    },
  },
  created() {
    // 
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    if(this.id){
      this.queryForm.group_id = parseInt(this.id);
      this.typegroups(this.type);
    }
    if(this.queryForm. account_type ===''){
      this.GroupForSessionList=[]
    }
  },
  beforeDestroy() {
  },
  mounted() {
    this.getGroupForSessionList()
    this.fetchData()
  },
  methods: {
    //迁移分组
    handleBatchmove() {
      this.selectRows.forEach((item, index) => {
        this.move_items[index] = item.id
      })
      // console.log(this.move_items)
      this.$refs['move'].showEdit(this.move_items)
    },



    parseRow(row) {
      console.log(row.field)
    },
    getGroupForSessionList() {
      GroupList({
        group_type: 4,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
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
      console.log(val)
      this.selectRows = val
      this.showGroupButton = true

    },
    toggleRowSelection(val) {
      console.log(val)
    },
    handleAdd() {
      this.$refs['edit'].showEdit()
    },
    handleEdit(row) {
      this.$refs['edit'].showEdit(this.selectRows)
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
    showFocus() {
      this.$refs['focus'].showEdit()
    },
    typegroup(val) {
      console.log(val)
      // console.log(13)
      if (val === undefined) {
        val = this.form.GroupForSessionList
      }
      let sessionGroupType = ''
      this.GroupForSessionList = []
      if (val === 1) {
        sessionGroupType = 4   //IG博主-关注 :12 IG博主—采集:4
      }
      if (val === 2) {
        sessionGroupType = 12 //IG博主-关注 :12 IG博主—采集:4
      }

      GroupList({
        group_type: sessionGroupType,
        form:"select"
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          console.log(res)
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id
          })
        }
      })

    },

    typegroups(val) {
      console.log(val)
      // console.log(13)
      // if (val === undefined) {
      //   val = this.form.GroupForSessionList
      // }
      let sessionGroupType = ''
      this.GroupForSessionList = []
      if (val === 1) {
        sessionGroupType = 4   //IG博主-关注 :12 IG博主—采集:4
      }
      if (val === 2) {
        sessionGroupType = 12 //IG博主-关注 :12 IG博主—采集:4
      }

      GroupList({
        group_type: sessionGroupType,
        form:"select"
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          console.log(res)
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id
          })
        }
      })

    },


  },
}
</script>
