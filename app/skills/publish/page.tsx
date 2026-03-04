import Link from "next/link";

export default function PublishSkillPage() {
  return (
    <main className="container">
      <h1 className="title">发布技能</h1>
      <p className="subtitle">
        这里模拟发布技能流程。你可以在填写过程中随时让智能体协助你打磨卖点和成交表达。
      </p>

      <section className="card" style={{ marginTop: 24 }}>
        <div className="form-row">
          <label htmlFor="skill-name">技能标题</label>
          <input id="skill-name" className="input" defaultValue="脱口秀段子创作与舞台表达" />
        </div>
        <div className="form-row">
          <label htmlFor="skill-desc">技能描述</label>
          <textarea
            id="skill-desc"
            className="textarea"
            defaultValue="提供脱口秀段子创作、现场表演结构优化、商业演出经验拆解。"
          />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn" href="/agent?entry=publish">
            让智能体帮我优化
          </Link>
          <Link className="btn ghost" href="/">
            返回首页
          </Link>
        </div>
      </section>
    </main>
  );
}
