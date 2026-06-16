# Agent 学习
尝试学习 OpenAI Agent SDK 编写 AI 项目，学习过程中发现 Vercel 也有 AI Agent SDK，感觉封装的更好，而且还适配不同服务商。

## OpenAI Agent SDK
Agent 动手实践目标
1. 创建 1 个 agent + 1 个 Tool 并跑通
2. 创建 2 个 agent（分工）+ 1 个 Triage（路由）并跑通
3. 接入一个后端 sse 推送

两种 API 形式
* 传统的 Chat Completions API
* 新的 Responses API（目前国内大模型对 Responses 普遍还未适配）

关键概念
* 输出项 OutputItems：Agent Run 在执行过程中产生的结构化事实对象，是对执行过程的结构化记录，比如模型生成了文本，决定调用某工具，工具执行完成，agent 发生了交接等，如果只有 final_output，则会失去对 agent 内部决策过程的全部洞察
* 对话 Conversation：主要做上下文管理，实现多轮对话
* 集成 MCP：可以理解成后端开发里的中间件，核心概念是 client 和 server
* 多 Agent 设计：可以理解成微服务

openai 设计中让人混淆的 completions
* chat.completions：它支持多轮对话结构、角色、tools/function calling、部分多模态能力、stream。
* completions：老的文本补全接口，它没有现代 chat 的 messages 角色结构，也不适合 tool calling/agent 流程。

关于思考模式
* openai 通过 reasoning_effort 参数控制是否要进行深度思考，取值有 low/medium/high 等
* deepseek 和 claude 中除了也支持这个参数，还额外有 thinking 的开关，当 thinking 开启时，普通请求默认为 high，复杂请求自动设置为 max

组合模式：当 agent 参与较大的工作流程时
* Manager(agents as tools)：中心 agent 拥有对话权，调用被暴露为工具的专业 agent
* Handoffs：初始 agent 在识别用户请求后，将整个对话委托给专家 agent

关于 responses 模式踩的坑，让我误认为是服务商不支持该模式
* 核心原因是服务商支持不完整，在传统 chat 模式中，sdk 会转成 input 结构化表达，但 responses 模式，sdk 会直接采用字符串简写形式（标准要求需同时支持字符串简写和结构化数组），但服务商依旧要求必须用结构化数组，从而导致报错
* 规避了 input 输入问题，但好像还是有其他问题，比如 tool 无法触发，应该也是适配不完整的原因，把 toll_call 当成普通回答了

当你调用 run 时，runner 会开启一个循环
1. 用当前输入调用当前 agent 的模型
2. 审查 LLM 的响应
  * Final output 则直接返回
  * Handoff 切换到新的 agent，保留积累的对话记录，切换到步骤 1
  * Tool calls 执行工具，拼接它们的结果到会话，切换到步骤 1
2. 当达到 maxTurns 时，抛出 MaxTurnsExceededError，除非 maxTurns 为空。

有四种方式将状态带入下一轮，前两者由客户端自行管理，后两者是由 OpenAI 管理，需要使用 OpenAI 服务
* result.history：app-memory，小规模的聊天循环，完全手动控制，任何服务商，下一轮传递 result.history
* session：自建存储，持久聊天状态、可恢复运行、自定义存储，下一轮传递 session 实例
* conversationId：OpenAI Conversations API 可用，跨 workers/services 的服务端状态管理，下一轮传递 conversationId 即可
* previousResponseId：OpenAI Responses API 可用，最简单的服务端管理延续，下一轮传给 result.lastResponseId 即可

> conversationId 和 previousResponseId 是互斥的。当你想要一个可以跨系统共享的命名对话资源时使用 conversationId；当你只想要从一个响应到另一个响应的最便宜的SDK级延续原语时，使用前置 previousResponseId。

Agent 编排主要有两种方式
* 让 LLM 做决定：这利用大型语言模型的智能来规划、推理并决定下一步该采取哪些步骤。
* 代码编排：通过代码确定 agent 的工作流。

Agent 是配备指令 instructions、工具 tools 和交接 handoffs 功能的大型语言模型，这意味着给定一个开放式任务，LLM 可以自主规划如何完成任务，使用工具执行和获取数据，并通过交接将任务委派给子代理。在 Agent SDK 中，主要有两种方式，分别是 Agents as tools 和 Handoffs。

