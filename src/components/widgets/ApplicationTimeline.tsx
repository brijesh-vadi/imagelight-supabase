"use client";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  type LucideIcon,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import type {
  ApplicationHistoryEntry,
  ApplicationStatus,
  DealerApplicationHistoryEntry,
} from "@/types";

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    icon: LucideIcon;
    color: string;
    dot: string;
    dealerMessage: string;
    manufacturerMessage: string;
    spinning?: boolean;
  }
> = {
  PENDING: {
    label: "Pending Review",
    icon: Clock,
    color: "text-yellow-600 bg-yellow-100",
    dot: "bg-yellow-500",
    dealerMessage:
      "Your request has been sent. Manufacturer will review it soon.",
    manufacturerMessage: "Dealer has applied. Please review their application.",
  },
  IN_REVIEW: {
    label: "Under Review",
    icon: Eye,
    color: "text-blue-600 bg-blue-100",
    dot: "bg-blue-500",
    spinning: true,
    dealerMessage: "Manufacturer is reviewing your application.",
    manufacturerMessage: "You are reviewing this dealer's application.",
  },
  REJECTED: {
    label: "Application Rejected",
    icon: XCircle,
    color: "text-red-600 bg-red-100",
    dot: "bg-red-500",
    dealerMessage: "Your dealership request was rejected. Check reason below.",
    manufacturerMessage: "You rejected this dealership application.",
  },
  APPROVED: {
    label: "Approved!",
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
    dot: "bg-green-500",
    dealerMessage: "Congratulations! You are now an approved dealer.",
    manufacturerMessage: "You approved this dealer successfully.",
  },
};

interface Props {
  currentStatus: ApplicationStatus;
  history: ApplicationHistoryEntry[] | DealerApplicationHistoryEntry[];
  className?: string;
  type?: "dealer" | "manufacturer";
  isLoading?: boolean;
}

const ApplicationTimeline = ({
  currentStatus,
  history,
  className,
  type,
  isLoading = false,
}: Props) => {
  const timelineEntries = history?.map(
    (entry: ApplicationHistoryEntry | DealerApplicationHistoryEntry) => {
      const statusKey = entry.status as ApplicationStatus;
      const entryConfig = statusConfig[statusKey];

      let description =
        type === "dealer"
          ? statusConfig[entry.status].dealerMessage
          : statusConfig[entry.status].manufacturerMessage;

      if (entry.status === "REJECTED" && entry.message) {
        description = `${description} — ${entry.message}`;
      }

      // For manufacturer applications (admin reviewing)
      if ("admin" in entry) {
        const admin =
          entry.admin && entry.admin.length > 0 ? entry.admin[0] : null;
        if (admin && entry.status.toUpperCase() !== "PENDING") {
          description += ` — Updated by ${admin.username || "Admin"}`;
        }
      }

      // For dealer applications (manufacturer reviewing)
      if ("approver" in entry) {
        const approver = entry.approver;
        if (approver && entry.status.toUpperCase() !== "PENDING") {
          const updaterName =
            type === "dealer" ? approver.company_name || "Manufacturer" : "You";
          description += ` — Updated by ${updaterName}`;
        }
      }

      return {
        title: entryConfig?.label || entry.status,
        description,
        timestamp: entry.created_at,
        icon: entryConfig?.icon || AlertCircle,
        dotColor: entryConfig?.dot || "bg-gray-400",
        isCurrent: statusKey === currentStatus,
      };
    },
  );

  return (
    <Card className={cn("overflow-hidden p-0 gap-0", className)}>
      <CardHeader className="border-b bg-muted text-center !p-4">
        <CardTitle className="text-2xl">Application Timeline</CardTitle>
        <CardDescription>
          Track every step of the verification journey
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 overflow-scroll">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : timelineEntries?.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No timeline events yet.
          </p>
        ) : (
          <div className="space-y-8">
            {timelineEntries?.map((entry, index) => (
              <div key={entry.timestamp} className="relative flex gap-4">
                {/* Connecting line */}
                {index < timelineEntries?.length - 1 && (
                  <div className="absolute left-5 top-10 h-full w-0.5 bg-border" />
                )}

                {/* Dot + Icon */}
                <div
                  className={cn(
                    "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-8 ring-background",
                    entry.dotColor,
                  )}
                >
                  <entry.icon className={cn("h-5 w-5 text-white")} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <h3
                      className={cn(
                        "font-semibold",
                        entry.isCurrent && "text-primary",
                      )}
                    >
                      {entry.title}
                    </h3>
                    <time className="text-xs text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationTimeline;
