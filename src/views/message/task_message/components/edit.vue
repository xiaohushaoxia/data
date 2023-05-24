<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="话术分组" prop="type">
        <el-select v-model="form.group_id">
          <el-option v-for="(item,index) in group_list" :key="index" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="话术类型" prop="type">
        <el-select v-model="form.message_type">
          <el-option v-for="item in message_type" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="话术名称" prop="type">
        <el-input v-model="form.message_name"></el-input>
      </el-form-item>
      <el-form-item label="话术内容" prop="message_content" v-if="form.message_type != 4">
        <el-input type="textarea" v-model="form.message_content"  placeholder="编辑消息需要加入的标签  {#contact}
*标签非必填 "></el-input>
        <div> 接粉号标签：  {#contact} </div>
      </el-form-item>
      <el-form-item label="图片" prop="message_url" v-if="form.message_type == 3 || form.message_type == 4">
        <el-image :src="form.message_url" />
        <el-upload action="#" :show-file-list="false" :http-request="UploadImage">
          <el-button size="small" type="primary">上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="话术状态" prop="type">
        <el-select v-model="form.message_status">
          <el-option v-for="(item, index) in message_status" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Create, Update } from '@/api/taskMessage'
import Upload from './upload'
import { UploadImage } from "@/api/fileUplode";
import { baseURL } from "@/config/net.config";
import { List as GroupList } from '@/api/group'

export default {
  name: 'TableEdit',
  components: {
    Upload,
  },
  data() {
    return {

      message_type: [
        { label: '纯文字', value: 1 },
        { label: '话术转发连接', value: 2 },
        { label: '图片+文字', value: 3 },
        { label: '纯图片', value: 4 },
      ],
      message_status: [
        { label: '可用', value: 1 },
        { label: '不可用', value: 2 },
      ],
      message_group_list: [],
      pull_group_list: [],
      send_strategy_list: [],
      pull_strategy_list: [],
      form: {
        message_name: '',
        message_content: '',
        message_type: '',
        message_status: '',
        message_url: '',
      },
      message_urls: '',
      title: '',
      actionType: '',
      dialogFormVisible: false,
      select_items: [],
    }
  },
  created() {
    this.group_list = []
    this.getGroupList()
  },
  methods: {
    //获取分组列表
    async getGroupList() {
      const { data } = await GroupList(
        {
          group_type: 3   //群发话术 话术分组 
        }
      )
      data.forEach(item => {
        this.group_list.push({
          label: item.group_name,
          value: item.id
        })
      })
    },


    UploadImage(fileObj) {
      // this.progressPercent = 0
      // this.progressFlag = true
      let f = new FormData()
      f.append("file", fileObj.file)

      UploadImage(f).then(res => {
        this.$message.success('上传成功')
        this.form.message_url = process.env.VUE_APP_STATIC_URL +'/'+res.url
        this.message_urls = res.url
        console.log(this.form.message_urls)
      }).catch(err => {
        this.progressFlag = false
        this.$message.error(err)
      })
      return true
    },
    getImgUrl(imageFileId) {
      return process.env.VUE_APP_STATIC_URL + imageFileId
    },
    async showEdit(row) {
      if (!row) {
        this.title = '添加'
        this.actionType = 'create'
      } else {
        //select_item json to array
        this.title = '编辑'
        this.actionType = 'update'
        this.form = Object.assign({}, row)
        // console.log(this.form)

      }
      this.dialogFormVisible = true
    },
    async close() {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.dialogFormVisible = false
      await this.$parent.fetchData()
    },
    async save() {
      await this.$refs['form'].validate(async (valid) => {
        //console.log(this.form)
        delete this.form.message_url;
        this.form.message_url=  this.message_urls
        console.log(this.form)
        // console.log(valid)
        if (valid) {
          if (this.actionType === 'create') {
            const { msg } = await Create(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            await this.$parent.fetchData()
            this.form = this.$options.data().form

          } else {
            const { msg } = await Update(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            await this.$parent.fetchData()
            this.form = this.$options.data().form
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.el-textarea__inner {
  background-color: #1b2735;
  color: #66ccaa;
  height: 100px;
}
</style>
