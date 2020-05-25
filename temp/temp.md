Form
* 布局
* noStyle 纯粹的无样式绑定组件
* shouldUpdate 根据速度动态控制展示字段
* dependencies 用来控制依赖校验，重新触发相关校验
* 动态增减表单项：Form.List
* Form.Item 的 name 属性支持嵌套结构，结果直接构造成一个对象
* Form.Item 只会对它的直接子元素绑定表单功能，如果控件前后还有一些文案或样式装点，或者一个表单项有多个控件，可以使用内嵌的 Form.Item 完成
* 自定义 validator：返回 Promise
* 自定义只要满足如下条件，也可以被 FormItem 包裹
  * 提供受控属性 value 或其它与 valuePropName 的值同名的属性。
  * 提供 onChange 事件或 trigger 的值同名的事件。
* 将表单数据存储于外部容器并非好的实践，如无必要请避免使用。
* useResetFormOnCloseModal
* Form.Provider 处理表单间数据
* 提交按钮可用状态控制
```tsx
<Form.Item shouldUpdate={true}>
    {() => (
        <Button
            type="primary"
            htmlType="submit"
            disabled={
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length).length
            }
        >
            Log in
        </Button>
    )}
</Form.Item>
```
* Form 组件的 scrollToFirstError 在校验失败时直接滚动到第一个错误
* FormInstance.scrollToField 滚动到字段对应位置
* 时间类组件的 value 类型为 moment 对象，所以在提交服务器前需要预处理
* Form 具有自动收集数据并校验的功能，如果默认行为无法满足要求，可自行处理，通过 Form.Item 的 validateStatus、help、hasFeedback 等属性