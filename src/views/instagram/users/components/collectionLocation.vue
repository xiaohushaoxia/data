<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form">
      <el-form-item label="国家分组" prop="type">
        <!-- <el-select v-model="form.country_id" placeholder="国家分组" @change="getCityList" filterable default-first-option :filter-method="searchMchList"> -->
          <el-select v-model="form.country_id" placeholder="国家分组"  @change="getCityList">
          <el-option v-for="(item, index) in CountryList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="  城    市" prop="type">
        <el-select v-model="form.city_id" placeholder="城市分组" @change="getLocationList">
          <el-option v-for="(item, index) in CityList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="  地    区" prop="type">
        <el-select v-model="form.location_id" multiple  placeholder="地区分组" style="overflow: hidden;height: 6vh;">

         
          <el-option v-for="(item, index) in  LocationList" :key="index" :label="item.label"
            :value="item.value" ></el-option>
        </el-select>
        <el-checkbox style="margin-left: 10px;" v-model="optionsAll" @change="handleoptionsAllChange">
          全部
        </el-checkbox>
      </el-form-item>

      <el-form-item label="粉丝分组" prop="type">
        <el-select v-model="form.group_id" placeholder="粉丝分组"  @change="getUsersTotal">
          <el-option v-for="(item, index) in GroupForUserList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled v-if="users_count !== ''">
          {{ users_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>
      <el-form-item label="业务类型" prop="account_type">
        <el-select v-model="form.account_type" placeholder="类型" @change="typegroup">
          <el-option v-for="(item, index) in accountType" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协议分组" prop="account_group_id">
        <el-select v-model="form.account_group_id" placeholder="分组" @change="getGroupForSessionTotal">
          <el-option v-for="(item, index) in GroupForSessionList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled v-if="group_for_session_count !== ''">
         {{ group_for_session_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>
      <el-form-item label="采集数量">
        <el-input v-model="form.max_collection_number" style="width: 190px"></el-input>
      </el-form-item>
      <el-form-item label="过滤条件">
        <el-form-item label="默认头像" prop="filter_face" style="margin-left: 75px">
          <el-switch v-model="form.filter.filter_face"></el-switch>
        </el-form-item>
        <el-form-item label="私密账号" prop="filter_private" style="margin-left: 75px">
          <el-switch v-model="form.filter.filter_private"></el-switch>
        </el-form-item>
        <el-form-item label="数值用户" prop="filter_number" style="margin-left: 75px">
          <el-switch v-model="form.filter.filter_number"></el-switch>
        </el-form-item>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">开始任务</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Language } from '@/api/instagram/users'
import { Total as userTotal } from "@/api/instagram/users";
import { List as GroupList } from "@/api/group";
import { Country } from '@/api/instagram/users'
import { City } from '@/api/instagram/users' 
import { Location } from '@/api/instagram/users'    //CollectLocation
import { CollectLocation } from '@/api/instagram/users' 
export default {
  name: 'upload2',
  data() {
    return {
      dialogFormVisible: false,
      CountryList: [],
      CityList: [],
      LocationList: [],
      GroupForUserList: [],
      city_id_name: '',
      country_id_name:' ' ,
      country_id: '',
      city_id: '',
      location_id: [],
      action: '',
      optionsAll: false,
      users_count: '',
      account_group_id: '',
      group_for_session_count: '',
      accountType: [
        { label: '采集', value: 1 },
        { label: '私发', value: 2 },
        { label: '拉群', value: 3 },
        { label: '关注', value: 4 },
      ],
      GroupForSessionList: [],
      form: {
        users_group_id: '',
        max_collection_number: 40000,
        account_group_id: '',
        filter: {
          filter_face: true,
          filter_private: true,
          filter_number: true,
        },
      },
      
        
      title: '地区采集',
    }
  },
  mounted() {
    this.GroupForUserList = this.$parent.GroupForSessionList

  },
  destroyed() {
    this.form = {}
  },
  created() {
    this.getGroupForSessionList()
    // this.getCityList()
    // this.getLocationList()
    this.getCountryList()

  },
  methods: {
    //点击
    handleoptionsAllChange(row){
      // console.log('row',row)
      if(row===true){
      // 把this.LocationList所有的value值push到this.location_id
      for(let i=0;i<this.LocationList.length;i++){
        this.location_id.push(this.LocationList[i].value)
        this.form.location_id=this.location_id
      }

      }else{
        this.location_id=[]
        this.form.location_id=[]
      }
      console.log('this.location_id',this.location_id)
    },


    // 获取国家
    getCountryList() {
      Country({
      }).then(res => {
        // console.log('Country',res)
        for (let i = 0; i < res.data.length; i++) {
          this.country_id_name = res.data[i].id_name
          this.CountryList.push({
            label: res.data[i].zh_name,
            value: res.data[i].id_name,
            
          })
        }
      })
    },
  
    // 获取城市
    getCityList(val) {
      // console.log('val',this.country_id)
      this.country_id_name = val
      this.CityList=[],
      this.LocationList=[],
      this.optionsAll=false,
      this.form.location_id=[],
      City({
        country_id_name: this.country_id_name,
        pageSize:9999
      }).then(res => {
        // console.log('City',res)
        for (let i = 0; i < res.data.length; i++) {
          this.CityList.push({
            label: res.data[i].name,
            value: res.data[i].sort_name ,
          })
        }
      })
    },
    // 获取地区
    getLocationList(val) {
      this.city_id_name = val
      this.LocationList=[]
      this.optionsAll=false,
      this.form.location_id=[],
      // console.log('val',val)
      Location({
         pageSize:9999,
        city_id_name: val,
        country_id_name:  this.country_id_name,
      }).then(res => {
        // console.log('Location',res)
        for (let i = 0; i < res.data.length; i++) {
          this.LocationList.push({
            label: res.data[i].name,
            value: res.data[i].id,
          })
        }
      })
    },
    getUsersTotal() {
      userTotal({
        id: this.form.group_id,
      }).then(res => {
        this.users_count = res.data
      })
    },
    //下拉列表输入内容时
    // searchMchList(val) {
    //   if (val) {
    //     let value = val;
    //     this._searchAllMch(value);
    //   } else {
    //     // 搜索内容为空时还原列表
    //     this._searchAllMch();
    //   }
    // },


    getGroupForSessionList() {
      GroupList({
        group_type: 5,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForUserList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
    },
    typegroup(val) {
      // console.log(val)
      // console.log(13)
      if (val === undefined) {
        val = this.form.GroupForSessionList
      }
      let sessionGroupType = ''
      this.GroupForSessionList = []
      if (val === 1) {
        sessionGroupType = 6   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      }
      if (val === 2) {
        sessionGroupType = 8  //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      }
      if (val === 3) {
        sessionGroupType = 7   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6
      }
      if (val === 4) {
        sessionGroupType = 11   //IG拉群协议：7  IG私发协议：8 IG协议号—采集:6  IG协议号-关注
      }
      GroupList({
        group_type: sessionGroupType,
        // from: "select"
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          // console.log(res)
          this.GroupForSessionList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
            total: res.data[i].total
          })
        }
      })

      // GroupList({
      //   group_type: 12,
      //   // form: "select"
      // }).then(res => {
      //   for (let i = 0; i < res.data.length; i++) {
      //     // console.log(res)
      //     this.GroupForBlogger.push({
      //       label: res.data[i].group_name,
      //       value: res.data[i].id,
      //       total: res.data[i].total
      //     })
      //   }
      // })

    },
  //获取分组下的协议号数
  getGroupForSessionTotal(id) {
      //找到当前id对应的total
      for (let i = 0; i < this.GroupForSessionList.length; i++) {
        if (this.GroupForSessionList[i].value === id) {
          this.group_for_session_count = this.GroupForSessionList[i].total
          // console.log(this.GroupForSessionList[i])
          break
        }
      }
    },
    async handle() {
      this.dialogFormVisible = true
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      console.log('this.form',this.form)
      this.dialogFormVisible = false
      CollectLocation({
        // country_id: this.form.country_id,
        // city_id: this.form.city_id,
        account_group_id: this.form.account_group_id,
        filter: this.form.filter,
        max_collection_number: parseInt(this.form.max_collection_number),
        location_id: this.form.location_id,
        group_id: this.form.group_id,
      }).then(res => {
        this.$message({
          message: '任务已经开始',
          type: 'success'
        });
      })
    },


    // 刷新
    refresh() {
      this.getUsersTotal()
      this.getGroupForSessionTotal(this.form.group_id)
    },
  },
}
</script>
<style>
  .el-form-item__label {
    width: 68px;
  }
</style>