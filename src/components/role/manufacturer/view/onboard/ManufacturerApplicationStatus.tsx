import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Clock,
  Eye,
  type LucideIcon,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn, formatDate } from "@/lib/utils";
import type {
  ApplicationHistoryEntry,
  ApplicationStatus,
  Manufacturer,
} from "@/types";

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
  manufacturer: Manufacturer;
  currentStatus: ApplicationStatus;
  history: ApplicationHistoryEntry[];
}

export default async function ManufacturerApplicationStatus({
  manufacturer,
  currentStatus,
  history,
}: Props) {
  const config = statusConfig[currentStatus] || statusConfig.pending;

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
    <div className="mx-auto max-w-7xl flex items-center justify-center h-screen">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Card: Company Details + Current Status */}
        <Card className="flex flex-col overflow-hidden p-0 gap-0 h-[70vh]">
          <CardHeader className="shrink-0 gap-0 border-b bg-muted p-4">
            <div className="space-y-1 text-center">
              <CardTitle className="font-semibold text-2xl text-primary">
                {config.label}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {config.description}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-8 overflow-scroll px-6 pt-6 pb-6">
            {/* Company Logo + Name */}
            <div className="flex items-center justify-between">
              <div className="flex w-fit items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={manufacturer.company_logo || ""}
                    alt={manufacturer.company_name || "Company"}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {manufacturer.company_name?.[0] || "C"}
                    {manufacturer.company_name?.[1] || "O"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg text-muted-foreground">
                  {manufacturer.company_name}
                </p>
              </div>
            </div>

            {/* Company Details */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 font-medium text-sm">
                <Label>Contact Person :</Label>
                <span className="text-muted-foreground">
                  {manufacturer.contact_person}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Label>GST :</Label>
                <span className="text-muted-foreground">
                  {manufacturer.gst_number}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Label>Website :</Label>
                <span className="text-muted-foreground">
                  {manufacturer.website || "-"}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Label>City :</Label>
                <span className="text-muted-foreground">
                  {manufacturer.city || "-"}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Label>State :</Label>
                <span className="text-muted-foreground">
                  {manufacturer.state || "-"}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Label>Pincode :</Label>
                <span className="text-muted-foreground">
                  {manufacturer.pincode || "-"}
                </span>
              </div>
              <div className="flex items-start gap-2 font-medium text-sm">
                <Label className="whitespace-nowrap">Address :</Label>
                <span className="min-w-0 flex-1 break-words text-muted-foreground">
                  {manufacturer.address}
                </span>
              </div>
              <div className="flex items-start gap-2 font-medium text-sm">
                <Label className="whitespace-nowrap">Description :</Label>
                <span className="min-w-0 flex-1 break-words text-muted-foreground">
                  {manufacturer.company_description}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Timeline */}
        <Card className="overflow-hidden p-0 gap-0 h-[70vh]">
          <CardHeader className="border-b bg-muted text-center p-4">
            <CardTitle className="text-2xl">Application Timeline</CardTitle>
            <CardDescription>
              Track every step of your verification journey
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
      </div>
    </div>
  );
}
