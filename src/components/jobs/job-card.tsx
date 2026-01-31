"use client";

import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CoinsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type JobLocationProps = {
  jobCountry?: string;
  jobCity?: string;
  jobState?: string;
};

const JobLocation = ({ jobCountry, jobCity, jobState }: JobLocationProps) => {
  return (
    <div className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-chart-2/10 w-fit">
      <Image
        src={`https://flagsapi.com/${jobCountry}/flat/64.png`}
        alt="country symbol"
        width={16}
        height={16}
        className="rounded-full"
      />

      <p className="text-xs">
        {jobCity && `${jobCity}, `}
        {jobState && `${jobState}, `}
        {jobCountry && `${jobCountry}`}
      </p>
    </div>
  );
};

type JobCardProps = {
  jobTitle: string;
  employerLogo: string | null;
  employerWebsite: string | null;
  jobEmploymentType: string;
  jobApplyLink: string;
  jobDescription: string;
  jobCity?: string;
  jobCountry?: string;
  jobState?: string;
  qualifications?: string[];
  responsibilities?: string[];
};

export const JobCard = ({
  employerLogo,
  employerWebsite,
  jobApplyLink,
  jobDescription,
  jobEmploymentType,
  jobTitle,
  jobCity,
  jobCountry,
  jobState,
  qualifications,
  responsibilities,
}: JobCardProps) => {
  const [open, setOpen] = useState(false);
  const [readMore, setReadMore] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-100 overflow-y-auto">
          <div className="w-full h-50 relative">
            <Link href={employerWebsite ?? "/jobs"}>
              <Image
                src={employerLogo ?? "/images/site-logo.svg"}
                alt="Logo"
                fill
                className="object-cover rounded-lg"
              />
            </Link>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold truncate">
              {jobTitle}
            </DialogTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <JobLocation
                jobCity={jobCity}
                jobCountry={jobCountry}
                jobState={jobState}
              />
              <Link href={jobApplyLink ?? "/jobs"}>
                <Button size="xs" className="h-7">
                  <ArrowRightIcon />
                  Go to listing
                </Button>
              </Link>
            </div>
            <DialogDescription
              className={cn(
                "text-sm text-muted-foreground",
                !readMore && "line-clamp-4",
              )}
            >
              {jobDescription}
            </DialogDescription>
            <Button
              onClick={() => setReadMore(!readMore)}
              variant="ghost"
              className="h-7 w-fit"
            >
              {readMore ? (
                <>
                  <ChevronUpIcon />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDownIcon />
                  Read more
                </>
              )}
            </Button>
          </DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-chart-2/10 w-fit">
              <ClockIcon className="size-4" />
              <span className="text-xs">{jobEmploymentType}</span>
            </div>
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-chart-2/10 w-fit">
              <CoinsIcon className="size-4" />
              <span className="text-xs">Not disclosed</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">Qualifications</h1>
              <ul className="list-disc list-inside ml-4 text-sm">
                {qualifications && qualifications.length ? (
                  qualifications.map((q, index) => <li key={index}>{q}</li>)
                ) : (
                  <li>
                    No qualifications listed. Check the official job listing to
                    confirm.
                  </li>
                )}
              </ul>
            </div>
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">Responsibilities</h1>
              <ul className="list-disc list-inside ml-4 text-sm">
                {responsibilities && responsibilities.length ? (
                  responsibilities.map((q, index) => <li key={index}>{q}</li>)
                ) : (
                  <li>
                    No responsibilities listed. Check the official job listing to
                    confirm.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-start gap-4 p-4 rounded-lg border bg-card"
      >
        <div className="shrink-0">
          <Link href={employerWebsite ?? "/jobs"}>
            <Image
              src={employerLogo ?? "/images/site-logo.svg"}
              alt="Logo"
              height={60}
              width={60}
              className="rounded-lg"
            />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <div className="space-y-1 overflow-hidden">
            <h1 className="text-xl font-semibold line-clamp-1">{jobTitle}</h1>
            <JobLocation
              jobCity={jobCity}
              jobCountry={jobCountry}
              jobState={jobState}
            />
            <p className="text-sm text-muted-foreground line-clamp-2 wrap-break-word">
              {jobDescription}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-chart-2/10 w-fit">
              <ClockIcon className="size-4" />
              <span className="text-xs">{jobEmploymentType}</span>
            </div>
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-chart-2/10 w-fit">
              <CoinsIcon className="size-4" />
              <span className="text-xs">Not disclosed</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
