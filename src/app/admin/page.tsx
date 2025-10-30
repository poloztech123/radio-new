
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
  }, [router]);

  const handleSave = async () => {
    setIsLoading(true);
    // Mock data saving
    setTimeout(() => {
      console.log("Saving text:", crawlingText);
      toast({
        title: "Content Saved",
        description: "The crawling text has been updated.",
      });
      setIsLoading(false);
    }, 1000);
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
