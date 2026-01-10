import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTeam } from '@/contexts/TeamContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { MainNavigation } from '@/components/MainNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Plus } from 'lucide-react';
import { SPORTS_LIST } from '@/components/SportIcons';

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [sport, setSport] = useState('soccer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { refetchTeams, setTeam } = useTeam();
  const navigate = useNavigate();
  const { data: adminClubs, isLoading } = useQuery({
    queryKey: ['admin-clubs', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('club_admins').select('club_id, clubs(id, name, logo_url)').eq('user_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClubId || !teamName.trim()) { toast.error('Please fill required fields'); return; }
    setIsSubmitting(true);
    try {
      const { data: team, error: teamError } = await supabase.from('teams').insert({ club_id: selectedClubId, name: teamName.trim(), age_group: ageGroup || null, gender: gender || null, sport: sport, created_by: user!.id }).select().single();
      if (teamError) throw teamError;
      await supabase.from('team_members').insert({ team_id: team.id, user_id: user!.id, role: 'team_manager', is_active: true });
      await refetchTeams();
      setTeam(team.id);
      toast.success('Team created!');
      navigate('/dashboard');
    } catch (error: any) { toast.error(error.message || 'Failed to create team'); } finally { setIsSubmitting(false); }
  };
  if (isLoading) return (<div className="min-h-screen bg-background"><MainNavigation /><div className="flex items-center justify-center min-h-[calc(100vh-5rem)]"><div className="animate-pulse">Loading...</div></div></div>);
  const hasClubs = adminClubs && adminClubs.length > 0;
  return (<div className="min-h-screen bg-background"><MainNavigation /><main className="max-w-2xl mx-auto px-4 py-8"><Button variant="ghost" onClick={() => navigate(-1)} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><Card><CardHeader><CardTitle>Create New Team</CardTitle><CardDescription>{hasClubs ? 'Add a team to your club' : 'Create a club first'}</CardDescription></CardHeader><CardContent>{!hasClubs ? (<div className="space-y-4"><p className="text-sm text-muted-foreground">You need to create a club first.</p><Button onClick={() => navigate('/clubs/create')}><Plus className="mr-2 h-4 w-4" />Create Club</Button></div>) : (<form onSubmit={handleSubmit} className="space-y-6"><div className="space-y-2"><Label htmlFor="club">Club *</Label><Select value={selectedClubId} onValueChange={setSelectedClubId}><SelectTrigger><SelectValue placeholder="Select club" /></SelectTrigger><SelectContent>{adminClubs?.map((ac: any) => (<SelectItem key={ac.clubs.id} value={ac.clubs.id}>{ac.clubs.name}</SelectItem>))}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="name">Team Name *</Label><Input id="name" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="U14 Boys" required /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Age Group</Label><Input value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} placeholder="U14" /></div><div className="space-y-2"><Label>Gender</Label><Select value={gender} onValueChange={setGender}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="">Not specified</SelectItem><SelectItem value="Boys">Boys</SelectItem><SelectItem value="Girls">Girls</SelectItem><SelectItem value="Coed">Coed</SelectItem></SelectContent></Select></div></div><div className="space-y-2"><Label>Sport *</Label><Select value={sport} onValueChange={setSport}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent className="max-h-[300px]">{SPORTS_LIST.map((s) => (<SelectItem key={s.value} value={s.value}><div className="flex items-center gap-2"><span>{s.icon}</span><span>{s.label}</span></div></SelectItem>))}</SelectContent></Select></div><div className="flex gap-3"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Team'}</Button><Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button></div></form>)}</CardContent></Card></main></div>);
}
