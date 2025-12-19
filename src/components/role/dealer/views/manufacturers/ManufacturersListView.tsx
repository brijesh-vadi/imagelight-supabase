"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { getAllManufacturers } from "@/actions/dealer/manufacturer.action";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import ManufacturersTable from "./ManufacturersTable";

const ManufacturersListView = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = useQuery({
    queryKey: ["manufacturers", page, limit],
    queryFn: () => getAllManufacturers({ page, limit }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-175">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (
    !data?.success ||
    !data.data?.manufacturers ||
    data.data.manufacturers.length === 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No manufacturers found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for available manufacturers
          </p>
        </div>
      </div>
    );
  }

  const manufacturers = data.data.manufacturers;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input className="w-64" />
      </div>
      <ManufacturersTable manufacturers={manufacturers} />
    </div>
  );
};

export default ManufacturersListView;
