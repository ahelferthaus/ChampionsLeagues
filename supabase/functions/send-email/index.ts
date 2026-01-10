import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  subject: string;
  type: "attendance_reminder" | "event_notification" | "team_announcement" | "custom";
  data: {
    recipientName?: string;
    eventName?: string;
    eventDate?: string;
    eventTime?: string;
    eventLocation?: string;
    teamName?: string;
    message?: string;
    customHtml?: string;
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
      return data.customHtml || `
        <!DOCTYPE html>
        <html>
        <head>${styles}</head>
        <body>
          <div class="container">
            <div class="content">
              <p>${data.message || "You have a new message."}</p>
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
    const { to, subject, type, data }: EmailRequest = await req.json();

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
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
