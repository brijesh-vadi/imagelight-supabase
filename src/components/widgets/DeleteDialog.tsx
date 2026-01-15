"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";

type DeleteDialogProps = {
  open: boolean;
  title: string;
  description: string;
  isDeleting: boolean;
  onConfirmAction: () => void;
  onCancelAction: () => void;
};

export const DeleteDialog = ({
  open,
  title,
  description,
  isDeleting,
  onConfirmAction,
  onCancelAction,
}: DeleteDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancelAction}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base md:text-lg text-left">
            Are you sure you want to delete{" "}
            <span className="text-destructive">{title}?</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-xs md:text-sm text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-end gap-2 ">
          <AlertDialogCancel asChild>
            <Button variant="ghost" className="w-fit">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            onClick={onConfirmAction}
            className="flex w-fit items-center gap-2 bg-destructive text-white hover:bg-destructive/90"
            type="submit"
            disabled={isDeleting}
          >
            <span>Delete</span>
            {isDeleting && <Spinner className="w-4 h-4" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
