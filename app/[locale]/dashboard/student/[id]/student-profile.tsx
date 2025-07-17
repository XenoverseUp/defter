"use client";

import { Badge } from "@/components/ui/badge";
import { BooringAvatars } from "@/components/ui/booring-avatars";
import { Button } from "@/components/ui/button";

import { If } from "@/components/ui/if";
import { getStudentProfile } from "@/lib/actions/students";
import { cn } from "@/lib/utils";

import { ShapesIcon, SigmaIcon, UserRoundPenIcon } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  profile: Awaited<ReturnType<typeof getStudentProfile>>;
}

export default function StudentProfile({ profile }: Props) {
  return (
    <header className="flex gap-6 py-6 px-4">
      <BooringAvatars
        colors={
          profile.grade === "middle-school"
            ? ["#78B9B5", "#0F828C", "#065084", "#320A6B", "#0B1D51", "#4300FF", "#00CAFF"]
            : ["#7B4019", "#FF7D29", "#FFBF78", "#FFEEA9"]
        }
        variant="beam"
        square
        name={profile.firstName}
        className="shrink-0 size-20 rounded-full overflow-hidden shadow-xl border"
      />

      <div className="space-y-1.5 my-auto">
        <h1 className="text-2xl font-semibold">
          {profile.firstName} {profile.lastName}
        </h1>

        <div className="flex items-center gap-2.5">
          <Badge
            variant="secondary"
            className={cn({
              "bg-blue-100 text-blue-500": profile.grade === "middle-school",
              "bg-orange-100 text-orange-600": profile.grade === "high-school",
            })}
          >
            <If condition={profile.grade === "middle-school"} renderItem={() => <ShapesIcon />} renderElse={() => <SigmaIcon />} />
            <If condition={profile.grade === "middle-school"} renderItem={() => "Middle School"} renderElse={() => "High School"} />
          </Badge>

          <p className="text-xs text-muted-foreground">Created on {new Date(profile.createdAt).toDateString()}</p>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" size="sm" className="ml-auto my-auto">
            <UserRoundPenIcon />
            Edit Profile
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Student Profile</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
}
