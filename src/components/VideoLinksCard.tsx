import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, ExternalLink, Play } from 'lucide-react';

const demoVideoLinks = [
  {
    id: '1',
    platform: 'veo',
    title: 'vs. FC Dallas Academy - Full Match',
    url: 'https://app.veo.co',
    date: '2026-01-05',
    thumbnail: null,
  },
  {
    id: '2',
    platform: 'hudl',
    title: 'Solar SC Game Highlights',
    url: 'https://www.hudl.com',
    date: '2025-12-28',
    thumbnail: null,
  },
  {
    id: '3',
    platform: 'nfhs',
    title: 'State Cup Qualifier vs Houston',
    url: 'https://www.nfhsnetwork.com',
    date: '2025-12-14',
    thumbnail: null,
  },
  {
    id: '4',
    platform: 'veo',
    title: 'Training Session - Set Pieces',
    url: 'https://app.veo.co',
    date: '2026-01-08',
    thumbnail: null,
  },
];

const platformColors: Record<string, string> = {
  veo: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  hudl: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  nfhs: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

const platformNames: Record<string, string> = {
  veo: 'Veo',
  hudl: 'Hudl',
  nfhs: 'NFHS Network',
};

export function VideoLinksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Team Videos
        </CardTitle>
        <CardDescription>
          Game footage and training videos from connected platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demoVideoLinks.map((video) => (
            <div
              key={video.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                  <Play className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{video.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={platformColors[video.platform]}>
                      {platformNames[video.platform]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{video.date}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg border-2 border-dashed">
          <p className="text-sm text-center text-muted-foreground">
            Connect your team's video accounts to automatically import game footage
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <Button variant="outline" size="sm" disabled>
              Connect Veo
            </Button>
            <Button variant="outline" size="sm" disabled>
              Connect Hudl
            </Button>
            <Button variant="outline" size="sm" disabled>
              Connect NFHS
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Video integrations coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
