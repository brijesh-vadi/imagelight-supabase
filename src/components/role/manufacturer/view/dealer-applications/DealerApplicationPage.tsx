"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/widgets/BackButton";
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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 border-b pb-3 md:pb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <BackButton />
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-xl md:text-2xl text-primary">
              Dealer Application
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Review dealer information and manage their application status.
            </p>
          </div>
        </div>
        <DealerApplicationActions
          dealerId={dealerId}
          applicationStatus={applicationStatus}
          onStatusChange={handleStatusChange}
        />
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
