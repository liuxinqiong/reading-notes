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

editor 做了什么
* 控制是否开启全局选择
* 控制是否开启编辑功能
* 控制选取对象
* 渲染内置的大地天空场景
* 相交判断
* 撤销回退
* 镜头相关：切换、移动
* 鼠标相关事件代理
  * mousemove、mouseleave、mousedown、mouseup
  * drop
  * click、dblclick

## 扫尾工作
大致工作完成后，还有某些清理工作
* 目录整理 - components
  * @/components/components
    * RatioItem 干嘛的？？
  * @/components/config
  * @/components/hooks
  * @/components/models
  * @/components/utils
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
  * BuildingInfoContextProvider 被多处用到 ？？？
  * Task 相关组件进行收纳
  * 移除原 ViewSwitcher，新的 ViewSwitcherPanel => ViewSwitcher
  * Dev 分享功能无法查看
  * 应用 npm 包
* 文档补充
  * LineSegments、LineSegmentGroup、LineSegmentsGroup 区别

### 工具栏优化
优化工具状态栏切换
* setEnabled
* setSelectionEnabled
* setObjectsForRaycasting

editor.enabled 扮演的角色
* 链条 editor.enabled、setEnabled、editorEnabledChange
* 用于某些场合关闭，可复制、可移动、可删除、可移动
* 会影响到撤销重做
* setEnabled
  * 进入关闭，退出时如果是中途没有被操作，则开启
* editorEnabledChange
  * LayerContext 获取状态变化
  * 撤销重做的禁用与否

editor.selectionEnabled 扮演的角色
* 显示和隐藏红线？？？
* 用于控制选取功能
* setSelectionEnabled
  * 进入关闭，退出时如果是中途没有被操作，则开启

可能存在的问题
* 如果功能直接进入，要求不能选取，这时候点选取该如何处理呢

使用顶部工具栏的几种情况？
* 自动调用工具栏功能
* 通过按钮触发工具栏功能

额外工作：优化掉 PartialPlan 以及 PartialPlanExtra

## 复盘
由于我一开始没有明确具体的任务列表，从而导致重构变成
* 目录移动大会（还有很多剩余）
* 死代码清理大会

系统整理
* the usage of three
* the usage of jsts
* the usage of fabric

选中态
* 修改 material 改为修改 material 对应的颜色，然后 original color 存储在 material.userData 中
* 修改外边框的方式实现，使用 outline 后置处理器

three.js editor 简直就是绝佳的学习资料

局部生成的按钮点击绘制，好像又说的过去了？

后期工作安排
* ODA 交接给伍杰麟，先从对接单体需求开始
  * 对位以及空间设置交给单体自行渲染，而不是借用 oda
* 彩总贴图需求以及后续的存储问题交给戴志陶
  * 导出时传递用户选择的文件流，以及对应的 scale 系数
  * 裁剪、填充模式
* 彩总新增人问题
* 环境配置问题
* Dev bug 修复
* 待完成的技术需求列表
* 梳理规划的整体设计，接下来的需求分析
  * 精确编辑 - 整理具体需求
  * 间距
  * 绘制建筑
  * 绘制台地
  * 评论功能
  * 指标优化
* 考察：聂升

准备工作
* 电脑清理工作
* 收集优秀 3D/2D 渲染场景网站，学习相关交互

PointerLockControls

loading 时的随机小 tip 提示，有助于用户挖掘功能