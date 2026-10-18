/**
 * Takes a contact message and forwards it to CONTACT_WEBHOOK_URL (Slack, Zapier, Formspree or
 * any endpoint that accepts JSON). Without that set, it says so rather than pretending it sent.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 320);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  const topic = String(body.topic ?? "").trim().slice(0, 60);
  // the hidden "website" field only bots fill in
  if (String(body.website ?? "").trim()) return Response.json({ ok: true });
  if (!name || !EMAIL.test(email) || !message) {
    return Response.json({ ok: false, error: "Please fill in your name, a valid email and a message." }, { status: 422 });
  }

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!hook) return Response.json({ ok: false, error: "Contact form is not connected yet." }, { status: 503 });

  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      topic,
      message,
      text: `New message${topic ? ` about ${topic}` : ""} from ${name} <${email}>:\n\n${message}`,
      source: "contact",
    }),
  }).catch(() => null);
  if (!res || !res.ok) return Response.json({ ok: false, error: "Could not deliver the message." }, { status: 502 });
  return Response.json({ ok: true });
}
