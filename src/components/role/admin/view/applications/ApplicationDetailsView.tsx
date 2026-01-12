"use client";

import { BadgeCheck } from "lucide-react";
import ApplicationActions from "@/components/role/admin/view/applications/ApplicationActions";
import ApplicationDetailsSkeleton from "@/components/skeletons/ApplicationDetailsSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationTimeline from "@/components/widgets/ApplicationTimeline";
import { useManufacturerById } from "@/hooks/admin/useManufacturerApplications";

interface Props {
  id: string;
}

const ApplicationDetailsView = ({ id }: Props) => {
  const { data: manufacturer, isLoading } = useManufacturerById(id);

  if (isLoading) return <ApplicationDetailsSkeleton />;

  const isPending = manufacturer?.application_status === "PENDING";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/10">
              {manufacturer?.company_logo ? (
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={manufacturer.company_logo}
                    alt={`${manufacturer.company_name} logo`}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg">
                    {manufacturer.company_name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted font-semibold text-muted-foreground text-xl">
                  {manufacturer?.company_name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-2xl text-primary">
                  {manufacturer?.company_name}
                </h1>
                {manufacturer?.is_verified && (
                  <BadgeCheck size={22} className="text-white" fill="#2b7fff" />
                )}
              </div>

              {manufacturer?.is_active ? (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              ) : (
                <Badge variant="destructive">Not Active</Badge>
              )}
            </div>
          </div>

          <ApplicationActions
            manufacturerId={id}
            applicationStatus={manufacturer?.application_status}
          />
        </div>
      </div>

      {/* Details */}
      <div className={`relative ${isPending ? "pointer-events-none" : ""}`}>
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
            <p className="text-muted-foreground text-lg font-medium">
              Click "Start Review" to view application details
            </p>
          </div>
        )}

        <div className={`flex gap-6 ${isPending ? "blur-sm" : ""}`}>
          <div className="flex flex-col w-1/2 gap-6">
            {/* Contact Info */}
            <Card className="overflow-hidden p-0 gap-0">
              <CardHeader className="px-4 py-2 bg-secondary text-center gap-0">
                <CardTitle className="text-md">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm p-4">
                <InfoRow
                  label="Contact Person"
                  value={manufacturer?.contact_person}
                />
                <InfoRow label="Email" value={manufacturer?.email} />
                <InfoRow label="Mobile" value={`+91 ${manufacturer?.mobile}`} />
                <InfoRow label="Website" value={manufacturer?.website ?? "-"} />
                <InfoRow label="Address" value={manufacturer?.address} />
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card className="overflow-hidden p-0 gap-0">
              <CardHeader className="px-4 py-2 bg-secondary text-center  gap-0">
                <CardTitle className="text-base">Business Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm p-4">
                <InfoRow
                  label="Business Type"
                  value={manufacturer?.business_type}
                />
                <InfoRow label="City" value={manufacturer?.city || "—"} />
                <InfoRow label="State" value={manufacturer?.state} />
                <InfoRow label="PIN Code" value={manufacturer?.pincode} />
                <InfoRow label="GST Number" value={manufacturer?.gst_number} />
              </CardContent>
            </Card>

            {/* About */}
            <Card className="overflow-hidden p-0 gap-0">
              <CardHeader className="px-4 py-2 bg-secondary text-center gap-0">
                <CardTitle className="text-base">About</CardTitle>
              </CardHeader>
              <CardContent className="text-sm p-4 text-muted-foreground wrap-break-word">
                {manufacturer?.company_description}
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div className="w-1/2">
            <ApplicationTimeline
              currentStatus={manufacturer?.application_status!}
              history={manufacturer?.application_history!}
              className="h-[calc(100vh-200px)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between gap-4 font-medium">
    <span>{label}</span>
    <span className="text-muted-foreground">{value}</span>
  </div>
);

export default ApplicationDetailsView;
