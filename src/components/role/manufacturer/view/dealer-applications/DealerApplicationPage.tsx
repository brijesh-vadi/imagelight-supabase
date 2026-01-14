"use client";

import { useEffect, useState } from "react";
import { useDealerById } from "@/hooks/manufacturer/useDealerApplications";
import type { ApplicationStatus } from "@/types";
import DealerApplicationActions from "./DealerApplicationActions";
import DealerDetailsView from "./DealerDetailsView";

interface Props {
  dealerId: string;
}

const DealerApplicationPage = ({ dealerId }: Props) => {
  const { data } = useDealerById(dealerId);

  const dealer = data?.data;

  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus>();

  useEffect(() => {
    if (dealer?.application_status) {
      setApplicationStatus(dealer.application_status);
    }
  }, [dealer?.application_status]);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setApplicationStatus(newStatus);
  };

  if (!dealer) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="font-semibold text-2xl text-primary">
              Dealer Application
            </h1>
            <p className="text-muted-foreground text-sm">
              Review dealer information and manage their application status.
            </p>
          </div>
          <DealerApplicationActions
            dealerId={dealerId}
            applicationStatus={applicationStatus}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
      <DealerDetailsView
        dealer={{
          ...dealer,
          application_status: applicationStatus,
        }}
      />
    </div>
  );
};

export default DealerApplicationPage;
