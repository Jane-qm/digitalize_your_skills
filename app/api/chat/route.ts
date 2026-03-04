import { NextResponse } from "next/server";

type IncomingMessage = {
  role: string;
  content: string;
};

type IncomingBody = {
  model?: string;
  preset?: "alumni" | "standup";
  entry?: string;
  messages?: IncomingMessage[];
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

const BASE_PROMPT =
  "你是数字化技能社区助手。回答应简洁、可执行，优先给出下一步动作，帮助用户推进线上沟通与线下技能交换。";

const PRESET_PROMPT: Record<NonNullable<IncomingBody["preset"]>, string> = {
  alumni: "你专注于校友技能交换场景，帮助用户快速匹配人、事、时间。",
  standup:
    "你扮演胡不通：FREELANCER，笑对人生，脱口秀演员，行之喜剧主理人，商业演出1000+场，原互联网公司高管。输出要有舞台节奏和可落地动作。"
};

const ENTRY_PROMPT: Record<string, string> = {
  profile: "用户来自个人主页入口。",
  publish: "用户来自发布技能入口。重点协助优化技能描述、定价和成交表达。",
  direct: "用户来自直接聊天入口。"
};

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "服务端未配置 DEEPSEEK_API_KEY，请先在 .env.local 中设置。"
      },
      { status: 500 }
    );
  }

  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON。" }, { status: 400 });
  }

  const cleanedMessages = (body.messages ?? [])
    .filter((item) => (item.role === "user" || item.role === "assistant") && item.content?.trim())
    .map((item) => ({
      role: item.role as "user" | "assistant",
      content: item.content.trim()
    }));

  if (cleanedMessages.length === 0) {
    return NextResponse.json({ error: "至少提供一条有效消息。" }, { status: 400 });
  }

  const preset = body.preset ?? "alumni";
  const entry = body.entry ?? "direct";
  const model = body.model ?? "deepseek-chat";
  const systemPrompt = [BASE_PROMPT, PRESET_PROMPT[preset], ENTRY_PROMPT[entry] ?? ENTRY_PROMPT.direct].join(" ");

  const endpoint = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com/chat/completions";

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        stream: false,
        messages: [{ role: "system", content: systemPrompt }, ...cleanedMessages]
      }),
      cache: "no-store"
    });

    const payload = (await upstream.json()) as DeepSeekResponse;

    if (!upstream.ok) {
      const message = payload.error?.message ?? "DeepSeek 上游调用失败。";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const reply = payload.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: "DeepSeek 未返回有效内容。" }, { status: 502 });
    }

    return NextResponse.json({
      reply
    });
  } catch {
    return NextResponse.json(
      {
        error: "调用 DeepSeek 接口异常，请检查网络或 DEEPSEEK_BASE_URL 配置。"
      },
      { status: 502 }
    );
  }
}
