"use client";

import { Building2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDealerApplications } from "@/hooks/manufacturer/useDealerApplications";
import DealersTable from "./DealersTable";

const DealersListView = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = useDealerApplications({ page, limit });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-175">
        <Spinner />
      </div>
    );
  }

  if (!data?.success || !data.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No dealers found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later when dealers apply for dealership
          </p>
        </div>
      </div>
    );
  }

  const dealersData = data.data;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between">
        <Input className="w-full sm:w-64" placeholder="Search dealer..." />
      </div>
      <DealersTable dealersData={dealersData} />
    </div>
  );
};

export default DealersListView;
