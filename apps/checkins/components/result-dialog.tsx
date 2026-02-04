"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ParticipantData } from "@/lib/checkin/api";

type ResultType =
  | "success"
  | "not_found"
  | "not_verified"
  | "already_checked_in"
  | "validation_error"
  | "error";

interface ResultDialogProps {
  open: boolean;
  onClose: () => void;
  type: ResultType;
  participant?: ParticipantData;
  message?: string;
}

const resultConfig: Record<ResultType, { title: string; borderClass: string }> = {
  success: {
    title: "Check-in Successful",
    borderClass: "border-l-4 border-l-success",
  },
  not_found: {
    title: "Registration Not Found",
    borderClass: "border-l-4 border-l-destructive",
  },
  not_verified: {
    title: "Not Verified",
    borderClass: "border-l-4 border-l-destructive",
  },
  already_checked_in: {
    title: "Already Checked In",
    borderClass: "border-l-4 border-l-warning",
  },
  validation_error: {
    title: "Invalid Request",
    borderClass: "border-l-4 border-l-destructive",
  },
  error: {
    title: "Error",
    borderClass: "border-l-4 border-l-destructive",
  },
};

export function ResultDialog({ open, onClose, type, participant, message }: ResultDialogProps) {
  const config = resultConfig[type];

  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
      <DialogContent className={cn("sm:max-w-md", config.borderClass)} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          {message && <DialogDescription>{message}</DialogDescription>}
        </DialogHeader>

        {type === "success" && participant && (
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{participant.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-sm">{participant.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{participant.phone}</span>
              </div>
            </div>

            {participant.idCard && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">ID Card</span>
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                  <img
                    src={participant.idCard}
                    alt="ID Card"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            {type === "success" ? "Next Scan" : "Try Again"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
