<template >
    <el-dialog :title="title" :visible.sync="dialogFormVisible" custom-class="map" width="1000px" @close="close" center modal
        :modal-append-to-body="false">
        <div class="text-button">
            <el-button type="primary" @click="refunt" >刷新</el-button>
        </div>
        <el-table :data="IgPullGroupList" border style="width: 100%" class="user_skills">
            <el-table-column prop="username" label="发件人">
            </el-table-column>
            <!-- <el-table-column prop="account_type" label="发件人">
            </el-table-column> -->
            <el-table-column show-overflow-tooltip label="操作">
                <template #default="{ row }">
                    <el-button type="danger" size="mini" @click="getpullGroupDetail(row)">查看日志</el-button>
                </template>
                
            </el-table-column>
        </el-table>
        <el-pagination  :current-page="queryForm.pageNo" :layout="layout"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
        <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="close">取 消</el-button> -->
            <!-- <el-button type="primary" @click="save">确 定</el-button> -->
            <IgPullGroupdetail ref="ig_pull_group_detail" />
        </div>
      
    </el-dialog>
</template>
  
<script>
//拉群列表
import { pullGroupList } from '@/api/task'
// import { pullGroupDetail } from '@/api/task'
import IgPullGroupdetail from './ig_pull_group_detail.vue'
export default {
    name: 'TableEdit',
    components: {
        IgPullGroupdetail
  },
    data() {
        return {
            account_list: [
                { label: '账号1', value: 1 },
                { label: '账号2', value: 2 },
                { label: '账号3', value: 3 },
                { label: '账号4', value: 4 },
                { label: '账号1', value: 1 },
                { label: '账号2', value: 2 },
                { label: '账号3', value: 3 },
                { label: '账号4', value: 4 },
                { label: '账号1', value: 1 },
                { label: '账号2', value: 2 },
                { label: '账号3', value: 3 },

            ],
            layout: 'total, sizes, prev, pager, next, jumper',
            total: 0,
            visible: false,
            form: {
                account_type: "",
                status: "",
            },
            queryForm: {
                pageNo: 1,
                pageSize: 10,

            },
            IgPullGroupList: [],
            title: '',
            task_id: '',
            actionType: '',
            dialogFormVisible: false,
            select_items: [],
        }
    },
    created() {
        // this.GroupForSessionList = this.$parent.GroupForSessionList
        // this.getpullGroupList()
    },
    methods: {

        async showEdit(row) {
            console.log('row', row)
            this.task_id = row
            this.title = '帐号日志列表'
            this.actionType = 'update'
            this.form = Object.assign({}, row)
            // console.log(this.form)
            this.dialogFormVisible = true
            
            pullGroupList({
                task_id: this.task_id,
                pageNo: 1,
                pageSize: 10,
            }).then(res => {
                this.IgPullGroupList = res.data
                this.total = res.total
                // console.log('IgPullGroupList',  this.IgPullGroupList)

            }).catch(err => {
                this.dialogFormVisible = false
            })
        },
        refunt() {
            this.getpullGrouplist()
        },
        getpullGrouplist() {
            pullGroupList({
                task_id: this.task_id,
                pageNo: 1,
                pageSize: 10,
            }).then(res => {
                this.IgPullGroupList = res.data
                this.total = res.total
                // console.log('IgPullGroupList',  this.IgPullGroupList)

            }).catch(err => {
                this.dialogFormVisible = false
            })
        } ,  



        getpullGroupDetail(row) {
             row.task_id = this.task_id
             console.log('row', row)
            this.$refs['ig_pull_group_detail'].showEdit( row)
        },
   
        async close() {
            // this.$refs['form'].resetFields()
            this.form = this.$options.data().form
            this.dialogFormVisible = false
            this.dialogFormVisible = false
            // await this.$parent.fetchData()
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
        
            this.queryForm.task_id= this.task_id
            const { data, total } = await pullGroupList(this.queryForm)
            this.total = total
            this.IgPullGroupList =  data
            this.list = data
            setTimeout(() => {
                this.listLoading = false
            }, 500)
        },
    },
}
</script>
<style lang="scss"></style>