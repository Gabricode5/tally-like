type Provider = 'postmark' | 'sendgrid';

const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER || 'postmark') as Provider;
const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY || '';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';

export type EmailMessage = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

async function sendWithPostmark(msg: EmailMessage) {
  const resp = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'X-Postmark-Server-Token': POSTMARK_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      From: 'no-reply@yourapp.test',
      To: msg.to,
      Subject: msg.subject,
      TextBody: msg.text,
      HtmlBody: msg.html,
      MessageStream: 'outbound',
    }),
  });
  if (!resp.ok) {
    throw new Error(`POSTMARK_ERROR_${resp.status}`);
  }
}

async function sendWithSendgrid(msg: EmailMessage) {
  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: msg.to }] }],
      from: { email: 'no-reply@yourapp.test', name: 'Your App' },
      subject: msg.subject,
      content: [
        msg.html ? { type: 'text/html', value: msg.html } : undefined,
        msg.text ? { type: 'text/plain', value: msg.text } : undefined,
      ].filter(Boolean),
    }),
  });
  if (resp.status >= 400) {
    throw new Error(`SENDGRID_ERROR_${resp.status}`);
  }
}

export async function sendEmail(msg: EmailMessage) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  if (EMAIL_PROVIDER === 'postmark') {
    return sendWithPostmark(msg);
  }
  return sendWithSendgrid(msg);
}

export function submissionNotificationTemplate(formTitle: string, count: number) {
  const subject = `New submission on "${formTitle}"`;
  const text = `You received a new submission on "${formTitle}". Total submissions: ${count}.`;
  const html = `<p>You received a new submission on "<strong>${formTitle}</strong>".</p><p>Total submissions: <strong>${count}</strong>.</p>`;
  return { subject, text, html };
}

type Lang = 'en' | 'fr';

const templates: Record<Lang, Record<string, (vars: Record<string, string | number>) => { subject: string; text: string; html: string }>> = {
  en: {
    submission: ({ title, count }) => ({
      subject: `New submission on "${title}"`,
      text: `You received a new submission on "${title}". Total submissions: ${count}.`,
      html: `<p>You received a new submission on "<strong>${title}</strong>".</p><p>Total submissions: <strong>${count}</strong>.</p>`,
    }),
  },
  fr: {
    submission: ({ title, count }) => ({
      subject: `Nouvelle réponse sur "${title}"`,
      text: `Vous avez reçu une nouvelle réponse sur "${title}". Total: ${count}.`,
      html: `<p>Vous avez reçu une nouvelle réponse sur "<strong>${title}</strong>".</p><p>Total: <strong>${count}</strong>.</p>`,
    }),
  },
};

export function renderTemplate(lang: Lang, templateId: 'submission', vars: Record<string, string | number>) {
  const l = (lang in templates ? lang : 'en') as Lang;
  return templates[l][templateId](vars);
}

export async function sendTemplate(to: string, lang: Lang, templateId: 'submission', vars: Record<string, string | number>) {
  const { subject, text, html } = renderTemplate(lang, templateId, vars);
  return sendEmail({ to, subject, text, html });
}


