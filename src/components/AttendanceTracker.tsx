import { useState } from 'react';
import { format } from 'date-fns';
import { Check, X, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Player {
  id: string;
  name: string;
  jersey_number?: string;
  avatar_url?: string;
}

interface AttendanceStatus {
  status: 'present' | 'absent' | 'excused' | 'late' | 'pending';
  notes?: string;
}

interface AttendanceTrackerProps {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  eventLocation?: string;
  players: Player[];
  attendanceRecords: Record<string, AttendanceStatus>;
  onMarkAttendance: (playerId: string, status: AttendanceStatus['status']) => Promise<void>;
  isManager?: boolean;
}

const statusConfig = {
  present: { icon: Check, label: 'Present', className: 'bg-green-500 hover:bg-green-600 text-white' },
  absent: { icon: X, label: 'Absent', className: 'bg-red-500 hover:bg-red-600 text-white' },
  late: { icon: Clock, label: 'Late', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
  excused: { icon: AlertCircle, label: 'Excused', className: 'bg-blue-500 hover:bg-blue-600 text-white' },
  pending: { icon: RotateCcw, label: 'Pending', className: 'bg-muted hover:bg-muted/80 text-muted-foreground' },
};

export function AttendanceTracker({
  eventId,
  eventTitle,
  eventDate,
  eventLocation,
  players,
  attendanceRecords,
  onMarkAttendance,
  isManager = false,
}: AttendanceTrackerProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (playerId: string, status: AttendanceStatus['status']) => {
    if (!isManager) return;
    setLoading(playerId);
    try {
      await onMarkAttendance(playerId, status);
    } finally {
      setLoading(null);
    }
  };

  const getPlayerStatus = (playerId: string): AttendanceStatus['status'] => {
    return attendanceRecords[playerId]?.status || 'pending';
  };

  const attendanceSummary = {
    present: players.filter(p => getPlayerStatus(p.id) === 'present').length,
    absent: players.filter(p => getPlayerStatus(p.id) === 'absent').length,
    late: players.filter(p => getPlayerStatus(p.id) === 'late').length,
    excused: players.filter(p => getPlayerStatus(p.id) === 'excused').length,
    pending: players.filter(p => getPlayerStatus(p.id) === 'pending').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10">
                {format(eventDate, 'MMM d')}
              </Badge>
              {eventTitle}
            </CardTitle>
            <CardDescription className="mt-1">
              {format(eventDate, 'EEEE @ h:mma')}
              {eventLocation && ` • ${eventLocation}`}
            </CardDescription>
          </div>
          <div className="flex gap-2 text-sm">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {attendanceSummary.present} present
            </Badge>
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              {attendanceSummary.absent} absent
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player) => {
            const currentStatus = getPlayerStatus(player.id);
            const isLoading = loading === player.id;

            return (
              <div
                key={player.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={player.avatar_url} />
                    <AvatarFallback>
                      {player.jersey_number || player.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{player.name}</p>
                    {player.jersey_number && (
                      <p className="text-sm text-muted-foreground">#{player.jersey_number}</p>
                    )}
                  </div>
                </div>

                {isManager ? (
                  <TooltipProvider>
                    <div className="flex gap-1">
                      {(['present', 'absent', 'late', 'excused'] as const).map((status) => {
                        const config = statusConfig[status];
                        const Icon = config.icon;
                        const isActive = currentStatus === status;

                        return (
                          <Tooltip key={status}>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant={isActive ? 'default' : 'outline'}
                                className={cn(
                                  'h-8 w-8 p-0',
                                  isActive && config.className
                                )}
                                onClick={() => handleStatusChange(player.id, status)}
                                disabled={isLoading}
                              >
                                <Icon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{config.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                ) : (
                  <Badge
                    className={cn(
                      'capitalize',
                      statusConfig[currentStatus].className
                    )}
                  >
                    {statusConfig[currentStatus].label}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