比如一个研究 agent 可能配备以下工具：
* Web search 去在线查找信息
* File search 和 retrieval 去用于检索专有数据和连接
* Computer use 去操作电脑
* Code execution 去做数据分析
* Handoffs 交给擅长规划、报告撰写等的专业 agent

虽然通过 LLM 编排功能强大，但通过代码编排使任务在速度、成本和性能方面更具确定性和可预测性。这里常见的模式有：
* 使用结构化输出 structured outputs 生成格式良好的数据，您可以使用代码进行检查
* 通过将一个 agent 的输出转换为下一个 agent 的输入，来串联多个 agent。例如你可以把写博客文章的任务拆解成一系列步骤——做调研、写大纲、写博客文章、批评，然后改进。
* 在 while 循环中运行执行任务的 agent，搭配一个评估并提供反馈的 agent，直到评估者说输出符合某些标准
* 并行运行多个代理，例如通过像 Promise.all 这样的 JavaScript 原语。当你有多个不相互依赖的任务时，这对速度很有用。

handoffs 本质上是一个 tools 的抽象，比如你 handoff 给一个 Refund Agent，工具名称会是 transfer_to_refund_agent。

Agent 返回值
* 非流式返回 RunResult
* 流式返回 StreamedRunResult
* 都会返回 finalOutput, newItems, interruptions 和 state
* StreamedRunResult 额外返回流控制的属性，如 completed, toStream(), toTextStream(), 和 currentAgent

关于 Session 机制，SDK 提供了 Session 接口，你只需要实现该接口，SDK 自动为你处理其他的逻辑
* 取出之前存储的对话数据，并 prepend 到下一回合
* 每次运行完成后，会持久化新的用户输入和助手输出
* 无论您使用新用户文本调用 run 还是从中断的 RunState 中恢复，都使会话保持可供将来使用

Context 管理
* Local context：代码在运行时可以访问的，如依赖关系或工具所需的数据，通过 RunContext 管理
* Agent/LLM context：大模型在生成时可以看到的数据，表现形式有 instructions/input，通过工具暴露，让 LLM 按需获取数据，以及使用检索或网络搜索工具，从文件、数据库或网络中提取相关数据

OpenAI Agent SDK 支持三种类型的 MCP
* Hosted MCP server tools
* Streamable HTTP MCP servers
* Stdio MCP server：服务器通过标准输入/输出访问（最简单的选项）

对于可流式 HTTP 和 Stdio 服务器，每次代理运行时，可能会调用 list_tools 来发现可用的工具。由于这种往返会增加延迟——尤其是对远程服务器——你可以通过传递 cacheToolsList 为 true 给 MCPServerStdio 或MCPServerStreamableHttp 来缓存，只有在你确定工具列表不会改变时才启用。

OpenAI Agents SDK、Vercel AI SDK、Vercel AI Gateway
* OpenAI Agents SDK：后端 SDK
* Vercel Agents SDK：全栈 AI 应用层 SDK
* Vercel AI Gateway：模型访问网关，提供统一 endpoint 访问多家模型

常见使用组合
* OpenAI Agents SDK -> 直接调用 OpenAI API
* OpenAI Agents SDK -> Vercel AI SDK adapter -> LLM Provider
* Vercel Agents SDK -> Vercel AI Gateway -> OpenAI / Anthropic / Google / xAI / ...

> 实测通过使用 @ai-sdk/deepseek 的方式使用 deepseek，相比直接使用还是避开了一些坑的，比如思考模式报错，不支持 outputType 设置等

Sandbox agents
* 沙箱代理可以利用专用工具和 shell 命令来搜索和操作大型文档集，编辑文件，生成工件，并执行命令。沙箱为模型提供了一个持久的工作区，代理可以代表你完成工作
* 代理所需的数据工作空间由你定义，它可以从 GitHub 仓库、本地文件和目录、合成任务文件、远程文件系统如 S3 或 Azure Blob 存储，以及你提供的其他沙箱输入开始
* 如果你不需要访问文件或需要实时文件系统，使用 Agent 即可；如果 shell 访问只是偶尔需要，添加 hosted shell；如果工作区边界本身是功能的一部分，使用沙箱代理

