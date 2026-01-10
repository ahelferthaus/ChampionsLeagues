import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainNavigation } from '@/components/MainNavigation';
import { TeamResourcesCard } from '@/components/TeamResourcesCard';
import { LoadDemoDataButton } from '@/components/LoadDemoDataButton';
import { useTeamResources } from '@/hooks/useTeamResources';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, FileText, Link2, Calendar } from 'lucide-react';

export default function Resources() {
  const { user, loading: authLoading, roles } = useAuth();
  const navigate = useNavigate();
  
  // For demo, we use a placeholder team ID - in production this would come from context
  const { resources, loading, addResource, deleteResource, updateResource, refetch } = useTeamResources();

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

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Resources</h1>
            <p className="text-muted-foreground">
              Access shared documents, links, and team information
            </p>
          </div>
          <LoadDemoDataButton userId={user.id} onComplete={refetch} />
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Shared with team</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Forms & files</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">External Links</CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Google Drive, etc.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Tournament links</p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Card */}
        <TeamResourcesCard
          resources={resources}
          isManager={isManager}
          onAddResource={addResource}
          onDeleteResource={deleteResource}
          onUpdateResource={updateResource}
          teamId="demo-team-id"
        />
      </main>
    </div>
  );
}
