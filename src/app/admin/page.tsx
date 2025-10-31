
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const CRAWLING_TEXT_STORAGE_KEY = 'crawlingText';
const DEFAULT_CRAWLING_TEXT = "Chali Royal Guest House is Jinja's home away from home, Ghokale Rd. Akwi fashions brings the best out of your looks with their passion in design Iganga road Jinja city. Magnetic looks saloon explains your right to look elegant. Lady Alice Mulooki Rd Jinja. HARED Petroleum has the best pure fuel and oil for your engine and with best services all across the country  ** Contact Mike Dee for your radio set up, Website design, App development, Music instrument lessons, DJ lessons, presentation lessons. For graphics design lessons and website development lessons contact us at Mike Dee Radio. Contact Mike Dee for any coverage and product marketing. Let's help you see results instantly. Send your info that you would like to be aired on our WhatsApp 075 666 04 05. Opinions, regards, debates e.t.c. Nuwa electronics on Kutch road behind lukanga plaza is the leading source of all spare parts for TV, radios, amplifiers, computers, mixers, DVDs. They also have new electronic equipment and all accessories.call 0755293504 / 0779537263. Butterfly fumigation and cleaning, slashing, sewage unblocking call 0702418492. Listen to the radio for details. Mob Tech: Your One-Stop Phone Centre We offer hire purchase on all phones 0702648160 or 0753373833  ";

export default function AdminPage() {
  const [crawlingText, setCrawlingText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Mock auth check
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/login');
    }
    
    const savedText = localStorage.getItem(CRAWLING_TEXT_STORAGE_KEY);
    setCrawlingText(savedText || DEFAULT_CRAWLING_TEXT);

  }, [router]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem(CRAWLING_TEXT_STORAGE_KEY, crawlingText);
      toast({
        title: "Content Saved",
        description: "The crawling text has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error Saving",
        description: "Could not save the text. Please try again.",
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
          <CardTitle>Manage Crawling Text</CardTitle>
          <CardDescription>Update the text that scrolls across the top of the main page.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Textarea
            placeholder="Enter the text to be displayed in the crawling banner..."
            value={crawlingText}
            onChange={(e) => setCrawlingText(e.target.value)}
            rows={10}
          />
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
