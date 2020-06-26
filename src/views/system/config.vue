<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane-config v-if="activeName==item.key" ref="tabPaneConfig" :type="item.key" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPaneConfig from './components/tabPaneConfig'
import { getMapsGroup } from '@/api/base/config'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'system_config',
  components: { tabPaneConfig },
  data() {
    return {
      tabMapOptions: [],
      tabMapOptionsType: [],
      activeName: ''
    }
  },
  created() {
    this.getMapsGroup()
  },
  methods: {
    async getMapsGroup() {
      const data = await getMapsGroup()
      this.tabMapOptions = data
      this.activeName = data[0].key
    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
