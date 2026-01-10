import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { MainNavigation } from '@/components/MainNavigation';
import { AttendanceTracker } from '@/components/AttendanceTracker';
import { LoadDemoDataButton } from '@/components/LoadDemoDataButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Users } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, addWeeks } from 'date-fns';
import { demoPlayerNames } from '@/lib/demo-roster-data';

export default function Attendance() {
  const { user, loading: authLoading, roles } = useAuth();
  const navigate = useNavigate();
  const { events, loading: eventsLoading, refetch } = useEvents();
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, Record<string, { status: 'present' | 'absent' | 'excused' | 'late' | 'pending' }>>>({});

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

  // Filter events by week
  const now = new Date();
  const getWeekRange = (weekOffset: number) => ({
    start: startOfWeek(addWeeks(now, weekOffset)),
    end: endOfWeek(addWeeks(now, weekOffset)),
  });

  const weekRanges: Record<string, { start: Date; end: Date }> = {
    current: getWeekRange(0),
    next: getWeekRange(1),
    previous: getWeekRange(-1),
  };

  const selectedRange = weekRanges[selectedWeek];
  const weekEvents = events.filter(event => 
    isWithinInterval(new Date(event.start_time), selectedRange)
  );

  // Create demo players list
  const demoPlayers = demoPlayerNames.map((player, index) => ({
    id: `demo-player-${index}`,
    name: `${player.first} ${player.last}`,
    jersey_number: player.jersey,
    avatar_url: undefined,
  }));

  // Handle attendance marking
  const handleMarkAttendance = async (eventId: string, playerId: string, status: 'present' | 'absent' | 'excused' | 'late' | 'pending') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [playerId]: { status },
      },
    }));
  };

  // Calculate summary stats
  const totalRecords = Object.values(attendanceRecords).flatMap(e => Object.values(e));
  const presentCount = totalRecords.filter(r => r.status === 'present').length;
  const absentCount = totalRecords.filter(r => r.status === 'absent').length;
  const lateCount = totalRecords.filter(r => r.status === 'late').length;

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground">
              Track player attendance for practices and games
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LoadDemoDataButton userId={user.id} onComplete={refetch} />
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous">Last Week</SelectItem>
                <SelectItem value="current">This Week</SelectItem>
                <SelectItem value="next">Next Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events This Week</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weekEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                {format(selectedRange.start, 'MMM d')} - {format(selectedRange.end, 'MMM d')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <p className="text-xs text-muted-foreground">Players marked present</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <X className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <p className="text-xs text-muted-foreground">Players marked absent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
              <p className="text-xs text-muted-foreground">Players marked late</p>
            </CardContent>
          </Card>
        </div>

        {/* Week Info */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="text-sm">
            {format(selectedRange.start, 'EEEE, MMM d')} - {format(selectedRange.end, 'EEEE, MMM d, yyyy')}
          </Badge>
          <span className="text-muted-foreground">
            {weekEvents.length} event{weekEvents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Events with Attendance */}
        {eventsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : weekEvents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No events scheduled for this week</p>
              <p className="text-sm text-muted-foreground">
                Import events from the Schedule page to start tracking attendance
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {weekEvents.map(event => (
              <AttendanceTracker
                key={event.id}
                eventId={event.id}
                eventTitle={event.title}
                eventDate={new Date(event.start_time)}
                eventLocation={event.location || undefined}
                players={demoPlayers}
                attendanceRecords={attendanceRecords[event.id] || {}}
                onMarkAttendance={(playerId, status) => handleMarkAttendance(event.id, playerId, status)}
                isManager={isManager}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
