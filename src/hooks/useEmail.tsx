import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type EmailType = "attendance_reminder" | "event_notification" | "team_announcement" | "custom";

interface EmailData {
  recipientName?: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  teamName?: string;
  message?: string;
  customHtml?: string;
}

export function useEmail() {
  const { toast } = useToast();

  const sendEmail = async (
    to: string | string[],
    subject: string,
    type: EmailType,
    data: EmailData
  ) => {
    try {
      const { data: response, error } = await supabase.functions.invoke("send-email", {
        body: { to, subject, type, data },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email sent",
        description: "Your email was sent successfully.",
      });

      return response;
    } catch (error: any) {
      console.error("Failed to send email:", error);
      toast({
        title: "Email failed",
        description: error.message || "Failed to send email. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendAttendanceReminder = async (
    to: string | string[],
    eventName: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    teamName: string,
    recipientName?: string
  ) => {
    return sendEmail(
      to,
      `Attendance Reminder: ${eventName}`,
      "attendance_reminder",
      {
        recipientName,
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        teamName,
      }
    );
  };

  const sendEventNotification = async (
    to: string | string[],
    eventName: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    teamName: string,
    message?: string
  ) => {
    return sendEmail(
      to,
      `Event: ${eventName}`,
      "event_notification",
      {
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        teamName,
        message,
      }
    );
  };

  const sendTeamAnnouncement = async (
    to: string | string[],
    subject: string,
    message: string,
    teamName: string
  ) => {
    return sendEmail(to, subject, "team_announcement", {
      message,
      teamName,
    });
  };

  return {
    sendEmail,
    sendAttendanceReminder,
    sendEventNotification,
    sendTeamAnnouncement,
  };
}
