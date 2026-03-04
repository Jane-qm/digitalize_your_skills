"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const PRESETS = {
  alumni: {
    label: "校友技能交换助手",
    context:
      "你是技能交换社区的助手，目标是帮助用户高质量连接校友、明确需求、快速推进到线下见面和技能交换。"
  },
  standup: {
    label: "脱口秀段子智能体（胡不通）",
    context:
      "你扮演胡不通：FREELANCER，笑对人生，脱口秀演员，行之喜剧主理人，商业演出1000+场，原互联网公司高管。请给出有舞台感、节奏感且可落地的段子与表达建议。"
  }
} as const;

const ENTRY_TEXT: Record<string, string> = {
  profile: "来自【个人主页】入口，可先问如何与我进行技能交换。",
  publish: "来自【发布技能】入口，可先让助手优化技能文案和定价。",
  direct: "你现在是直接进入智能体聊天场景。"
};

export default function AgentPage() {
  return (
    <Suspense
      fallback={
        <main className="container">
          <h1 className="title">智能体对话 Demo</h1>
          <p className="subtitle">页面加载中...</p>
        </main>
      }
    >
      <AgentPageContent />
    </Suspense>
  );
}

function AgentPageContent() {
  const searchParams = useSearchParams();
  const entry = searchParams.get("entry") ?? "direct";

  const [model, setModel] = useState("deepseek-chat");
  const [preset, setPreset] = useState<keyof typeof PRESETS>("alumni");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const entryHint = useMemo(() => ENTRY_TEXT[entry] ?? ENTRY_TEXT.direct, [entry]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `你好，我是${PRESETS[preset].label}。${entryHint}`
      }
    ]);
  }, [entryHint, preset]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          entry,
          preset,
          messages: nextMessages
        })
      });
      const data = (await response.json()) as { error?: string; reply?: string };
      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "调用失败，请稍后再试。");
      }
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "未知错误";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: `已清空会话。我仍是${PRESETS[preset].label}，可以继续帮你。`
      }
    ]);
    setError("");
  };

  return (
    <main className="container">
      <h1 className="title">智能体对话 Demo</h1>
      <p className="subtitle">
        已接入 DeepSeek 在线模型。当前入口：{entryHint}
      </p>

      <section className="chat-wrap">
        <div className="chat-toolbar">
          <div className="form-row" style={{ marginBottom: 0 }}>
            <label htmlFor="model-select">模型</label>
            <select
              id="model-select"
              className="select"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              disabled={loading}
            >
              <option value="deepseek-chat">deepseek-chat（通用对话）</option>
              <option value="deepseek-reasoner">deepseek-reasoner（推理增强）</option>
            </select>
          </div>

          <div className="form-row" style={{ marginBottom: 0 }}>
            <label htmlFor="preset-select">智能体角色</label>
            <select
              id="preset-select"
              className="select"
              value={preset}
              onChange={(event) => setPreset(event.target.value as keyof typeof PRESETS)}
              disabled={loading}
            >
              <option value="alumni">{PRESETS.alumni.label}</option>
              <option value="standup">{PRESETS.standup.label}</option>
            </select>
          </div>
        </div>

        <div className="chat-list">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
              {message.content}
            </div>
          ))}
          {loading && <div className="bubble assistant">正在调用 DeepSeek，请稍候...</div>}
        </div>

        <div className="chat-input-wrap">
          <textarea
            className="textarea"
            value={input}
            placeholder="输入你想讨论的问题，例如：如何在 2 周内完成 10 次技能交换？"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
          />

          <div className="chat-actions">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn" type="button" onClick={() => void sendMessage()} disabled={loading}>
                发送
              </button>
              <button className="btn ghost" type="button" onClick={clearConversation} disabled={loading}>
                清空对话
              </button>
              <Link className="btn ghost" href="/">
                返回首页
              </Link>
            </div>
            <span className="hint">{loading ? "请求中..." : "Enter 发送，Shift + Enter 换行"}</span>
          </div>

          {error && (
            <p className="hint error">
              {error}
              <br />
              请确认已在环境变量中配置 DEEPSEEK_API_KEY。
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
