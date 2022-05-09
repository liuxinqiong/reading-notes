了解各组件使用场景，而不是随意乱用

Affix 固钉：当内容区域比较长，需要滚动页面时，这部分内容对应的操作或者导航需要在滚动范围内始终展现。常用于侧边菜单和按钮组合。

Breadcrumb 面包屑
* 当系统拥有超过两级以上的层级结构时；
* 当需要告知用户『你在哪里』时；
* 当需要向上导航的功能时。

Dropdown 下拉菜单：当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。

Menu 导航菜单：导航菜单是一个网站的灵魂，用户依赖导航在各个页面中进行跳转。一般分为顶部导航和侧边导航，顶部导航提供全局性的类目和功能，侧边导航提供多级结构来收纳和排列网站架构。

PageHeader页头
* 页头位于页容器中，页容器顶部，起到了内容概览和引导页级操作的作用。
* 当需要使用户快速理解当前页是什么以及方便用户使用页面功能时使用，通常也可被用作页面间导航。

Checkbox 多选框
* 在一组可选项中进行多项选择时；
* 单独使用可以表示两种状态之间的切换，和 switch 类似。区别在于切换 switch 会直接触发状态改变，而 checkbox 一般用于状态标记，需要和提交操作配合。

Cascader 级联选择与 Select 选择器

Select 组件 multiple 和 tags 的区别：之前研究出来过，后面又忘了！！！tags 属性表示用户可以自行输入回车添加新标签。

Input 输入框与 InputNumber 数字输入框

Radio 单选框
* 用于在多个备选项中选中单个状态。
* 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

Collapse 折叠面板
* 对复杂区域进行分组和隐藏，保持页面的整洁。
* 手风琴是一种特殊的折叠面板，只允许单个内容区域展开

Popover 气泡卡片
* 当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。
* 和 Tooltip 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。

Tooltip 文字提示
* 鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。
* 可用来代替系统默认的 title 提示，提供一个按钮/文字/操作的文案解释。

Tabs 标签页：提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

Alert 警告提示
* 当某个页面需要向用户显示警告的信息时。
* 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

Modal 对话框
* 需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 Modal 在当前页面正中打开一个浮层，承载相应的操作。
* 另外当需要一个简洁的确认框询问用户时，可以使用 Modal.confirm() 等语法糖方法。

Message 全局提示
* 可提供成功、警告和错误等反馈信息。
* 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

Notification 通知提醒框
* 较为复杂的通知内容。
* 带有交互的通知，给出用户下一步的行动点。
* 系统主动推送。

Progress 进度条：在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。
* 当一个操作会打断当前界面，或者需要在后台运行，且耗时可能超过 2 秒时；
* 当需要显示一个操作完成的百分比时。

PopConfirm 气泡确认框
* 目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。
* 和 Modal.confirm 弹出的全屏居中模态对话框相比，交互形式更轻量。

Skeleton 骨架屏
* 网络较慢，需要长时间等待加载处理的情况下。
* 图文信息内容较多的列表/卡片中。
* 只在第一次加载数据的时候使用。
* 可以被 Spin 完全代替，但是在可用的场景下可以比 Spin 提供更好的视觉效果和用户体验。


带 Search 功能的 Select 和 AutoComplete 区别
* Search 组件
  * multiple 和 tags 差别
  * showSearch 开启搜索功能
  * searchValue 控制搜索文本
  * filterOption：指定过滤方式
  * optionFilterProp：搜索时对应的 options 属性，设置为 children 表示对内嵌内容进行搜索，设置为 label 表示对内容进行搜索
  * optionLabelProp：回填到选择框的 Option 的属性
* AutoComplete 组件
  * 组件很多类似的，出发点不一样
* 区别
  * AutoComplete 是一个带提示的文本输入框，用户可以自由输入，关键词是**辅助输入**。
  * Select 是在限定的可选项中进行选择，关键词是**选择**。

## ArcoDesign 调研
ArcoDesign 使用 CSS 变量来构建暗黑主题。

ArcoDesign 内部 Less 变量和 CSS 变量共存，并且内置了亮色和暗色的色彩算法。

