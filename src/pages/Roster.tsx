import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainNavigation } from '@/components/MainNavigation';
import { RosterTable } from '@/components/RosterTable';
import { ComposeMessageDialog } from '@/components/ComposeMessageDialog';
import { MessagesList } from '@/components/MessagesList';
import { LoadDemoDataButton } from '@/components/LoadDemoDataButton';
import { useMessages } from '@/hooks/useMessages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Mail } from 'lucide-react';

export default function Roster() {
  const { user, loading: authLoading, roles } = useAuth();
  const navigate = useNavigate();
  const { messages, loading: messagesLoading, sendMessage, refetch } = useMessages();

  const isManager = roles.includes('club_admin') || roles.includes('team_manager');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const handleSendMessage = async (subject: string, body: string) => {
    // For demo, we'll use a placeholder team ID
    return sendMessage('demo-team-id', user.id, subject, body);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Roster</h1>
            <p className="text-muted-foreground">
              Manage players, staff, and team communications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LoadDemoDataButton userId={user.id} onComplete={refetch} />
            {isManager && (
              <ComposeMessageDialog onSend={handleSendMessage} />
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Active roster members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coaches & Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Team leadership</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
              <p className="text-xs text-muted-foreground">Team communications</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Roster and Messages */}
        <Tabs defaultValue="roster" className="space-y-6">
          <TabsList>
            <TabsTrigger value="roster" className="gap-2">
              <Users className="h-4 w-4" />
              Roster
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roster">
            <RosterTable showDemoData={true} />
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-4">
              {isManager && (
                <div className="flex justify-end">
                  <ComposeMessageDialog onSend={handleSendMessage} />
                </div>
              )}
              <MessagesList messages={messages} loading={messagesLoading} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
