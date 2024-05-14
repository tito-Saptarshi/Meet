import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateMeeting = () => {
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  
  const createMeeting = async () => {
    if (!client || !user) return;

    const id = crypto.randomUUID();
    const call = client.call("default", id);

    if (!call) throw new Error("Failed to create meeting");
    const startsAt =
      values.dateTime.toISOString() || new Date(Date.now()).toString();
    const description = values.description || "Instant meeting";

    await call.getOrCreate({
      data: {
        starts_at: startsAt,
        custom: {
          description,
        },
      },
    });

    setCallDetails(call);
  };

  return <div>CreateMeeting</div>;
};

export default CreateMeeting;
