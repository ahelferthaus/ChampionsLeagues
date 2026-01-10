import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { demoPlayerNames, demoCoaches } from '@/lib/demo-roster-data';

interface RosterTableProps {
  showDemoData?: boolean;
}

export function RosterTable({ showDemoData = true }: RosterTableProps) {
  if (!showDemoData) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No roster members yet</p>
          <p className="text-sm text-muted-foreground">
            Add players and staff to build your roster
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Head Coach':
        return 'default';
      case 'Assistant Coach':
        return 'secondary';
      case 'Team Manager':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Coaches & Staff */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Coaches & Staff</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoCoaches.map((coach, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {coach.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {coach.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(coach.role)}>
                      {coach.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {coach.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {coach.phone}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Players */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Players</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Parent/Guardian</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoPlayerNames.map((player, index) => (
                <TableRow key={index}>
                  <TableCell className="font-bold text-primary">
                    {player.jersey}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {player.first[0]}{player.last[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {player.first} {player.last}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{player.position}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {player.parentName}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-muted-foreground">{player.parentEmail}</p>
                      <p className="text-muted-foreground">{player.parentPhone}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
