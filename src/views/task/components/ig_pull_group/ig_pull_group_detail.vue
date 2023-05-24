<template >
    <el-dialog :title="title" :visible.sync="dialogFormVisible" custom-class="maps" width="700px" height="700px" @close="close" center modal
        :modal-append-to-body="false">
        <div class="text-button">
            <el-button type="primary"  @click="refunt">刷新</el-button>
        </div>
        <div style="margin-top: 50px;">  
            <div v-for="(value,index ) in data" :key="index" style="margin-top: 1vh;">
            {{ value }}
        </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <!-- <el-button type="primary" @click="save">确 定</el-button> -->
        </div>

    </el-dialog>
</template>
  
<script>
//拉群列表
// import { pullGroupList } from '@/api/task'
import { pullGroupDetail } from '@/api/task'
export default {
    name: 'TableEdit',
    data() {
        return {
            data: [
		"[开始执行任务]",
		"[[获取账号失败] - [网络问题] - 休眠 5ns 秒后重试 - 重试次数: [ 1 ]]",
		"[账号获取失败： 9009]",
     
	],
            layout: 'total, sizes, prev, pager, next, jumper',
            total: 0,
            visible: false,
            // rowlist: [],
            form: {
                account_type: "",
                status: "",
            },
            queryForm: {
                pageNo: 1,
                pageSize: 10,

            },
            title: '',
            task_id: '',
            actionType: '',
            dialogFormVisible: false,
            select_items: [],
        }
    },
    created() {
        // this.getpullGroupDetail(row)
    },
    methods: {

        async showEdit(row) {
           
            this.rowlists = row
            console.log('rowlist',  this.rowlists)
            this.title = '帐号日志详情'
            this.actionType = 'update'
            this.form = Object.assign({}, row)
            // console.log(this.form)
            this.dialogFormVisible = true
            pullGroupDetail({
                task_id: row.task_id,
                account_id: row.id,
            }).then(res => {
                console.log('pullGroupDetail', res)
                this.data = res.data
            }).catch(err => {
                this.dialogFormVisible = false
            })
        },
        refunt() {
            this.getpullGroupDetail()
        },
        //
        getpullGroupDetail() {
            pullGroupDetail({
                task_id: this.rowlists.task_id,
                account_id:  this.rowlists.id,
            }).then(res => {
                console.log('pullGroupDetail', res)
                this.data = res.data
            }).catch(err => {
                this.dialogFormVisible = false
            })
        },
        async close() {
            // this.$refs['form'].resetFields()
            this.form = this.$options.data().form
            //
        
            // this.dialogFormVisible = false
            this.dialogFormVisible = false
            //让class为v-modal的属性display为none
            document.getElementsByClassName('v-modal')[0].style.display = 'none'
        },

        // handleSizeChange(val) {
        //     this.queryForm.pageSize = val
        //     this.fetchData()
        // },
        // handleCurrentChange(val) {
        //     this.queryForm.pageNo = val
        //     this.fetchData()
        // },
        // handleQuery() {
        //     this.queryForm.pageNo = 1
        //     console.log(this.queryForm.query)
        //     this.fetchData()
        // },
        // async fetchData() {
        //     this.listLoading = true
        //     // const { data, count } = await pullGroupList(this.queryForm)
        //     this.total = count

        //     this.list = data
        //     setTimeout(() => {
        //         this.listLoading = false
        //     }, 500)
        // },
    },
}
</script>
<style lang="scss">
.text-button {
    text-align: right;
    margin-bottom: 1vh;
    position:sticky;
    // height: 750px;
}
.el-dialog__header{
    position: relative;
}
.el-dialog__body{
    // margin-top: 20px;
    height: 450px;
    overflow-y: auto;
}
</style>