import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useStartMeetings = () => {
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
    if (!values.description) {
      router.push(`/meeting/${call.id}`);
    }
  };

  return { createMeeting };
};
