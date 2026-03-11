
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const CRAWLING_TEXT_STORAGE_KEY = 'crawlingText';
const STREAM_URL_STORAGE_KEY = 'streamUrl';
const DEFAULT_CRAWLING_TEXT = "Chali Royal Guest House is Jinja's home away from home, Ghokale Rd. Akwi fashions brings the best out of your looks with their passion in design Iganga road Jinja city. Magnetic looks saloon explains your right to look elegant. Lady Alice Mulooki Rd Jinja. HARED Petroleum has the best pure fuel and oil for your engine and with best services all across the country  ** Contact Mike Dee for your radio set up, Website design, App development, Music instrument lessons, DJ lessons, presentation lessons. For graphics design lessons and website development lessons contact us at Mike Dee Radio. Contact Mike Dee for any coverage and product marketing. Let's help you see results instantly. Send your info that you would like to be aired on our WhatsApp 075 666 04 05. Opinions, regards, debates e.t.c. Nuwa electronics on Kutch road behind lukanga plaza is the leading source of all spare parts for TV, radios, amplifiers, computers, mixers, DVDs. They also have new electronic equipment and all accessories.call 0755293504 / 0779537263. Butterfly fumigation and cleaning, slashing, sewage unblocking call 0702418492. Listen to the radio for details. Mob Tech: Your One-Stop Phone Centre We offer hire purchase on all phones 0702648160 or 0753373833  ";
const DEFAULT_STREAM_URL = "https://uk20freenew.listen2myradio.com/live.mp3?typeportmount=s1_21833_stream_57657585";

export default function AdminPage() {
  const [crawlingText, setCrawlingText] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/login');
    }
    
    const savedText = localStorage.getItem(CRAWLING_TEXT_STORAGE_KEY);
    const savedUrl = localStorage.getItem(STREAM_URL_STORAGE_KEY);
    
    setCrawlingText(savedText || DEFAULT_CRAWLING_TEXT);
    setStreamUrl(savedUrl || DEFAULT_STREAM_URL);

  }, [router]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Trim the URL to avoid hidden spaces breaking playback
      const trimmedUrl = streamUrl.trim();
      localStorage.setItem(CRAWLING_TEXT_STORAGE_KEY, crawlingText);
      localStorage.setItem(STREAM_URL_STORAGE_KEY, trimmedUrl);
      toast({
        title: "Content Saved",
        description: "Admin settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error Saving",
        description: "Could not save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Manage Radio Settings</CardTitle>
          <CardDescription>Update the stream URL and the crawling banner text.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="streamUrl">Radio Stream URL</Label>
            <Input
              id="streamUrl"
              placeholder="Enter the live streaming URL (e.g., https://.../live.mp3)"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
            />
            <div className="bg-muted p-3 rounded-md border border-border">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1">Important Instructions:</p>
                <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    <li>Use <strong>HTTPS</strong> URLs (starting with <code>https://</code>). Browsers often block HTTP streams on HTTPS sites.</li>
                    <li>Ensure it is a <strong>direct audio link</strong>. It should usually end in <code>.mp3</code>, <code>.aac</code>, or have <code>/stream</code> at the end.</li>
                    <li>If using <em>Listen2MyRadio</em>, look for the "Direct Link" in your broadcaster panel. It usually looks like <code>https://...listen2myradio.com/live.mp3...</code></li>
                </ul>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="crawlingText">Crawling Text</Label>
            <Textarea
              id="crawlingText"
              placeholder="Enter the text to be displayed in the crawling banner..."
              value={crawlingText}
              onChange={(e) => setCrawlingText(e.target.value)}
              rows={8}
            />
          </div>
          <Button onClick={handleSave} disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Save All Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
