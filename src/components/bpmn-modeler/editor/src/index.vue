<template>
  <el-container class="bpmn-editor">
    <el-header class="bpmn-editor-header">
      <div class="bpmn-editor-header-btn">
        <div>
          <el-tooltip
              class="item"
              effect="dark"
              content="自适应屏幕"
              placement="bottom"
          >
            <el-button
                size="mini"
                icon="el-icon-rank"
                @click="fitViewport"
            ></el-button>
          </el-tooltip>

          <el-tooltip
              class="item"
              effect="dark"
              content="放大"
              placement="bottom"
          >
            <el-button
                size="mini"
                icon="el-icon-zoom-in"
                @click="zoomIn"
            ></el-button>
          </el-tooltip>

          <el-tooltip
              class="item"
              effect="dark"
              content="缩小"
              placement="bottom"
          >
            <el-button
                size="mini"
                icon="el-icon-zoom-out"
                @click="zoomOut"
            ></el-button>
          </el-tooltip>

          <el-tooltip
              class="item"
              effect="dark"
              content="后退"
              placement="bottom"
          >
            <el-button
                size="mini"
                icon="el-icon-back"
                @click="undo"
            ></el-button>
          </el-tooltip>

          <el-tooltip
              class="item"
              effect="dark"
              content="前进"
              placement="bottom"
          >
            <el-button
                size="mini"
                icon="el-icon-right"
                @click="redo"
            ></el-button>
          </el-tooltip>
        </div>
        <div>
          <el-button
              size="mini"
              icon="el-icon-download"
              @click="downloadXML"
          >下载
          </el-button>
        </div>
      </div>
    </el-header>
    <el-container class="bpmn-editor-body">
      <el-main class="bpmn-editor-body-main">
        <div class="canvas" id="js-canvas"></div>
      </el-main>
      <el-aside width="400px" class="bpmn-editor-panel">
        <div class="properties-panel-parent" id="js-properties-panel"></div>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import DiagramXML from '../../resources/diagram.bpmn'
import ActivitiModdle from '../../resources/activiti.json'
import ModelerModdle from '../../resources/modeler.json'
import PropertiesPanelModule from '../../panel'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

export default {
  name: "BpmnEditor",
  data() {
    return {
      modeler: {},
      modeling: {},
      canvas: {},
      commandStack: {}
    }
  },
  created() {
  },
  mounted() {
    this.initial()
  },
  methods: {
    initial() {
      this.modeler = new BpmnModeler({
        container: '#js-canvas',
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          PropertiesPanelModule
        ],
        moddleExtensions: {
          activiti: ActivitiModdle,
          modeler: ModelerModdle
        }
      })
      this.modeling = this.modeler.get('modeling')
      this.canvas = this.modeler.get('canvas')
      this.commandStack = this.modeler.get('commandStack')
      this.createNewDiagram()
    },
    createNewDiagram() {
      this.openDiagram(DiagramXML).then(() => {
        this.modeling.updateProperties(this.canvas.getRootElement(), {
          id: 'Process_' + Math.random().toString(36).slice(-8)
        })
        this.fitViewport()
      })
    },
    openDiagram(diagramXML) {
      return this.modeler.importXML(diagramXML)
    },
    downloadXML() {
      this.modeler.saveXML({format: true}).then(res => {
        if (res && res.xml) {
          console.log(res.xml)
          const link = document.createElement('a')
          link.setAttribute('href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodeURIComponent(res.xml))
          link.setAttribute('download', 'diagram.bpmn20.xml')
          //link.click()
        }
      })
    },
    fitViewport() {
      this.canvas.zoom('fit-viewport')
    },
    zoomIn() {
      this.canvas.zoom(this.canvas.zoom() + 0.2)
    },
    zoomOut() {
      this.canvas.zoom(this.canvas.zoom() - 0.2)
    },
    redo() {
      this.commandStack.redo()
    },
    undo() {
      this.commandStack.undo()
    }
  }
}
</script>

<style scoped>
.bpmn-editor {
  height: 100%;
  padding: 0;
  margin: 0;
}

.bpmn-editor-header {
  height: auto !important;
  border-bottom: 1px solid rgb(218, 218, 218);
}

.bpmn-editor-header-btn {
  display: flex;
  padding: 10px 0;
  justify-content: space-between;
}

.bpmn-editor-body {
  height: 100%;
  padding: 0;
  margin: 0;
}

.bpmn-editor-body-main {
  height: 100%;
  padding: 0;
  margin: 0;
}

.canvas {
  width: 100%;
  height: 100%;
}

.bpmn-editor-panel {
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)*/
}

.properties-panel-parent {
  height: 100%;
}
</style>
