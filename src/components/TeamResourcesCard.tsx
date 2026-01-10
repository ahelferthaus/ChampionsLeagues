import { useState } from 'react';
import { ExternalLink, FolderOpen, FileText, Calendar, ClipboardList, Plus, Star, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { TeamResource } from '@/hooks/useTeamResources';

interface TeamResourcesCardProps {
  resources: TeamResource[];
  isManager?: boolean;
  onAddResource?: (resource: Omit<TeamResource, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<boolean>;
  onDeleteResource?: (id: string) => Promise<boolean>;
  onUpdateResource?: (id: string, updates: Partial<TeamResource>) => Promise<boolean>;
  teamId?: string;
}

const resourceTypeConfig = {
  link: { icon: ExternalLink, label: 'Link', color: 'bg-blue-100 text-blue-700' },
  google_drive: { icon: FolderOpen, label: 'Google Drive', color: 'bg-green-100 text-green-700' },
  document: { icon: FileText, label: 'Document', color: 'bg-purple-100 text-purple-700' },
  event_link: { icon: Calendar, label: 'Event', color: 'bg-orange-100 text-orange-700' },
  form: { icon: ClipboardList, label: 'Form', color: 'bg-pink-100 text-pink-700' },
};

// Demo resources for display
const demoResources: TeamResource[] = [
  {
    id: '1',
    team_id: 'demo',
    title: 'Team Photos & Videos',
    description: 'Shared folder with game photos and highlight videos',
    resource_type: 'google_drive',
    url: 'https://drive.google.com/drive/folders/example',
    icon: null,
    category: 'Media',
    sort_order: 0,
    is_pinned: true,
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    team_id: 'demo',
    title: 'Spring Tournament Registration',
    description: 'Register for the 2026 Spring Classic tournament',
    resource_type: 'event_link',
    url: 'https://example.com/tournament',
    icon: null,
    category: 'Events',
    sort_order: 1,
    is_pinned: true,
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    team_id: 'demo',
    title: 'Team Roster Spreadsheet',
    description: 'Player contact info and emergency contacts',
    resource_type: 'google_drive',
    url: 'https://docs.google.com/spreadsheets/example',
    icon: null,
    category: 'Admin',
    sort_order: 2,
    is_pinned: false,
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    team_id: 'demo',
    title: 'Travel Code of Conduct',
    description: 'Required form for all travel tournaments',
    resource_type: 'form',
    url: 'https://example.com/form',
    icon: null,
    category: 'Forms',
    sort_order: 3,
    is_pinned: false,
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    team_id: 'demo',
    title: 'Club Website',
    description: 'Official Albion SC website',
    resource_type: 'link',
    url: 'https://albionsc.com',
    icon: null,
    category: 'Club',
    sort_order: 4,
    is_pinned: false,
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function TeamResourcesCard({
  resources,
  isManager = false,
  onAddResource,
  onDeleteResource,
  onUpdateResource,
  teamId,
}: TeamResourcesCardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    resource_type: 'link' as TeamResource['resource_type'],
    url: '',
    category: '',
    is_pinned: false,
  });

  // Use demo resources if none provided
  const displayResources = resources.length > 0 ? resources : demoResources;

  // Group resources by category
  const groupedResources = displayResources.reduce((acc, resource) => {
    const category = resource.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, TeamResource[]>);

  // Sort to show pinned first
  const pinnedResources = displayResources.filter(r => r.is_pinned);

  const handleAddResource = async () => {
    if (!onAddResource || !teamId) return;

    const success = await onAddResource({
      ...newResource,
      team_id: teamId,
      icon: null,
      sort_order: displayResources.length,
    });

    if (success) {
      toast.success('Resource added successfully');
      setIsAddDialogOpen(false);
      setNewResource({
        title: '',
        description: '',
        resource_type: 'link',
        url: '',
        category: '',
        is_pinned: false,
      });
    } else {
      toast.error('Failed to add resource');
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDeleteResource) return;
    const success = await onDeleteResource(id);
    if (success) {
      toast.success('Resource deleted');
    } else {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Team Resources
            </CardTitle>
            <CardDescription>
              Quick access to team documents, links, and shared resources
            </CardDescription>
          </div>
          {isManager && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Resource</DialogTitle>
                  <DialogDescription>
                    Add a link, document, or folder to share with the team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      placeholder="Team Photos Folder"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Resource Type</Label>
                    <Select
                      value={newResource.resource_type}
                      onValueChange={(value) => setNewResource({ ...newResource, resource_type: value as TeamResource['resource_type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">General Link</SelectItem>
                        <SelectItem value="google_drive">Google Drive</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="event_link">Event Link</SelectItem>
                        <SelectItem value="form">Form</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newResource.category}
                      onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                      placeholder="Media, Forms, Events, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={newResource.description}
                      onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                      placeholder="Brief description of this resource"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddResource} disabled={!newResource.title || !newResource.url}>
                    Add Resource
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Pinned Resources */}
        {pinnedResources.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Pinned
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {pinnedResources.map((resource) => {
                const config = resourceTypeConfig[resource.resource_type];
                const Icon = config.icon;

                return (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {resource.title}
                      </p>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {resource.description}
                        </p>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* All Resources by Category */}
        <div className="space-y-6">
          {Object.entries(groupedResources).map(([category, categoryResources]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{category}</h4>
              <div className="space-y-2">
                {categoryResources.filter(r => !r.is_pinned).map((resource) => {
                  const config = resourceTypeConfig[resource.resource_type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={resource.id}
                      className="group flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate group-hover:text-primary transition-colors">
                          {resource.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {config.label}
                        </Badge>
                      </a>
                      {isManager && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(resource.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {displayResources.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resources added yet</p>
            {isManager && (
              <p className="text-sm">Click "Add Resource" to share links with your team</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
