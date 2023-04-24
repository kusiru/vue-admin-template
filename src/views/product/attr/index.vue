<template>
  <div>
    <el-card style="margin-bottom: 20px;">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!category3Id"
          @click="isShowTable=false"
        >
          添加属性
        </el-button>
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="150"></el-table-column>
          <el-table-column label="属性值列表" prop="attrValueList" width="width">
            <template slot-scope="{row, $index}">
              <el-tag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                type="success"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row, $index}">
              <el-button type="warning" icon="el-icon-edit" size="small" @click="isShowTable=false"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table border style="width:100%;margin: 10px 0">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称" prop="attrName" width="width"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row, $index}">
              <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      isShowTable: false,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [ // 属性值列表.
          {
            attrId: 0, // 属性名的id
            valueName: '' // 属性值
          }
        ],
        categoryId: 0, // 属性名所属的分类id
        categoryLevel: 0 // 属性名所属的分类级别
      }
    }
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else if (level === 3) {
        this.category3Id = categoryId
        // 发请求获取平台属性数据
        this.getAttrList()
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    }
  }
}
</script>

<style scoped>

</style>
