"use client";

import sidebarLinks from "@/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import ReactDatePicker from "react-datepicker";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useStartMeetings } from "@/hooks/useStartMeetings";
import CreateMeeting from "./CreateMeeting";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { create } from "domain";
import Modal from "./Modal";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import homeMenuLinks from "@/constants/indexHomeMenu";

const Hero = () => {
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

  const { createMeeting } = useStartMeetings();

  return (
    <div>
      <section>
        <div className="mx-auto flex flex-col-reverse md:flex-row px-5  items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center xl:pl-16">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900 max-sm:hidden">
              Video Call and Meetings for Everyone
            </h1>
            <p className="mb-8 leading-relaxed max-sm:hidden">
              Meet 2.0: Enjoy superior video meetings with enhanced features and
              intuitive design, surpassing the old Google Meet experience.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button
                className="relative py-2 px-4 rounded-lg border border-blue-400 uppercase font-semibold tracking-wide text-blue-900 bg-transparent overflow-hidden transition duration-200 ease-in shadow-none hover:bg-blue-500 hover:shadow-lg hover:text-white"
                onClick={createMeeting}
              >
                Create Meeting
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="relative py-2 px-4 rounded-lg border bg-blue-400 border-blue-400 uppercase font-semibold tracking-wide text-blue-900 bg-transparent overflow-hidden transition duration-200 ease-in shadow-none hover:bg-blue-500 hover:shadow-lg hover:text-white">
                    Schedule Meeting
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    Schedule or Join via Link
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {homeMenuLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.label}
                      onClick={() => {
                        if (link.onclick === "isScheduleMeeting") {
                          setMeetingState("isScheduleMeeting");
                        } else if (link.onclick === "joinMeeting") {
                          setMeetingState("isJoiningMeeting");
                        }
                      }}
                    >
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <Image
              className="flex object-cover object-center rounded items-center justify-center"
              alt="hero"
              src="https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg"
              height={300}
              width={300}
            />
          </div>
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
    </div>
  );
};

export default Hero;
