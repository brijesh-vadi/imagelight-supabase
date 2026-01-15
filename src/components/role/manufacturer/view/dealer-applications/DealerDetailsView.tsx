import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ApplicationTimeline from "@/components/widgets/ApplicationTimeline";
import type {
  ApplicationStatus,
  Dealer,
  DealerApplicationHistoryEntry,
} from "@/types";

interface Props {
  dealer: Dealer & {
    application_history?: DealerApplicationHistoryEntry[];
    application_status?: ApplicationStatus;
  };
}

const DealerDetailsView = ({ dealer }: Props) => {
  const currentStatus = dealer.application_status || "PENDING";
  const isPending = currentStatus === "PENDING";

  return (
    <div className={`relative ${isPending ? "pointer-events-none" : ""}`}>
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
          <p className="text-muted-foreground text-sm md:text-lg font-medium text-center px-4">
            Click "Start Review" to view application details
          </p>
        </div>
      )}

      <div className={`flex flex-col md:flex-row gap-4 md:gap-8 ${isPending ? "blur-sm" : ""}`}>
        <div className="flex flex-col w-full md:w-1/2 gap-4 md:gap-8">
          {/* About */}
          <Card className="p-0 gap-0 overflow-hidden">
            <CardHeader className="px-4 py-2 bg-secondary text-center gap-0">
              <CardTitle className="text-sm md:text-base">About</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col gap-3 md:gap-4">
                {/* Logo + Name */}
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative h-12 w-12 md:h-16 md:w-16 overflow-hidden rounded-full border-2 border-primary/10 shrink-0">
                    {dealer?.company_logo ? (
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src={dealer.company_logo}
                          alt={`${dealer?.company_name} logo`}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-base md:text-lg">
                          {dealer?.company_name?.[0]}
                          {dealer?.company_name?.[1]}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted font-semibold text-muted-foreground text-lg md:text-xl">
                        {dealer?.company_name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <h1 className="font-medium text-lg md:text-xl text-primary truncate">
                    {dealer?.company_name || "Unnamed Company"}
                  </h1>
                </div>
                <Separator />
                <div className="grid gap-2 text-xs md:text-sm">
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Contact Person</span>
                    <span className="text-muted-foreground text-right md:text-left">
                      {dealer?.contact_person}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Email</span>
                    <span className="text-muted-foreground text-right md:text-left break-all md:break-normal">
                      {dealer?.email}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Mobile</span>
                    <span className="text-muted-foreground text-right md:text-left">
                      +91 {dealer?.mobile}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>Address</span>
                    <span className="text-muted-foreground text-right md:text-left">
                      {dealer?.address}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>City</span>
                    <span className="text-muted-foreground text-right md:text-left">
                      {dealer?.city || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>State</span>
                    <span className="text-muted-foreground text-right md:text-left">
                      {dealer?.state}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>PIN Code</span>
                    <span className="text-muted-foreground text-right md:text-left">
                      {dealer?.pincode}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <span>GST Number</span>
                    <span className="text-muted-foreground text-right md:text-left">
                      {dealer?.gst_number}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-1/2">
          <ApplicationTimeline
            currentStatus={currentStatus}
            history={dealer.application_history || []}
            className="max-h-[600px] overflow-y-auto"
            type="dealer"
          />
        </div>
      </div>
    </div>
  );
};

export default DealerDetailsView;
