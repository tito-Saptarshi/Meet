"use client"

import { tokenProvider } from "@/actions/stream.actions";
import { useUser } from "@clerk/nextjs";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { Loader } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

 const StreamVideoProvider  = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();

  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!apiKey) throw new Error('Stream API key is missing');

    const client = new StreamVideoClient({
        apiKey: apiKey,
        user: {
          id: user?.id,
          name: user?.fullName || user?.username || user?.id,
          image: user?.imageUrl,
        },
        tokenProvider,
      });
      
      setVideoClient(client);
  }, [user, isLoaded]);
  
  if (!videoClient) return <Loader width={50} height={50} className="flex-center h-screen w-full" />

  return <StreamVideo client={videoClient}>
    {children}
  </StreamVideo>;
};

export default StreamVideoProvider;
