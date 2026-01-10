import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export function NoTeamSelected() {
  const navigate = useNavigate();
  
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Team Selected</h3>
        <p className="text-muted-foreground text-center mb-4 max-w-md">
          Select a team from the dropdown in the header or create a new one to get started.
        </p>
        <Button onClick={() => navigate('/teams/create')}>
          Create Team
        </Button>
      </CardContent>
    </Card>
  );
}
