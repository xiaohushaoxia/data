<template>
  <div class="table-container">
    <vab-query-form>
      <el-form ref="form" :model="queryForm" :inline="true" @submit.native.prevent>


        <el-form-item>
          <el-select v-model="queryForm.group_id" placeholder="分组">
            <el-option v-for="(item, index) in GroupForSessionList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.import_type" placeholder="来源">
            <el-option v-for="(item, index) in ImportTypeList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.language_id" placeholder="语言">
            <el-option v-for="(item, index) in LanguageList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.country_id_name" placeholder="国家">
            <el-option v-for="(item, index) in CountryList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <!--        <el-form-item>-->
        <!--          <el-date-picker-->
        <!--              v-model="queryForm.created_at"-->
        <!--              type="date"-->
        <!--              value-format="yyyy-MM-dd"-->
        <!--              placeholder="导入时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" native-type="submit" @click="resetForm">
            重置
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" @click="handleQuery">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" @click="handleExport">
            导出
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleImport">
            导入粉丝
          </el-button>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button-->
        <!--              type="success"-->
        <!--              @click="handleCollectionFollowing"-->
        <!--          >-->
        <!--            关注采集-->
        <!--          </el-button>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button type="success" @click="handleCollectionFollower">
            粉丝采集
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleCollectionLocation" >
            地区采集
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleCollectionLanguage" >
            语言识别
          </el-button>
        </el-form-item>
      </el-form>

    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
      :height="height" @selection-change="setSelectRows" @sort-change="tableSortChange" width="100%">
      <el-table-column align="left" show-overflow-tooltip prop="id" width="100" label="序号"></el-table-column>

      <el-table-column align="left" show-overflow-tooltip prop="group_name" width="100" label="分组" />
      <el-table-column align="left" show-overflow-tooltip prop="pk" width="120" label="PK" />
      <el-table-column align="left" min-width="100" prop="username" label="账号">
        <template #default="{ row }">
          <el-icon></el-icon>
          <el-link type="success" :href="'https://www.instagram.com/' + row.username" target="_blank"
            class="el-icon-link">{{ row.username }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column align="left" show-overflow-tooltip prop="full_name" width="120" label="名称">
        <template #default="{ row }">
          <div v-if="row.full_name == ''">-</div>
          <div v-else>{{ row.full_name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="blogger_name" label="所属博主" />

      <el-table-column align="left" show-overflow-tooltip prop="import_type" label="数据来源">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.import_type == 1" type="success">采集关注</el-tag>
          <el-tag v-if="scope.row.import_type == 2" type="primary">采集粉丝</el-tag>
          <el-tag v-if="scope.row.import_type == 3" type="info">国家地区</el-tag>
          <el-tag v-if="scope.row.import_type == 4" type="warning">文件导入</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="task_times" label="任务次数" />

      <el-table-column align="left" show-overflow-tooltip prop="country_id_name" label="国家">
        <template slot-scope="scope">
          <div v-if="scope.row.country_id_name == ''" type="success">-</div>
          <div v-if="scope.row.country_id_name !== ''" type="success">{{ scope.row.country_id_name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="language_id" label="语言" style="display: flex;">
        <template slot-scope="scope" >
          <div class="flexs"  v-for="(item, index) in scope.row.language_id" :key="index" >
         
          <el-tag v-if="scope.row.language_id !== ''" type="success">{{ item }}</el-tag>
          </div>
        </template>

      </el-table-column>

      <el-table-column align="left" show-overflow-tooltip min-width="120" prop="created_at" label="导入时间" />
      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
      :page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
      @size-change="handleSizeChange"></el-pagination>
    <Edit ref="edit" />
    <SessionUpload ref="sessionUpload" />
    <ExportExcel ref="exportExcel" />
    <CollectionFollower ref="collectionFollower" />
    <CollectionFollowing ref="collectionFollowing" />
    <CollectionLanguage ref="collectionLanguage" />
    <CollectionLocation ref="collectionLocation" />
  </div>
</template>

<script>
import { Delete, LanguageMap, List } from '@/api/instagram/users'
import { Country } from '@/api/instagram/locations'
// import edit.vue
import Edit from './components/edit.vue'
import SessionUpload from './components/import.vue'
import { List as GroupList } from "@/api/group";
import ExportExcel from './components/export.vue';
//import collectionFollower.vue
import CollectionFollower from './components/collectionFollower.vue'
//collectionFollowing.vue
import CollectionFollowing from './components/collectionFollowing.vue'
import CollectionLanguage from './components/collectionLanguage.vue'
import CollectionLocation from './components/collectionLocation.vue'



export default {
  name: 'ComprehensiveTable',
  components: {
    Edit,
    ExportExcel,
    SessionUpload,
    CollectionFollower,
    CollectionFollowing,
    CollectionLanguage,
    CollectionLocation
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
      language_id:",zh-Hant,zh,en,tw",
      listLoading: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      elementLoadingText: '正在加载...',
      accountStatus: [
        { label: '正常', value: 1 },
        { label: '异常', value: 2 },
      ],

      GroupForSessionList: [],
      CountryList: [],
      LanguageList: [ 
      // {
      //     label: '中文',
      //     value:  'zh',
      //   },
      //   {
      //     label: '台湾',
      //     value: 'tw',
      //   },
      //   {
      //     label: '英文',
      //     value: 'en',
      //   },
      //   {
      //     label: '繁体',
      //     value: 'zh-Hant',
      //   },
       ],
      ImportTypeList: [
        { label: '采集粉丝', value: 1 },
        { label: '采集关注', value: 2 },
        { label: '国家地区', value: 3 },
        { label: '文件导入', value: 4 },
      ],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        query: '',
        status: '',
        import_type: '',
        language_id: '',
        country_id_name: '',
        created_at: '',
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
      // this.typegroups(this.type);
    }
    if(this.queryForm. account_type ===''){
      this.GroupForSessionList=[]
    }
  },
  beforeDestroy() {
  },
  mounted() {
    this.getLanguageList()
    this.getLocationList()
    this.getGroupForSessionList()
    this.fetchData()
  },
  methods: {
    parseRow(row) {
      console.log(row.field)
    },
    getGroupForSessionList() {
      GroupList({
        group_type: 5,
        from: "select",
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
    },
    getLocationList() {
      Country({}).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.CountryList.push({
            label: res.data[i].zh_name,
            value: res.data[i].id_name,
          })
        }
      })
    },
    getLanguageList() {
      LanguageMap({}).then(res => {
        for (const resKey in res.data) {
          this.LanguageList.push({
            label: res.data[resKey],
            value: resKey,
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
      this.selectRows = val
    },
    handleAdd() {
      this.$refs['edit'].showEdit()
    },
    handleEdit(row) {
      this.$refs['edit'].showEdit(row)
    },
    handleExport(row) {
      this.$refs['exportExcel'].showEdit(row)
    },
    handleCollectionFollower() {
      this.$refs['collectionFollower'].handle()
    },
    //语言识别
    handleCollectionLanguage() {
      this.$refs['collectionLanguage'].handle()
    },
    //地区采集
    handleCollectionLocation() {
      this.$refs['collectionLocation'].handle()
    },
    handleCollectionFollowing() {
      this.$refs['collectionFollowing'].handle()
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
      //删除language_id中的第一个逗号
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].language_id = this.list[i].language_id.substring(1)
      }
      //将language_id按照逗号分隔成数组
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].language_id = this.list[i].language_id.split(',')
      }
      //删除language_id中未识别的语言
      
     
      this.handleLanguageId()
      // console.log(this.list)
      setTimeout(() => {
        this.listLoading = false
      }, 1000)
    },
    //写一个函数，先申明一个空数组，然后用language_id匹配languageList的value，如果匹配到了，就把label放到数组里，最后把数组赋值给language_id
    handleLanguageId() {
      for (let i = 0; i < this.list.length; i++) {
        let arr = []
        for (let j = 0; j < this.list[i].language_id.length; j++) {
          for (let k = 0; k < this.LanguageList.length; k++) {
            if (this.list[i].language_id[j] == this.LanguageList[k].value) {
              arr.push(this.LanguageList[k].label)
            }
          }
        }
        this.list[i].language_id = arr
      }
    },
    
    

    
   
   

  
    
    handleImport() {
      this.$refs['sessionUpload'].showUpload()
    },


  },
}
</script>
<style>
.cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

