import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = { name?: string; email?: string; message?: string; topic?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  const topic = clean(body.topic, 80);

  if (name.length < 2 || !emailRe.test(email) || message.length < 10) {
    return NextResponse.json({ ok: false, error: "Validation failed" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  // No provider configured — accept the message and log it (useful in development).
  if (!key || !to) {
    console.info("[contact] New message (email delivery not configured):", { name, email, topic });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Portfolio enquiry — ${topic || "General"} — ${name}`,
      html: `<p><strong>${escape(name)}</strong> &lt;${escape(email)}&gt;</p><p><em>${escape(topic)}</em></p><p style="white-space:pre-wrap">${escape(message)}</p>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return NextResponse.json({ ok: false, error: "Email provider error" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
