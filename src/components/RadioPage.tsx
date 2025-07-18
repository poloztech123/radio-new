"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, Volume2, Volume1, VolumeX, Radio, CalendarDays, Music, Info, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const AD_TEXT = "Chali Royal Guest House is Jinja's home away from home, Ghokale Rd  ** Akwi fashions brings the best out of your looks with their passion in design. Iganga road Jinja city  **  Magnetic looks saloon explains your right to look elegant. Lady Alice Mulooki Rd Jinja  **  HARED Petroleum has the best pure fuel and oil for your engine and with best services all across the country  **  Salongo and Sons electronics for all original electronics on Main Street Opp former Crane Bank. They do deliveries  **  Contact Mike Dee for your radio set up, Website design, App development, Music instrument lessons, DJ lessons, presentation lessons  **  For graphics design lessons and website development lessons contact us at Mike Dee Radio  **  Contact Mike Dee Radio for any coverage and product marketing. Let's help you see results instantly  **  Send your info that you would like to be aired on our WhatsApp 075 666 04 05. Opinions, regards, debates e.t.c  **  Listen to the radio for details.  ";
const STREAM_URL = "http://stream.radiojar.com/9nesgw002hcwv";

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

type Schedule = typeof INITIAL_SCHEDULE;

export function RadioPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [schedule, setSchedule] = useState<Schedule>(INITIAL_SCHEDULE);
    const [currentDay, setCurrentDay] = useState('');
    const [isShareSupported, setIsShareSupported] = useState(false);
    const { toast } = useToast();

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        setIsShareSupported(!!(typeof window !== 'undefined' && navigator.share));
        
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date();
        const dayIndex = new Date().getDay();
        const currentDayName = days[dayIndex];
        setCurrentDay(currentDayName.toLowerCase());
        
        console.log("Current Day:", currentDayName);
    }, []);


    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleShare = async () => {
        const shareData = {
            title: 'Mike Dee Radio',
            text: 'Check out Mike Dee Radio - Live streaming radio!',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error("Sharing failed:", error);
                toast({
                  title: "Error Sharing",
                  description: "Could not share at this moment. Please try again later.",
                  variant: "destructive",
                });
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                toast({
                    title: "Link Copied",
                    description: "The radio link has been copied to your clipboard.",
                });
            } catch (error) {
                 toast({
                  title: "Failed to Copy",
                  description: "Could not copy the link. Please try again.",
                  variant: "destructive",
                });
            }
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    console.error("Playback failed:", error);
                    toast({
                        title: "Playback Error",
                        description: "Could not play the stream. Please try again.",
                        variant: "destructive",
                    });
                });
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const VolumeIcon = useMemo(() => {
        if (volume === 0) return VolumeX;
        if (volume < 0.5) return Volume1;
        return Volume2;
    }, [volume]);

    return (
        <>
            <audio ref={audioRef} src={STREAM_URL} preload="none" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
            <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
                <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
                    <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#f59e0b33,transparent)]"></div>
                </div>
                
                <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <header className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                                <Radio className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-bold font-headline tracking-tighter">
                                Mike Dee <span className="text-primary">Radio</span>
                            </h1>
                        </div>
                        <Button onClick={handleShare} variant="outline" size="icon" className="shrink-0" aria-label="Share App">
                           {isShareSupported ? <Share2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </Button>
                    </header>
                    <div className="relative w-full flex justify-center mb-10">
                        <div className="relative w-[100px] h-[100px] rounded-lg overflow-hidden bg-card/70 border border-border/50 shadow-lg shadow-black/20">
                            <Image
                                src="https://mikedeeradio.com/img/MIKE DEE RADIO 1.jpg"
                                alt="Logo"
                                fill
                                className="object-cover opacity-80"
                                data-ai-hint="radio banner"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 flex flex-col gap-8">
                            <Card className="bg-card/70 backdrop-blur-lg border-border/50 shadow-2xl shadow-black/20">
                                <CardHeader className="text-center">
                                    <CardTitle className="font-headline text-3xl">Making Life Interesting</CardTitle>
                                    <CardDescription>Streaming Worldwide 24/7</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center gap-8">
                                    <div className="relative w-52 h-52">
                                        <div className={`absolute inset-0 bg-primary/20 rounded-full transition-transform duration-500 ${isPlaying ? 'animate-pulse scale-110' : 'scale-100'}`}></div>
                                        <Button
                                            onClick={togglePlayPause}
                                            variant="outline"
                                            size="icon"
                                            className="relative z-10 w-52 h-52 rounded-full bg-background/50 hover:bg-background/80 border-4 border-primary shadow-lg transition-transform hover:scale-105"
                                            aria-label={isPlaying ? 'Pause' : 'Play'}
                                        >
                                            {isPlaying ? <Pause className="w-24 h-24 text-primary" /> : <Play className="w-24 h-24 text-primary" />}
                                        </Button>
                                    </div>
                                    <div className="w-full max-w-xs space-y-4">
                                        <div className="flex items-center gap-4">
                                            <VolumeIcon className="w-6 h-6 text-muted-foreground" />
                                            <Slider
                                                defaultValue={[volume]}
                                                max={1}
                                                step={0.05}
                                                onValueChange={handleVolumeChange}
                                                className="w-full"
                                                aria-label="Volume control"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="relative w-full overflow-hidden bg-card/70 backdrop-blur-lg rounded-lg p-3 border border-border/50 shadow-lg shadow-black/20">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Info className="w-5 h-5 text-primary"/>
                                </div>
                                <div className="whitespace-nowrap ml-8">
                                    <span className="inline-block text-primary-foreground font-semibold animate-marquee-slow hover:pause">
                                        {AD_TEXT.repeat(3)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <Card className="bg-card/70 backdrop-blur-lg border-border/50 shadow-2xl shadow-black/20 h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <CalendarDays className="w-6 h-6 text-accent" />
                                        <CardTitle className="font-headline text-3xl">Weekly Schedule</CardTitle>
                                    </div>
                                    <CardDescription>What's on this week at Mike Dee Radio.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                     <Tabs defaultValue={currentDay} className="w-full">
                                        <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 bg-card/80">
                                            {Object.keys(schedule).map((day) => (
                                                <TabsTrigger key={day} value={day.toLowerCase()}>{day.substring(0,3)}</TabsTrigger>
                                            ))}
                                        </TabsList>
                                        {Object.entries(schedule).map(([day, shows]) => (
                                            <TabsContent key={day} value={day.toLowerCase()} className="mt-4">
                                                <div className="w-full overflow-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="hover:bg-transparent border-b-border/50">
                                                                <TableHead className="w-[100px]">Time</TableHead>
                                                                <TableHead><Music className="inline w-4 h-4 mr-2"/>Show</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {shows.map((show, index) => (
                                                                <TableRow key={index} className="border-b-border/20">
                                                                    <TableCell className="font-medium text-primary">{show.time}</TableCell>
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
                    animation: marquee-slow 550s linear infinite;
                }
                .pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </>
    );
}
