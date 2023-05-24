<template>
  <el-form-item :label="form.label" :prop="form.field">
    <el-upload
        action="#"
        :limit="1"
        :show-file-list="false"
        :http-request="UploadImage">
      <el-button size="small" type="primary">上传</el-button>

    </el-upload>
    <el-image  v-if="fileId!==''" :src="getImgUrl(fileId)" class="avatar" alt=""/>
  </el-form-item>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  margin-top: 10px;
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<script>
import {UploadImage} from "@/api/employee";
import {baseURL} from "@/config/net.config";

export default {
  name: 'Upload',
  props: {
    form: Object,
    fileId: String
  },
  data() {
    return {
      imageUrl: "",
    };
  },
  created() {
    console.log(this.form)
  },
  methods: {
    UploadImage(fileObj) {
      console.log(fileObj)
      this.progressPercent = 0
      this.progressFlag = true
      let f = new FormData()
      f.append("file", fileObj.file)

      UploadImage(f).then(res => {

        this.$message.success('上传成功')

        this.imageUrl = baseURL + '/file/image/' + res.data.file_id
        let field = this.form.field
        this.$emit("setField", field, res.data.file_id)
        this.fileId = res.data.file_id
      }).catch(err => {
        this.progressFlag = false
        // this.$message.error('上传失败')
      })
      return true
    },
    getImgUrl(imageFileId) {
      return process.env.VUE_APP_STATIC_URL + imageFileId
    },

  }
}
</script>