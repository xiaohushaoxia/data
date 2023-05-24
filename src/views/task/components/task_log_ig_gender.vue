<template >
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="90%" @close="close" >
    <el-descriptions title="数据统计" direction="vertical" border>
      <div slot="extra">
        <el-button type="primary" @click="fetchData" style="margin-left: 10px">刷新数据
        </el-button>
      </div>

    </el-descriptions>
    <el-table :data="statistic" border style="width: 100%">
      <el-table-column prop="id" label="总数量">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.account_total }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="成功">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.account_total }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="失败">
        <template slot-scope="scope">
          {{ scope.row.task_log_content.account_total }}
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div style="display: flex;">
      <div style="width: 49%;margin-right: 5vh;height: 500px;">
        <el-descriptions title="帐号日志" direction="vertical" border>
        </el-descriptions>

        <el-table :data="IgPullGroupList" border style="width: 100%" class="user_skills">
          <el-table-column prop="username" label="发件人">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <template #default="{ row }">
              <el-button type="danger" size="mini" @click="getpullGroupDetail(row)">查看日志</el-button>
              <el-button type="gray" size="mini" @click="refuntdata(row)">刷新</el-button>
            </template>

          </el-table-column>
        </el-table>
        <el-pagination :background="background" :current-page="queryForm.pageNos" :layout="layout"
          :page-size="queryForm.pageSizes" :total="totals" @current-change="handleCurrentChanges"></el-pagination>
      </div>
      <div style="width: 49%;overflow: hidden;">
        <el-descriptions title="日志看板" direction="vertical" border>
        </el-descriptions>
        <!-- <el-table :data="list" border style="width: 100%">
          <el-table-column prop="task_log_content.account_name" label="发件人">
          </el-table-column>
          <el-table-column prop="task_log_content.error" label="详情">
          </el-table-column>
        </el-table>
        <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
          :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
          @size-change="handleSizeChange"></el-pagination> -->


       
        <div style="margin-top: 5px;height: 450px; overflow-y: auto;border: 1px solid #ebeef5">
          <div v-for="(value, index ) in data" :key="index" style="margin-top: 2vh;padding-left: 1vh;">
            {{ value }}
          </div>
        </div>

      </div>
    </div>



    <div slot="footer" class="dialog-footer">

      <el-button type="primary" @click="save">确 定</el-button>
      <IgPullGroupdetail ref="ig_pull_group_detail" />
    </div>

  </el-dialog>
</template>


<script>
import { List } from '@/api/taskLog'
//拉群列表
import { pullGroupList } from '@/api/task'
// import { pullGroupDetail } from '@/api/task'
import IgPullGroupdetail from './ig_pull_group/ig_pull_group_detail.vue'
import { pullGroupDetail } from '@/api/task'
export default {
  name: 'TableEdit',
  components: {
    IgPullGroupdetail
  },
  data() {
    return {
      data: [
		
	],
      statistic: [],
      layout: 'total, sizes, prev, pager, next',
      total: 0,
      totals: 0,
      list: [],
      background: true,
      selectRows: '',
      task_type: [],
      IgPullGroupList: [],
      task_status: [
        { label: '已开始', value: 1 },
      ],
      queryForm: {
        id: "",
        pageNo: 1,
        pageSize: 10,
        pageNos: 1,
        pageSizes: 10,
      },
      form: {
        id: "",
        task_data: "",
      },

      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
    }
  },

  methods: {
    refunt() {
      this.getpullGrouplist()
    },
    getpullGrouplist() {
      pullGroupList({
        task_id: this.queryForm.task_id,
        pageNos: 1,
        pageSizes: 10,
      }).then(res => {
        this.IgPullGroupList = res.data
        this.totals = res.total
        // console.log('IgPullGroupList',  this.IgPullGroupList)

      }).catch(err => {
        this.dialogFormVisible = false
      })
    },
    async handle(row) {
      this.title = '执行日志-性别识别'
      this.actionType = 'update'
      this.form = Object.assign({}, row)
      this.form.task_data = JSON.parse(this.form.task_data)
      // console.log(this.form.task_data)
      this.queryForm.task_id = row.id

      this.fetchData()
      this.dialogFormVisible = true
    },
    async close() {
      this.dialogFormVisible = false

    },
    async save() {

      this.dialogFormVisible = false

    },
    //showList

    fetchData() {
      if (this.queryForm.task_id !== null) {
        pullGroupList({
          task_id: this.queryForm.task_id,
          pageNo: this.queryForm.pageNos,
          pageSize: this.queryForm.pageSize,
        }).then(res => {
          this.IgPullGroupList = res.data
          this.totals = res.total
          // console.log('IgPullGroupList',  this.IgPullGroupList)

        }).catch(err => {
          this.dialogFormVisible = false
        })
      }
      List({
        task_id: this.queryForm.task_id,
        pageNo: this.queryForm.pageNo,
        task_log_type: 400,
        pageSize: this.queryForm.pageSize,
      }).then(response => {
        // console.log(response)
        this.list = response.data
        this.total = response.total
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].task_log_content = JSON.parse(this.list[i].task_log_content)

          // console.log(this.list[i].task_log_content)
        }
      })
      List({
        task_id: this.queryForm.task_id,
        task_log_type: 500,
        pageNo: 1,
        pageSize: 10,
      }).then(response => {
        // console.log(response)
        this.statistic = response.data
        for (let i = 0; i < this.statistic.length; i++) {
          this.statistic[i].task_log_content = JSON.parse(this.statistic[i].task_log_content)
          // console.log(this.statistic[i].task_log_content)
        }
      })

    },
    refuntdata(row) {
      this.getpullGroupDetail(row)
    },
    getpullGroupDetail(row) {
            this.data=[],
            pullGroupDetail({
                task_id: this.queryForm.task_id,
                account_id:  row.id,
            }).then(res => {
                this.data = res.data
            }).catch(err => {
                this.dialogFormVisible = false
            })
    },
    // showList(row) {
    //   // row.message_url = this.getImgUrl(row.message_url)
    //   this.$refs['ig_pull_group_list'].showEdit(this.queryForm.task_id)
    // },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val

      this.fetchData()
    },
    handleSizeChanges(val) {
      this.queryForm.pageSizes = val
      this.fetchData()
    },
    handleCurrentChanges(val) {
      this.queryForm.pageNos = val

      this.fetchData()
    },
  },
}
</script>
<style>
.el-table__row {
  height: 40px;
  line-height: 40px
}

.el-dialog {
  margin-top: 7vh !important;
}

.el-dialog__body {
  height: auto !important;
}

/* .el-dialog__wrapper {
  width: 890 !important;
} */

.text-button {
    text-align: right;
    margin-bottom: 1vh;
    position:sticky;
    display: inline-block;
}
</style>