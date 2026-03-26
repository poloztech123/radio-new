
"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, Radio, CalendarDays, Music, Info, Share2, Copy, Loader2, Volume2, Volume1, VolumeX, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import placeholders from '@/app/lib/placeholder-images.json';

const DEFAULT_AD_TEXT = "Chali Royal Guest House is Jinja's home away from home, Ghokale Rd. Akwi fashions brings the best out of your looks with their passion in design Iganga road Jinja city. Magnetic looks saloon explains your right to look elegant. Lady Alice Mulooki Rd Jinja. HARED Petroleum has the best pure fuel and oil for your engine and with best services all across the country  ** Contact Mike Dee for your radio set up, Website design, App development, Music instrument lessons, DJ lessons, presentation lessons. For graphics design lessons and website development lessons contact us at Mike Dee Radio. Contact Mike Dee for any coverage and product marketing. Let's help you see results instantly. Send your info that you would like to be aired on our WhatsApp 075 666 04 05. Opinions, regards, debates e.t.c. Nuwa electronics on Kutch road behind lukanga plaza is the leading source of all spare parts for TV, radios, amplifiers, computers, mixers, DVDs. They also have new electronic equipment and all accessories.call 0755293504 / 0779537263. Butterfly fumigation and cleaning, slashing, sewage unblocking call 0702418492. Listen to the radio for details. Mob Tech: Your One-Stop Phone Centre We offer hire purchase on all phones 0702648160 or 0753373833  ";
const DEFAULT_STREAM_URL = "https://uk20freenew.listen2myradio.com/live.mp3?typeportmount=s1_21833_stream_409303646";
const CRAWLING_TEXT_STORAGE_KEY = 'crawlingText';
const STREAM_URL_STORAGE_KEY = 'streamUrl';

const INITIAL_SCHEDULE = {
   Monday: [
 { time: "5am - 11am", show: "Morning Burster" },
 { time: "11am - 3pm", show: "The Work Flow" },
 { time: "3pm - 8pm", show: "Township Tunes" },
 { time: "8pm - 9pm", show: "The World News Hour" },
 { time: "9pm - 10pm", show: "Talk Desk" },
 { time: "10pm - 5am", show: "Love Jungle" }
 ],
  Tuesday: [
    { time: "5am - 11am", show: "Morning Burster" },
    { time: "11am - 3pm", show: "The Work Flow" },
    { time: "3pm - 8pm", show: "Township Tunes" },
    { time: "8pm - 9pm", show: "The World News Hour" },
    { time: "9pm - 10pm", show: "Talk Desk" },
    { time: "10pm - 5am", show: "Love Jungle" }
  ],
  Wednesday: [
    { time: "5am - 11am", show: "Morning Burster" },
    { time: "11am - 3pm", show: "The Work Flow" },
    { time: "3pm - 8pm", show: "Township Tunes" },
    { time: "8pm - 9pm", show: "The World News Hour" },
    { time: "9pm - 10pm", show: "Talk Desk" },
    { time: "10pm - 5am", show: "Love Jungle" }
  ],
  Thursday: [
    { time: "5am - 11am", show: "Morning Burster" },
    { time: "11am - 3pm", show: "The Work Flow" },
    { time: "3pm - 8pm", show: "Township Tunes" },
    { time: "8pm - 9pm", show: "The World News Hour" },
    { time: "9pm - 10pm", show: "Talk Desk" },
    { time: "10pm - 5am", show: "Love Jungle" }
  ],
  Friday: [
    { time: "5am - 11am", show: "Morning Burster" },
    { time: "11am - 3pm", show: "The Work Flow" },
    { time: "3pm - 8pm", show: "Township Tunes" },
    { time: "8pm - 9pm", show: "The World News Hour" },
    { time: "9pm - 10pm", show: "Talk Desk" },
    { time: "10pm - 5am", show: "Love Jungle" }
  ],
  Saturday: [
    { time: "5am-10am", show: "Feel Good Saturday" },
    { time: "10am-3pm", show: "Entertainment Machine Gun" },
    { time: "3pm-7pm", show: "Mike Dee Countdown" },
    { time: "7pm-5am", show: "Saturday Big Party"}
  ],
  Sunday: [
    { time: "5am-9am", show: "Gospel Hook" },
    { time: "9am-11am", show: "Talk People" },
    { time: "11am-3pm", show: "Theme Sunday" },
    { time: "3pm-7pm", show: "Reggae Business" },
    { time: "7am-5am", show: "Sunday Summer Night" }
  ],
};

