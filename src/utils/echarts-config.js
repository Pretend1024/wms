import * as echarts from 'echarts/core'
// 图表类型
import { PieChart, LineChart } from 'echarts/charts'
// 组件模块
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,   // 新增数据缩放
  DatasetComponent,    // 新增数据集
  MarkLineComponent,    // 新增标记线
  LegendComponent,
  // LineChart,
} from 'echarts/components'
// 特性模块
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 渲染器
import { CanvasRenderer } from 'echarts/renderers'

// 统一注册所有组件
echarts.use([
  // 基础组件
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
  DatasetComponent,
  MarkLineComponent,
  LegendComponent,

  // 图表类型
  PieChart,
  LineChart,

  // 特性模块
  LabelLayout,
  UniversalTransition,

  // 渲染器
  CanvasRenderer
])

export default echarts