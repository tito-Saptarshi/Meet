"use client";

import MeetingRoom from "@/components/MeetingRoom";
import SetupPage from "@/components/SetupPage";
import { Button } from "@/components/ui/button";
import { useGetCallById } from "@/hooks/useGetCallsbyIds";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const Meeting = ({ params }: { params: { id: string } }) => {
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { call, isCallLoading } = useGetCallById(params.id);

  if (!isLoaded || isCallLoading)
    return (
      <Loader2 height={50} width={50} className="flex-center h-screen w-full" />
    );

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
       
        <StreamTheme className="text-white">
          {!isSetupComplete ? (
            <SetupPage setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
