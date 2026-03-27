import { useState } from 'react';
import { Check, X, HelpCircle, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trip } from '@/hooks/useTrips';
import { useRoster } from '@/hooks/useRoster';
import { useTripRoster, TripRosterStatus } from '@/hooks/useTripRoster';

interface TripRosterPanelProps {
  trip: Trip;
  teamId: string;
}

const STATUS_CONFIG: Record<TripRosterStatus, { label: string; color: string; icon: React.ReactNode }> = {
  going: { label: 'Going', color: 'bg-green-100 text-green-800 border-green-200', icon: <Check className="h-3.5 w-3.5" /> },
  not_going: { label: 'Not Going', color: 'bg-red-100 text-red-800 border-red-200', icon: <X className="h-3.5 w-3.5" /> },
  maybe: { label: 'Maybe', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <HelpCircle className="h-3.5 w-3.5" /> },
  invited: { label: 'Invited', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <UserPlus className="h-3.5 w-3.5" /> },
};

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function TripRosterPanel({ trip, teamId }: TripRosterPanelProps) {
  const { roster, loading: rosterLoading } = useRoster(teamId);
  const { entries, loading: entriesLoading, upsertStatus, addAllMembers, removeEntry } = useTripRoster(trip.id, teamId);
  const [tab, setTab] = useState<'all' | 'going' | 'not_going' | 'maybe' | 'invited'>('all');

  const loading = rosterLoading || entriesLoading;

  const getEntry = (memberId: string) => entries.find(e => e.team_member_id === memberId) ?? null;

  const coaches = roster.filter(m => m.role === 'coach' || m.role === 'manager' || m.role === 'admin');
  const players = roster.filter(m => m.role === 'player' || (!coaches.find(c => c.id === m.id)));

  const counts = {
    going: entries.filter(e => e.status === 'going').length,
    not_going: entries.filter(e => e.status === 'not_going').length,
    maybe: entries.filter(e => e.status === 'maybe').length,
    invited: entries.filter(e => e.status === 'invited').length,
  };

  const handleInviteAll = () => {
    addAllMembers(roster.map(m => m.id));
  };

  const memberMatchesTab = (memberId: string) => {
    if (tab === 'all') return true;
    const entry = getEntry(memberId);
    if (!entry) return tab === 'invited' ? false : false;
    return entry.status === tab;
  };

  const renderMember = (member: typeof roster[0]) => {
    const entry = getEntry(member.id);
    const status = entry?.status ?? null;
    const name = member.profile?.full_name ?? 'Unknown';

    return (
      <div key={member.id} className="flex items-center gap-3 py-2.5 border-b last:border-0">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-muted-foreground capitalize">{member.role}{member.jersey_number ? ` · #${member.jersey_number}` : ''}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {(['going', 'maybe', 'not_going'] as TripRosterStatus[]).map(s => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? 'default' : 'outline'}
              className={`h-7 px-2 text-xs ${status === s ? '' : 'text-muted-foreground'}`}
              onClick={() => upsertStatus(member.id, s)}
            >
              {s === 'going' && <Check className="h-3.5 w-3.5" />}
              {s === 'maybe' && <HelpCircle className="h-3.5 w-3.5" />}
              {s === 'not_going' && <X className="h-3.5 w-3.5" />}
            </Button>
          ))}
          {entry && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={() => removeEntry(member.id)}
              title="Remove from trip"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const filteredRoster = (group: typeof roster) =>
    tab === 'all'
      ? group
      : group.filter(m => {
          const entry = getEntry(m.id);
          if (tab === 'invited') return entry?.status === 'invited' || (!entry && false);
          return entry?.status === tab;
        });

  if (loading) {
    return (
      <div className="space-y-3 py-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(counts) as [TripRosterStatus, number][]).map(([status, count]) => (
          <Badge
            key={status}
            variant="outline"
            className={`gap-1 ${STATUS_CONFIG[status].color} cursor-pointer`}
            onClick={() => setTab(status === tab ? 'all' : status)}
          >
            {STATUS_CONFIG[status].icon}
            {STATUS_CONFIG[status].label}: {count}
          </Badge>
        ))}
        <Badge variant="outline" className="gap-1 bg-muted text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          Total: {roster.length}
        </Badge>
      </div>

      {/* Invite all */}
      {entries.length === 0 && roster.length > 0 && (
        <Button size="sm" variant="outline" className="w-full" onClick={handleInviteAll}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Entire Roster
        </Button>
      )}

      <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)}>
        <TabsList className="w-full h-8 text-xs">
          <TabsTrigger value="all" className="flex-1 text-xs">All</TabsTrigger>
          <TabsTrigger value="going" className="flex-1 text-xs">Going</TabsTrigger>
          <TabsTrigger value="maybe" className="flex-1 text-xs">Maybe</TabsTrigger>
          <TabsTrigger value="not_going" className="flex-1 text-xs">Not Going</TabsTrigger>
          <TabsTrigger value="invited" className="flex-1 text-xs">Invited</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-3">
          {roster.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No team members found.</p>
          ) : (
            <div className="space-y-0">
              {/* Coaches section */}
              {filteredRoster(coaches).length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Coaches & Staff
                  </p>
                  {filteredRoster(coaches).map(renderMember)}
                </div>
              )}

              {/* Players section */}
              {filteredRoster(players).length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Players
                  </p>
                  {filteredRoster(players).map(renderMember)}
                </div>
              )}

              {filteredRoster(coaches).length === 0 && filteredRoster(players).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No members with this status.
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        <Check className="h-3 w-3 inline mr-1 text-green-600" />Going
        <HelpCircle className="h-3 w-3 inline mx-1 ml-3 text-yellow-600" />Maybe
        <X className="h-3 w-3 inline mx-1 ml-3 text-red-600" />Not Going
      </p>
    </div>
  );
}
