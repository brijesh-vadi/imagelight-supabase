import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ApplicationDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {/* Avatar skeleton */}
            <Skeleton className="h-16 w-16 rounded-full" />

            <div className="space-y-2">
              {/* Company name skeleton */}
              <Skeleton className="h-8 w-48" />
              {/* Badge skeleton */}
              <Skeleton className="h-5 w-16" />
            </div>
          </div>

          {/* Actions skeleton */}
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Details */}
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2 gap-6">
          {/* Contact Info Card */}
          <Card className="overflow-hidden p-0 gap-0">
            <Skeleton className="h-10 w-full bg-secondary rounded-none" />
            <CardContent className="space-y-3 text-sm p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Business Info Card */}
          <Card className="overflow-hidden p-0 gap-0">
            <Skeleton className="h-10 w-full bg-secondary rounded-none" />
            <CardContent className="space-y-3 text-sm p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* About Card */}
          <Card className="overflow-hidden p-0 gap-0">
            <Skeleton className="h-10 w-full bg-secondary rounded-none" />
            <CardContent className="text-sm p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>

        {/* Timeline Card */}
        <div className="w-1/2">
          <Card className="overflow-hidden p-0 gap-0 h-[calc(100vh-200px)]">
            <CardHeader className="border-b bg-muted text-center !p-3.5">
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </CardHeader>
            <CardContent className="p-4 overflow-scroll">
              <div className="space-y-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="relative flex gap-4">
                    {/* Dot skeleton */}
                    <Skeleton className="z-10 h-10 w-10 shrink-0 rounded-full" />

                    {/* Content */}
                    <div className="flex-1 pb-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsSkeleton;