> SandboxAgent extends Agent, so it is still an Agent. It keeps the usual agent surface such as instructions, tools, handoffs, mcpServers, modelSettings, output types, guardrails, and hooks, and it still runs through the normal run() and Runner APIs.

## Vercel AI SDK
prompt 分为三种，分别对应 prompt，messages，system 三个字段。

tools 也分为三种
* Custom Tools：完全由自己定义，包括 description, input schema, and execute function.
* Provider-Defined Tools：inputSchema 和 description 由 provider 生命，但自己提供 execute 方法，因为执行需要在客户端完成，常见于模型经过专门训练以有效使用这些工具，从而为支持的任务带来更好的性能。
* Provider-Executed Tools：完全在 provider 服务端运行，你只需要配置，由服务端执行，比如 OpenAI 提供的 web search 和 Anthropic 提供的 code execution 功能，这些提供开箱即用的功能，无需搭建基础设施。

Vercel AI SDK 主要有三部分
* AI SDK Core：一个统一的、与服务商无关的 API，用于生成文本、结构化对象和工具调用
* AI SDK UI：一组框架无关的钩子，用于构建聊天和生成式用户界面。
* AI SDK RSC：通过 React 服务器组件（RSC）流式生成用户界面。目前开发处于实验阶段，我们建议使用 AI SDK UI。

推荐安装 vercel ai skill 用于协助 Agent 进行开发
```shell
npx skills add vercel/ai
```

Vercel 还提供了 @ai-sdk/devtools 用于帮助你开发过程中协助排查，它捕获 LLM 请求、响应、工具调用、令牌使用和多步交互，并显示在本地 Web 界面中。

### AI SDK Core
ToolLoopAgent 是使用 AI SDK 构建代理的推荐方法，因为它：
* 减少样板程序——管理循环和消息数组
* 提高可重复使用性——定义一次，在整个应用中使用
* 简化维护——单一地点更新代理配置

对于大多数用例，建议从 ToolLoopAgent 开始。当你需要对复杂结构化工作流程的每个步骤有明确控制时，再使用核心功能（generateText、streamText）。

Workflow 模式
* Sequential Processing：顺序执行
* Routing：根据上下文引导工作
* Parallel Processing：并发执行
* Orchestrator-Worker：主模型（编排器）负责协调专业 Worker 的执行。每个 Worker 针对特定子任务进行优化，而编排者则维护整体上下文并确保结果连贯。这种模式在需要不同专业知识或处理能力的复杂任务中表现出色。
* Evaluator-Optimizer：通过专门的评估步骤，为工作流程添加质量控制，评估中间结果。基于评估，工作流程继续运行、调整参数重试或采取纠正措施。这创造了强大的工作流程，能够自我改进和错误恢复。

Loop Control
* stopWhen 用户控制循环结束
* prepareStep 在每一次循环前执行，用它来修改设置、管理上下文，或基于执行历史实现动态行为。
  * 动态模型选择
  * 上下文管理
  * 工具动态选择
  * 消息修改
  * 访问步骤信息
  * 强制工具调用

Subagents
* Basic Subagent：直接在一个 tool 的 execute 中调用 agent，这很简单，但缺点是无法知道 subagent 的状态
* 如果你想要知道 subagent 状态，则需要将 execute 定义为生成器函数，函数内通过 yield 传递状态
* 可以通过 toModelOutput 定义主 agent 能看到什么，subagent 可能消耗了很多 tokens，这样可以让主 agent 保持专注

SDK 提供了三种内置的停止条件
* stepCountIs(count)：在指定步骤数后停止（默认 20）
* hasToolCall(toolName)：当特定工具被调用时停止
* isLoopFinished()：循环运行直到自然结束

Dynamic Tools 适用于编译时工具 schema 未知的场景。
* MCP Tools without schemas
* 运行时用户自定义函数
* 从外部来源加载的工具

语言模型一次只能处理有限数量的工具，具体取决于模型。为了允许使用大量工具进行静态类型并同时限制模型可用工具，AI SDK 提供了 activeTools 属性。它是一组目前正在激活的工具名称。默认情况下，该值未定义，所有工具均处于激活状态。

