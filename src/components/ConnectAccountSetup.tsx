import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConnectAccountStatus } from '@/hooks/useExpenses';
import { Building2, CheckCircle, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

interface ConnectAccountSetupProps {
  status: ConnectAccountStatus | null;
  venmoHandle?: string;
  onStartOnboarding: () => void;
  onUpdateVenmo: (handle: string) => void;
  loading?: boolean;
}

export function ConnectAccountSetup({ 
  status, 
  venmoHandle, 
  onStartOnboarding, 
  onUpdateVenmo,
  loading 
}: ConnectAccountSetupProps) {
  const [venmo, setVenmo] = useState(venmoHandle || '');
  const [savingVenmo, setSavingVenmo] = useState(false);

  const handleSaveVenmo = async () => {
    setSavingVenmo(true);
    await onUpdateVenmo(venmo);
    setSavingVenmo(false);
  };

  const isFullySetup = status?.chargesEnabled && status?.payoutsEnabled;
  const isPartialSetup = status?.hasAccount && !isFullySetup;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Payment Account Setup
        </CardTitle>
        <CardDescription>
          Set up how you receive payments from team members
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stripe Connect Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Direct Payments (Stripe)</h4>
              <p className="text-sm text-muted-foreground">
                Receive card and ACH payments directly to your bank account
              </p>
            </div>
            {isFullySetup ? (
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
            ) : isPartialSetup ? (
              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 gap-1">
                <AlertCircle className="h-3 w-3" />
                Incomplete
              </Badge>
            ) : (
              <Badge variant="secondary">Not Set Up</Badge>
            )}
          </div>

          {isFullySetup ? (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Your payment account is active! You can receive card and bank (ACH) payments from team members.
                Funds are deposited directly to your linked bank account.
              </AlertDescription>
            </Alert>
          ) : isPartialSetup ? (
            <Alert>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="flex items-center justify-between">
                <span>Please complete your account setup to start receiving payments.</span>
                <Button size="sm" onClick={onStartOnboarding} disabled={loading}>
                  Complete Setup
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <p className="font-medium">Benefits of Stripe Connect:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Accept card payments (2.9% + $0.30 fee)</li>
                  <li>Accept ACH bank transfers (0.8% fee, max $5)</li>
                  <li>Automatic deposits to your bank account</li>
                  <li>No monthly fees</li>
                </ul>
              </div>
              <Button onClick={onStartOnboarding} disabled={loading} className="w-full gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Set Up Payment Account
                    <ExternalLink className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Venmo Handle */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <h4 className="font-medium">Venmo (Alternative)</h4>
            <p className="text-sm text-muted-foreground">
              Add your Venmo handle so parents can pay you directly via Venmo
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="venmo" className="sr-only">Venmo Handle</Label>
              <Input
                id="venmo"
                placeholder="@your-venmo-handle"
                value={venmo}
                onChange={(e) => setVenmo(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSaveVenmo} 
              disabled={savingVenmo || venmo === venmoHandle}
              variant="outline"
            >
              {savingVenmo ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
          
          {venmoHandle && (
            <p className="text-xs text-muted-foreground">
              Current: <span className="font-medium">{venmoHandle}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
