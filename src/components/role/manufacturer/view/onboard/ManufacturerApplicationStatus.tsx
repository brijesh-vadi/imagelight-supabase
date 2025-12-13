import {
  AlertCircle,
  CheckCircle,
  Clock,
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
import { createClient } from "@/lib/supabase/server";
import { cn, formatDate } from "@/lib/utils";
import type { Manufacturer } from "@/types";

const statusConfig: Record<
  string,
  {
    label: string;
    description: string;
    icon: any;
    color: string;
    dot: string;
    spinning?: boolean;
  }
> = {
  PENDING: {
    label: "Pending Review",
    description:
      "We have received your application. Admin will review it soon.",
    icon: Clock,
    color: "text-yellow-600 bg-yellow-50",
    dot: "bg-yellow-500",
  },
  IN_REVIEW: {
    label: "Under Review",
    description: "An admin is currently reviewing your documents.",
    icon: RefreshCw,
    color: "text-blue-600 bg-blue-50",
    dot: "bg-blue-500",
    spinning: true,
  },
  REJECTED: {
    label: "Application Rejected",
    description:
      "Your application was rejected. Please check feedback and resubmit.",
    icon: XCircle,
    color: "text-red-600 bg-red-50",
    dot: "bg-red-500",
  },
  APPROVED: {
    label: "Approved!",
    description: "Congratulations! Your account is now fully verified.",
    icon: CheckCircle,
    color: "text-green-600 bg-green-50",
    dot: "bg-green-500",
  },
};

interface Props {
  manufacturer: Manufacturer;
  currentStatus: string;
}

export default async function ManufacturerApplicationStatus({
  manufacturer,
  currentStatus,
}: Props) {
  const supabase = await createClient();

  const { data: app } = await supabase
    .from("manufacturer_application")
    .select("id")
    .eq("manufacturer_id", manufacturer.id)
    .single();

  if (!app?.id) {
    return <div>Error loading application.</div>;
  }

  const { data: history = [] } = await supabase
    .from("manufacturer_application_status_history")
    .select(`
      status,
      message,
      created_at,
      changed_by_role,
      admin:changed_by (username, profile_image)
    `)
    .eq("application_id", app.id)
    .order("created_at", { ascending: true });

  const config = statusConfig[currentStatus] || statusConfig.PENDING;

  const timelineEntries = (history ?? []).map((entry) => {
    const admin = entry.admin && entry.admin.length > 0 ? entry.admin[0] : null;

    return {
      title: statusConfig[entry.status]?.label || entry.status,
      description:
        entry.message ||
        (entry.changed_by_role === "admin"
          ? `Updated by ${admin?.username || "Admin"}`
          : "Application submitted"),
      timestamp: entry.created_at,
      icon: statusConfig[entry.status]?.icon || AlertCircle,
      dotColor: statusConfig[entry.status]?.dot || "bg-gray-400",
      isCurrent: entry.status === currentStatus,
    };
  });

  return (
    <div className="mx-auto max-w-7xl flex items-center justify-center h-screen">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Card 1: Company Details + Status */}
        <Card className="flex flex-col overflow-hidden shadow-md">
          <CardHeader className="shrink-0 gap-0 border-b">
            <div className="space-y-1 text-center">
              <CardTitle className="font-semibold text-2xl text-primary">
                {config.label}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {config.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-8 overflow-y-auto px-6 pt-6 pb-6">
            {/* Company Info */}
            <div className="flex items-center justify-between">
              <div className="flex w-fit items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={manufacturer.company_logo || ""}
                    alt={manufacturer.company_name || "Company"}
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
                  {manufacturer.website ? manufacturer.website : "-"}
                </span>
              </div>
              <div className="flex items-start gap-2 font-medium text-sm">
                <Label className="whitespace-nowrap">Address :</Label>
                <span className="min-w-0 flex-1 break-words text-muted-foreground">
                  {manufacturer.address}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Label>City :</Label>
                <span className="text-muted-foreground">
                  {manufacturer.city}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Label>State :</Label>
                <span className="text-muted-foreground">
                  {manufacturer.state}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-sm">
                <Label>Pincode :</Label>
                <span className="text-muted-foreground">
                  {manufacturer.pincode}
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

        {/* Card 2: Timeline */}
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-muted/30 text-center">
            <CardTitle className="text-2xl">Application Timeline</CardTitle>
            <CardDescription>
              Track every step of your verification journey
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {timelineEntries?.map((entry, index) => (
                <div key={`${entry.timestamp}`} className="relative flex gap-4">
                  {/* Connecting line */}
                  {index < timelineEntries.length - 1 && (
                    <div className="absolute left-5 top-10 h-full w-0.5 bg-border" />
                  )}

                  {/* Dot */}
                  <div
                    className={cn(
                      "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-8 ring-background",
                      entry.dotColor,
                      entry.isCurrent && "ring-primary/30",
                    )}
                  >
                    <entry.icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "font-semibold",
                        entry.isCurrent && "text-primary",
                      )}
                    >
                      {entry.title}
                    </h3>
                    <time className="text-xs text-muted-foreground">
                      {formatDate(new Date(entry.timestamp))}
                    </time>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
