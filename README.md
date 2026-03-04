# digitalize_your_skills

可运行的 MVP Demo：个人主页入口 + 发布技能入口 + DeepSeek 在线智能体对话。

## 功能

- 首页展示三个入口：个人主页、发布技能、直接聊天。
- 个人主页与发布技能页都可跳转到智能体聊天页。
- 聊天页支持：
  - 多轮对话
  - `deepseek-chat` / `deepseek-reasoner` 模型切换
  - 两种角色：`校友技能交换助手` 与 `脱口秀段子智能体（胡不通）`
- 服务端 API `POST /api/chat` 通过 `DEEPSEEK_API_KEY` 调用线上 DeepSeek 模型。

## 快速开始

1. 安装依赖

   npm install

2. 配置环境变量

   cp .env.example .env.local
   # 然后在 .env.local 中填写 DEEPSEEK_API_KEY

3. 启动开发环境

   npm run dev

4. 浏览器访问

   http://localhost:3000

## 构建检查

- `npm run typecheck`
- `npm run build`

## 后续扩展建议

- 对接用户体系和技能发布真实数据。
- 增加会话存档、反馈闭环和运营看板。
- 在智能体层增加“线下交换推进”目标追踪（例如 10 次交换达成率）。