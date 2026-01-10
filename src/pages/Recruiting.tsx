import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MainNavigation } from '@/components/MainNavigation';
import { VideoClipAdvisor } from '@/components/VideoClipAdvisor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { GraduationCap, Video, Mail, Search } from 'lucide-react';

export default function Recruiting() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // For demo purposes, check URL param or use state
  // In production, you'd verify this against a database/Stripe
  const [hasPurchasedVideoAdvisor, setHasPurchasedVideoAdvisor] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      setHasPurchasedVideoAdvisor(true);
      toast({
        title: "Payment Successful!",
        description: "You now have access to the Video Clip Advisor.",
      });
      // Clean up URL
      window.history.replaceState({}, '', '/recruiting');
    } else if (payment === 'canceled') {
      toast({
        title: "Payment Canceled",
        description: "You can try again when you're ready.",
        variant: "destructive",
      });
      window.history.replaceState({}, '', '/recruiting');
    }
  }, [searchParams]);

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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            College Recruiting
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered tools to help you navigate the college recruiting process
          </p>
        </div>

        <Tabs defaultValue="video" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video" className="gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Video Advisor</span>
              <span className="sm:hidden">Video</span>
            </TabsTrigger>
            <TabsTrigger value="colleges" className="gap-2" disabled>
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">College Finder</span>
              <span className="sm:hidden">Colleges</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="gap-2" disabled>
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email Writer</span>
              <span className="sm:hidden">Emails</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <VideoClipAdvisor hasPurchased={hasPurchasedVideoAdvisor} />
          </TabsContent>

          <TabsContent value="colleges">
            <Card>
              <CardHeader>
                <CardTitle>College Finder</CardTitle>
                <CardDescription>
                  Coming soon: AI-powered college matching based on your athletic profile, academics, and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12 text-muted-foreground">
                This feature is coming soon!
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Coach Email Writer</CardTitle>
                <CardDescription>
                  Coming soon: AI-assisted emails to college coaches tailored to your profile and target programs
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12 text-muted-foreground">
                This feature is coming soon!
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
