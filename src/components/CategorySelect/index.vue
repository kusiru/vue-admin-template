<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类" :model="cForm">
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          @change="handler1"
        >
          <el-option
            v-for="c1 in list1"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          @change="handler2"
        >
          <el-option
            v-for="c2 in list2"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          @change="handler3"
        >
          <el-option
            v-for="c3 in list3"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  data() {
    return {
      // 一级分类数据
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    // 初始化一级分类数据
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    async handler1() {
      // 解构出一级分类id
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 获取二级分类数据
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.list2 = []
        this.list3 = []
        this.cForm.category2Id = ''
        this.cForm.category3Id = ''
        this.list2 = result.data
      }
    },
    async handler2() {
      // 解构出二级分类id
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })

      // 获取二级分类数据
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        this.list3 = []
        this.cForm.category3Id = ''
        this.list3 = result.data
      }
    },
    handler3() {
      // 解构出二级分类id
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style scoped>

</style>
