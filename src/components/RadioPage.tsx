
"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, Volume2, Volume1, VolumeX, Radio, CalendarDays, Music, Info, Share2, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const AD_TEXT = "Chali Royal Guest House is Jinja's home away from home, Ghokale Rd  ** Akwi fashions brings the best out of your looks with their passion in design. Iganga road Jinja city  **  Magnetic looks saloon explains your right to look elegant. Lady Alice Mulooki Rd Jinja  **  HARED Petroleum has the best pure fuel and oil for your engine and with best services all across the country  **  Salongo and Sons electronics for all original electronics on Main Street Opp former Crane Bank. They do deliveries  **  Contact Mike Dee for your radio set up, Website design, App development, Music instrument lessons, DJ lessons, presentation lessons  **  For graphics design lessons and website development lessons contact us at Mike Dee Radio  **  Contact Mike Dee for any coverage and product marketing. Let's help you see results instantly  **  Send your info that you would like to be aired on our WhatsApp 075 666 04 05. Opinions, regards, debates e.t.c  **  Listen to the radio for details.  ";
const STREAM_URL = "https://stream.radiojar.com/9nesgw002hcwv";

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

const PictureInPictureIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.5 9.5 21 3m0 6V3h-6" />
        <path d="M3 3h18v18H3z" />
        <path d="m11 15-5 5" />
    </svg>
);


export function RadioPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [schedule, setSchedule] = useState<Schedule>(INITIAL_SCHEDULE);
    const [currentDay, setCurrentDay] = useState('');
    const [isShareSupported, setIsShareSupported] = useState(false);
    const [isPipSupported, setIsPipSupported] = useState(false);
    const [isPipActive, setIsPipActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsShareSupported(!!navigator.share);

            const audioEl = document.createElement('audio');
            const isCaptureStreamSupported = typeof (audioEl as any).captureStream === 'function';

            if ('pictureInPictureEnabled' in document && document.pictureInPictureEnabled && isCaptureStreamSupported) {
                setIsPipSupported(true);
            }
        }
        
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = new Date().getDay();
        const currentDayName = days[dayIndex];
        setCurrentDay(currentDayName.toLowerCase());

        const video = videoRef.current;
        if (video) {
            const onEnterPip = () => setIsPipActive(true);
            const onLeavePip = () => setIsPipActive(false);
            video.addEventListener('enterpictureinpicture', onEnterPip);
            video.addEventListener('leavepictureinpicture', onLeavePip);

            return () => {
                video.removeEventListener('enterpictureinpicture', onEnterPip);
                video.removeEventListener('leavepictureinpicture', onLeavePip);
            };
        }
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
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            setIsLoading(true);
            const audio = audioRef.current;
            
            // Set the source only when play is initiated
            if (audio.src !== STREAM_URL) {
                audio.src = STREAM_URL;
            }

            audio.load();
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(error => {
                    console.error("Playback failed:", error);
                    let description = "Could not play the stream. Please try again later.";
                    if (error.message.includes("not suitable")) {
                        description = "The audio stream is currently unavailable or not supported by your browser.";
                    }
                    toast({
                        title: "Playback Error",
                        description: description,
                        variant: "destructive",
                    });
                    setIsPlaying(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };
    
    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };
    
    const togglePictureInPicture = async () => {
        if (!isPipSupported || !videoRef.current || !canvasRef.current || !audioRef.current) return;

        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                const audio = audioRef.current;
                const video = videoRef.current;
                const canvas = canvasRef.current;

                if (typeof (audio as any).captureStream !== 'function') {
                    console.error("audio.captureStream() is not supported.");
                    toast({
                        title: "Feature Not Supported",
                        description: "Picture-in-Picture is not supported by your browser.",
                        variant: "destructive",
                    });
                    return;
                }
                
                const audioStream = (audio as any).captureStream();
                const videoStream = canvas.captureStream();
                
                audioStream.getAudioTracks().forEach(track => videoStream.addTrack(track));
                video.srcObject = videoStream;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    const logo = new window.Image();
                    logo.crossOrigin = "Anonymous";
                    logo.src = "https://mikedeeradio.com/img/MIKE%20DEE%20RADIO%201.jpg";
                    logo.onload = () => {
                        ctx.drawImage(logo, 56, 56, 400, 400);
                    };
                }

                await video.play();
                await video.requestPictureInPicture();
            }
        } catch (error) {
            console.error("PiP failed:", error);
            toast({
                title: "Picture-in-Picture Error",
                description: "Could not enter Picture-in-Picture mode.",
                variant: "destructive",
            });
        }
    };

    const VolumeIcon = useMemo(() => {
        if (volume === 0) return VolumeX;
        if (volume < 0.5) return Volume1;
        return Volume2;
    }, [volume]);

    return (
        <>
            <audio ref={audioRef} crossOrigin="anonymous" preload="none" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
            <video ref={videoRef} muted style={{ display: 'none' }} playsInline />
            <canvas ref={canvasRef} width="512" height="512" style={{ display: 'none' }}></canvas>
            
            <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
                <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
                    <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#f59e0b33,transparent)]"></div>
                </div>
                
                <main className="p-4 sm:p-6 lg:p-8">
                    <header className="flex justify-between items-center mb-6">
                         <div className="flex items-center gap-3 justify-center flex-grow">
                             <Radio className="w-8 h-8 text-primary" />
                            <h1 className="text-4xl font-bold font-headline tracking-tighter text-center">
                                <span className="whitespace-nowrap">Mike Dee</span> <br /><span className="text-primary">Radio</span>
                            </h1>
                        </div>
                         <div className="flex items-center gap-2 justify-self-end">
                            {isPipSupported && (
                                <Button onClick={togglePictureInPicture} variant="outline" size="icon" className="shrink-0" aria-label="Toggle Picture-in-Picture">
                                    <PictureInPictureIcon className={`h-5 w-5 ${isPipActive ? "text-primary" : ""}`} />
                                </Button>
                            )}
                            <Button onClick={handleShare} variant="outline" size="icon" className="shrink-0" aria-label="Share App">
                               {isShareSupported ? <Share2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </Button>
                        </div>
                    </header>
                    <div className="relative w-full flex justify-center mb-4">
                        <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden bg-card/70 border border-border/50 shadow-lg shadow-black/20">
                            <Image
                                src="https://mikedeeradio.com/img/MIKE%20DEE%20RADIO%201.jpg"
                                alt="Logo"
                                fill
                                className="object-cover opacity-80"
								priority
                                data-ai-hint="radio banner"
                            />
                        </div>
                    </div>
                    <div className="relative w-full overflow-hidden bg-card/70 backdrop-blur-lg rounded-lg p-3 border border-border/50 shadow-lg shadow-black/20 mb-8">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Info className="w-5 h-5 text-primary"/>
                        </div>
                        <div className="whitespace-nowrap ml-8">
                            <span className="inline-block text-2xl text-primary-foreground font-semibold animate-marquee-slow hover:pause">
                                {AD_TEXT.repeat(3)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 items-center">
                        <div className="w-full max-w-md">
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
                                            className="relative z-10 w-52 h-52 rounded-full hover:bg-background/80 border-4 border-primary shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
                                            aria-label={isPlaying ? 'Pause' : 'Play'}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="w-40 h-40 text-primary animate-spin" /> : (isPlaying ? <Pause className="w-40 h-40 text-primary" /> : <Play className="w-40 h-40 text-primary" />)}
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
                        </div>

                        <div className="w-full max-w-4xl">
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
