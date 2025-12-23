"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  approveDealerApplication,
  rejectDealerApplication,
  startDealerReview,
} from "@/actions/manufacturer/dealer-applications.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicationStatus } from "@/types";

type ActionType = "START_REVIEW" | "APPROVE" | "REJECT" | null;

interface Props {
  dealerId: string;
  applicationStatus?: ApplicationStatus | null;
  onStatusChange?: (status: ApplicationStatus) => void;
}

const DealerApplicationActions = ({
  dealerId,
  applicationStatus,
  onStatusChange,
}: Props) => {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<ActionType>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (applicationStatus === "APPROVED" || applicationStatus === "REJECTED") {
    return null;
  }

  const handleStartReview = async () => {
    setLoadingAction("START_REVIEW");
    try {
      const result = await startDealerReview(dealerId);
      console.log("result start review", result);
      if (result.success) {
        toast.success(result.message);
        onStatusChange?.("IN_REVIEW");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproveApplication = async () => {
    setLoadingAction("APPROVE");
    try {
      const result = await approveDealerApplication(dealerId);
      if (result.success) {
        toast.success(result.message);
        setApproveDialogOpen(false);
        onStatusChange?.("APPROVED"); // Update status immediately
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectApplication = async () => {
    setLoadingAction("REJECT");
    try {
      const result = await rejectDealerApplication(dealerId, rejectionReason);
      if (result.success) {
        toast.success(result.message);
        setRejectDialogOpen(false);
        setRejectionReason("");
        onStatusChange?.("REJECTED"); // Update status immediately
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingAction(null);
    }
  };

  if (applicationStatus === "PENDING") {
    return (
      <Button onClick={handleStartReview} disabled={loadingAction !== null}>
        <Eye className="mr-2 h-4 w-4" />
        Start Review {loadingAction === "START_REVIEW" && <Spinner />}
      </Button>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setApproveDialogOpen(true)}
          disabled={loadingAction !== null}
        >
          Approve {loadingAction === "APPROVE" && <Spinner />}
        </Button>
        <Button
          onClick={() => setRejectDialogOpen(true)}
          disabled={loadingAction !== null}
        >
          Reject {loadingAction === "REJECT" && <Spinner />}
        </Button>
      </div>

      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Dealer Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will approve the dealer's application and grant them
              access to your products. Please confirm to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveApplication}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection. This message will be sent to the
              dealer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={7}
              className="h-32"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={loadingAction !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectApplication}
              disabled={loadingAction !== null || !rejectionReason.trim()}
            >
              Reject {loadingAction === "REJECT" && <Spinner />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DealerApplicationActions;
