import { supabase } from '@/integrations/supabase/client';

let cachedTeamId: string | null = null;

export async function getOrCreateDemoTeam(userId: string): Promise<string | null> {
  // Return cached value if we have one
  if (cachedTeamId) {
    return cachedTeamId;
  }

  // First check if user has any clubs
  const { data: adminClubs } = await supabase
    .from('club_admins')
    .select('club_id')
    .eq('user_id', userId)
    .limit(1);

  let clubId: string;

  if (adminClubs && adminClubs.length > 0) {
    clubId = adminClubs[0].club_id;
  } else {
    // Create a demo club for the user
    const { data: newClub, error: clubError } = await supabase
      .from('clubs')
      .insert({
        name: 'Demo Soccer Club',
        description: 'Demo club for showcasing features',
        created_by: userId,
      })
      .select()
      .single();

    if (clubError || !newClub) {
      console.error('Failed to create demo club:', clubError);
      return null;
    }

    clubId = newClub.id;

    // Add user as club admin
    await supabase
      .from('club_admins')
      .insert({ club_id: clubId, user_id: userId });
  }

  // Check if club has any teams
  const { data: teams } = await supabase
    .from('teams')
    .select('id')
    .eq('club_id', clubId)
    .limit(1);

  if (teams && teams.length > 0) {
    cachedTeamId = teams[0].id;
    return cachedTeamId;
  }

  // Create a demo team
  const { data: newTeam, error: teamError } = await supabase
    .from('teams')
    .insert({
      name: 'U14 Boys Premier',
      club_id: clubId,
      age_group: 'U14',
      gender: 'Boys',
      sport: 'Soccer',
      created_by: userId,
    })
    .select()
    .single();

  if (teamError || !newTeam) {
    console.error('Failed to create demo team:', teamError);
    return null;
  }

  cachedTeamId = newTeam.id;
  return cachedTeamId;
}
