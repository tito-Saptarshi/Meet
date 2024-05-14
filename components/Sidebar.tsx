"use client";
"ignore ty";
import sidebarLinks from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "./Modal";
import { useStartMeetings } from "@/hooks/useStartMeetings";
import { Button } from "./ui/button";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

const Sidebar = () => {
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
  const pathname = usePathname();

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        return;
      }
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between  bg-dark-1 p-6 pt-28 text-black max-sm:hidden lg:w-[264px]">
      <div className="flex flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route || pathname.startsWith(`${link.route}/`);

          return (
            <Button
              onClick={() => {
                if (link.onclick === "createMeeting") {
                  createMeeting();
                }
                else if (link.onclick === "home") {
                  router.push(link.route);
                }
                else if (link.onclick === "isScheduleMeeting") {
                  setMeetingState("isScheduleMeeting");
                }
                else if (link.onclick === 'upcomingMeeting') {
                  router.push('/upcoming-meetings')
                }
                else if (link.onclick === 'previousMeeting') {
                  router.push('/previous-meetings')
                }
                else if (link.onclick === 'recordings') {
                  router.push('/recordings')
                }
                else if (link.onclick === 'joinMeeting') {
                  setMeetingState("isJoiningMeeting");
                }
              }}
              key={link.label}
              className={cn(
                "relative py-2 pl-2 text-left rounded-lg border border-blue-400 uppercase font-semibold tracking-wide text-blue-900 bg-transparent overflow-hidden transition duration-200 ease-in shadow-none hover:bg-blue-400 hover:shadow-lg hover:text-white ",
                {
                  "bg-blue-700 text-white": isActive,
                }
              )}
            >
              {link.label}
            </Button>
          );
        })}
      </div>

      {!callDetails ? (
        <Modal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Schedule Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-xl pl-2">Title</label>
            <Textarea
              className="border-slate-500 bg-slate-200"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Schedule Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={10}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-slate-200 p-2"
            />
          </div>
        </Modal>
      ) : (
        <Modal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Scheduled Successfully" 
          description="Refresh page to Schedule Another Meeting"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
          }}
         
          buttonText="Click to Copy Link"
        />
      )}
      {/* <Modal
        isOpen={meetingState === "isScheduleMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Create Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      /> */}
      <Modal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Paste Meeting Link"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Paste Meeting Link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-slate-700 bg-slate-200"
        />
      </Modal>
    </section>
  );
};

export default Sidebar;
