关于规划重构的反思（editor 优化）

## 现在
当前 editor 做了什么？
* 获取相交元素
* 事件发布订阅
* 对象状态变更
* 基于 EditCommand 撤销重做
* 基于 Command 的顶部工具栏相关功能及启用工具状态管理
* 对象的添加、移除与渲染
* 捕捉吸附

> Object3DFinder 值得好好关注一哈，做了很多 Editor 可直接对外输出的能力以及很多业务能力

## 愿景
最终理想的愿景
* 插件化开发
* 可以方便沉淀给其他场景复用的能力

## 任务清单
任务清单如下
* 提供 selection 相关 api
  * MaterialHelper => StateToggle，新增 BuildingComplexStateToggle
  * SelectionHelper => StateControl
  * 考虑每个对象可能存在不同 highlight 颜色需求
* typing 完善
  * 优化 Object3D 对象的 userData，第一导致重构麻烦，第二成为 any 逃生舱，不安全
  * editor 事件类型和 Event 对象类型管理，看能否提供一个日志功能
* 顶部工具栏
  * 顶部工具栏状态与具体业务中工具调用，非常混乱，提供隐式（implicit）和显式（explicit）api
* 通用化 editor
  * 区分非业务对象 Object3D 对象和通用对象
  * 顶部工具栏更通用化
  * 提供通用的 CommonObject3D 对象，通用化移动、锁定、复制、选择等能力
* 其他优化点
  * 优化选取操作，每次选取同样元素时会重复触发事件问题
  * 提供获取相交对象与最近相交对象，而不是交给调用方通过 Finder 去解决
  * 优化关于添加对象 api 的第三参数是否旋转让人困惑问题

## 反思总结
关于此次重构任务，对于组员任务安排以及自己的任务拆分，碰到一些问题导致任务出现一些阻塞甚至返工
* 客观问题：自己重新接手项目，本身也需要时间去了解和熟悉
* 针对组员：一开始没有列出具体的任务清单，只给出一个大致的方向，但这会导致组员缺失目标，从而导致不知道要做什么
  * 给出方向可以，接下来应该挖掘该方向可能的重构点，集中在一起收集成一个任务清单
* 针对自身：自己想做的事情很多，反而导致不知道如何下手，与工时的矛盾很纠结，一开始估时就差很远
  * 除了任务清单之外，更重要的是对任务进行紧急与虫咬程度四象限划分，抓住主要矛盾行动，其他的来日方长
  * 自身无法将全部时间投入到开发中，比如进行代码的审查、日常会议等会花费不少时间

任务管理三要素
* 事前：做什么（排优先级很重要）
  1. 列出任务清单
  2. 列出每一个任务对结果的核心期待（进度、质量、效果）
  3. 对照目标评估任务
  4. 通过成果收益来看重要程度（和目标的匹配度）
  5. 通过后果损失来看紧急程度
* 事中：怎么做
  * 保证有效执行
* 事后：怎么做更好
  * 完善流程机制

## 设计参考
* 参考 oda 设计
* 参考 fabric 设计

> 高亮和选中的关系

fabric
* Canvas 对象
  * 清晰且有语义的事件名，比如 object:rotated/object:scaled/object:moved/……
  * 光标相关：defaultCursor/setCursor(value)
  * 组选相关
    * 是否开启组选：selection
    * 组选样式：selectionColor/selectionBorderColor/selectionDashArray/selectionLineWidth/……
  * 选取相关：skipTargetFind/targetFindTolerance/targets/findTarget(e, skipGroup)
  * 捕捉相关：snapAngle/snapThreshold
  * 对象管理：add(...objects)/remove(...objects)/contains(object)/clear()/dispose()
  * 对象选取：discardActiveObject(e)/getActiveObjects/setActiveObject
  * 关于监听：removeListeners()
  * 关于渲染：renderAll()/requestRenderAll()
* Object
  * controls
  * evented：当设置为 false，对象无法成为事件的目标对象，而是直接穿过
  * lockMovementX/lockMovementY
  * lockRotation
  * lockScalingX/lockScalingY
  * lockSkewingX/lockSkewingY
  * perPixelTargetFind
  * selectable
  * type/visible
  * onSelect()/onDeselect()
* Group
  * subTargetCheck
  * addWithUpdate(object)/removeWithUpdate() 添加、删除对象，且重新计算组的尺寸以及位置
  * getObjects(typeopt)
  * ungroupOnCanvas()

oda
* Viewer 对象
  * 关于渲染：update()
  * 对象管理：clear()/regenAll()
  * 关于选取：getSelected()/setSelected()/select()/unselect()/hideSelectedObjects
  * 高级选取：selectXXX() 多点选、多边形选、框选、多线段选
  * 关于捕捉：getSnapPoint()
  * 关于坐标：screenToWorld()/toEyeToWorld(x, y, z)
  * 关于高亮：setHighlightColor(r, g, b, a)
* Object：Model、Entity、Block
  * getSelectability()/setSelectability()

## 扫尾工作
大致工作完成后，还有某些清理工作
* 目录整理 - components
  * @/components/components
  * @/components/hooks
  * @/components/utils
  * @/components/config
  * @/components/models
  * 指标 Indicator 相关增加上一层分类
* 可能通用化的组件
  * AnglePicker
  * PanelTitle
  * BasicConditions
  * ColorPickerPopover
  * ShortCutPanel
  * SelectBlockConfirm 通用化？？？
* 组件优化
  * 移除 Cad/components/DraggableModal，使用新的替换
  * 优化 ObjectPropertyModal > ResetInput ？？？
  * BuildingSingleInfoContextProvider 被多处用到 ？？？
  * Task 相关组件进行收纳
  * 移除原 ViewSwitcher，新的 ViewSwitcherPanel => ViewSwitcher
  * Dev 分享功能无法查看