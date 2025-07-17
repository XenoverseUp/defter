"use client";

import { Badge } from "@/components/ui/badge";
import { BooringAvatars } from "@/components/ui/booring-avatars";
import { Button } from "@/components/ui/button";

import { If } from "@/components/ui/if";
import { getStudentProfile } from "@/lib/actions/students";
import { cn } from "@/lib/utils";

import { LoaderIcon, QuoteIcon, ShapesIcon, SigmaIcon, Trash2Icon, UserRoundPenIcon } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { deleteStudent } from "@/lib/client-services/students";
import { mutateStudents } from "@/lib/hooks/useStudents";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

interface Props {
  profile: Awaited<ReturnType<typeof getStudentProfile>>;
}

export default function StudentProfile({ profile }: Props) {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDeleteClick = async () => {
    setDeleteLoading(true);

    try {
      await deleteStudent(profile.id);
      await mutateStudents();
      router.replace("/dashboard");
      toast.success(`Successfully deleted ${profile.firstName}.`);
    } catch {
      setDeleteLoading(false);
      toast.error("Couldn't delete the student.");
    }
  };

  return (
    <header className="flex flex-col gap-3 py-6">
      <div className="flex gap-6 px-4">
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
              <If
                condition={profile.grade === "middle-school"}
                renderItem={() => <ShapesIcon />}
                renderElse={() => <SigmaIcon />}
              />
              <If
                condition={profile.grade === "middle-school"}
                renderItem={() => "Middle School"}
                renderElse={() => "High School"}
              />
            </Badge>

            <p className="text-xs text-muted-foreground">Created on {new Date(profile.createdAt).toDateString()}</p>
          </div>
        </div>

        <div className="ml-auto my-auto rounded-lg border divide-x overflow-hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-none">
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
          <Button
            onClick={onDeleteClick}
            size="sm"
            variant="ghost"
            className="rounded-none text-destructive! hover:bg-destructive/10!"
          >
            <If
              condition={deleteLoading}
              renderItem={() => <LoaderIcon className="animate-spin" />}
              renderElse={() => <Trash2Icon />}
            />
          </Button>
        </div>
      </div>

      {profile.notes && (
        <blockquote className="text-sm text-muted-foreground px-2">
          <QuoteIcon className="inline! size-4" /> {profile.notes}
        </blockquote>
      )}
    </header>
  );
}
