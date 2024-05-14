"use client";

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Merienda } from "next/font/google";

const SetupPage = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const call = useCall();
  const [isMicCamToggleOn, setIsMicCamToggleOn] = useState(false);
  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );
  }

  useEffect(() => {
    if (isMicCamToggleOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggleOn, call?.camera, call?.microphone]);
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-3 text-black">
        <h1 className="text-2xl font-bold my-10">Setup Mic and Camera</h1>
        <VideoPreview />
      </div>
      <label className="flex items-center justify-center m-5 font-medium text-black">
        <input
          type="checkbox"
          checked={isMicCamToggleOn}
          className="m-2"
          onChange={(e) => setIsMicCamToggleOn(e.target.checked)}
        />
        Join with mic and camera off
      </label>

      <div className="flex justify-center pb-2 gap-2">
        <Button
          className="relative py-2 px-4 rounded-lg border border-blue-400 uppercase font-semibold tracking-wide text-blue-900 bg-transparent overflow-hidden transition duration-200 ease-in shadow-none hover:bg-blue-500 hover:shadow-lg hover:text-white"
          onClick={() => {
            call.join();
            setIsSetupComplete(true);
          }}
        >
          Join Meeting
        </Button>
        
        <DeviceSettings/>
       
      </div>
    </>
  );
};

export default SetupPage;
