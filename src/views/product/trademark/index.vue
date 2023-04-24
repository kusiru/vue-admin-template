<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>
    <el-table :data="list" border>
      <el-table-column type="index" label="序号" width="80" align="center"/>
      <el-table-column prop="tmName" label="品牌名称"/>
      <el-table-column prop="logoUrl" label="品牌logo">
        <template slot-scope="{row, $index}">
          <img :src="row.logoUrl" alt="" width="100">
        </template>
      </el-table-column>
      <el-table-column prop="opr" label="操作">
        <template slot-scope="{row, $index}">
          <el-button type="warning" size="small" icon="el-icon-edit" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px;text-align: center;"
      background
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加dialog -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'tradeMark',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌logo' }
        ]
      }
    }
  },

  mounted() {
    // 获取列表数据的方法
    this.getPageList()
  },
  methods: {
    // 获取列表数据的方法
    async getPageList(pager = 1) {
      // 解构出参数
      const { page, limit } = this
      // 获取品牌列表的接口
      const result = await this.$API.trademark.reqTradeMarkList(pager ? page : pager, limit)
      if (result.code === 200) {
        this.page = result.data.current
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    handleCurrentChange(page) {
      this.page = page
      this.getPageList()
    },
    showDialog() {
      this.dialogFormVisible = true
      // 清空表单
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    updateTradeMark(row) {
      // row 就是当前行的数据
      this.dialogFormVisible = true
      this.tmForm = { ...row }
    },
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false
          // 发请求
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            this.$message.success(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
            await this.getPageList(this.tmForm.id ? this.page : '')
          }
        } else {
          this.$message.error('操作失败')
          return false
        }
      })
    },
    deleteTradeMark(row) {
      this.$confirm(`您确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          await this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

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
  width: 178px;
  height: 178px;
  display: block;
}
</style>
