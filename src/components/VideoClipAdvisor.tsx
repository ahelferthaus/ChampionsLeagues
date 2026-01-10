import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useRecruiting } from '@/hooks/useRecruiting';
import { Video, Sparkles, ExternalLink, Loader2, Lock } from 'lucide-react';

const SPORTS = [
  'Soccer',
  'Basketball',
  'Baseball',
  'Softball',
  'Volleyball',
  'Football',
  'Lacrosse',
  'Field Hockey',
  'Swimming',
  'Track & Field',
  'Tennis',
  'Golf',
  'Ice Hockey',
  'Wrestling',
  'Gymnastics',
];

const LEVELS = [
  { value: 'D1', label: 'NCAA Division I' },
  { value: 'D2', label: 'NCAA Division II' },
  { value: 'D3', label: 'NCAA Division III' },
  { value: 'NAIA', label: 'NAIA' },
  { value: 'JUCO', label: 'Junior College' },
];

interface VideoClipAdvisorProps {
  hasPurchased?: boolean;
}

export function VideoClipAdvisor({ hasPurchased = false }: VideoClipAdvisorProps) {
  const { loading, advice, getVideoClipAdvice, startPayment, clearAdvice } = useRecruiting();
  const [sport, setSport] = useState('');
  const [position, setPosition] = useState('');
  const [level, setLevel] = useState('');
  const [highlights, setHighlights] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sport || !position || !level) return;
    await getVideoClipAdvice(sport, position, level, highlights);
  };

  const handlePurchase = () => {
    startPayment();
  };

  if (!hasPurchased) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <Video className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Video Clip Advisor</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            Get AI-powered, personalized guidance on what clips to include in your college recruiting video
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Position-Specific Advice</p>
                <p className="text-sm text-muted-foreground">Tailored to your exact sport and position</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Level-Targeted</p>
                <p className="text-sm text-muted-foreground">D1, D2, D3, NAIA, or JUCO specific</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Expert Insights</p>
                <p className="text-sm text-muted-foreground">Based on what coaches actually look for</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Current Best Practices</p>
                <p className="text-sm text-muted-foreground">Up-to-date with recruiting trends</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 text-center">
            <p className="text-3xl font-bold mb-2">$19.99</p>
            <p className="text-sm text-muted-foreground mb-4">One-time purchase • Unlimited uses</p>
            <Button size="lg" onClick={handlePurchase} className="gap-2">
              <Lock className="h-4 w-4" />
              Unlock Video Clip Advisor
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Clip Advisor
          </CardTitle>
          <CardDescription>
            Get personalized advice on what clips to include in your recruiting video
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="e.g., Center Midfielder, Point Guard"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Target College Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights">Your Highlights/Strengths (optional)</Label>
              <Textarea
                id="highlights"
                placeholder="Describe what you think are your best skills or moments..."
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" disabled={loading || !sport || !position || !level} className="w-full gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Advice...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get Video Clip Advice
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {advice && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Personalized Video Guide</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAdvice}>
                Clear
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">{advice.sport}</Badge>
              <Badge variant="secondary">{advice.position}</Badge>
              <Badge variant="secondary">{advice.level}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {advice.advice}
              </div>
            </div>

            {advice.citations && advice.citations.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {advice.citations.map((citation, index) => (
                    <a
                      key={index}
                      href={citation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Source {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
