<template>
  <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="600px"
      @close="close"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="导出类型" prop="export_type">
        <el-select v-model="form.export_type" placeholder="导出类型">
          <el-option v-for="(item,index) in exportType" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分组" prop="group_id" v-if="form.export_type===1 || form.export_type===4">
        <el-input v-model="group_name" placeholder="分组" disabled style="width: auto;"></el-input>
        <el-link style="margin-left: 10px" type="success" disabled>
          可用数：{{ total }} 个
        </el-link> 
      </el-form-item>
      <el-form-item label="国家" prop="country_id_name" v-if="form.export_type===2 || form.export_type===4">
        <el-select v-model="form.country_id_name" placeholder="国家">
          <el-option v-for="(item,index) in CountryList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语言" prop="language_id" v-if="form.export_type===3 || form.export_type===4">
        <el-select v-model="form.language_id" placeholder="语言">
          <el-option v-for="(item,index) in LanguageList" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">导出csv</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {Export,LanguageMap} from '@/api/instagram/users'
import {List as GroupList} from "@/api/group";
import {Total} from "@/api/instagram/users";
import { Country } from '@/api/instagram/users'
export default {
  name: 'upload',
  data() {
    return {
      dialogFormVisible: false,
      GroupForSessionList: [],
      exportType: [
        {
          label: '分组',
          value: 1,
        },
        {
          label: '国家',
          value: 2,
        },
        {
          label: '语言',
          value: 3,
        },
        {
          label: '多条件',
          value: 4,
        },
      ],
      CountryList: [],
      languageList: [

      {
          label: '中文',
          value:  'zh',
        },
        {
          label: '台湾',
          value: 'tw',
        },
        {
          label: '英文',
          value: 'en',
        },
       
      ],
      action: '',
      group_for_session_count: '',
      group_name: '',
      total: '',
      group_id: '',
      LanguageList: [],
      form: {
        export_type: '',
        group_id: '',
        language_id: '',
        country_id_name: '',
      },
      title: '导出IG粉丝',
    }
  },
  mounted() {
    this.GroupForSessionList= this.$parent.GroupForSessionList

  },
  destroyed() {
    this.form = {}
  },
  methods: {
    // 获取国家
    getCountryList() {
      Country({
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.country_id_name = res.data[i].id_name
          this.CountryList.push({
            label: res.data[i].zh_name,
            value: res.data[i].id_name,
            
          })
        }
      })
    },
    // 获取语言
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

    async showEdit(row) {
      this.dialogFormVisible = true
      this.group_name = row.group_name
      this.total = row.total
      this.group_id = row.id
      this.getCountryList()
      this.getLanguageList()
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      this.dialogFormVisible = false
      Export({
        group_id: this.group_id,
        language_id: this.form.language_id,
        country_id_name: this.form.country_id_name,
      }).then(res => {
        this.$baseNotify('粉丝数据导出中,请勿重复执行', '任务执行中',)
      })
    },


  },
}
</script>
