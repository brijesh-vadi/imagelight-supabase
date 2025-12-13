import { BadgeCheck, CircleUserRound } from "lucide-react";
import { getManufacturerById } from "@/actions/admin/applications.action";
import ApplicationActions from "@/components/role/admin/view/applications/ApplicationActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  params: Promise<{ id: string }>;
}

const ApplicationDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  const { data: manufacturer } = await getManufacturerById(id);

  const isPending = manufacturer?.application_status === "PENDING";

  return (
    <div className="space-y-6">
      {/* Header - Always Visible */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/10">
              {manufacturer?.company_logo ? (
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={manufacturer.company_logo}
                    alt={`${manufacturer?.company_name} logo`}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg">
                    {manufacturer?.company_name?.[0]}
                    {manufacturer?.company_name?.[1]}
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
                  {manufacturer?.company_name || "Unnamed Company"}
                </h1>
                {manufacturer?.is_verified && (
                  <BadgeCheck
                    size={22}
                    className="text-white text-blue"
                    fill="#2b7fff"
                  />
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

      {/* Details Section - Blurred when PENDING */}
      <div className={`relative ${isPending ? "pointer-events-none" : ""}`}>
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
            <p className="text-muted-foreground text-lg font-medium">
              Click "Start Review" to view application details
            </p>
          </div>
        )}

        <div className={isPending ? "blur-sm" : ""}>
          <div className="flex flex-col w-1/2 gap-6">
            {/* Contact Information */}
            <Card className="p-0 gap-0 overflow-hidden">
              <CardHeader className="px-4 py-2 bg-primary/10 text-center gap-0">
                <CardTitle className="flex items-center gap-2 text-md mx-auto">
                  <CircleUserRound className="h-5 w-5" />
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm p-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Contact Person</span>
                    <span className="text-muted-foreground">
                      {manufacturer?.contact_person}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Email</span>
                    <span className="text-muted-foreground">
                      {manufacturer?.email}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Mobile</span>
                    <span className="text-muted-foreground">
                      +91 {manufacturer?.mobile}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Website</span>
                    <span className="text-muted-foreground">
                      {manufacturer?.website ?? "-"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Address</span>
                    <span className="text-muted-foreground">
                      {manufacturer?.address}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card className="p-0 gap-0 overflow-hidden">
              <CardHeader className="px-4 py-2 bg-secondary text-center gap-0">
                <CardTitle className="text-base">Business Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm p-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Business Type</span>
                    <span className="text-muted-foreground">
                      {manufacturer?.business_type}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>City</span>
                    <span className="text-muted-foreground">
                      {manufacturer?.city || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>State</span>
                    <span className="text-muted-foreground">
                      {manufacturer?.state}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>PIN Code</span>
                    <span className="text-muted-foreground">
                      {manufacturer?.pincode}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>GST Number</span>
                    <span className="text-muted-foreground">
                      {manufacturer?.gst_number}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className=" p-0 gap-0 overflow-hidden">
              <CardHeader className="px-4 py-2 bg-secondary text-center gap-0">
                <CardTitle className="text-base">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm p-4">
                <div className="font-medium text-muted-foreground">
                  {manufacturer?.company_description}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
