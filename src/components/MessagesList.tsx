import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users } from 'lucide-react';
import { Message } from '@/hooks/useMessages';

interface MessagesListProps {
  messages: Message[];
  loading: boolean;
}

export function MessagesList({ messages, loading }: MessagesListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground">
            Team messages will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{message.subject}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span>{format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}</span>
                  {message.is_group_message && (
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      Team
                    </Badge>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {message.body}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
