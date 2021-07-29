XKEditor 优化
* 参考 oda 设计
* 参考 fabric 设计

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

高亮和选中的关系

## 现在
当前 XKEditor 做了什么？

## 哪些是不该它做的


## 哪些是它该做的
通用能力
* 选择
* 删除
* 移动
* 复制？
* 编辑？

## 当前不合理设计


## 重构预期


## 展望


## 列表
选择态切换
- [] MaterialHelper => StateToggle，新增 BuildingComplexStateToggle、
- [] SelectionHelper => stateControl
- [] 优化 userData 使用，userData 默认为 any 逃生舱，导致重构麻烦，materialHelper 和 selectionHelper 从 userData 中移除
- [] editor 提供 select 相关 api 优化 api
- [] 考虑每个对象可能存在不同 highlight 颜色需求
