<template>
  <el-tabs
    class="bpmn-properties-panel"
    type="border-card">
    <el-tab-pane label="用户管理">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
  </el-tabs>
</template>

<script>
import {is} from 'bpmn-js/lib/util/ModelUtil'
import panelTabs from '../resources/tabs.json'
import panelProps from '../resources/props.json'

export default {
  name: "PropertiesPanel",
  data () {
    return {
      eventBus: {},
      activatedTabs: []
    }
  },
  mounted () {
    this.initial()
  },
  methods: {
    initial () {
      this.eventBus.on('root.added', event => {
        console.log(is(event.element, 'bpmn:BaseElement'))
        this.activeTabs(event.element)
      })

      this.eventBus.on('element.click', event => {
        console.log(is(event.element, 'bpmn:BaseElement'))
        console.log(event.element)
        this.activeTabs(event.element)
      })
    },
    activeTabs (element) {
      const activatedTabs = []
      panelTabs.forEach(tab => {
        const activatedTab = {
          ...tab,
          props: panelProps.filter(prop => tab.props.indexOf(prop.id) && prop.allow.filter(e => is(element, e)).length > 0)
        }
        activatedTabs.push(activatedTab)
      })
      console.log(activatedTabs)
      this.activatedTabs = activatedTabs
    }
  }
}
</script>

<style scoped>
.bpmn-properties-panel {
  height: calc(100% - 6px);
}
</style>
