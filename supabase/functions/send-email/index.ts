import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Validation constants
const VALID_EMAIL_TYPES = ["attendance_reminder", "event_notification", "team_announcement", "custom"] as const;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailRequest {
  to: string | string[];
  subject: string;
  type: typeof VALID_EMAIL_TYPES[number];
  data: {
    recipientName?: string;
    eventName?: string;
    eventDate?: string;
    eventTime?: string;
    eventLocation?: string;
    teamName?: string;
    message?: string;
  };
}

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

function validateEmailRequest(body: unknown): EmailRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const { to, subject, type, data } = body as Record<string, unknown>;

  // Validate 'to' field
  if (!to) {
    throw new Error('Recipient email(s) required');
  }
  
  const toArray = Array.isArray(to) ? to : [to];
  if (toArray.length === 0 || toArray.length > 50) {
    throw new Error('Must have between 1 and 50 recipients');
  }
  
  for (const email of toArray) {
    if (typeof email !== 'string' || !validateEmail(email)) {
      throw new Error(`Invalid email address: ${email}`);
    }
  }

  // Validate subject
  if (typeof subject !== 'string' || subject.trim().length === 0) {
    throw new Error('Subject is required');
  }
  if (subject.length > MAX_SUBJECT_LENGTH) {
    throw new Error(`Subject must be ${MAX_SUBJECT_LENGTH} characters or less`);
  }

  // Validate type
  if (!VALID_EMAIL_TYPES.includes(type as typeof VALID_EMAIL_TYPES[number])) {
    throw new Error(`Type must be one of: ${VALID_EMAIL_TYPES.join(', ')}`);
  }

  // Validate data object
  if (!data || typeof data !== 'object') {
    throw new Error('Data object is required');
  }

  const dataObj = data as Record<string, unknown>;

  // Validate optional string fields in data
  const stringFields = ['recipientName', 'eventName', 'eventDate', 'eventTime', 'eventLocation', 'teamName'];
  for (const field of stringFields) {
    if (dataObj[field] !== undefined && dataObj[field] !== null) {
      if (typeof dataObj[field] !== 'string') {
        throw new Error(`${field} must be a string`);
      }
      if ((dataObj[field] as string).length > MAX_NAME_LENGTH) {
        throw new Error(`${field} must be ${MAX_NAME_LENGTH} characters or less`);
      }
    }
  }

  // Validate message with higher limit
  if (dataObj.message !== undefined && dataObj.message !== null) {
    if (typeof dataObj.message !== 'string') {
      throw new Error('Message must be a string');
    }
    if ((dataObj.message as string).length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message must be ${MAX_MESSAGE_LENGTH} characters or less`);
    }
  }

  return {
    to: Array.isArray(to) ? to : [to],
    subject: subject.trim(),
    type: type as typeof VALID_EMAIL_TYPES[number],
    data: {
      recipientName: typeof dataObj.recipientName === 'string' ? dataObj.recipientName.trim() : undefined,
      eventName: typeof dataObj.eventName === 'string' ? dataObj.eventName.trim() : undefined,
      eventDate: typeof dataObj.eventDate === 'string' ? dataObj.eventDate.trim() : undefined,
      eventTime: typeof dataObj.eventTime === 'string' ? dataObj.eventTime.trim() : undefined,
      eventLocation: typeof dataObj.eventLocation === 'string' ? dataObj.eventLocation.trim() : undefined,
      teamName: typeof dataObj.teamName === 'string' ? dataObj.teamName.trim() : undefined,
      message: typeof dataObj.message === 'string' ? dataObj.message.trim() : undefined,
    },
  };
}

function generateEmailHtml(type: EmailRequest["type"], data: EmailRequest["data"]): string {
  const styles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
      .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
      .footer { background: #374151; color: #9ca3af; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; text-align: center; }
      .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      .event-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3b82f6; }
      h1 { margin: 0; font-size: 24px; }
      h2 { color: #1f2937; margin-top: 0; }
    </style>
  `;

  switch (type) {
    case "attendance_reminder":
      return `
        <!DOCTYPE html>
        <html>
        <head>${styles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Attendance Reminder</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.recipientName || "Team Member"},</h2>
              <p>This is a friendly reminder about the upcoming event:</p>
              <div class="event-details">
                <strong>${data.eventName || "Team Event"}</strong><br>
                📅 ${data.eventDate || "TBD"} at ${data.eventTime || "TBD"}<br>
                📍 ${data.eventLocation || "TBD"}
              </div>
              <p>Please make sure to confirm your attendance so we can plan accordingly.</p>
              ${data.message ? `<p><strong>Note:</strong> ${data.message}</p>` : ""}
            </div>
            <div class="footer">
              ${data.teamName || "Your Team"} • Sent via Team Manager
            </div>
          </div>
        </body>
        </html>
      `;

    case "event_notification":
      return `
        <!DOCTYPE html>
        <html>
        <head>${styles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🗓️ Event Notification</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.recipientName || "Team Member"},</h2>
              <p>You have an upcoming event:</p>
              <div class="event-details">
                <strong>${data.eventName || "Team Event"}</strong><br>
                📅 ${data.eventDate || "TBD"} at ${data.eventTime || "TBD"}<br>
                📍 ${data.eventLocation || "TBD"}
              </div>
              ${data.message ? `<p>${data.message}</p>` : ""}
              <p>See you there!</p>
            </div>
            <div class="footer">
              ${data.teamName || "Your Team"} • Sent via Team Manager
            </div>
          </div>
        </body>
        </html>
      `;

    case "team_announcement":
      return `
        <!DOCTYPE html>
        <html>
        <head>${styles}</head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📢 Team Announcement</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.recipientName || "Team Member"},</h2>
              <p>${data.message || "You have a new message from your team."}</p>
            </div>
            <div class="footer">
              ${data.teamName || "Your Team"} • Sent via Team Manager
            </div>
          </div>
        </body>
        </html>
      `;

    case "custom":
      // Security: customHtml is no longer supported to prevent XSS/phishing attacks
      // Only use predefined templates with sanitized data
      return `
        <!DOCTYPE html>
        <html>
        <head>${styles}</head>
        <body>
          <div class="container">
            <div class="content">
              <p>${(data.message || "You have a new message.").replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
          </div>
        </body>
        </html>
      `;

    default:
      return `<p>${data.message || "You have a new notification."}</p>`;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    const rawBody = await req.json();
    const { to, subject, type, data } = validateEmailRequest(rawBody);

    console.log(`Sending ${type} email to:`, to);

    const html = generateEmailHtml(type, data);

    // Use Resend API directly via fetch
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Team Manager <onboarding@resend.dev>",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    const status = errorMessage.includes('required') || errorMessage.includes('must be') || errorMessage.includes('Invalid') ? 400 : 500;
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
