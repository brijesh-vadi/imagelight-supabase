"use client";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
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
import type { ApplicationHistoryEntry, ApplicationStatus } from "@/types";

const statusConfig: Record<
  string,
  {
    label: string;
    description: string;
    icon: LucideIcon;
    color: string;
    dot: string;
    spinning?: boolean;
  }
> = {
  pending: {
    label: "Pending Review",
    description:
      "We have received your application. Admin will review it soon.",
    icon: Clock,
    color: "text-yellow-600 bg-yellow-100",
    dot: "bg-yellow-500",
  },
  in_review: {
    label: "Under Review",
    description: "An admin is currently reviewing your application.",
    icon: Eye,
    color: "text-blue-600 bg-blue-100",
    dot: "bg-blue-500",
    spinning: true,
  },
  rejected: {
    label: "Application Rejected",
    description:
      "Your application was rejected. Please check feedback and resubmit.",
    icon: XCircle,
    color: "text-red-600 bg-red-100",
    dot: "bg-red-500",
  },
  approved: {
    label: "Approved!",
    description: "Congratulations! Your account is now fully verified.",
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
    dot: "bg-green-500",
  },
};

interface Props {
  currentStatus: ApplicationStatus;
  history: ApplicationHistoryEntry[];
  className?: string;
}

const ApplicationTimeline = ({ currentStatus, history, className }: Props) => {
  const timelineEntries = history?.map((entry: ApplicationHistoryEntry) => {
    const statusKey = entry.status.toLowerCase();
    const entryConfig = statusConfig[statusKey];

    let description = "";
    if (entry.status.toUpperCase() === "REJECTED" && entry.message) {
      description = entry.message;
    } else if (entryConfig) {
      description = entryConfig.description;
    } else {
      description = "Status updated";
    }

    const admin = entry.admin && entry.admin.length > 0 ? entry.admin[0] : null;
    if (admin && entry.status.toUpperCase() !== "PENDING") {
      description += ` — Updated by ${admin.username || "Admin"}`;
    }

    return {
      title: entryConfig?.label || entry.status,
      description,
      timestamp: entry.created_at,
      icon: entryConfig?.icon || AlertCircle,
      dotColor: entryConfig?.dot || "bg-gray-400",
      isCurrent: statusKey === currentStatus.toLowerCase(),
    };
  });

  return (
    <Card className={cn("overflow-hidden p-0 gap-0", className)}>
      <CardHeader className="border-b bg-muted text-center p-4">
        <CardTitle className="text-2xl">Application Timeline</CardTitle>
        <CardDescription>
          Track every step of the verification journey
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 overflow-scroll">
        {timelineEntries?.length === 0 ? (
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
