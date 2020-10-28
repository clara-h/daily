<template>
  <div class="index-main">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>总消费</span>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {}
    }
  }
</script>

<style lang="less" scoped>
.index-main{
  padding: 20px;
}
</style>
