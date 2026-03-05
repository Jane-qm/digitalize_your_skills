import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="container">
      <h1 className="title">个人主页</h1>
      <p className="subtitle">
        这里模拟你已搭好的个人主页。用户可直接点击智能体入口，快速发起技能交流。
      </p>

      <section className="card" style={{ marginTop: 24 }}>
        <h3>你的身份卡</h3>
        <p>
          方向：产品增长 / AI 应用落地 / 技能数字化
          <br />
          目标：完成 10 次线下技能交换验证，沉淀可推广模板。
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn" href="/agent?entry=profile">
            进入智能体聊一聊
          </Link>
          <Link className="btn ghost" href="/">
            返回首页
          </Link>
        </div>
      </section>
    </main>
  );
}
