"use client";
import {
  CheckCircle2,
  Clock,
  Eye,
  type LucideIcon,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ApplicationTimeline from "@/components/widgets/ApplicationTimeline";
import type {
  ApplicationHistoryEntry,
  ApplicationStatus,
  Manufacturer,
} from "@/types";
import ManufacturerOnboradUpdateForm from "./ManufacturerOnboradUpdateForm";

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

const ManufacturerApplicationStatus = ({
  manufacturer,
  currentStatus,
  history,
}: Props) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const config = statusConfig[currentStatus] || statusConfig.pending;

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
              <div className="flex  items-center gap-4 w-full">
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
                <div className="flex items-center justify-between w-full">
                  <p className="font-semibold text-lg text-muted-foreground">
                    {manufacturer.company_name}
                  </p>
                  {manufacturer?.application_status === "REJECTED" && (
                    <Button onClick={() => setIsEditModalOpen(true)}>
                      Update Application
                    </Button>
                  )}
                </div>
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
        <ApplicationTimeline
          currentStatus={currentStatus}
          history={history}
          className="h-[70vh]"
        />
      </div>
      <ManufacturerOnboradUpdateForm
        userId={manufacturer.id}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={manufacturer}
      />
    </div>
  );
};

export default ManufacturerApplicationStatus;