export function RadioPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [adText, setAdText] = useState(DEFAULT_AD_TEXT);
    const [currentDay, setCurrentDay] = useState('');
    const [isShareSupported, setIsShareSupported] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [logoSrc, setLogoSrc] = useState(placeholders.logo.url);
    const { toast } = useToast();
    
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === CRAWLING_TEXT_STORAGE_KEY && event.newValue) {
                setAdText(event.newValue);
            }
            if (event.key === STREAM_URL_STORAGE_KEY && event.newValue) {
                if (audioRef.current && isPlaying) {
                    const newUrl = event.newValue.trim();
                    audioRef.current.src = newUrl;
                    audioRef.current.load();
                    audioRef.current.play().catch(console.error);
                }
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            setIsShareSupported(!!navigator.share);

            const storedText = localStorage.getItem(CRAWLING_TEXT_STORAGE_KEY);
            if (storedText) setAdText(storedText);
            
            const storedUrl = localStorage.getItem(STREAM_URL_STORAGE_KEY);
            if (storedUrl && audioRef.current) {
                audioRef.current.src = storedUrl.trim();
            } else if (audioRef.current) {
                audioRef.current.src = DEFAULT_STREAM_URL;
            }

            // Ensure volume is synchronized on mount
            if (audioRef.current) {
                audioRef.current.volume = volume;
            }
        }
        
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = new Date().getDay();
        const currentDayName = days[dayIndex];
        setCurrentDay(currentDayName.toLowerCase());

        return () => {
             if (typeof window !== 'undefined') {
                window.removeEventListener('storage', handleStorageChange);
            }
        }
    }, [isPlaying, volume]);

    const handleShare = async () => {
        const shareData = {
            title: 'Mike Dee Radio',
            text: 'Check out Mike Dee Radio - Live streaming radio!',
            url: typeof window !== 'undefined' ? window.location.href : '',
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error("Sharing failed:", error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast({ title: "Link Copied", description: "The radio link has been copied to your clipboard." });
            } catch (error) {
                 toast({ title: "Failed to Copy", description: "Could not copy the link.", variant: "destructive" });
            }
        }
    };

    const togglePlayPause = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        setIsLoading(true);

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
            setIsLoading(false);
        } else {
            try {
                const storedUrl = localStorage.getItem(STREAM_URL_STORAGE_KEY) || DEFAULT_STREAM_URL;
                // Add a simple cache buster to force the browser to reconnect to the live stream
                const currentUrl = `${storedUrl.trim()}${storedUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
                
                if (typeof window !== 'undefined' && window.location.protocol === 'https:' && currentUrl.startsWith('http:')) {
                    toast({
                        title: "Security Block",
                        description: "Your browser blocks HTTP streams on HTTPS sites. Please update your admin setting to an HTTPS stream URL.",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return;
                }

                // Reset stream to ensure we get a fresh live buffer
                audio.pause();
                audio.src = currentUrl;
                audio.load();
                audio.volume = volume;
                
                await audio.play();
                setIsPlaying(true);
            } catch (error: any) {
                console.error("Playback failed:", error);
                toast({
                    title: "Playback Error",
                    description: error.message || "The stream could not be played. This might be due to a slow connection or an invalid stream link.",
                    variant: "destructive",
                });
                setIsPlaying(false);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const VolumeIcon = useMemo(() => {
        if (volume === 0) return VolumeX;
        if (volume < 0.5) return Volume1;
        return Volume2;
    }, [volume]);

    return (
        <>
            <audio ref={audioRef} preload="none" crossOrigin="anonymous" />
            
            <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
                <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
                    <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#f59e0b33,transparent)]"></div>
                </div>
                
                <main className="p-4 sm:p-6 lg:p-8">
                    <header className="flex flex-col items-center justify-center mb-10 max-w-5xl mx-auto gap-8 text-center">
                         <div className="w-full flex justify-between items-center">
                            <Link href="/login">
                              <Button variant="ghost" size="icon" aria-label="Admin Login">
                                <User className="h-6 w-6" />
                              </Button>
                            </Link>
                            <Button onClick={handleShare} variant="outline" size="icon" className="shrink-0" aria-label="Share App">
                               {isShareSupported ? <Share2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </Button>
                         </div>
                         
                         <div className="flex flex-col items-center gap-6">
                             <div className="flex items-center justify-center gap-4">
                                <Radio className="h-10 w-10 md:h-14 md:w-14 text-primary" />
                                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                                    <span>Mike Dee</span>
                                    <span className="text-primary ml-3">Radio</span>
                                </h1>
                             </div>
                             
                             <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/30 bg-card/50">
                                <Image 
                                    src={logoSrc} 
                                    alt="Mike Dee Radio Logo" 
                                    fill 
                                    className="object-cover"
                                    priority
                                    onError={() => {
                                        // Try relative path first, then absolute, then external fallback
                                        if (logoSrc === placeholders.logo.url) {
                                            setLogoSrc('./images/logo.jpg');
                                        } else if (logoSrc === './images/logo.jpg') {
                                            setLogoSrc('https://mikedeeradio.com/images/logo.jpg');
                                        }
                                    }}
                                    data-ai-hint="radio station logo"
                                />
                             </div>
                        </div>
                    </header>

                    <div className="relative max-w-4xl mx-auto overflow-hidden bg-card/70 backdrop-blur-lg rounded-lg p-3 border border-border/50 shadow-lg shadow-black/20 mb-10">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10 bg-card/10 backdrop-blur-sm pr-2">
                            <Info className="w-5 h-5 text-primary"/>
                        </div>
                        <div className="whitespace-nowrap ml-8 overflow-hidden">
                            <span className="inline-block text-xl md:text-2xl text-white font-semibold animate-marquee-slow hover:pause">
                                {adText.repeat(3)}
                            </span>
                        </div>                        
                    </div>

                    <div className="flex flex-col gap-10 items-center max-w-6xl mx-auto">
                        <div className="w-full max-w-md">
                            <Card className="bg-card/70 backdrop-blur-lg border-border/50 shadow-2xl shadow-black/20">
                                <CardHeader className="text-center">
                                    <CardTitle className="font-headline text-2xl md:text-3xl">Making Life Interesting</CardTitle>
                                    <CardDescription>Streaming Worldwide 24/7</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center gap-8 p-8">
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                                            <div className={`absolute inset-0 bg-primary/10 rounded-full transition-transform duration-500 ${isPlaying ? 'animate-pulse scale-110' : 'scale-100'}`}></div>
                                            <Button
                                                onClick={togglePlayPause}
                                                variant="outline"
                                                size="icon"
                                                className="relative z-10 w-full h-full rounded-full hover:bg-background/80 border-4 border-primary shadow-[0_0_40px_8px_rgba(249,115,22,0.3)] transition-transform hover:scale-105 flex items-center justify-center bg-card/50"
                                                aria-label={isPlaying ? 'Pause' : 'Play'}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                  <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-primary animate-spin" />
                                                ) : (
                                                  isPlaying ? (
                                                    <Pause className="w-12 h-12 md:w-16 md:h-16 text-primary fill-primary" />
                                                  ) : (
                                                    <Play className="w-12 h-12 md:w-16 md:h-16 text-primary fill-primary ml-2" />
                                                  )
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="w-full max-w-xs flex flex-col items-center gap-4 pt-4">
                                        <div className="w-full flex items-center gap-3">
                                            <VolumeIcon className="w-6 h-6 text-primary" />
                                            <Slider
                                                value={[volume * 100]}
                                                max={100}
                                                step={1}
                                                className="w-full cursor-pointer"
                                                onValueChange={(value) => setVolume(value[0] / 100)}
                                                aria-label="Volume control"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="w-full max-w-4xl">
                            <Card className="bg-card/70 backdrop-blur-lg border-border/50 shadow-2xl shadow-black/20 h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <CalendarDays className="w-6 h-6 text-accent" />
                                        <CardTitle className="font-headline text-2xl md:text-3xl">Weekly Schedule</CardTitle>
                                    </div>
                                    <CardDescription>What's on this week at Mike Dee Radio.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                     <Tabs defaultValue={currentDay} className="w-full">
                                        <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 bg-card/80">
                                            {Object.keys(INITIAL_SCHEDULE).map((day) => (
                                                <TabsTrigger key={day} value={day.toLowerCase()} className="text-xs md:text-sm">{day.substring(0,3)}</TabsTrigger>
                                            ))}
                                        </TabsList>
                                        {Object.entries(INITIAL_SCHEDULE).map(([day, shows]) => (
                                            <TabsContent key={day} value={day.toLowerCase()} className="mt-4">
                                                <div className="w-full overflow-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="hover:bg-transparent border-b-border/50">
                                                                <TableHead className="w-[120px]">Time</TableHead>
                                                                <TableHead><Music className="inline w-4 h-4 mr-2"/>Show</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {shows.map((show, index) => (
                                                                <TableRow key={index} className="border-b-border/20">
                                                                    <TableCell className="font-medium text-primary whitespace-nowrap">{show.time}</TableCell>
                                                                    <TableCell>{show.show}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
            <style jsx>{`
                @keyframes marquee-slow {
                    from { transform: translateX(0%); }
                    to { transform: translateX(-100%); }
                }
                .animate-marquee-slow {
                    animation: marquee-slow 600s linear infinite;
                }
                .pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </>
    );
}