组件中和 antd 不同之处
* 通用组件
  * 新增了个 mini 尺寸
  * 响应式参数支持：xs/sm/md/lg/xl/xxl 等
  * 有些组件提供 `hoverable` 属性用于控制 hover 时是否有底色反馈
  * 支持 `bordered` 属性表示是否需要边框
  * 支持 `triggerElement` 自定义显示触发元素
  * 渲染方式更加灵活，大部分组件支持 renderProps 方式将渲染暴露出来，比如 `renderXXX` 或 `children func`
  * wrapClassName and wrapStyle
* Button
  * secondary button
  * mini size
  * ButtonGroup
  * 专门的 Link 组件从 Button 中独立出去
* Space
  * 支持对齐方式，还挺实用的
  * wrap 属性设置环绕类型间距
* Avatar
  * 支持 AvatarGroup 展示头像组
  * 还支持设置 trigger 设置交互按钮
* Card
  * 支持 Card.Grid 批量展示 Card
  * 支持 Card.Meta 展示一些元信息
* Carousel
  * 针对指示器样式和位置提供了更多的配置项
  * 切换方向配置
  * 高级动画效果
* Image
  * 支持设置标题和描述，及显示位置设定
  * 支持设置额外的 actions
  * Image.PreviewGroup 多图预览
* Table
  * 配合 `react-resizable` 可以实现可伸缩列的效果
  * 配合 `react-sticky` 可以实现表头吸顶的效果
  * 配合 `react-sortable-hoc` 实现拖拽排序
* Tabs
  * 通过 `react-dnd` 可以实现页签的拖拽
* AutoComplete
  * 支持 triggerElement 自定义触发元素
* Form
  * `normalize` 标准化收集到的值，与之对应，使用 `formatter` 将值格式化转给表单项
  * 比 antd 新增全局禁用 `disabled` 属性，这很 nice
  * `getTouchedFields` 获取被操作过的字段
* InputTag 新增组件
  * 还支持 dragToSort 属性
* InputNumber
  * 增加 mode 属性支持指定为 Button 模式
  * 支持 hideControl 隐藏右侧按钮
* Slider
  * 支持 showInput 显示输入框
* Upload
  * `react-easy-crop` 裁剪库
* Modal
  * `react-draggable` 实现拖拽
  * 很聪明的设计，直接通过 modalRender 将 modal 暴露出来，交给 Draggable 组件渲染即可
* Dropdown
  * 默认使用 children 作为触发元素
  * 聪明的设计在于提供了 Dropdown.Button 收敛了一个特殊的场景
* Menu
  * mode 为 pop 使用悬浮菜单，popButton 使用按钮组悬浮菜单

一些思考，均实现了一些常见特定业务场景组件，在中后台场景能快速被复用，但前台场景，估计就很难满足设计师的要求了
* 评论 Comment
* 描述列表 Descriptions 内部使用表格实现
* 列表 List，高级特性会被需要
  * 滚动加载列表
  * 无限长列表
* 数值显示 Statistic
  * 处理数字分隔显示、精度显示、前后缀添加
  * 倒计时组件，电商网站常用
  * 时间格式化效果

设计指南
* 主要目标：体验问题、产品设计指导原则、协作沟通语言
* 色彩：主色、中性色、功能色和遮罩色
* 文字：字体、字重、行高、段间距
* 阴影：不同层级使用阴影的指导原则

提供了一个风格配置平台
* 本质上是一系列的变量
* 基础样式：颜色、字体、尺寸、边框、阴影，是设计同学和前端同学约定的一套规范。
* 组件样式控制：使用暴露出的配置项进行配置
* 开发者模式：本质上就是样式覆盖的方式解决配置项做不到的需求

总结
* 新增了大量的 props 配置
* 解决了一些 antd 组件中不太合理的地方
* 更明显的 iconOnly Button 组件
* 新增 ResizeBox 组件
* 新增 Trigger 组件，用于弹出一个面板，感觉和 Popover 比较类似
  * alignPoint 出现在鼠标位置很赞
  * updateOnScroll 滚动时更新位置很赞