MCP
* 通过 createMCPClient 创建 client
* 服务要记得通过 client.close 关闭，对于短暂使用，当响应完成时即关闭，对于长期运行的客户端，确保应用终止时关闭
* MCP Tools：client.tools() 作为 MCP 工具与 AI SDK 工具之间的适配器
* MCP Resource
  * client.listResource() 列举所有的资源
  * client.readResource(options) 读特定资源的数据
  * client.listResourceTemplates() 列举所有的资源模板
* MCP Prompts
  * client.listPrompts() 列举所有的提示词语
  * client.getPrompt(options) 获取指定提示词

当你创建包含工具的提示时，随着工具数量和复杂度的增加，获得好结果可能会变得棘手。以下是一些帮助你获得最佳效果的建议：
* 使用更强的模型
* 保持 tool 数量较低，比如 5 个或更少
* 保持 tool 参数的复杂度较低
* 给工具、参数、参数属性等使用语义上有意义的名称
* 在你的 Zod schema 属性中添加 .describe（"..."），以给模型提示某个属性的用途
* 当 tool 的输出对模型来说可能不清晰且工具之间存在依赖关系时，可以使用 tool 的 description 字段来提供关于工具执行输出的信息
* 在提示词中包含工具调用的输入/输出示例，帮助模型理解如何使用这些工具。请记住，这些工具是用 JSON 对象的，所以示例应该用 JSON
* 对于 tool calls 和 object generation，建议使用 temperature 为 0 以确保确定性和一致的结果

Embeddings
* embed 函数，用于 embed 单个值，这对寻找相似词汇或短语、聚类文本等任务非常有用
* embedMany 函数，用于一次性处理多个值
* cosineSimilarity 函数，用于计算相似度

Reranking
* 一种通过根据文档与查询的相关性重新排序一组文档来提高搜索相关性的技术，与基于嵌入的相似性搜索不同，重新排序模型经过专门训练以理解查询与文档之间的关系，通常能产生更准确的相关性评分。
* 提供了 rerank 函数根据文档与查询的相关性重新排序。

Image Generation
* 直接提供了 generateImage 函数出图，只需将 model 切换成出图的模型即可
* 完成后可以用 base64 或者 unit8Array 访问图片数据

Transcription & Speech
* 提供 transcribe 函数将语音转文字，只需将 model 设置为语音模型，audio 设施为音频（Uint8Array, ArrayBuffer, Buffer, base64, URL）
* 提供 generateSpeech 将文字转语音，用 base64 或 uint8Array 访问语音数据

Video Generation
* 提供 generateVideo 生成视频，将 model 设置为视频模型
* 通过 base64 或 uint8Array 访问视频数据

我觉得 Vercel 设计的东西真挺不错，简洁又全面
* Testing：帮助你写单元测试
* Telemetry：检测应用运行情况
* DevTools：可以查看 agent 运行情况
* Event Callbacks

### AI SDK UI
useChat
* messages
  * message.role
  * message.parts
* sendMessage(option)
  * option.text
  * option.files
* status: submitted/streaming/ready/error
* stop
* error
* regenerate
* onFinished/onError/onData

Chat Message Persistence
* 可以使用 database 或 cloud storage service
* 使用 toUIMessageStreamResponse 中 onFinished 钩子实现消息存储
* 一旦你实现了消息持久化，你可能只想向服务器发送最后一条消息。这减少了每次请求发送到服务器的数据量，并能提升性能。

Resume Streams
* 借助 redis + resumable-stream 包
* 在可恢复流中，useChat 提供的 stop 只是断开连接，而不是停止生成的请求，因此你需要自定义停止功能

Tool Usage 支持三种类型的工具
* 自动执行服务端工具
* 自动执行客户端工具
* 需要用户操作的工具，如确认对话框

Streaming Custom Data
* createUIMessageStream
* createUIMessageStreamResponse
* pipeUIMessageStreamToResponse

Message Metadata vs Data Parts
* Message Metadata：最适合用于描述整个消息的消息层级信息，通过 message.metadata 访问
* Data Parts：最适合流式动态任意数据，通过 message.parts 访问