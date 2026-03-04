import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <h1 className="title">Digitalize Your Skills · Demo</h1>
      <p className="subtitle">
        先打通基础能力：入口联通、在线对话、可切模型，然后再叠加驯化与技能交换运营。
      </p>

      <section className="grid">
        <article className="card">
          <h3>个人主页入口</h3>
          <p>从个人主页进入智能体，进行技能问答、交换建议和合作沟通。</p>
          <Link className="btn" href="/profile">
            打开个人主页
          </Link>
        </article>

        <article className="card">
          <h3>发布技能入口</h3>
          <p>在发布技能场景下直接呼起智能体，协助润色内容与报价策略。</p>
          <Link className="btn" href="/skills/publish">
            打开发布技能页
          </Link>
        </article>

        <article className="card">
          <h3>直接进入智能体</h3>
          <p>当前 demo 支持 DeepSeek 在线模型，确保今天就能对话可用。</p>
          <Link className="btn" href="/agent">
            开始聊天
          </Link>
        </article>
      </section>

      <h2 className="section-title">当前 demo 目标</h2>
      <div className="tag-list">
        <span className="tag">可交流（多轮对话）</span>
        <span className="tag">可调用线上 DeepSeek</span>
        <span className="tag">入口从个人页/发布页联通</span>
        <span className="tag">支持技能交换场景提示词</span>
      </div>
    </main>
  );
}
