"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Music, 
  Circle, 
  Square, 
  Check, 
  X, 
  Tag, 
  Type, 
  Search, 
  Download, 
  RotateCcw, 
  Zap, 
  Clock, 
  Flame, 
  Smile, 
  Lock, 
  Users, 
  Globe,
  Image
} from "lucide-react";
import { ReelType, Song, Visibility } from "@prisma/client";
import { createReel } from "@/lib/actions";

interface StudioRecorderProps {
  songs: Song[]; // Existing songs in our DB
}

interface ITunesSong {
  trackId: number;
  trackName: string;
  artistName: string;
  previewUrl: string;
  artworkUrl100: string;
}

export default function StudioRecorder({ songs: dbSongs }: StudioRecorderProps) {
  // Setup & Permissions
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // Camera & Recording State
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // Audio / Music State
  const [showMusicSearch, setShowMusicSearch] = useState(false);
  const [showTrimmer, setShowTrimmer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [itunesResults, setItunesResults] = useState<ITunesSong[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any | null>(null); // itunes song or db song
  const [audioStartTime, setAudioStartTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [caption, setCaption] = useState("");
  const [type] = useState<ReelType>(ReelType.FRIENDSHIP); // Removed from UI, default to FRIENDSHIP
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const MAX_DURATION_SEC = 30; // TikTok videos are longer now

  // Initialize Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION_SEC) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // iTunes Search function
  const searchITunes = async (query: string) => {
    if (!query) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`);
      const data = await response.json();
      setItunesResults(data.results || []);
    } catch (error) {
      console.error("iTunes Search Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const startRecording = useCallback(() => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    if (selectedSong && audioRef.current) {
      audioRef.current.currentTime = audioStartTime; // Start from trimmed time
      audioRef.current.play().catch(console.error);
    }

    const stream = videoRef.current.srcObject as MediaStream;
    let options = { mimeType: "video/webm;codecs=vp8,opus" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "video/mp4" };
    }

    try {
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
        setRecordedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        if (selectedSong && audioRef.current) {
          audioRef.current.pause();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (e) {
      console.error("Error starting MediaRecorder:", e);
    }
  }, [selectedSong, audioStartTime]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const resetRecording = () => {
    setRecordedBlob(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCaption("");
    setRecordingTime(0);
    // startCamera(); // No need to restart camera here, useEffect handles it if we go back to !previewUrl
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file.");
        return;
      }
      setRecordedBlob(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const handleSaveToDevice = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noni-reel-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePost = async () => {
    if (!recordedBlob) return;
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("file", recordedBlob, "video.webm");
      formData.append("type", type);
      formData.append("visibility", visibility);
      if (caption) formData.append("caption", caption);

      if (selectedSong) {
        if (selectedSong.id) {
          formData.append("audioId", selectedSong.id);
        } else {
          // iTunes song metadata
          formData.append("songTitle", selectedSong.trackName);
          formData.append("songArtist", selectedSong.artistName);
          formData.append("songUrl", selectedSong.previewUrl);
          formData.append("songCover", selectedSong.artworkUrl100);
        }
      }

      const result = await createReel(formData);
      
      if (result?.error) {
        alert(result.error);
        setIsSubmitting(false);
      } else {
        // Success!
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error posting reel:", error);
      alert("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-black text-center text-gray-400 p-6">
        <div className="bg-white/10 p-6 rounded-full mb-6">
          <Zap size={48} className="text-accent" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Camera Access Required</h1>
        <p className="text-sm opacity-60">Please enable camera and microphone permissions in your settings to start creating.</p>
        <button onClick={() => window.location.reload()} className="mt-8 bg-white text-black font-bold py-3 px-8 rounded-full">RETRY</button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col">
      {/* BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 z-0">
        {!previewUrl ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <video
            ref={playbackRef}
            src={previewUrl}
            autoPlay
            loop
            playsInline
            controls={false}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* OVERLAY UI */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        
        {/* Top Header Section */}
        <div className="p-4 flex items-center justify-between pointer-events-auto">
          {!previewUrl ? (
            <>
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10"
                onClick={() => window.history.back()}
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => setShowMusicSearch(true)}
                  className="bg-black/40 backdrop-blur-xl text-white px-5 py-2.5 rounded-full font-bold text-[13px] flex items-center gap-2 border border-white/10 hover:bg-black/60 transition active:scale-95"
                >
                  <Music size={14} className="text-accent" />
                  {selectedSong ? (selectedSong.trackName || selectedSong.title) : "Add sound"}
                </button>
                {selectedSong && (
                  <button 
                    onClick={() => setShowTrimmer(true)}
                    className="bg-accent text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/40 active:scale-95 transition"
                  >
                    Adjust Sound
                  </button>
                )}
              </div>

              <div className="w-10"></div>
            </>
          ) : (
            <button 
              onClick={resetRecording}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition pointer-events-auto"
            >
              <RotateCcw size={22} />
            </button>
          )}
        </div>

        {/* Right Side Actions Panel (Floating) */}
        {!previewUrl && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-auto">
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="w-11 h-11 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/5 active:scale-90 transition">
                <RotateCcw size={24} className="text-white" />
              </div>
              <span className="text-[10px] text-white font-bold opacity-80">Flip</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div className="w-11 h-11 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/5 active:scale-90 transition">
                <Flame size={24} className="text-white" />
              </div>
              <span className="text-[10px] text-white font-bold opacity-80">Filters</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div className="w-11 h-11 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/5 active:scale-90 transition">
                <Smile size={24} className="text-white" />
              </div>
              <span className="text-[10px] text-white font-bold opacity-80">Effects</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div className="w-11 h-11 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/5 active:scale-90 transition">
                <Clock size={24} className="text-white" />
              </div>
              <span className="text-[10px] text-white font-bold opacity-80">Timer</span>
            </div>
          </div>
        )}

        {/* Bottom Section (Recording & Posting) */}
        <div className="mt-auto p-6 pointer-events-auto">
          {!previewUrl ? (
            <div className="flex flex-col items-center pb-8">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="video/*" 
                onChange={handleFileChange} 
              />
              
              <div className="flex items-center justify-center gap-10">
                {/* Effects Placeholder for symmetry */}
                <div className="flex flex-col items-center gap-1 opacity-0 pointer-events-none">
                  <div className="w-12 h-12"></div>
                  <span className="text-[10px]">&nbsp;</span>
                </div>

                {/* Record Progress Ring (Visual) */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-white/20"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (recordingTime / MAX_DURATION_SEC) * 251.2}
                      className="text-accent transition-all duration-1000 linear"
                    />
                  </svg>
                  
                  {/* Real Button */}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className="absolute w-20 h-20 bg-accent rounded-full border-[6px] border-white/20 flex items-center justify-center active:scale-90 transition-transform duration-200"
                  >
                    {isRecording ? (
                      <div className="w-8 h-8 bg-white rounded-sm"></div>
                    ) : (
                      <div className="w-16 h-16 bg-accent rounded-full border-[6px] border-white/10 group-hover:scale-105 transition"></div>
                    )}
                  </button>
                </div>

                {/* Upload Button */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-1.5 active:scale-95 transition"
                >
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
                    <Image size={24} className="text-white" />
                  </div>
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider opacity-90 drop-shadow-md">Upload</span>
                </button>
              </div>

              <span className="text-white text-[12px] font-black tracking-widest mt-6 uppercase drop-shadow-lg">
                {isRecording ? `00:${recordingTime.toString().padStart(2, '0')}` : "Tap to record"}
              </span>
            </div>
          ) : (
            <div className="bg-black/80 backdrop-blur-3xl p-6 pb-12 rounded-t-[40px] border-t border-white/10 slide-up-animation">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-black text-2xl tracking-tight">Post your moment</h3>
                <button 
                  onClick={handleSaveToDevice}
                  className="bg-white/10 text-white/80 p-3 rounded-full hover:bg-white/20 transition active:scale-90"
                  title="Save to Galaxy"
                >
                  <Download size={22} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="relative group">
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Wanna add a caption? #noni"
                    className="w-full bg-white/5 text-white border border-white/5 rounded-3xl px-5 py-4 h-28 resize-none focus:bg-white/10 focus:ring-1 focus:ring-accent/50 transition-all text-[15px] placeholder:text-white/30 outline-none"
                  />
                  <div className="absolute right-4 bottom-4 flex gap-3 text-white/40">
                    <span className="text-xs font-bold">@</span>
                    <span className="text-xs font-bold">#</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/60 text-[10px] font-black uppercase tracking-wider ml-2">Who can see this?</label>
                  <div className="relative">
                    <select 
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as Visibility)}
                      className="w-full bg-white/5 text-white border border-white/5 rounded-2xl px-4 py-4 appearance-none outline-none font-bold text-[15px] pl-12"
                    >
                      <option value={Visibility.PUBLIC} className="bg-zinc-900">Everyone</option>
                      <option value={Visibility.FRIENDS} className="bg-zinc-900">Friends Only</option>
                      <option value={Visibility.PRIVATE} className="bg-zinc-900">Private (Me)</option>
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
                      {visibility === Visibility.PUBLIC && <Globe size={20} />}
                      {visibility === Visibility.FRIENDS && <Users size={20} />}
                      {visibility === Visibility.PRIVATE && <Lock size={20} />}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button
                    disabled={isSubmitting}
                    onClick={handlePost}
                    className="flex-1 bg-white text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 text-base"
                  >
                    {isSubmitting ? "UPLOADING..." : "POST REEL"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AUDIO TRIMMER SLIDER (POPUP) */}
      {showTrimmer && selectedSong && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col justify-end fade-in-animation pointer-events-auto">
          <div className="bg-zinc-900 p-8 rounded-t-[40px] border-t border-white/10 slide-up-animation">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <img src={selectedSong.artworkUrl100 || selectedSong.cover_image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-none">{selectedSong.trackName || selectedSong.title}</h4>
                  <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-1">Select start point</p>
                </div>
              </div>
              <button onClick={() => setShowTrimmer(false)} className="text-white/60">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="relative h-12 flex items-center">
                <div className="absolute inset-0 bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className="bg-accent/20 h-full border-x-2 border-accent" 
                        style={{ width: '40%', marginLeft: `${(audioStartTime / 30) * 60}%` }}
                    ></div>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="15" // Assuming 30s preview, allow selecting start up to 15s in
                  step="0.1"
                  value={audioStartTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setAudioStartTime(val);
                    if (audioRef.current) {
                        audioRef.current.currentTime = val;
                        audioRef.current.play();
                    }
                  }}
                  className="w-full h-12 bg-transparent appearance-none cursor-pointer z-10"
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase tracking-wider">
                <span>0:00</span>
                <span>{Math.floor(audioStartTime)}s</span>
                <span>0:15</span>
              </div>
              <button 
                onClick={() => {
                    setShowTrimmer(false);
                    if (audioRef.current) audioRef.current.pause();
                }}
                className="w-full bg-white text-black font-black py-4 rounded-xl active:scale-95 transition"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN MUSIC SEARCH (SLIDE UP) */}
      {showMusicSearch && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col slide-up-animation pointer-events-auto">
          <div className="p-6 flex items-center gap-4">
            <button 
              onClick={() => setShowMusicSearch(false)} 
              className="text-white/60 hover:text-white"
            >
              <X size={28} />
            </button>
            <div className="flex-1 relative">
              <input 
                autoFocus
                type="text"
                placeholder="Search music, artists..."
                className="w-full bg-white/10 text-white rounded-full py-4 pl-12 pr-6 outline-none focus:ring-1 focus:ring-accent/50 text-[15px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchITunes(searchQuery)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-12">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center mt-20 gap-4">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Looking for sounds...</p>
              </div>
            ) : itunesResults.length > 0 ? (
              <div className="space-y-1">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-wider mb-4">Results from iTunes</p>
                {itunesResults.map((song) => (
                  <div 
                    key={song.trackId} 
                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all active:scale-95 group relative ${selectedSong?.trackId === song.trackId ? 'bg-accent/20 border border-accent/20' : 'hover:bg-white/5'}`}
                    onClick={() => {
                      setSelectedSong(selectedSong?.trackId === song.trackId ? null : song);
                      setTimeout(() => setShowMusicSearch(false), 300);
                      setAudioStartTime(0); // Reset trim when picking new song
                    }}
                  >
                    <div className="w-14 h-14 bg-white/10 rounded-xl overflow-hidden shadow-lg relative group">
                      <img src={song.artworkUrl100} alt={song.trackName} className="w-full h-full object-cover" />
                      {selectedSong?.trackId === song.trackId && (
                        <div className="absolute inset-0 bg-accent/40 flex items-center justify-center">
                          <Check className="text-white" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-[15px] leading-tight truncate">{song.trackName}</h4>
                      <p className="text-white/40 text-[13px] truncate">{song.artistName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-20">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-white/20" />
                </div>
                <p className="text-white/60 font-bold">Search millions of songs</p>
                <p className="text-white/30 text-xs mt-2">Find real Arabic & English tracks</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden Audio Player for selected song preview */}
      {selectedSong && (
        <audio src={selectedSong.previewUrl || selectedSong.audio_url} ref={audioRef} />
      )}

      <style jsx>{`
        .slide-up-animation { animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-in-animation { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 48px;
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
