<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" label-width="160">
      <el-form-item label="采集数量">
        <el-input v-model="form.max_collection_number" style="width: 190px"></el-input>
      </el-form-item>
      <el-form-item label="协议分组" prop="type" label-width="160">
        <el-select v-model="form.account_group_id" placeholder="协议号分组" @change="getAccountTotal">
          <el-option v-for="(item, index) in GroupForAccountList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled>
          {{ account_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>
      <el-form-item label="博主分组" prop="type" label-width="160">
        <el-select v-model="form.blogger_group_id" placeholder="博主分组" @change="getBloggerTotal">
          <el-option v-for="(item, index) in GroupForBloggerList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled>
          {{ blogger_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
      </el-form-item>
      <el-form-item label="粉丝分组" prop="type" label-width="160">
        <el-select v-model="form.users_group_id" placeholder="粉丝分组" @change="getUsersTotal">
          <el-option v-for="(item, index) in GroupForUserList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
        <el-link style="margin-left: 10px" type="success" disabled>
          {{ users_count }} 个
        </el-link>
        <el-button icon="el-icon-refresh" style="margin-left: 10px" @click="refresh"></el-button>
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
import { Follower } from '@/api/instagram/users'
import { List as GroupList } from "@/api/group";
import { Total as userTotal } from "@/api/instagram/users";
import { Total as bloggerTotal } from "@/api/instagram/blogger";
import { Total as accountTotal } from "@/api/instagram/account";
import { Country } from '@/api/instagram/users'
import { City } from '@/api/instagram/users'
import { Location } from '@/api/instagram/users'

export default {
  name: 'upload3',
  data() {
    return {
      dialogFormVisible: false,
      GroupForAccountList: [],
      GroupForBloggerList: [],
      GroupForUserList: [],
      action: '',
      CountryList: [],
      CityList: [],
      LocationList: [],
      city_id_name: '',
      country_id_name: ' ',
      country_id: '',
      city_id: '',
      location_id: '',
      account_count: '',
      blogger_count: '',
      users_count: '',
      form: {
        account_group_id: '',
        blogger_group_id: '',
        users_group_id: '',
        country_id: '',
        city_id: '',
        location_id: '',
        max_collection_number: 40000,
        filter: {
          filter_face: true,
          filter_private: true,
          filter_number: true,
        },

      },
      title: 'IG博主粉丝采集',
    }
  },
  mounted() {
    this.GroupForUserList = this.$parent.GroupForSessionList
    this.getGroupForSessionList()
  },
  destroyed() {
    this.form = {}
  },

  methods: {



    getGroupForSessionList() {

      GroupList({
        group_type: 4,
        form: "select"
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForBloggerList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
      GroupList({
        group_type: 6,
        form: "select"
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.GroupForAccountList.push({
            label: res.data[i].group_name,
            value: res.data[i].id,
          })
        }
      })
    },

    async handle() {
      this.dialogFormVisible = true
    },
    async close() {
      this.dialogFormVisible = false
    },
    async save() {
      this.dialogFormVisible = false
      // console.log(this.form)
      Follower({
        account_group_id: this.form.account_group_id,
        blogger_group_id: this.form.blogger_group_id,
        users_group_id: this.form.users_group_id,
        filter: this.form.filter,
        max_collection_number: parseInt(this.form.max_collection_number),
        // country_id: this.form.country_id,
        // city_id: this.form.city_id,
        // location_id: this.form.location_id,
      }).then(res => {
        this.$message({
          message: '任务已经开始',
          type: 'success'
        });
      })
    },
    getAccountTotal() {
      accountTotal({
        id: this.form.account_group_id,
      }).then(res => {
        this.account_count = res.data
      })
    },
    getBloggerTotal() {
      bloggerTotal({
        id: this.form.blogger_group_id,
      }).then(res => {
        this.blogger_count = res.data
      })
    },
    getUsersTotal() {
      userTotal({
        id: this.form.users_group_id,
      }).then(res => {
        this.users_count = res.data
      })
    },
    refresh() {
      // this.getGroupForSessionList()
      this.form.account_group_id = '',
        this.form.blogger_group_id = '',
        this.form.users_group_id = '',
        this.GroupForAccountList = [],
        this.GroupForBloggerList = [],
        this.GroupForUserList = [],
        this.account_count = '',
        this.blogger_count = '',
        this.users_count = '',
        this.getGroupForSessionList()
      this.getAccountTotal()
      this.getBloggerTotal()
      this.getUsersTotal()
    }
  },
}
</script>
